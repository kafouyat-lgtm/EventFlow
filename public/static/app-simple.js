// EventFlow - Version Simplifiée et Fonctionnelle
console.log('🚀 EventFlow Simple - Chargement...');

let eventsData = [];

// Charger les événements
async function loadEvents() {
    try {
        const response = await fetch('/events.json');
        const data = await response.json();
        eventsData = data.events || [];
        console.log('✅ Événements chargés:', eventsData.length);
        
        displayEvents(eventsData);
        setupSearch();
        loadStats();
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

// Afficher les événements
function displayEvents(events) {
    const container = document.getElementById('events-list');
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = '<div class="text-center py-8"><h3 class="text-xl text-gray-600">Aucun événement trouvé</h3></div>';
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <div class="flex items-center space-x-2 mb-2">
                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">${event.company_sector}</span>
                        <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">${event.country}</span>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900">${event.title}</h3>
                    <p class="text-gray-600 text-sm">${event.description.substring(0, 100)}...</p>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                <div class="flex items-center text-gray-600">
                    <i class="fas fa-building mr-2 text-blue-500"></i>
                    <span>${event.organizer_name || event.company_name}</span>
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
                    <i class="fas fa-euro-sign mr-2 text-purple-500"></i>
                    <span>${event.registration_fee === 0 ? 'Gratuit' : `${event.registration_fee}€`}</span>
                </div>
            </div>
            
            <div class="flex space-x-2">
                <a href="mailto:${event.contact_email}?subject=Information - ${event.title}" 
                   class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
                    <i class="fas fa-envelope mr-1"></i> Contact
                </a>
                <button onclick="showDetails(${event.id})" 
                        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                    <i class="fas fa-info mr-1"></i> Détails
                </button>
            </div>
        </div>
    `).join('');
    
    console.log('📅 Affichage:', events.length, 'événements');
}

// Configuration de la recherche
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const countryFilter = document.getElementById('country-filter');
    const sectorFilter = document.getElementById('sector-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterEvents);
        console.log('🔍 Recherche configurée');
    }
    
    if (countryFilter) {
        // Remplir les options
        const countries = [...new Set(eventsData.map(e => e.country))];
        countryFilter.innerHTML = '<option value="">Tous les pays</option>' + 
            countries.map(c => `<option value="${c}">${c}</option>`).join('');
        countryFilter.addEventListener('change', filterEvents);
    }
    
    if (sectorFilter) {
        // Remplir les options  
        const sectors = [...new Set(eventsData.map(e => e.company_sector))];
        sectorFilter.innerHTML = '<option value="">Tous les secteurs</option>' + 
            sectors.map(s => `<option value="${s}">${s}</option>`).join('');
        sectorFilter.addEventListener('change', filterEvents);
    }
}

// Filtrer les événements
function filterEvents() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const selectedCountry = document.getElementById('country-filter')?.value || '';
    const selectedSector = document.getElementById('sector-filter')?.value || '';
    
    console.log('🔍 Recherche:', searchTerm, 'Pays:', selectedCountry, 'Secteur:', selectedSector);
    
    let filtered = eventsData.filter(event => {
        const matchesSearch = !searchTerm || 
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.company_name.toLowerCase().includes(searchTerm) ||
            (event.organizer_name && event.organizer_name.toLowerCase().includes(searchTerm));
            
        const matchesCountry = !selectedCountry || event.country === selectedCountry;
        const matchesSector = !selectedSector || event.company_sector === selectedSector;
        
        return matchesSearch && matchesCountry && matchesSector;
    });
    
    console.log('✅ Résultats filtrés:', filtered.length, '/', eventsData.length);
    displayEvents(filtered);
}

// Afficher les détails
function showDetails(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    alert(`DÉTAILS DE L'ÉVÉNEMENT

📅 ${event.title}
🏢 Organisé par: ${event.organizer_name || event.company_name}
📍 Lieu: ${event.city}, ${event.country}
📆 Date: ${new Date(event.start_date).toLocaleDateString('fr-FR')}
💰 Prix: ${event.registration_fee === 0 ? 'Gratuit' : `${event.registration_fee}€`}
📧 Contact: ${event.contact_email}

${event.description}`);
}

// Charger les stats
function loadStats() {
    const stats = {
        totalEvents: eventsData.length,
        totalCountries: [...new Set(eventsData.map(e => e.country))].length,
        upcomingEvents: eventsData.filter(e => new Date(e.start_date) > new Date()).length,
        totalSectors: [...new Set(eventsData.map(e => e.company_sector))].length
    };
    
    document.getElementById('total-events').textContent = stats.totalEvents;
    document.getElementById('total-countries').textContent = stats.totalCountries;
    document.getElementById('upcoming-events').textContent = stats.upcomingEvents;
    document.getElementById('total-sectors').textContent = stats.totalSectors;
    
    console.log('📊 Stats:', stats);
}

// Démarrage
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 EventFlow Simple - Démarrage');
    loadEvents();
});

console.log('📦 EventFlow Simple chargé');