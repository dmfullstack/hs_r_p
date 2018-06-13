const JWT = require('jsonwebtoken');
const config = require('../../../config');

function createJWT({access_token, refresh_token}, userProfile, done) {
  JWT.sign({
    scopes: ['server:access'],
    accessToken: access_token
  }, config.jwtSecret, {
    subject: userProfile.username,
    issuer: 'gitlab-wd',
    expiresIn: '12h'
  }, (err, token) => {
    if(err) { done(err); return; }
    done(null, token);
  });
}

module.exports = createJWT;
