const {spawn} = require('child_process');

function cleanDataDir({port}, done) {
  const cleanCommand = spawn('rm', `-rf /data/${port}`.split(' '));
  cleanCommand.on('close', (code) => {
    if(code !== 0) { done(new Error(`Cannot Delete: /data/${port}: ${code}`)); return; }
    done(null, arguments[0]);
  });
}

module.exports = cleanDataDir;
