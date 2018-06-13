const redisClient = require('../../redisClient').duplicate();
const retrieveSession = require('./retrieveSession');

function endSession() {
  retrieveSession((err, currentSession) => {
    if(currentSession) {
      const session = JSON.parse(currentSession);
      session.endTime = new Date();
      redisClient.lpush('sessions', JSON.stringify(session));
      redisClient.del('currentSession');
    }
  });
}

module.exports = endSession;
