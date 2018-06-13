const controller = require('./gitlab.controller');

module.exports = function({clientID, clientSecret, redirectURL, baseURL}) {
  const Router = require('express').Router();

  Router.get('/complete', controller.complete.bind(null, {clientID, clientSecret, baseURL, redirectURL}));

  return Router
};
