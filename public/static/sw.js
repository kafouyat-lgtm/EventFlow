// 🔔 Service Worker pour Kafouyat Events
// Gestion des notifications push et cache

const CACHE_NAME = 'kafouyat-events-v1';
const urlsToCache = [
  '/',
  '/static/app.js',
  '/static/styles.css',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Installation du Service Worker Kafouyat');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Resources mises en cache');
        return self.skipWaiting();
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Activation du Service Worker Kafouyat');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activé');
      return self.clients.claim();
    })
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  // Stratégie Cache First pour les assets statiques
  if (event.request.url.includes('/static/') || event.request.url.includes('cdn.')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Retourner depuis le cache si trouvé
          if (response) {
            return response;
          }
          
          // Sinon, aller chercher sur le réseau et mettre en cache
          return fetch(event.request).then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
        })
    );
  }
  // Stratégie Network First pour les API
  else if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // En cas d'erreur réseau, retourner une réponse par défaut
          return new Response(JSON.stringify({
            success: false,
            error: 'Mode hors ligne - Données non disponibles',
            offline: true
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
  }
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('📱 Notification push reçue:', event);
  
  let notificationData = {};
  
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData = {
        title: 'Kafouyat Events',
        body: event.data.text() || 'Nouvel événement disponible',
        icon: '/static/icons/icon-192x192.png',
        badge: '/static/icons/badge-72x72.png'
      };
    }
  } else {
    notificationData = {
      title: 'Kafouyat Events',
      body: 'Découvrez les nouveaux événements corporate',
      icon: '/static/icons/icon-192x192.png',
      badge: '/static/icons/badge-72x72.png'
    };
  }
  
  const notificationOptions = {
    body: notificationData.body,
    icon: notificationData.icon || '/static/icons/icon-192x192.png',
    badge: notificationData.badge || '/static/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: notificationData.data || { url: '/' },
    actions: [
      {
        action: 'view',
        title: 'Voir l\\'événement',
        icon: '/static/icons/view-icon.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/static/icons/close-icon.png'
      }
    ],
    tag: 'kafouyat-event',
    requireInteraction: false,
    silent: false
  };
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationOptions)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Clic sur notification:', event);
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  // URL à ouvrir
  let urlToOpen = '/';
  if (event.notification.data && event.notification.data.url) {
    urlToOpen = event.notification.data.url;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Vérifier s'il y a déjà un onglet ouvert
        for (let client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        
        // Sinon, ouvrir un nouvel onglet
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Gestion de la fermeture des notifications
self.addEventListener('notificationclose', (event) => {
  console.log('❌ Notification fermée:', event);
  
  // Ici, on pourrait envoyer des analytics sur les notifications fermées
  // fetch('/api/analytics/notification-closed', {
  //   method: 'POST',
  //   body: JSON.stringify({ notificationTag: event.notification.tag })
  // });
});

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  console.log('🔄 Synchronisation en arrière-plan:', event.tag);
  
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
  
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

// Fonction pour synchroniser les favoris
async function syncFavorites() {
  try {
    // Récupérer les favoris locaux en attente de synchronisation
    const localFavorites = await getLocalPendingFavorites();
    
    for (let favorite of localFavorites) {
      await fetch('/api/favorites/' + favorite.eventId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIdentifier: favorite.userIdentifier })
      });
    }
    
    // Nettoyer les favoris locaux après synchronisation
    await clearLocalPendingFavorites();
    
    console.log('✅ Favoris synchronisés');
  } catch (error) {
    console.error('❌ Erreur synchronisation favoris:', error);
  }
}

// Fonction pour synchroniser les analytics
async function syncAnalytics() {
  try {
    const pendingAnalytics = await getLocalPendingAnalytics();
    
    if (pendingAnalytics.length > 0) {
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analytics: pendingAnalytics })
      });
      
      await clearLocalPendingAnalytics();
      console.log('✅ Analytics synchronisées');
    }
  } catch (error) {
    console.error('❌ Erreur synchronisation analytics:', error);
  }
}

// Fonctions utilitaires pour la gestion locale des données
async function getLocalPendingFavorites() {
  // Implémenter la récupération des favoris depuis IndexedDB
  return [];
}

async function clearLocalPendingFavorites() {
  // Implémenter le nettoyage des favoris locaux
}

async function getLocalPendingAnalytics() {
  // Implémenter la récupération des analytics depuis IndexedDB
  return [];
}

async function clearLocalPendingAnalytics() {
  // Implémenter le nettoyage des analytics locaux
}

console.log('🔔 Service Worker Kafouyat Events chargé');