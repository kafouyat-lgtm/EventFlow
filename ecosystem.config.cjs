// 🚀 PM2 Configuration pour EventFlow
// Plateforme d'événements corporate

module.exports = {
  apps: [
    {
      name: 'eventflow',
      script: 'npx',
      args: 'wrangler pages dev dist --d1=eventflow-production --local --ip 0.0.0.0 --port 3000',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false, // Wrangler gère déjà le hot reload
      instances: 1, // Mode développement avec une seule instance
      exec_mode: 'fork',
      
      // Logs configuration
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      log_file: 'logs/combined.log',
      
      // Restart configuration
      max_restarts: 10,
      restart_delay: 1000,
      
      // Monitoring
      min_uptime: '10s',
      max_memory_restart: '500M'
    }
  ]
}