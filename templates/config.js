module.exports = {
  env: process.env.NODE_ENV || 'development',
  type: "{{node_type}}",
  port: process.env.PORT || 80,
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: process.env.REDIS_PORT || 6379,
  amqpURL: process.env.AMQP_URL || 'amqp://localhost',
  localAmqpURL: process.env.LOCAL_AMQP_URL || 'amqp://localhost',
  fqdn: process.env.FQDN || '{{ansible_nodename}}',
  jwtSecret: '{{jwt_secret}}',
  "gitlab-wd": {
    CLIENT_ID: process.env.GITLAB_WD_CLIENT_ID || '08e4a5bd87825f7f4ce801b721e9df4564c12aaa679194ca7b063b40b697f4c2',
    CLIENT_SECRET: process.env.GITLAB_WD_SECRET || '2fab377431a1f57a26b0ca71b52f3cc1248b15a78138adca8a102457f61ef125',
    BASE_URL: 'https://gitlab-dev.stackroute.in'
  }
}
