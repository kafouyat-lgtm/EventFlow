// 🚀 Kafouyat Corporate Events - Frontend JavaScript
// Tous droits réservés à Kafouyat

class KafouyatEventsApp {
    constructor() {
        this.currentOffset = 0;
        this.isLoading = false;
        this.userIdentifier = this.getUserIdentifier();
        this.notificationSupported = 'Notification' in window && 'serviceWorker' in navigator;
        
        this.init();
    }

    // 🔧 Initialisation de l'application
    async init() {
        console.log('🚀 Initialisation de Kafouyat Events');
        
        // Charger les statistiques
        await this.loadStats();
        
        // Charger les options de filtres
        await this.loadFilterOptions();
        
        // Charger les événements à la une
        await this.loadFeaturedEvents();
        
        // Charger les événements principaux
        await this.loadEvents();
        
        // Configurer les event listeners
        this.setupEventListeners();
        
        // Initialiser les notifications push (si supportées)
        if (this.notificationSupported) {
            this.initializeNotifications();
        }
        
        console.log('✅ Kafouyat Events initialisé avec succès');
    }

    // 👤 Gestion de l'identifiant utilisateur (pour favoris et notifications)
    getUserIdentifier() {
        let userId = localStorage.getItem('kafouyat_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('kafouyat_user_id', userId);
        }
        return userId;
    }

    // 📊 Charger les statistiques globales
    async loadStats() {
        try {
            const response = await fetch('/api/stats');
            const data = await response.json();
            
            if (data.success) {
                document.getElementById('total-events').textContent = data.stats.totalEvents.toLocaleString();
                document.getElementById('total-countries').textContent = data.stats.totalCountries.toLocaleString();
                document.getElementById('upcoming-events').textContent = data.stats.upcomingEvents.toLocaleString();
                document.getElementById('total-sectors').textContent = data.stats.totalSectors.toLocaleString();
                
                // Animation des compteurs
                this.animateCounters();
            }
        } catch (error) {
            console.error('❌ Erreur lors du chargement des statistiques:', error);
        }
    }

    // ✨ Animation des compteurs de statistiques
    animateCounters() {
        const counters = document.querySelectorAll('#total-events, #total-countries, #upcoming-events, #total-sectors');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/,/g, ''));
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current).toLocaleString();
            }, 20);
        });
    }

    // 🏷️ Charger les options de filtres dynamiquement
    async loadFilterOptions() {
        try {
            // Charger les pays disponibles
            const eventsResponse = await fetch('/api/events?limit=1000');
            const eventsData = await eventsResponse.json();
            
            if (eventsData.success) {
                const countries = [...new Set(eventsData.events.map(e => e.country))];
                const sectors = [...new Set(eventsData.events.map(e => e.company_sector))];
                
                this.populateSelect('country-filter', countries);
                this.populateSelect('sector-filter', sectors);
            }
        } catch (error) {
            console.error('❌ Erreur lors du chargement des options de filtres:', error);
        }
    }

    // 📋 Remplir un élément select avec des options
    populateSelect(selectId, options) {
        const select = document.getElementById(selectId);
        options.sort().forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });
    }

    // ⭐ Charger les événements à la une
    async loadFeaturedEvents() {
        try {
            const response = await fetch('/api/events?featured=true&limit=6');
            const data = await response.json();
            
            if (data.success) {
                const container = document.getElementById('featured-events');
                container.innerHTML = '';
                
                data.events.forEach(event => {
                    const eventCard = this.createFeaturedEventCard(event);
                    container.appendChild(eventCard);
                });
            }
        } catch (error) {
            console.error('❌ Erreur lors du chargement des événements à la une:', error);
        }
    }

    // 🎟️ Créer une carte d'événement à la une
    createFeaturedEventCard(event) {
        const div = document.createElement('div');
        div.className = 'bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-2 border-yellow-200';
        
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        const isInternational = event.scope === 'international';
        
        div.innerHTML = `
            <div class="relative">
                <div class="bg-gradient-to-r ${isInternational ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-green-500'} text-white p-4">
                    <div class="flex justify-between items-start mb-2">
                        <span class="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                            <i class="fas fa-star mr-1"></i>À LA UNE
                        </span>
                        <span class="bg-white/20 px-3 py-1 rounded-full text-xs">
                            <i class="fas fa-${isInternational ? 'globe' : 'flag'} mr-1"></i>
                            ${isInternational ? 'International' : 'National'}
                        </span>
                    </div>
                    <h4 class="font-bold text-lg mb-1 line-clamp-2">${event.title}</h4>
                    <p class="text-sm opacity-90">${event.company_name}</p>
                </div>
                
                <div class="p-6">
                    <div class="flex items-center text-gray-600 mb-3">
                        <i class="fas fa-map-marker-alt mr-2 text-red-500"></i>
                        <span class="text-sm">${event.city}, ${event.country}</span>
                    </div>
                    
                    <div class="flex items-center text-gray-600 mb-3">
                        <i class="fas fa-calendar-alt mr-2 text-blue-500"></i>
                        <span class="text-sm">${this.formatDate(startDate)} - ${this.formatDate(endDate)}</span>
                    </div>
                    
                    <div class="flex items-center text-gray-600 mb-4">
                        <i class="fas fa-tag mr-2 text-green-500"></i>
                        <span class="text-sm">${event.company_sector}</span>
                    </div>
                    
                    <p class="text-gray-700 text-sm mb-4 line-clamp-3">${event.description}</p>
                    
                    <div class="flex justify-between items-center">
                        <div class="text-lg font-bold text-green-600">
                            ${event.registration_fee ? `${event.registration_fee}€` : 'Gratuit'}
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="app.toggleFavorite(${event.id}, this)" 
                                    class="bg-pink-100 text-pink-600 p-2 rounded-full hover:bg-pink-200 transition-colors">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button onclick="app.shareEvent(${event.id})" 
                                    class="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition-colors">
                                <i class="fas fa-share-alt"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <a href="${event.registration_url || '#'}" 
                           class="block text-center bg-gradient-to-r ${isInternational ? 'from-purple-600 to-pink-600' : 'from-blue-600 to-green-600'} text-white py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold">
                            <i class="fas fa-ticket-alt mr-2"></i>S'inscrire maintenant
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        return div;
    }

    // 📅 Charger les événements avec filtres
    async loadEvents(append = false) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        try {
            // Construire l'URL avec les filtres
            const params = new URLSearchParams();
            
            const search = document.getElementById('search-input').value;
            const country = document.getElementById('country-filter').value;
            const sector = document.getElementById('sector-filter').value;
            const type = document.getElementById('type-filter').value;
            const scope = document.getElementById('scope-filter').value;
            
            if (search) params.append('search', search);
            if (country) params.append('country', country);
            if (sector) params.append('sector', sector);
            if (type) params.append('type', type);
            if (scope) params.append('scope', scope);
            
            params.append('limit', '10');
            if (append) {
                params.append('offset', this.currentOffset.toString());
            } else {
                this.currentOffset = 0;
                params.append('offset', '0');
            }
            
            const response = await fetch(`/api/events?${params.toString()}`);
            const data = await response.json();
            
            if (data.success) {
                const container = document.getElementById('events-list');
                
                if (!append) {
                    container.innerHTML = '';
                }
                
                data.events.forEach(event => {
                    const eventElement = this.createEventListItem(event);
                    container.appendChild(eventElement);
                });
                
                // Mettre à jour l'offset pour le \"Charger plus\"
                this.currentOffset += data.events.length;
                
                // Masquer le bouton si moins de 10 événements retournés
                const loadMoreBtn = document.getElementById('load-more-btn');
                if (data.events.length < 10) {
                    loadMoreBtn.style.display = 'none';
                } else {
                    loadMoreBtn.style.display = 'block';
                }
                
                // Animation d'apparition des nouvelles cartes
                if (append) {
                    const newCards = container.querySelectorAll('.event-card:nth-last-child(-n+' + data.events.length + ')');
                    newCards.forEach((card, index) => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.transition = 'all 0.5s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        } catch (error) {
            console.error('❌ Erreur lors du chargement des événements:', error);
        }
        
        this.isLoading = false;
    }

    // 📋 Créer un élément de liste d'événement
    createEventListItem(event) {
        const div = document.createElement('div');
        div.className = 'event-card bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden';
        
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        const isInternational = event.scope === 'international';
        const timeUntil = this.getTimeUntilEvent(startDate);
        
        div.innerHTML = `
            <div class="md:flex">
                <div class="md:flex-shrink-0">
                    <div class="h-48 md:h-full md:w-64 bg-gradient-to-br ${isInternational ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-green-500'} flex flex-col justify-center items-center text-white relative">
                        <div class=\"absolute top-4 left-4\">
                            <span class=\"bg-white/20 px-3 py-1 rounded-full text-xs font-semibold\">
                                <i class=\"fas fa-${isInternational ? 'globe' : 'flag'} mr-1\"></i>
                                ${isInternational ? 'International' : 'National'}
                            </span>
                        </div>
                        <div class=\"text-center\">
                            <div class=\"text-3xl font-bold\">${startDate.getDate()}</div>
                            <div class=\"text-lg\">${this.getMonthName(startDate.getMonth())}</div>
                            <div class=\"text-2xl font-bold\">${startDate.getFullYear()}</div>
                        </div>
                        ${timeUntil ? `<div class=\"absolute bottom-4 text-center text-xs bg-white/20 px-3 py-1 rounded-full\">${timeUntil}</div>` : ''}
                    </div>
                </div>
                
                <div class=\"flex-1 p-6\">
                    <div class=\"flex justify-between items-start mb-4\">
                        <div class=\"flex-1\">
                            <h3 class=\"text-xl font-bold text-gray-900 mb-2\">${event.title}</h3>
                            <p class=\"text-lg text-blue-600 font-semibold mb-1\">${event.company_name}</p>
                            <span class=\"inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm\">${event.company_sector}</span>
                        </div>
                        <div class=\"flex flex-col space-y-2 ml-4\">
                            <button onclick=\"app.toggleFavorite(${event.id}, this)\" 
                                    class=\"bg-pink-100 text-pink-600 p-2 rounded-full hover:bg-pink-200 transition-colors\">
                                <i class=\"fas fa-heart\"></i>
                            </button>
                            <button onclick=\"app.shareEvent(${event.id})\" 
                                    class=\"bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition-colors\">
                                <i class=\"fas fa-share-alt\"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">
                        <div class=\"flex items-center text-gray-600\">
                            <i class=\"fas fa-map-marker-alt mr-2 text-red-500\"></i>
                            <span>${event.city}, ${event.country}</span>
                        </div>
                        <div class=\"flex items-center text-gray-600\">
                            <i class=\"fas fa-calendar-clock mr-2 text-blue-500\"></i>
                            <span>${this.formatDateTime(startDate)}</span>
                        </div>
                        <div class=\"flex items-center text-gray-600\">
                            <i class=\"fas fa-users mr-2 text-green-500\"></i>
                            <span>${event.max_participants ? `${event.max_participants} places` : 'Places illimitées'}</span>
                        </div>
                        <div class=\"flex items-center text-gray-600\">
                            <i class=\"fas fa-euro-sign mr-2 text-yellow-500\"></i>
                            <span class=\"font-semibold ${event.registration_fee ? 'text-orange-600' : 'text-green-600'}\">\n                                ${event.registration_fee ? `${event.registration_fee} ${event.currency}` : 'Gratuit'}\n                            </span>
                        </div>
                    </div>
                    
                    <p class=\"text-gray-700 mb-4 line-clamp-3\">${event.description}</p>
                    
                    <div class=\"flex flex-wrap gap-2 mb-4\">
                        <span class=\"bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm\">\n                            <i class=\"fas fa-tag mr-1\"></i>${this.getEventTypeLabel(event.event_type)}\n                        </span>\n                        ${event.categories ? event.categories.split(',').map(cat => \n                            `<span class=\"bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm\">${cat}</span>`\n                        ).join('') : ''}\n                    </div>\n                    \n                    <div class=\"flex justify-between items-center\">\n                        <div class=\"flex space-x-4 text-sm text-gray-500\">\n                            <span><i class=\"fas fa-eye mr-1\"></i>Voir détails</span>\n                            ${event.venue ? `<span><i class=\"fas fa-building mr-1\"></i>${event.venue}</span>` : ''}\n                        </div>\n                        <a href=\"${event.registration_url || '#'}\" \n                           class=\"bg-gradient-to-r ${isInternational ? 'from-purple-600 to-pink-600' : 'from-blue-600 to-green-600'} text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity font-semibold\">\n                            <i class=\"fas fa-external-link-alt mr-2\"></i>S'inscrire\n                        </a>\n                    </div>\n                </div>\n            </div>\n        `;\n        \n        return div;\n    }\n\n    // 🗓️ Fonctions utilitaires pour les dates\n    formatDate(date) {\n        return date.toLocaleDateString('fr-FR', {\n            day: 'numeric',\n            month: 'short',\n            year: 'numeric'\n        });\n    }\n\n    formatDateTime(date) {\n        return date.toLocaleDateString('fr-FR', {\n            day: 'numeric',\n            month: 'short',\n            hour: '2-digit',\n            minute: '2-digit'\n        });\n    }\n\n    getMonthName(monthIndex) {\n        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', \n                       'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];\n        return months[monthIndex];\n    }\n\n    getTimeUntilEvent(eventDate) {\n        const now = new Date();\n        const diff = eventDate - now;\n        \n        if (diff <= 0) return null;\n        \n        const days = Math.floor(diff / (1000 * 60 * 60 * 24));\n        if (days > 30) return `${Math.floor(days/30)} mois`;\n        if (days > 0) return `${days} jours`;\n        \n        const hours = Math.floor(diff / (1000 * 60 * 60));\n        return `${hours}h`;\n    }\n\n    getEventTypeLabel(type) {\n        const labels = {\n            'conference': 'Conférence',\n            'seminar': 'Séminaire',\n            'workshop': 'Atelier',\n            'networking': 'Networking',\n            'product_launch': 'Lancement',\n            'merger': 'Fusion',\n            'ipo': 'Introduction en Bourse',\n            'acquisition': 'Acquisition',\n            'other': 'Autre'\n        };\n        return labels[type] || type;\n    }\n\n    // 🔍 Configuration des event listeners\n    setupEventListeners() {\n        // Recherche en temps réel (debounced)\n        let searchTimeout;\n        document.getElementById('search-input').addEventListener('input', () => {\n            clearTimeout(searchTimeout);\n            searchTimeout = setTimeout(() => this.loadEvents(), 300);\n        });\n\n        // Filtres\n        ['country-filter', 'sector-filter', 'type-filter', 'scope-filter'].forEach(id => {\n            document.getElementById(id).addEventListener('change', () => this.loadEvents());\n        });\n\n        // Raccourcis clavier\n        document.addEventListener('keydown', (e) => {\n            if (e.ctrlKey && e.key === 'k') {\n                e.preventDefault();\n                document.getElementById('search-input').focus();\n            }\n        });\n    }\n\n    // ❤️ Gestion des favoris\n    async toggleFavorite(eventId, button) {\n        try {\n            const response = await fetch(`/api/favorites/${eventId}`, {\n                method: 'POST',\n                headers: {\n                    'Content-Type': 'application/json'\n                },\n                body: JSON.stringify({ userIdentifier: this.userIdentifier })\n            });\n            \n            const data = await response.json();\n            \n            if (data.success) {\n                const icon = button.querySelector('i');\n                if (data.isFavorite) {\n                    icon.className = 'fas fa-heart';\n                    button.classList.remove('text-pink-600');\n                    button.classList.add('text-red-600', 'animate-pulse');\n                    this.showNotification('❤️ Ajouté aux favoris!', 'success');\n                } else {\n                    icon.className = 'far fa-heart';\n                    button.classList.remove('text-red-600', 'animate-pulse');\n                    button.classList.add('text-pink-600');\n                    this.showNotification('💔 Retiré des favoris', 'info');\n                }\n                \n                setTimeout(() => {\n                    button.classList.remove('animate-pulse');\n                }, 1000);\n            }\n        } catch (error) {\n            console.error('❌ Erreur lors de la gestion des favoris:', error);\n            this.showNotification('❌ Erreur lors de la mise à jour des favoris', 'error');\n        }\n    }\n\n    // 🔔 Initialisation des notifications push\n    async initializeNotifications() {\n        if ('serviceWorker' in navigator) {\n            try {\n                const registration = await navigator.serviceWorker.register('/static/sw.js');\n                console.log('✅ Service Worker enregistré:', registration);\n                \n                // Demander la permission pour les notifications\n                if (Notification.permission === 'default') {\n                    this.showNotificationPermissionPrompt();\n                }\n            } catch (error) {\n                console.error('❌ Erreur Service Worker:', error);\n            }\n        }\n    }\n\n    // 📱 Demander la permission pour les notifications\n    showNotificationPermissionPrompt() {\n        const promptDiv = document.createElement('div');\n        promptDiv.className = 'fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-xl z-50 max-w-sm';\n        promptDiv.innerHTML = `\n            <div class=\"flex items-start space-x-3\">\n                <i class=\"fas fa-bell text-xl mt-1\"></i>\n                <div class=\"flex-1\">\n                    <h4 class=\"font-bold mb-2\">Notifications Kafouyat</h4>\n                    <p class=\"text-sm mb-3\">Recevez des alertes sur les nouveaux événements qui vous intéressent.</p>\n                    <div class=\"flex space-x-2\">\n                        <button onclick=\"app.requestNotificationPermission()\" \n                                class=\"bg-white text-blue-600 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100\">\n                            Autoriser\n                        </button>\n                        <button onclick=\"this.parentElement.parentElement.parentElement.remove()\" \n                                class=\"bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-400\">\n                            Plus tard\n                        </button>\n                    </div>\n                </div>\n                <button onclick=\"this.parentElement.parentElement.remove()\" \n                        class=\"text-white hover:text-gray-200\">\n                    <i class=\"fas fa-times\"></i>\n                </button>\n            </div>\n        `;\n        \n        document.body.appendChild(promptDiv);\n        \n        // Auto-remove après 10 secondes\n        setTimeout(() => {\n            if (promptDiv.parentElement) {\n                promptDiv.remove();\n            }\n        }, 10000);\n    }\n\n    // 🔔 Demander la permission de notification\n    async requestNotificationPermission() {\n        const permission = await Notification.requestPermission();\n        \n        if (permission === 'granted') {\n            this.showNotification('🔔 Notifications activées! Vous recevrez des alertes sur les nouveaux événements.', 'success');\n            // Ici, on pourrait souscrire l'utilisateur aux notifications push\n        } else {\n            this.showNotification('🔕 Notifications désactivées. Vous pouvez les activer dans les paramètres de votre navigateur.', 'info');\n        }\n        \n        // Supprimer le prompt\n        document.querySelectorAll('.fixed.top-4.right-4').forEach(el => el.remove());\n    }\n\n    // 📤 Partage d'événement\n    async shareEvent(eventId) {\n        try {\n            const eventUrl = `${window.location.origin}/#event-${eventId}`;\n            \n            if (navigator.share) {\n                // Utiliser l'API de partage native si disponible\n                await navigator.share({\n                    title: 'Événement Corporate - Kafouyat Events',\n                    text: 'Découvrez cet événement corporate sur Kafouyat Events',\n                    url: eventUrl\n                });\n            } else {\n                // Fallback: copier dans le presse-papiers\n                await navigator.clipboard.writeText(eventUrl);\n                this.showNotification('🔗 Lien copié dans le presse-papiers!', 'success');\n            }\n        } catch (error) {\n            console.error('❌ Erreur lors du partage:', error);\n            this.showNotification('❌ Erreur lors du partage', 'error');\n        }\n    }\n\n    // 💬 Système de notifications toast\n    showNotification(message, type = 'info') {\n        const notification = document.createElement('div');\n        const colors = {\n            success: 'bg-green-500',\n            error: 'bg-red-500',\n            info: 'bg-blue-500',\n            warning: 'bg-yellow-500'\n        };\n        \n        notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-xl z-50 transition-all duration-300`;\n        notification.style.transform = 'translate(-50%, -100px)';\n        notification.innerHTML = `\n            <div class=\"flex items-center space-x-2\">\n                <span>${message}</span>\n                <button onclick=\"this.parentElement.parentElement.remove()\" class=\"ml-2 hover:bg-white/20 rounded p-1\">\n                    <i class=\"fas fa-times text-sm\"></i>\n                </button>\n            </div>\n        `;\n        \n        document.body.appendChild(notification);\n        \n        // Animation d'apparition\n        setTimeout(() => {\n            notification.style.transform = 'translate(-50%, 0)';\n        }, 100);\n        \n        // Auto-remove après 5 secondes\n        setTimeout(() => {\n            notification.style.transform = 'translate(-50%, -100px)';\n            setTimeout(() => {\n                if (notification.parentElement) {\n                    notification.remove();\n                }\n            }, 300);\n        }, 5000);\n    }\n\n    // 📄 Charger plus d'événements\n    loadMoreEvents() {\n        this.loadEvents(true);\n    }\n}\n\n// 🔍 Fonctions globales\nfunction searchEvents() {\n    app.loadEvents();\n}\n\nfunction loadMoreEvents() {\n    app.loadMoreEvents();\n}\n\n// 🚀 Initialisation de l'application au chargement de la page\nlet app;\n\ndocument.addEventListener('DOMContentLoaded', () => {\n    app = new KafouyatEventsApp();\n});\n\n// 📱 Service Worker pour les notifications (basique)\nif ('serviceWorker' in navigator) {\n    window.addEventListener('load', () => {\n        navigator.serviceWorker.register('/static/sw.js')\n            .then(registration => {\n                console.log('✅ SW enregistré:', registration.scope);\n            })\n            .catch(error => {\n                console.log('❌ SW échec:', error);\n            });\n    });\n}"