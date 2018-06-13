module.exports = {
  env: process.env.NODE_ENV || 'development',
  type: 'controller',
  port: process.env.PORT || 3000,
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: process.env.REDIS_PORT || 6379,
  amqpURL: process.env.AMQP_URL || 'amqp://localhost',
  localAmqpURL: process.env.LOCAL_AMQP_URL || 'amqp://localhost',
  fqdn: process.env.FQDN || 'localhost',
  jwtSecret: 'gcegauhtgcu8878',
  https: false,
  "gitlab-wd": {
    CLIENT_ID: process.env.GITLAB_WD_CLIENT_ID || '4355a235af3769aba65a3c311fad7d5b7e64f00cd017b098108f977a849cff24',
    CLIENT_SECRET: process.env.GITLAB_WD_SECRET || '07f3d292007b6c8539a85a079590dce28b9261b666b6a2abc9af684f3cfc85d1',
    BASE_URL: 'https://gitlab-dev.stackroute.in'
  },
  controllerUrl: 'http://localhost:3000'
}
