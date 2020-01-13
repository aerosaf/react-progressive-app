module.exports = {
  apps: [{
    name: "gemx-webapp",
    script: "./public/bundle.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }, {
    name: 'worker',
    script: 'worker.js'
  }]
}
