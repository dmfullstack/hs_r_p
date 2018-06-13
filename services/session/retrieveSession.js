const redisClient = require('../../redisClient').duplicate();

function retrieveSession(done) {
  redisClient.get('currentSession', done);
}

module.exports = retrieveSession;
