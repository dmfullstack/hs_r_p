const async = require('async');
const redisClient = require('../../redisClient');

function initializeFreeHosts(number, done) {
  async.series([
    clearHosts,
    initialize.bind(null, number)
  ], done);
}

function clearHosts( done) {
  redisClient.del('freeHostsBucket', done);
}

function initialize(number, done) {
  const initialFreeHosts = new Array(number).fill().map((item, index) => `che${index}`);
  redisClient.rpush('freeHostsBucket', initialFreeHosts, done);
}

module.exports = initializeFreeHosts;
