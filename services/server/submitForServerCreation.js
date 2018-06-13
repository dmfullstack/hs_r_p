const async = require('async');
const getAmqpConnection = require('../../getAmqpConnection');

function submitForServerCreation({host, port, dataDir, fqdn}, done) {
  async.waterfall([
    getAmqpConnection,
    getAmqpChannel,
    (channel, callback) => {
      channel.assertQueue('createServerQueue', {durable: true});
      channel.sendToQueue('createServerQueue', new Buffer(JSON.stringify({host, port, dataDir: `/data/${port}`, fqdn})), {persistent: true});
      callback(null);
    }
  ], (err) => {
    done(err, arguments[0]);
  })
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

module.exports = submitForServerCreation;
