const jsonwebtoken = require('jsonwebtoken');
const {jwtSecret} = require('./config');
const handleError = require('./handleError');
const config = require('./config');

function authorizeRoute(claims) {
  function extractJWTToken(req) {
    if(req.get('Authorization')) {
      return req.get('Authorization').replace('Bearer ', '');
    } else {
      return req.cookies.jwt;
    }
  }
  
  function middleware(req, res, next) {
    const token = extractJWTToken(req);
    const baseURL = config['gitlab-wd'].BASE_URL
    const clientId = config['gitlab-wd'].CLIENT_ID;
    const responseType = 'code';
    const redirectURL = `http://${req.headers.host}/auth/gitlab-wd/complete`;
    // const redirectURL = 'https://google.com/';
    const url = `${baseURL}/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectURL)}&response_type=code`;

    if(!token) { res.redirect(url); return; }

    // if(!token) { res.status(404).send(); return; }

    // Veriy Token and reject if not verified.
    jsonwebtoken.verify(token, jwtSecret, (err, decoded) => {
      if(err) { res.redirect('/notFound'); return; }
      req.decoded = decoded;
      req.token = token;
      const {scopes} = decoded;
      const allowed = claims.find((item) => {
        return scopes.indexOf(item) >= 0;
      });

      return allowed ? next() : res.status(404).send('Resource Not Found');
    });
  }

  return middleware;
}

module.exports = authorizeRoute;
