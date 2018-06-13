const handleError = require('./handleError');
const getHostsAccessibleByUser = require('./services/hosts/getHostsAccessibleByUser');

const {fqdn} = require('./config');

function verifyAccess({decoded, headers}, res, next) {
  const {sub} = decoded;

  // Extract server subdomain.
  const subdomain = getSubdomain(headers.host);

  // TODO: Retrieve servers list accessible by user
  getHostsAccessibleByUser(sub, (err, accessibleHosts) => {
    if(err) { return handleError(err, res); }
    const accessible = accessibleHosts.indexOf(subdomain) >= 0;
    if(!accessible) { res.redirect('/notFound'); return; }
    next();
  });
}

function getSubdomain(hostString) {
  return hostString.replace(`.${fqdn}`,'').split(':')[0];
}

module.exports = verifyAccess;
