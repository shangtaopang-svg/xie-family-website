module.exports = {
  apps: [{
    name: 'xie-family',
    script: 'server.js',
    cwd: __dirname,
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'production',
      WEBHOOK_SECRET: 'xie-family-deploy-2026',
    }
  }]
};
