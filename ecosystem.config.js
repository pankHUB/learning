export const apps = [
  {
    name: 'nextjs-app',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '/home/deployer/app',
    interpreter: '/home/deployer/.nvm/versions/node/v20.x.x/bin/node',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  },
];