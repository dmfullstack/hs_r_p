const redisClient = require('../../redisClient').duplicate();
const superagent = require('superagent');

function addAgent(agentUrl, capacity, done) {
  superagent
    .get(`${agentUrl}/agent-api/v1/health`)
    .end((err, res) => {
      if(err) { done(err); return; }
      console.log('res.body:', res.body);
      redisClient.hset('agents', res.body.url, capacity, done);
    });
}

module.exports = addAgent;
