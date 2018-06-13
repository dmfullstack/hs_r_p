const superagent = require('superagent');

const [cmd, file, agentUrl, capacity] = process.argv;

const {controllerUrl} = require('./config');

const token = require('./generateToken')('sagar.patke', 'agent:add');

console.log('token:', token);

superagent
  .post(`${controllerUrl}/controller-api/v1/agents`)
  .send({
    agentUrl,
    capacity
  })
  .set('Authorization', `Bearer ${token}`)
  .end((err, res) => {
    if(err) { console.log('FAILED:', err); return; }
    console.log('SUCCESS:', res.body);
  });
