-- Données de test pour Kafouyat Corporate Events

-- Insérer des catégories d'événements
INSERT OR IGNORE INTO event_categories (name, description, color_code, icon) VALUES 
  ('Technologie', 'Événements liés aux nouvelles technologies', '#3B82F6', 'fas fa-laptop-code'),
  ('Finance', 'Événements financiers et bancaires', '#10B981', 'fas fa-chart-line'),
  ('Santé', 'Événements du secteur de la santé', '#EF4444', 'fas fa-heartbeat'),
  ('Industrie', 'Événements industriels et manufacturiers', '#F59E0B', 'fas fa-industry'),
  ('Énergie', 'Événements du secteur énergétique', '#8B5CF6', 'fas fa-bolt'),
  ('Télécommunications', 'Événements télécoms et réseaux', '#06B6D4', 'fas fa-broadcast-tower'),
  ('Automobile', 'Événements de l''industrie automobile', '#F97316', 'fas fa-car'),
  ('Immobilier', 'Événements du secteur immobilier', '#84CC16', 'fas fa-building');

-- Insérer un administrateur de test
INSERT OR IGNORE INTO admins (email, name, role, password_hash, is_active) VALUES 
  ('admin@kafouyat.com', 'Kafouyat Admin', 'super_admin', '$2a$10$dummy.hash.for.testing', 1);

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
  'Le plus grand événement FinTech de France réunissant startups, banques traditionnelles et régulateurs pour façonner l\'avenir de la finance numérique.',
  'BNP Paribas',
  'Finance',
  'conference',
  'national',
  'France',
  'Paris',
  'Palais des Congrès',
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
  'fintech, finance, innovation, paris, blockchain, crypto'
),

(
  'Conférence IA & Santé Lyon',
  'Découvrez comment l\'intelligence artificielle révolutionne le secteur de la santé. Cas d\'usage, régulations et perspectives d\'avenir.',
  'Sanofi',
  'Santé',
  'conference',
  'national',
  'France',
  'Lyon',
  'Centre de Congrès de Lyon',
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
  'intelligence artificielle, santé, médecine, innovation, lyon'
),

-- Événements internationaux
(
  'Global Energy Transition Summit',
  'International summit bringing together energy leaders, policymakers, and innovators to accelerate the global transition to renewable energy.',
  'TotalEnergies',
  'Énergie',
  'conference',
  'international',
  'France',
  'Paris',
  'La Défense Arena',
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
  'energy, renewable, sustainability, international, climate'
),

(
  'World Automotive Innovation Forum',
  'The premier global event for automotive industry leaders exploring electric vehicles, autonomous driving, and sustainable mobility solutions.',
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
  'automotive, electric vehicles, innovation, international, sustainability'
),

(
  'African Tech Investment Summit',
  'Connecting African startups with international investors. Focus on fintech, healthtech, and sustainable technology solutions across Africa.',
  'Orange',
  'Technologie',
  'networking',
  'international',
  'Senegal',
  'Dakar',
  'King Fahd Palace Hotel',
  14.6928,
  -17.4467,
  '2025-07-15 09:00:00',
  '2025-07-16 18:00:00',
  '2025-06-30 23:59:59',
  1200,
  350.00,
  'EUR',
  'atis@orange.com',
  'https://atis-dakar.com',
  'https://register.atis-dakar.com',
  'published',
  'public',
  1,
  1,
  '2025-03-01 16:20:00',
  'african-tech-investment-summit',
  'africa, technology, investment, startup, fintech, dakar'
),

(
  'Forum Immobilier Durable Casablanca',
  'Forum international sur l\'immobilier durable et les smart cities au Maroc et en Afrique du Nord.',
  'CDG Group',
  'Immobilier',
  'conference',
  'international',
  'Morocco',
  'Casablanca',
  'Four Seasons Hotel Casablanca',
  33.5731,
  -7.5898,
  '2025-09-25 08:30:00',
  '2025-09-26 17:00:00',
  '2025-09-01 23:59:59',
  900,
  250.00,
  'EUR',
  'fid@cdggroup.ma',
  'https://fid-casablanca.com',
  'https://inscription.fid-casablanca.com',
  'published',
  'public',
  0,
  1,
  '2025-04-01 10:45:00',
  'forum-immobilier-durable-casablanca',
  'immobilier, durable, smart city, maroc, casablanca'
);

-- Associer les événements aux catégories
INSERT OR IGNORE INTO event_category_relations (event_id, category_id) VALUES 
  (1, 2), -- FinTech Paris -> Finance
  (2, 1), -- IA Santé -> Technologie
  (2, 3), -- IA Santé -> Santé
  (3, 5), -- Energy Summit -> Énergie
  (4, 7), -- Automotive -> Automobile
  (4, 1), -- Automotive -> Technologie
  (5, 1), -- African Tech -> Technologie
  (5, 2), -- African Tech -> Finance
  (6, 8), -- Immobilier -> Immobilier
  (6, 5); -- Immobilier -> Énergie (durable)