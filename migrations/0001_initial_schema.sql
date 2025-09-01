-- Kafouyat Corporate Events Database Schema

-- Table pour les utilisateurs administrateurs Kafouyat
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT 1
);

-- Table pour les événements corporate
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_sector TEXT NOT NULL, -- Tech, Finance, Healthcare, etc.
  event_type TEXT NOT NULL CHECK (event_type IN ('conference', 'seminar', 'workshop', 'networking', 'product_launch', 'merger', 'ipo', 'acquisition', 'other')),
  scope TEXT NOT NULL CHECK (scope IN ('national', 'international')),
  
  -- Informations de localisation
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  venue TEXT,
  latitude REAL,
  longitude REAL,
  
  -- Dates et heures
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  registration_deadline DATETIME,
  
  -- Détails organisationnels
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  registration_fee REAL DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  
  -- Informations de contact
  contact_email TEXT,
  contact_phone TEXT,
  website_url TEXT,
  registration_url TEXT,
  
  -- Métadonnées
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'restricted')),
  featured BOOLEAN DEFAULT 0,
  
  -- Kafouyat metadata
  created_by INTEGER REFERENCES admins(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  published_at DATETIME,
  
  -- SEO et partage
  slug TEXT UNIQUE,
  meta_keywords TEXT,
  social_image_url TEXT
);

-- Table pour les catégories d'événements
CREATE TABLE IF NOT EXISTS event_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color_code TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT 'fas fa-calendar',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table de liaison événements-catégories (many-to-many)
CREATE TABLE IF NOT EXISTS event_category_relations (
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES event_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, category_id)
);

-- Table pour les notifications push
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  
  -- Préférences utilisateur
  user_email TEXT,
  preferred_sectors TEXT, -- JSON array des secteurs d'intérêt
  preferred_countries TEXT, -- JSON array des pays d'intérêt
  preferred_event_types TEXT, -- JSON array des types d'événements
  notification_radius INTEGER DEFAULT 50, -- Rayon en km pour notifications géolocalisées
  
  -- Métadonnées
  user_agent TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_notification_sent DATETIME,
  is_active BOOLEAN DEFAULT 1
);

-- Table pour les analytics et statistiques
CREATE TABLE IF NOT EXISTS event_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  
  -- Métriques de vue
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  
  -- Métriques d'engagement
  shares_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  registration_clicks INTEGER DEFAULT 0,
  
  -- Métriques géographiques
  views_by_country TEXT, -- JSON object {country: count}
  
  -- Métadonnées temporelles
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(event_id, date)
);

-- Table pour les favoris utilisateurs
CREATE TABLE IF NOT EXISTS user_favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_identifier TEXT NOT NULL, -- Email ou session ID
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_identifier, event_id)
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_country ON events(country);
CREATE INDEX IF NOT EXISTS idx_events_sector ON events(company_sector);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_scope ON events(scope);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active ON push_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_analytics_event_date ON event_analytics(event_id, date);