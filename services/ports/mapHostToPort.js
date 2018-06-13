const redisClient = require('../../redisClient').duplicate();

function mapPortToHost({host, port}, done) {
  redisClient.set(`port_${port}`, host, (err) => {
    done(err, arguments[0]);
  });
}

module.exports = mapPortToHost;
