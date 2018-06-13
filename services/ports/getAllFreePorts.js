const redisClient = require('../../redisClient').duplicate();

function getFreePorts(done) {
  redisClient.lrange('freePortsBucket', 0, -1, done);
}

module.exports = getFreePorts;
