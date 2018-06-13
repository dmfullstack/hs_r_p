const redisClient = require('../../redisClient');

function getUsedPorts(done) {
  redisClient.hkeys('usedPortMap', done);
}

module.exports = getUsedPorts;
