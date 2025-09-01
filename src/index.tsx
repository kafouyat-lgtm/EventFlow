import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'
import { MainPage } from './main-page'

// Type pour les bindings Cloudflare
type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Configuration CORS pour les API
app.use('/api/*', cors())

// Servir les fichiers statiques
app.use('/static/*', serveStatic({ root: './public' }))

// Middleware de rendu
app.use(renderer)

// Routes API

// 🌍 API: Récupérer tous les événements avec filtres
app.get('/api/events', async (c) => {
  const { env } = c
  const { country, sector, type, scope, featured, search, limit = '20', offset = '0' } = c.req.query()
  
  try {
    let query = `
      SELECT e.*, 
             GROUP_CONCAT(ec.name) as categories,
             a.name as admin_name
      FROM events e 
      LEFT JOIN event_category_relations ecr ON e.id = ecr.event_id
      LEFT JOIN event_categories ec ON ecr.category_id = ec.id
      LEFT JOIN admins a ON e.created_by = a.id
      WHERE e.status = 'published' AND e.start_date > datetime('now')
    `
    
    const params: any[] = []
    
    if (country) {
      query += ` AND e.country = ?`
      params.push(country)
    }
    
    if (sector) {
      query += ` AND e.company_sector = ?`
      params.push(sector)
    }
    
    if (type) {
      query += ` AND e.event_type = ?`
      params.push(type)
    }
    
    if (scope) {
      query += ` AND e.scope = ?`
      params.push(scope)
    }
    
    if (featured === 'true') {
      query += ` AND e.featured = 1`
    }
    
    if (search) {
      query += ` AND (e.title LIKE ? OR e.description LIKE ? OR e.company_name LIKE ?)`
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern)
    }
    
    query += ` GROUP BY e.id ORDER BY e.featured DESC, e.start_date ASC LIMIT ? OFFSET ?`
    params.push(parseInt(limit), parseInt(offset))
    
    const { results } = await env.DB.prepare(query).bind(...params).all()
    
    return c.json({ 
      success: true, 
      events: results,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: results.length
      }
    })
  } catch (error) {
    return c.json({ success: false, error: 'Erreur lors de la récupération des événements' }, 500)
  }
})

// 📅 API: Récupérer un événement spécifique
app.get('/api/events/:id', async (c) => {
  const { env } = c
  const id = c.req.param('id')
  
  try {
    const { results } = await env.DB.prepare(`
      SELECT e.*, 
             GROUP_CONCAT(ec.name) as categories,
             a.name as admin_name
      FROM events e 
      LEFT JOIN event_category_relations ecr ON e.id = ecr.event_id
      LEFT JOIN event_categories ec ON ecr.category_id = ec.id
      LEFT JOIN admins a ON e.created_by = a.id
      WHERE e.id = ? AND e.status = 'published'
      GROUP BY e.id
    `).bind(id).all()
    
    if (results.length === 0) {
      return c.json({ success: false, error: 'Événement non trouvé' }, 404)
    }
    
    // Increment page view
    const today = new Date().toISOString().split('T')[0]
    await env.DB.prepare(`
      INSERT OR REPLACE INTO event_analytics (event_id, date, page_views, unique_visitors)
      VALUES (?, ?, 
        COALESCE((SELECT page_views FROM event_analytics WHERE event_id = ? AND date = ?), 0) + 1,
        COALESCE((SELECT unique_visitors FROM event_analytics WHERE event_id = ? AND date = ?), 0) + 1
      )
    `).bind(id, today, id, today, id, today).run()
    
    return c.json({ success: true, event: results[0] })
  } catch (error) {
    return c.json({ success: false, error: 'Erreur lors de la récupération de l\'événement' }, 500)
  }
})

// 📊 API: Statistiques globales
app.get('/api/stats', async (c) => {
  const { env } = c
  
  try {
    const [totalEvents, totalCountries, totalSectors, upcomingEvents] = await Promise.all([
      env.DB.prepare('SELECT COUNT(*) as count FROM events WHERE status = "published"').first(),
      env.DB.prepare('SELECT COUNT(DISTINCT country) as count FROM events WHERE status = "published"').first(),
      env.DB.prepare('SELECT COUNT(DISTINCT company_sector) as count FROM events WHERE status = "published"').first(),
      env.DB.prepare('SELECT COUNT(*) as count FROM events WHERE status = "published" AND start_date > datetime("now")').first()
    ])
    
    return c.json({
      success: true,
      stats: {
        totalEvents: totalEvents?.count || 0,
        totalCountries: totalCountries?.count || 0,
        totalSectors: totalSectors?.count || 0,
        upcomingEvents: upcomingEvents?.count || 0
      }
    })
  } catch (error) {
    return c.json({ success: false, error: 'Erreur lors de la récupération des statistiques' }, 500)
  }
})

// 🏷️ API: Récupérer toutes les catégories
app.get('/api/categories', async (c) => {
  const { env } = c
  
  try {
    const { results } = await env.DB.prepare('SELECT * FROM event_categories ORDER BY name').all()
    return c.json({ success: true, categories: results })
  } catch (error) {
    return c.json({ success: false, error: 'Erreur lors de la récupération des catégories' }, 500)
  }
})

// 🔔 API: Souscrire aux notifications push
app.post('/api/notifications/subscribe', async (c) => {
  const { env } = c
  
  try {
    const body = await c.req.json()
    const { endpoint, keys, preferences } = body
    
    await env.DB.prepare(`
      INSERT OR REPLACE INTO push_subscriptions 
      (endpoint, p256dh_key, auth_key, user_email, preferred_sectors, preferred_countries, preferred_event_types, notification_radius)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      endpoint,
      keys.p256dh,
      keys.auth,
      preferences?.email || null,
      JSON.stringify(preferences?.sectors || []),
      JSON.stringify(preferences?.countries || []),
      JSON.stringify(preferences?.eventTypes || []),
      preferences?.radius || 50
    ).run()
    
    return c.json({ success: true, message: 'Souscription aux notifications réussie' })
  } catch (error) {
    return c.json({ success: false, error: 'Erreur lors de la souscription' }, 500)
  }
})

// ❤️ API: Ajouter/Retirer des favoris
app.post('/api/favorites/:eventId', async (c) => {
  const { env } = c
  const eventId = c.req.param('eventId')
  
  try {
    const { userIdentifier } = await c.req.json()
    
    // Vérifier si déjà en favoris
    const existing = await env.DB.prepare(
      'SELECT id FROM user_favorites WHERE user_identifier = ? AND event_id = ?'
    ).bind(userIdentifier, eventId).first()
    
    if (existing) {
      // Retirer des favoris
      await env.DB.prepare(
        'DELETE FROM user_favorites WHERE user_identifier = ? AND event_id = ?'
      ).bind(userIdentifier, eventId).run()
      
      return c.json({ success: true, action: 'removed', isFavorite: false })
    } else {
      // Ajouter aux favoris
      await env.DB.prepare(
        'INSERT INTO user_favorites (user_identifier, event_id) VALUES (?, ?)'
      ).bind(userIdentifier, eventId).run()
      
      return c.json({ success: true, action: 'added', isFavorite: true })
    }
  } catch (error) {
    return c.json({ success: false, error: 'Erreur lors de la gestion des favoris' }, 500)
  }
})

// 🏠 Page d'accueil principale
app.get('/', (c) => {
  return c.render(<MainPage />)
})

export default app
