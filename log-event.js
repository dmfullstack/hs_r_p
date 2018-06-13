const async = require('async');
const getAmqpConnection = require('./getAmqpConnection');

function logEvent(event, message, done) {
  async.waterfall([
    getAmqpConnection.bind(null, 'localAmqpURL'),
    getAmqpChannel,
    (channel, callback) => {
      const exchange = 'pp_logs';
      channel.assertExchange(exchange, 'direct', {durable: true}, null, callback);
      channel.publish(exchange, event, new Buffer(JSON.stringify(message)), {persistent: true});
      callback();
    }
  ], (err) => {
    if(done) { done(err, arguments[0]); return;}
  });
}

let channel = null;
function getAmqpChannel(connection, callback) {
  if(channel) { callback(null, channel); return; }
  connection.createChannel((err, newChannel) => {
    if(err) { callback(err); return; }
    channel = newChannel;
    callback(null, channel);
  });
};

module.exports = logEvent;
