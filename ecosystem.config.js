module.exports = {
  apps: [{
    name: 'shared-bicycle',
    script: 'bin/www',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy: {
    production: {
      user: 'root',
      host: '',
      ref: 'origin/master',
      repo: 'git@github.com:donaldding/koa_bicycle.git',
      path: '/var/www/shared-bicycle/production',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
}
