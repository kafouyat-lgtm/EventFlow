import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Kafouyat Events - Plateforme d'événements corporate nationaux et internationaux. Découvrez les événements les plus importants du monde des affaires." />
        <meta name="keywords" content="événements corporate, business events, conférences, séminaires, kafouyat, national, international" />
        <meta name="author" content="Kafouyat Team" />
        <meta name="copyright" content="© 2025 Kafouyat. Tous droits réservés." />
        
        {/* Open Graph */}
        <meta property="og:title" content="Kafouyat Events - Événements Corporate" />
        <meta property="og:description" content="Découvrez les événements corporate les plus importants - Nationaux et Internationaux" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Kafouyat Events" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kafouyat Events" />
        <meta name="twitter:description" content="Plateforme d'événements corporate - Tous droits réservés à Kafouyat" />
        
        <title>Kafouyat Events - Événements Corporate Nationaux & Internationaux</title>
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
        
        {/* Styles */}
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="/static/styles.css" rel="stylesheet" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/static/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        
        {/* Preconnect pour optimiser les performances */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      </head>
      <body class="bg-gray-50">
        {children}
        
        {/* Service Worker Registration */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/static/sw.js')
                  .then(registration => console.log('✅ SW registered'))
                  .catch(error => console.log('❌ SW registration failed'));
              });
            }
          `
        }}></script>
      </body>
    </html>
  )
})
