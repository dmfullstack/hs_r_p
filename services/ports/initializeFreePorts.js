const async = require('async');
const redisClient = require('../../redisClient');

function initializeFreePorts(number, done) {
  async.series([
    clearHosts,
    initialize.bind(null, number)
  ], done);
}

function clearHosts( done) {
  redisClient.del('freePortsBucket', done);
}

function initialize(number, done) {
  const initialFreePorts = new Array(number).fill().map((item, index) => 22000+index);
  redisClient.rpush('freePortsBucket', initialFreePorts, done);
}

module.exports = initializeFreePorts;
