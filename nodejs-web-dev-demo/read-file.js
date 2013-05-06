var fs = require('fs');

fs.readFile('net.js', 'utf-8',function(err, data) {
    if (err) throw err;
    console.log('asyn: ',data);
});

console.log('Sync: ',fs.readFileSync('net.js', 'utf-8'));