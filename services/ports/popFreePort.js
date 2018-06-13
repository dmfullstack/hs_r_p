const redisClient = require('../../redisClient').duplicate();

function popFreePort(done) {
  redisClient.lpop('freePortsBucket', done);
}

module.exports = popFreePort;
