const Server = require('./server');
const server = new Server();

server.qPush('a');
server.qPush('b');
server.qPush('1');

// 1 minute request summary
setInterval(requestReport, 60*1000, server);

function requestReport(s) {
    console.log(`Estimated requests/minute: ${s.rpm}`);
    s.reqClear()
}


