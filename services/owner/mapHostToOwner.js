const redisClient = require('../../redisClient').duplicate();

function mapHostToOwner({host, owner}, done) {
  redisClient.lpush(`owner_${owner}`, host, (err) => {
    done(err, arguments[0]);
  });
}

module.exports = mapHostToOwner;
