module.exports = {
  apps: [{
    name: 'xie-family',
    script: 'server.js',
    cwd: __dirname,
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '800M',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      WEBHOOK_SECRET: 'xie-family-deploy-2026',
    }
  }]
};
