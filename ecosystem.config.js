module.exports = {
  apps: [
    {
      name: 'avfs',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/avfs',
      env: {
        NODE_ENV: 'production',
        PORT: 3098,
      },
    },
  ],
}
