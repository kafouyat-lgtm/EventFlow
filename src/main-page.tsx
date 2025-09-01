// 🏠 Page principale EventFlow

export const MainPage = () => (
  <div class="min-h-screen bg-gray-50">
    {/* Header avec branding Kafouyat */}
    <header class="bg-white shadow-lg border-b-4 border-blue-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <div class="bg-blue-600 text-white p-3 rounded-lg">
              <i class="fas fa-calendar-alt text-2xl"></i>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">EventFlow</h1>
              <p class="text-gray-600">Le flux d'événements corporate en temps réel</p>
            </div>
          </div>
          <div class="hidden md:flex space-x-4">
            <button onclick="window.scrollTo({top: document.getElementById('events').offsetTop, behavior: 'smooth'})" 
                    class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <i class="fas fa-search mr-2"></i>Explorer les événements
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Hero Section avec statistiques */}
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h2 class="text-5xl font-bold mb-6">Événements Corporate</h2>
        <h3 class="text-3xl font-semibold mb-4">Nationaux & Internationaux</h3>
        <p class="text-xl mb-12 max-w-3xl mx-auto">
          Découvrez les événements corporate les plus importants. 
          Connectez-vous avec les leaders d'industrie du monde entier.
        </p>
        
        {/* Statistiques en temps réel */}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div id="total-events" class="text-4xl font-bold mb-2">...</div>
            <div class="text-blue-200">Événements</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div id="total-countries" class="text-4xl font-bold mb-2">...</div>
            <div class="text-blue-200">Pays</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div id="upcoming-events" class="text-4xl font-bold mb-2">...</div>
            <div class="text-blue-200">À venir</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div id="total-sectors" class="text-4xl font-bold mb-2">...</div>
            <div class="text-blue-200">Secteurs</div>
          </div>
        </div>
      </div>
    </section>

    {/* Section des filtres et recherche */}
    <section id="events" class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="bg-gray-50 rounded-2xl p-8 mb-12">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">
            <i class="fas fa-filter mr-3 text-blue-600"></i>
            Filtres de recherche avancés
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Recherche textuelle */}
            <div class="col-span-1 lg:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-search mr-1"></i> Recherche
              </label>
              <input type="text" id="search-input" placeholder="Nom d'événement, entreprise, secteur..." 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            
            {/* Filtre pays */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-globe mr-1"></i> Pays
              </label>
              <select id="country-filter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Tous les pays</option>
              </select>
            </div>
            
            {/* Filtre secteur */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-industry mr-1"></i> Secteur
              </label>
              <select id="sector-filter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Tous les secteurs</option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Filtre type */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-calendar mr-1"></i> Type d'événement
              </label>
              <select id="type-filter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Tous les types</option>
                <option value="conference">Conférence</option>
                <option value="seminar">Séminaire</option>
                <option value="workshop">Atelier</option>
                <option value="networking">Networking</option>
                <option value="product_launch">Lancement produit</option>
              </select>
            </div>
            
            {/* Filtre portée */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-map mr-1"></i> Portée
              </label>
              <select id="scope-filter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Toutes</option>
                <option value="national">National</option>
                <option value="international">International</option>
              </select>
            </div>
            
            {/* Bouton recherche */}
            <div class="flex items-end">
              <button onclick="searchEvents()" class="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <i class="fas fa-search mr-2"></i>Rechercher
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Section des événements à la une */}
    <section class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <h3 class="text-3xl font-bold text-gray-900 mb-8 text-center">
          <i class="fas fa-star mr-3 text-yellow-500"></i>
          Événements à la une
        </h3>
        <div id="featured-events" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Les événements à la une seront chargés ici */}
        </div>
      </div>
    </section>

    {/* Section de tous les événements */}
    <section class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <h3 class="text-3xl font-bold text-gray-900 mb-8 text-center">
          <i class="fas fa-calendar-week mr-3 text-blue-600"></i>
          Tous les événements
        </h3>
        <div id="events-list" class="space-y-6">
          {/* La liste des événements sera chargée ici */}
        </div>
        
        {/* Bouton charger plus */}
        <div class="text-center mt-12">
          <button id="load-more-btn" onclick="loadMoreEvents()" 
                  class="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            <i class="fas fa-plus mr-2"></i>Charger plus d'événements
          </button>
        </div>
      </div>
    </section>

    {/* Footer avec droits Kafouyat */}
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <div class="mb-6">
          <h4 class="text-2xl font-bold mb-2">EventFlow</h4>
          <p class="text-gray-400">Plateforme d'événements corporate</p>
        </div>
        
        <div class="border-t border-gray-800 pt-6">
          <p class="text-sm text-gray-400">
            © 2025 EventFlow. Tous droits réservés. | Le flux d'événements corporate en temps réel.
          </p>
        </div>
      </div>
    </footer>

    {/* Scripts intégrés */}
    <script src="/static/app.js" />
  </div>
)