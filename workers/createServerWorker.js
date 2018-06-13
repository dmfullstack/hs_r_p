const {spawn} = require('child_process');

const {fqdn, env} = require('../config');

function createServerWorker({host, port, dataDir}, done) {
  const cmd = 'docker';
  const hostString = env!=='development' && host ? `-e CHE_HOST=${host}.${fqdn}` : '';
  const args = `run -t ${hostString} -e CHE_PORT=${port} --rm -v /var/run/docker.sock:/var/run/docker.sock -v /data/${port}:/data eclipse/che start`;

  console.log('args:', args);

  const dockerRun = spawn(cmd, args.replace(/\s+/g, ' ').split(' '));

  dockerRun.stdout.on('data', (data) => {
    console.log('STDOUT:', data.toString());
  });

  dockerRun.stderr.on('data', (data) => {
    console.log('STDERR:', data.toString());
  })

  dockerRun.on('close', (code) => {
    if(code !== 0) { done(new Error('Docker Run exited with code:', code)); return; }
    done(null);
  });
}

module.exports = createServerWorker;
