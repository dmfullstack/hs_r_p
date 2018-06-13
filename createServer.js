const owner = process.argv[2];
const {controllerUrl} = require('./config');
const superagent = require('superagent');
const token = require('./generateToken')('sagar.patke', 'server:create');

superagent
  .post(`${controllerUrl}/controller-api/v1/server`)
  .send({owner: owner})
  .set('Authorization', `Bearer ${token}`)
  .end((err, res) => {
    if(err) { console.error('FAILED:', err); return; }
    console.log('SUCCESS:', res.body);
  });
