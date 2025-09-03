module.exports = {
  apps: [
    {
      name: 'eventflow',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}