// 🚀 EventFlow - Frontend JavaScript CORRIGÉ
// Plateforme d'événements corporate

class EventFlowApp {
    constructor() {
        this.currentOffset = 0;
        this.isLoading = false;
        this.userIdentifier = this.getUserIdentifier();
        this.eventsData = null;
        
        this.init();
    }

    // 🔧 Initialisation de l'application
    async init() {
        console.log('🚀 Initialisation de EventFlow');
        
        // Charger les données d'événements
        await this.loadEventsData();
        
        // Charger les statistiques calculées
        this.loadStats();
        
        // Charger les options de filtres
        this.loadFilterOptions();
        
        // Charger les événements à la une
        this.loadFeaturedEvents();
        
        // Charger tous les événements
        this.loadEvents();
        
        // Configurer les event listeners
        this.setupEventListeners();
        
        console.log('✅ EventFlow initialisé avec succès');
    }

    // 👤 Gestion de l'identifiant utilisateur
    getUserIdentifier() {
        let userId = localStorage.getItem('eventflow_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('eventflow_user_id', userId);
        }
        return userId;
    }

    // 📦 Charger les données d'événements
    async loadEventsData() {
        try {
            const response = await fetch('/events.json');
            const data = await response.json();
            this.eventsData = data.events || [];
            console.log('✅ Données chargées:', this.eventsData.length, 'événements');
        } catch (error) {
            console.error('❌ Erreur lors du chargement des données:', error);
            this.eventsData = [];
        }
    }

    // 📊 Calculer et afficher les statistiques
    loadStats() {
        if (!this.eventsData) return;

        const stats = {
            totalEvents: this.eventsData.length,
            totalCountries: [...new Set(this.eventsData.map(e => e.country))].length,
            upcomingEvents: this.eventsData.filter(e => new Date(e.start_date) > new Date()).length,
            totalSectors: [...new Set(this.eventsData.map(e => e.company_sector))].length
        };

        // Mise à jour des éléments HTML
        const totalEventsEl = document.getElementById('total-events');
        const totalCountriesEl = document.getElementById('total-countries');
        const upcomingEventsEl = document.getElementById('upcoming-events');
        const totalSectorsEl = document.getElementById('total-sectors');

        if (totalEventsEl) totalEventsEl.textContent = stats.totalEvents;
        if (totalCountriesEl) totalCountriesEl.textContent = stats.totalCountries;
        if (upcomingEventsEl) upcomingEventsEl.textContent = stats.upcomingEvents;
        if (totalSectorsEl) totalSectorsEl.textContent = stats.totalSectors;

        console.log('📊 Statistiques:', stats);
    }

    // 🏷️ Charger les options de filtres
    loadFilterOptions() {
        if (!this.eventsData) return;

        const countries = [...new Set(this.eventsData.map(e => e.country))];
        const sectors = [...new Set(this.eventsData.map(e => e.company_sector))];
        const eventTypes = [...new Set(this.eventsData.map(e => e.event_type))];

        // Remplir le filtre par pays
        const countryFilter = document.getElementById('country-filter');
        if (countryFilter) {
            countryFilter.innerHTML = '<option value="">Tous les pays</option>';
            countries.forEach(country => {
                countryFilter.innerHTML += `<option value="${country}">${country}</option>`;
            });
        }

        // Remplir le filtre par secteur
        const sectorFilter = document.getElementById('sector-filter');
        if (sectorFilter) {
            sectorFilter.innerHTML = '<option value="">Tous les secteurs</option>';
            sectors.forEach(sector => {
                sectorFilter.innerHTML += `<option value="${sector}">${sector}</option>`;
            });
        }

        // Remplir le filtre par type
        const typeFilter = document.getElementById('type-filter');
        if (typeFilter) {
            typeFilter.innerHTML = '<option value="">Tous les types</option>';
            eventTypes.forEach(type => {
                const typeLabel = type === 'conference' ? 'Conférence' : 
                                type === 'networking' ? 'Networking' : 
                                type === 'salon' ? 'Salon' : type;
                typeFilter.innerHTML += `<option value="${type}">${typeLabel}</option>`;
            });
        }

        console.log('🏷️ Filtres chargés');
    }

    // ⭐ Charger les événements à la une
    loadFeaturedEvents() {
        if (!this.eventsData) return;

        const featuredEvents = this.eventsData.filter(e => e.featured === 1).slice(0, 3);
        const container = document.getElementById('featured-events');
        
        if (!container) return;

        container.innerHTML = featuredEvents.map(event => `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            ${event.company_sector}
                        </span>
                        <span class="text-gray-500 text-sm">
                            ${new Date(event.start_date).toLocaleDateString('fr-FR')}
                        </span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">${event.title}</h3>
                    <p class="text-gray-600 mb-4 line-clamp-2">${event.description}</p>
                    <div class="space-y-2">
                        <div class="flex items-center text-gray-500">
                            <i class="fas fa-map-marker-alt mr-2"></i>
                            <span>${event.city}, ${event.country}</span>
                        </div>
                        <div class="flex items-center text-gray-500">
                            <i class="fas fa-user-tie mr-2"></i>
                            <span>Organisé par ${event.organizer_name || event.company_name}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="text-blue-600 font-bold">
                                ${event.registration_fee === 0 ? 'Gratuit' : `${event.registration_fee}€`}
                            </div>
                            <a href="mailto:${event.contact_email}" class="text-green-600 hover:text-green-700 font-medium">
                                <i class="fas fa-envelope mr-1"></i>
                                Contacter
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        console.log('⭐ Événements à la une chargés:', featuredEvents.length);
    }

    // 📅 Charger tous les événements
    loadEvents(filters = {}) {
        if (!this.eventsData) return;

        let filteredEvents = [...this.eventsData];

        // Appliquer les filtres
        if (filters.country) {
            filteredEvents = filteredEvents.filter(e => e.country === filters.country);
        }
        if (filters.sector) {
            filteredEvents = filteredEvents.filter(e => e.company_sector === filters.sector);
        }
        if (filters.type) {
            filteredEvents = filteredEvents.filter(e => e.event_type === filters.type);
        }
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredEvents = filteredEvents.filter(e => 
                e.title.toLowerCase().includes(searchTerm) ||
                e.description.toLowerCase().includes(searchTerm) ||
                e.company_name.toLowerCase().includes(searchTerm)
            );
        }

        const container = document.getElementById('events-list');
        if (!container) return;

        if (filteredEvents.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">Aucun événement trouvé</h3>
                    <p class="text-gray-500">Essayez de modifier vos critères de recherche</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredEvents.map(event => `
            <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div class="p-6">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex-1">
                            <div class="flex items-center space-x-2 mb-2">
                                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                                    ${event.company_sector}
                                </span>
                                <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                    ${event.scope === 'national' ? 'National' : 'International'}
                                </span>
                            </div>
                            <h3 class="text-lg font-bold text-gray-900 mb-2">${event.title}</h3>
                            <p class="text-gray-600 text-sm mb-3 line-clamp-2">${event.description}</p>
                        </div>
                    </div>
                    
                    <div class="border-t pt-4">
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div class="flex items-center text-gray-600">
                                <i class="fas fa-building mr-2 text-blue-500"></i>
                                <span>${event.company_name}</span>
                            </div>
                            <div class="flex items-center text-gray-600">
                                <i class="fas fa-calendar mr-2 text-green-500"></i>
                                <span>${new Date(event.start_date).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div class="flex items-center text-gray-600">
                                <i class="fas fa-map-marker-alt mr-2 text-red-500"></i>
                                <span>${event.city}, ${event.country}</span>
                            </div>
                            <div class="flex items-center text-gray-600">
                                <i class="fas fa-users mr-2 text-purple-500"></i>
                                <span>${event.max_participants} participants</span>
                            </div>
                        </div>
                        
                        <div class="bg-gray-50 p-3 rounded-lg mt-4">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm font-medium text-gray-700">Organisateur :</span>
                                <span class="text-sm font-bold text-gray-900">${event.organizer_name || event.company_name}</span>
                            </div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm text-gray-600">Contact :</span>
                                <a href="mailto:${event.contact_email}" class="text-sm text-green-600 hover:text-green-700 font-medium">
                                    <i class="fas fa-envelope mr-1"></i>
                                    ${event.contact_email}
                                </a>
                            </div>
                            ${event.contact_phone ? `
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm text-gray-600">Téléphone :</span>
                                <a href="tel:${event.contact_phone}" class="text-sm text-blue-600 hover:text-blue-700">
                                    <i class="fas fa-phone mr-1"></i>
                                    ${event.contact_phone}
                                </a>
                            </div>
                            ` : ''}
                        </div>
                        
                        <div class="flex items-center justify-between mt-4">
                            <div class="text-lg font-bold text-blue-600">
                                ${event.registration_fee === 0 ? 'Gratuit' : `${event.registration_fee}€`}
                            </div>
                            <div class="flex space-x-2">
                                <a href="mailto:${event.contact_email}?subject=Demande d'information - ${event.title}" 
                                   class="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                                    <i class="fas fa-envelope mr-1"></i>
                                    Contact
                                </a>
                                <button onclick="window.open('${event.website_url}', '_blank')" 
                                        class="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                    <i class="fas fa-external-link-alt mr-1"></i>
                                    Détails
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        console.log('📅 Événements chargés:', filteredEvents.length);
    }

    // 🎧 Configurer les event listeners
    setupEventListeners() {
        // Recherche
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.applyFilters();
            });
        }

        // Filtres
        const filters = ['country-filter', 'sector-filter', 'type-filter'];
        filters.forEach(filterId => {
            const element = document.getElementById(filterId);
            if (element) {
                element.addEventListener('change', () => {
                    this.applyFilters();
                });
            }
        });

        console.log('🎧 Event listeners configurés');
    }

    // 🔍 Appliquer tous les filtres
    applyFilters() {
        const filters = {
            search: document.getElementById('search-input')?.value || '',
            country: document.getElementById('country-filter')?.value || '',
            sector: document.getElementById('sector-filter')?.value || '',
            type: document.getElementById('type-filter')?.value || ''
        };

        this.loadEvents(filters);
    }
}

// 🚀 Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 EventFlow - Démarrage de l\'application');
    window.eventFlowApp = new EventFlowApp();
});

// 📱 Gestion des erreurs globales
window.addEventListener('error', (e) => {
    console.error('❌ Erreur JavaScript:', e.error);
});

console.log('📦 EventFlow JavaScript chargé');