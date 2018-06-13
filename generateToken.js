const jsonwebtoken = require('jsonwebtoken');
const {jwtSecret} = require('./config');

function generateToken(_subject, _claims) {
  let [cmd, file, subject, claims] = process.argv;

  subject = _subject || subject;
  claims = _claims || claims;

  claims = claims || 'server:all agent:all';

  return jsonwebtoken.sign({scopes: claims.split(/\s+/)}, jwtSecret, {subject});

}

console.log(generateToken());

module.exports = generateToken;
