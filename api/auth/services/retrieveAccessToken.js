const request = require('superagent');

function retrieveAccessToken({clientID, baseURL, clientSecret, redirectURL}, code, done) {
  const query = {
    client_id: clientID,
    client_secret: clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectURL
  };
  request.post(`${baseURL}/oauth/token`)
    .query(query)
    .set('Accept', 'application/json')
    .end((err, res) => {
      if(err) { done(err); return; }
      done(null, res.body);
    });
}

module.exports = retrieveAccessToken;
