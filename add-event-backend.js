// Backend pour ajout d'événements - VRAIE SOLUTION
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()
app.use('/api/*', cors())

// Stockage temporaire en mémoire (sera remplacé par D1)
let pendingEvents = []
let eventCounter = 7 // Commence après les 6 événements existants

// API pour ajouter un événement
app.post('/api/events', async (c) => {
    try {
        const eventData = await c.req.json()
        
        // Validation
        const required = ['title', 'organizer_name', 'description', 'start_date', 'country', 'city', 'company_sector', 'contact_email']
        for (const field of required) {
            if (!eventData[field]) {
                return c.json({ error: `Champ requis manquant: ${field}` }, 400)
            }
        }
        
        // Créer l'événement
        const newEvent = {
            id: eventCounter++,
            title: eventData.title,
            description: eventData.description,
            company_name: eventData.organizer_name,
            organizer_name: eventData.organizer_name,
            company_sector: eventData.company_sector,
            event_type: eventData.event_type || 'conference',
            scope: eventData.scope || 'national',
            country: eventData.country,
            city: eventData.city,
            venue: eventData.venue || '',
            latitude: 0, // À calculer plus tard
            longitude: 0,
            start_date: eventData.start_date,
            end_date: eventData.end_date || eventData.start_date,
            registration_deadline: eventData.registration_deadline || eventData.start_date,
            max_participants: parseInt(eventData.max_participants) || 100,
            registration_fee: parseFloat(eventData.registration_fee) || 0,
            currency: 'EUR',
            contact_email: eventData.contact_email,
            contact_phone: eventData.contact_phone || '',
            website_url: eventData.website_url || '',
            registration_url: eventData.registration_url || '',
            status: 'pending', // pending, approved, rejected
            visibility: 'public',
            featured: 0,
            categories: eventData.company_sector,
            created_at: new Date().toISOString()
        }
        
        // Ajouter aux événements en attente
        pendingEvents.push(newEvent)
        
        console.log('✅ Nouvel événement ajouté:', newEvent.title)
        
        return c.json({ 
            success: true, 
            message: 'Événement soumis avec succès',
            event_id: newEvent.id
        })
        
    } catch (error) {
        console.error('❌ Erreur ajout événement:', error)
        return c.json({ error: 'Erreur serveur' }, 500)
    }
})

// API pour lister les événements en attente (admin)
app.get('/api/events/pending', async (c) => {
    return c.json({ events: pendingEvents })
})

// API pour approuver un événement
app.post('/api/events/:id/approve', async (c) => {
    const eventId = parseInt(c.req.param('id'))
    const event = pendingEvents.find(e => e.id === eventId)
    
    if (!event) {
        return c.json({ error: 'Événement non trouvé' }, 404)
    }
    
    // Ajouter à la liste principale des événements
    // (Ici on devrait l'ajouter au fichier events.json ou à la DB)
    event.status = 'approved'
    event.featured = 1 // Mettre en vedette les nouveaux événements
    
    console.log('✅ Événement approuvé:', event.title)
    
    return c.json({ success: true, message: 'Événement approuvé et publié' })
})

export default app