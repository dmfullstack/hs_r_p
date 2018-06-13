const redisClient = require('../../redisClient').duplicate();

function mapOwnerToHost({owner, host}, done) {
  redisClient.lpush(`hostAccess_${host}`, owner, (err) => {
    done(err, arguments[0]);
  });
}

module.exports = mapOwnerToHost;
