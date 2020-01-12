const Server = require('./server');
const server = new Server();

server.qPush('a');
server.qPush('b');
server.qPush('1');
