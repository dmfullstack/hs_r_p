const getFreeAgent = require('./getFreeAgent');

getFreeAgent((err, agentUrl) => {
  if(err) { console.log('ERR:', err); return; }
  console.log('agentUrl:', agentUrl);
});
