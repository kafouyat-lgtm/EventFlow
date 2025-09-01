-- Données de test pour EventFlow - Plateforme d'événements corporate

-- Insérer des catégories d'événements
INSERT OR IGNORE INTO event_categories (name, description, color_code, icon) VALUES 
  ('Technologie', 'Evenements technologiques et innovation', '#3B82F6', 'fas fa-laptop-code'),
  ('Finance', 'Evenements financiers et fintech', '#10B981', 'fas fa-chart-line'),
  ('Sante', 'Evenements du secteur de la sante', '#EF4444', 'fas fa-heartbeat'),
  ('Industrie', 'Evenements industriels et manufacturiers', '#F59E0B', 'fas fa-industry'),
  ('Energie', 'Evenements du secteur energetique', '#8B5CF6', 'fas fa-bolt'),
  ('Automobile', 'Evenements industrie automobile', '#F97316', 'fas fa-car');

-- Insérer un administrateur EventFlow
INSERT OR IGNORE INTO admins (email, name, role, password_hash, is_active) VALUES 
  ('admin@eventflow.com', 'EventFlow Admin', 'super_admin', 'dummy_hash', 1);

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
  'Le plus grand evenement FinTech de France reunissant startups et banques traditionnelles pour faconner le futur de la finance numerique.',
  'BNP Paribas',
  'Finance',
  'conference',
  'national',
  'France',
  'Paris',
  'Palais des Congres',
  48.8738,
  2.2830,
  '2025-12-15 09:00:00',
  '2025-12-16 18:00:00',
  '2025-12-01 23:59:59',
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
  'Decouvrez comment intelligence artificielle revolutionne le secteur de la sante avec cas usage concrets et perspectives avenir.',
  'Sanofi',
  'Sante',
  'conference',
  'national',
  'France',
  'Lyon',
  'Centre de Congres de Lyon',
  45.7640,
  4.8357,
  '2025-11-08 08:30:00',
  '2025-11-08 17:30:00',
  '2025-10-25 23:59:59',
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
  'International summit bringing together energy leaders, policymakers, and innovators to accelerate the global transition to renewable energy.',
  'TotalEnergies',
  'Energie',
  'conference',
  'international',
  'France',
  'Paris',
  'La Defense Arena',
  48.8960,
  2.2290,
  '2025-10-20 09:00:00',
  '2025-10-22 18:00:00',
  '2025-10-05 23:59:59',
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
  '2025-09-10 08:00:00',
  '2025-09-12 19:00:00',
  '2025-08-15 23:59:59',
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
),

(
  'African Tech Investment Summit Dakar',
  'Connecting African startups with international investors. Focus on fintech, healthtech, and sustainable technology solutions across Africa.',
  'Orange Africa',
  'Technologie',
  'networking',
  'international',
  'Senegal',
  'Dakar',
  'King Fahd Palace Hotel',
  14.6928,
  -17.4467,
  '2025-11-15 09:00:00',
  '2025-11-16 18:00:00',
  '2025-10-30 23:59:59',
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
  'africa, technology, investment, startup'
);

-- Associer les événements aux catégories
INSERT OR IGNORE INTO event_category_relations (event_id, category_id) VALUES 
  (1, 2), -- FinTech Paris -> Finance
  (2, 1), -- IA Sante -> Technologie
  (2, 3), -- IA Sante -> Sante
  (3, 5), -- Energy Summit -> Energie
  (4, 6), -- Automotive -> Automobile
  (4, 1), -- Automotive -> Technologie
  (5, 1), -- African Tech -> Technologie
  (5, 2); -- African Tech -> Finance