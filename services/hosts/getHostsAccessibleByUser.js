const redisClient = require('../../redisClient').duplicate();

function getHostsAccessibleByUser(username, done) {
  redisClient.lrange(`owner_${username}`, 0, -1, done);
}

module.exports = getHostsAccessibleByUser;
