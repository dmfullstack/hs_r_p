const redisClient = require('../../redisClient').duplicate();

function popFreeHost(done) {
  redisClient.lpop('freeHostsBucket', done);
}

module.exports = popFreeHost;
