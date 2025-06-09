module.exports = {
  apps: [{
    name: 'whatsapp-morning-bot',
    script: 'bot.js',
    
    // Process yönetimi
    instances: 1,
    exec_mode: 'fork',
    
    // Restart policy
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    restart_delay: 5000,
    
    // Çevre değişkenleri
    env: {
      NODE_ENV: 'development',
      LOG_LEVEL: 'debug'
    },
    env_production: {
      NODE_ENV: 'production',
      LOG_LEVEL: 'info'
    },
    
    // Log ayarları
    log_file: 'logs/pm2-combined.log',
    out_file: 'logs/pm2-out.log',
    error_file: 'logs/pm2-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Monitoring
    min_uptime: '10s',
    max_restarts: 10,
    
    // Cron restart (isteğe bağlı - her gün 04:00'da restart)
    cron_restart: '0 4 * * *',
    
    // Merge logs
    merge_logs: true,
    
    // Process title
    name: 'whatsapp-bot',
    
    // Advanced options
    kill_timeout: 5000,
    listen_timeout: 3000,
    
    // Source map support
    source_map_support: true,
    
    // Instance variables
    instance_var: 'INSTANCE_ID'
  }],

  // Deployment configuration (sunucu için)
  deploy: {
    production: {
      user: 'ubuntu',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/whatsapp-morning-bot.git',
      path: '/home/ubuntu/whatsapp-morning-bot',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};