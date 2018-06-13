const retrieveSession = require('./retrieveSession');
const createNewSession = require('./createNewSession');

function startNewSessionIfNoneExists() {
  retrieveSession((err, session) => {
    if(err) { console.error('ERR:', err); return; }
    if(!session) { createNewSession(); }
  });
}

module.exports = startNewSessionIfNoneExists;
