const async = require('async');
const handleError = require('./handleError');
const config = require('./config');
const {port, fqdn} = config;
const portOverride = config.portOverride || port;
const initializeDataIfNotAlreadyInitialized = require('./services/initializeDataIfNotAlreadyInitialized');
const popFreeHostAndPort = require('./services/popFreeHostAndPort');
const cleanDataDir = require('./services/cleanDataDir');
const mapHostToPort = require('./services/ports/mapHostToPort');
const mapPortToHost = require('./services/hosts/mapPortToHost');
const mapHostToOwner = require('./services/owner/mapHostToOwner');
const mapOwnerToHost = require('./services/hosts/mapOwnerToHost');
const submitForServerCreation = require('./services/server/submitForServerCreation');
const registerWorker = require('./registerWorker');
const createServerWorker = require('./workers/createServerWorker');
const getPortForHost = require('./services/hosts/getPortForHost');
const authorizeRoute = require('./authorizeRoute');
const verifyAccess = require('./verifyAccess');
const addAgent = require('./services/agents/addAgent');
const getFreeAgent = require('./services/agents/getFreeAgent');
const redisClient = require('./redisClient').duplicate();

const startNewSessionIfNoneExists = require('./services/session/startNewSessionIfNoneExists');
const endSession = require('./services/session/endSession');
const superagent = require('superagent');

const httpProxy = require('http-proxy');
const http = require('http');

const proxy = new httpProxy.createProxyServer();

const app = require('express')();

const logEvent = require('./log-event');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

server = http.Server(app);

if(config.type === 'agent') {
  app.post('/agent-api/v1/server', require('body-parser').json(), authorizeRoute(['server:all', 'server:create']), (req, res) => {
    const owner = req.body.owner || req.body.owners || req.decoded.sub;

    async.waterfall([
      popFreeHostAndPort.bind(null, {fqdn, owner}),
      cleanDataDir,
      mapHostToPort,
      mapPortToHost,
      mapHostToOwner,
      mapOwnerToHost,
      submitForServerCreation
    ], (err, result) => {
      if(err) { handleError(err, res); return; }
      const {host, fqdn} = result;
      res.status(202).json({serverURL: `http://${host}.${fqdn}:${portOverride}/`});
    });
  });

  app.get('/agent-api/v1/health', (req, res) => {
    res.json({url: `${config.https ? 'https' : 'http'}://${fqdn}:${portOverride}`});
  });

  app.use('/auth/gitlab-wd', require('./api/auth/gitlab.router')({
    clientID: config['gitlab-wd'].CLIENT_ID,
    clientSecret: config['gitlab-wd'].CLIENT_SECRET,
    baseURL: config['gitlab-wd'].BASE_URL
  }));

  app.all('/*', authorizeRoute(['server:all', 'server:access']), verifyAccess, (req, res) => {
    const host = getSubdomain(req.headers.host);

    getPortForHost(host, (err, port) => {
      if(err) { handleError(err); return; }
      if(!port) { res.status(404); return; }

      const protocol = req.get('X-Forwarded-Protocol') ? req.get('X-Forwarded-Protocol') : req.protocol;
      const message = {ts: (new Date).getTime(), url: `${protocol}://${req.headers.host}${req.originalUrl}`, method: req.method, event: 'http:connect'};
      logEvent('http:connect', message);
      proxy.web(req, res, {target: {host: 'localhost', port}});
    });
  });

  server.on('upgrade', (req, socket, head) => {
    const host = getSubdomain(req.headers.host);

    startNewSessionIfNoneExists();

    socket.on('close', () => {
      endSession();
    });

    const events = 'close connect data drain end error lookup timeout'.split(' ');
    events.forEach((event) => {
      socket.on(event, () => {
        const message = {ts: (new Date).getTime(), event: `ws:${event}`}
        logEvent(`ws:${event}`, message);
      });
    });

    getPortForHost(host, (err, port) => {
      if(err) { handleError(err); return; }
      if(!port) { socket.end(); return; }
      proxy.ws(req, socket, head, {target: {host: 'localhost', port}});
    });
  });
} else if(config.type === 'controller') {
  app.post('/controller-api/v1/agents', require('body-parser').json(), authorizeRoute(['agent:all', 'agent:add']), (req, res) => {
    const agentUrl = req.body.agentUrl;
    const capacity = req.body.capacity;

    console.log('agentUrl:', agentUrl);
    console.log('capacity:', capacity);

    if(!agentUrl || !capacity) {
      res.status(400).json({msg: 'agentUrl and capacity are required to process this request'});
    }

    addAgent(agentUrl, capacity, (err) => {
      if(err) { handleError(err, res); return; }
      res.status(200).json({msg: 'Added'});
    });
  });

  app.post('/controller-api/v1/server', require('body-parser').json(), authorizeRoute(['server:all', 'server:create']), (req, res) => {
    const owner = req.body.owner || req.body.owners || req.decoded.sub;
    getFreeAgent((err, agentUrl) => {
      if(err) { handleError(err, res); return; }
      superagent
        .post(`${agentUrl}/agent-api/v1/server`)
        .set('Authorization', `Bearer ${req.token}`)
        .send({
          owner: req.body.owner
        }).end((err, response) => {
          if(err) { handleError(err, res); return; }

          redisClient.rpush(`owner_${owner}`, response.body.serverURL, (err, reply) => {
            if(err) { handleError(err, res); return; }
            redisClient.incr(`used_${agentUrl}`);
            res.status(200).json({serverURL: response.body.serverURL});
          });
        });
    });
  });
}

app.get('/echo/:msg', (req, res) => { res.send(req.params.msg); });

app.get('/notFound', (req, res) => {
  res.status(404).send(`<p>The resource you were looking for was not found.</p>
    <p>To login as another user:</p>
    <ol>
      <li><a href="${config['gitlab-wd'].BASE_URL}" target="_blank">Click here</a> to open gitlab, and sign out.</li>
      <li><a href="/logout">Click here</a> to login as another user.</li>
    </ol>`);
});

app.get('/logout', (req, res) => {
  res.clearCookie('jwt').redirect('/');
});

app.get('/', function(req, res, next) {
  const uname = req.query.uname;
  if(!uname) { next(); return; }
  res.redirect('http://che0.server0.lab.stackroute.in');
}, authorizeRoute(['server:all', 'server:access']));

// Initialize Unused Ports
const initializeEmitter = initializeDataIfNotAlreadyInitialized();

initializeEmitter.on('done', () => {
  registerWorker('createServerQueue', createServerWorker);

  server.listen(port);
}); 

function getSubdomain(hostString) {
  return hostString.replace(`.${fqdn}`,'').split(':')[0];
}
