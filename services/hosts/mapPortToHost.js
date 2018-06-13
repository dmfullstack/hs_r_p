const redisClient = require('../../redisClient').duplicate();

function mapHostToPort({host, port}, done) {
  redisClient.set(`host_${host}`, port, (err) => {
    done(err, arguments[0]);
  });
}

module.exports = mapHostToPort;
