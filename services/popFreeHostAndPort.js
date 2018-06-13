const async = require('async');
const _ = require('lodash');
const popFreePort = require('./ports/popFreePort');
const popFreeHost = require('./hosts/popFreeHost');

function popFreeHostAndPort(input, done) {
  async.parallel([
    popFreePort,
    popFreeHost
  ], (err, [port, host]) => {
    if(err) { done(null); return; }
    done(err, _.merge(input, {host, port}));
  });
}

module.exports = popFreeHostAndPort;
