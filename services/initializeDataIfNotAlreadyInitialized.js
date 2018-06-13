const async = require('async');
const getAllFreePorts = require('./ports/getAllFreePorts');
const getAllUsedPorts = require('./ports/getAllUsedPorts');
const initializeFreePorts = require('./ports/initializeFreePorts');
const initializeFreeHosts = require('./hosts/initializeFreeHosts');
const redisClient = require('../redisClient').duplicate();

const EventEmitter = require('events');

function checkIfAlreadyInitialized(done) {
  redisClient.get('initialized', done);
}

function initializeData(done) {
  async.parallel([
    initializeFreePorts.bind(null, 1000),
    initializeFreeHosts.bind(null, 1000)
  ], (err) => {
    if(err) { done(err); return; }
    redisClient.set('initialized', true, done);
  });
}

function initializeDataIfNotAlreadyInitialized() {
  // Initialize if initialized so not true
  const eventEmitter = new EventEmitter();
  checkIfAlreadyInitialized((err, alreadyInitialized) => {
    if(err) { eventEmitter.emit('error', err); return; }
    eventEmitter.emit('initialized', alreadyInitialized);
    if(alreadyInitialized) { eventEmitter.emit('done'); return; }

    initializeData((err) => {
      if(err) { eventEmitter.emit('error', err); return; }
      eventEmitter.emit('done');
    });
  });
  return eventEmitter;
}

module.exports = initializeDataIfNotAlreadyInitialized;
