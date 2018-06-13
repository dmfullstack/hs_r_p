const redisClient = require('../../redisClient').duplicate();

function getPortForHost(host, done) {
  redisClient.get(`host_${host}`, (err, port) => {
    done(err, port);
  });
}

module.exports = getPortForHost;
