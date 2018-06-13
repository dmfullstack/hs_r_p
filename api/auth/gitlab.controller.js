const async = require('async');
const retrieveAccessToken = require('./services/retrieveAccessToken');
const retrieveUserProfile = require('./services/retrieveUserProfile');
const createJWT = require('./services/createJWT');

function complete({clientID, clientSecret, baseURL}, req, res, callback) {
  const code = req.query.code;
  const redirectURL = `http://${req.headers.host}/auth/gitlab-wd/complete`;
  async.waterfall([
    retrieveAccessToken.bind(null, {clientID, clientSecret, baseURL, redirectURL}, code),
    retrieveUserProfile.bind(null, {baseURL}),
    createJWT
  ], (err, result) => {
    if(err) { callback(err); return; }
    res.cookie('jwt', result).redirect(`http://${req.headers.host}/`);
  });
}

module.exports = {
  complete
}
