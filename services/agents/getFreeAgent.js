const redisClient = require('../../redisClient').duplicate();

function getFreeAgent(done) {
  redisClient.hgetall('agents', (err, reply) => {
    if(err) { done(err); return; }
    const capacity = reply;
    const servers = Object.keys(capacity);
    redisClient.mget(servers.map(server => `used_${server}`), (err, reply) => {
      if(err) { done(err); return; }

      const availableServers = servers.filter((server, i) => {
        return capacity[server] > reply[i];
      });

      done(null, availableServers[0]);
    });
  });
}

module.exports = getFreeAgent;
