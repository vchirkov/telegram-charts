const {Server} = require('node-static');
const http = require('http');

const dist = new Server('./dist');

http.createServer((req, res) => {
    req.addListener('end', () => dist.serve(req, res)).resume();
}).listen(process.env.PORT || 8080);
