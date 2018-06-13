const redisClient = require('../../redisClient').duplicate();

function createNewSession(done) {
  redisClient.set('currentSession', JSON.stringify({startTime: new Date()}), done);
}

module.exports = createNewSession;
