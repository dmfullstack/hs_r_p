const request = require('superagent');
require('superagent-auth-bearer')(request);

function retrieveUserProfile({baseURL}, {access_token, refresh_token}, done) {
  request
    .get(`${baseURL}/api/v3/user`)
    .set('Authorization', `Bearer ${access_token}`)
    .end((err, res) => {
      if(err) { done(err); return; }
      done(null, {access_token, refresh_token}, res.body);
    });
}

module.exports = retrieveUserProfile;
