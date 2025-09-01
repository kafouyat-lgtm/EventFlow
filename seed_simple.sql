-- Données de test pour Kafouyat Events (version simplifiée)

-- Insérer des catégories d'événements
INSERT OR IGNORE INTO event_categories (name, description, color_code, icon) VALUES 
  ('Technologie', 'Evenements technologiques', '#3B82F6', 'fas fa-laptop-code'),
  ('Finance', 'Evenements financiers', '#10B981', 'fas fa-chart-line'),
  ('Sante', 'Evenements du secteur de la sante', '#EF4444', 'fas fa-heartbeat'),
  ('Industrie', 'Evenements industriels', '#F59E0B', 'fas fa-industry'),
  ('Energie', 'Evenements du secteur energetique', '#8B5CF6', 'fas fa-bolt'),
  ('Automobile', 'Evenements automobile', '#F97316', 'fas fa-car');

-- Insérer un administrateur de test
INSERT OR IGNORE INTO admins (email, name, role, password_hash, is_active) VALUES 
  ('admin@kafouyat.com', 'Kafouyat Admin', 'super_admin', 'dummy_hash', 1);

-- Insérer des événements de test
INSERT OR IGNORE INTO events (
  title, description, company_name, company_sector, event_type, scope,
  country, city, venue, latitude, longitude,
  start_date, end_date, registration_deadline,
  max_participants, registration_fee, currency,
  contact_email, website_url, registration_url,
  status, visibility, featured,
  created_by, published_at, slug, meta_keywords
) VALUES 

-- Événements nationaux français
(
  'Summit FinTech Paris 2025',
  'Le plus grand evenement FinTech de France reunissant startups et banques traditionnelles.',
  'BNP Paribas',
  'Finance',
  'conference',
  'national',
  'France',
  'Paris',
  'Palais des Congres',
  48.8738,
  2.2830,
  '2025-03-15 09:00:00',
  '2025-03-16 18:00:00',
  '2025-03-01 23:59:59',
  1500,
  299.00,
  'EUR',
  'contact@fintechsummit.fr',
  'https://fintechsummit-paris.fr',
  'https://tickets.fintechsummit.fr',
  'published',
  'public',
  1,
  1,
  '2025-01-15 10:00:00',
  'summit-fintech-paris-2025',
  'fintech, finance, innovation, paris'
),

(
  'Conference IA & Sante Lyon',
  'Decouvrez comment IA revolutionne le secteur de la sante.',
  'Sanofi',
  'Sante',
  'conference',
  'national',
  'France',
  'Lyon',
  'Centre de Congres de Lyon',
  45.7640,
  4.8357,
  '2025-04-08 08:30:00',
  '2025-04-08 17:30:00',
  '2025-03-25 23:59:59',
  800,
  150.00,
  'EUR',
  'ia-sante@sanofi.com',
  'https://ia-sante-lyon.fr',
  'https://registration.sanofi-event.fr',
  'published',
  'public',
  1,
  1,
  '2025-02-01 14:30:00',
  'conference-ia-sante-lyon',
  'intelligence artificielle, sante, medecine'
),

-- Événements internationaux
(
  'Global Energy Transition Summit',
  'International summit bringing together energy leaders and policymakers.',
  'TotalEnergies',
  'Energie',
  'conference',
  'international',
  'France',
  'Paris',
  'La Defense Arena',
  48.8960,
  2.2290,
  '2025-05-20 09:00:00',
  '2025-05-22 18:00:00',
  '2025-04-30 23:59:59',
  3000,
  799.00,
  'EUR',
  'gets@totalenergies.com',
  'https://gets2025.com',
  'https://register.gets2025.com',
  'published',
  'public',
  1,
  1,
  '2025-01-20 11:00:00',
  'global-energy-transition-summit',
  'energy, renewable, sustainability'
),

(
  'World Automotive Innovation Forum',
  'The premier global event for automotive industry leaders.',
  'Stellantis',
  'Automobile',
  'conference',
  'international',
  'Germany',
  'Munich',
  'BMW Welt',
  48.1769,
  11.5561,
  '2025-06-10 08:00:00',
  '2025-06-12 19:00:00',
  '2025-05-15 23:59:59',
  2500,
  899.00,
  'EUR',
  'forum@stellantis.com',
  'https://waif2025.com',
  'https://tickets.waif2025.com',
  'published',
  'public',
  1,
  1,
  '2025-02-10 09:15:00',
  'world-automotive-innovation-forum',
  'automotive, electric vehicles, innovation'
);

-- Associer les événements aux catégories
INSERT OR IGNORE INTO event_category_relations (event_id, category_id) VALUES 
  (1, 2), -- FinTech Paris -> Finance
  (2, 1), -- IA Sante -> Technologie
  (2, 3), -- IA Sante -> Sante
  (3, 5), -- Energy Summit -> Energie
  (4, 6), -- Automotive -> Automobile
  (4, 1); -- Automotive -> Technologie