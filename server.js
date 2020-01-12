'use strict';
 
// load the Node.js TCP library
const net = require('net');
const PORT = 3010;
//const HOST = '45.55.50.25';
const HOST = '0.0.0.0';
 
class Server {

    constructor(port, address) {
        this.port = port || PORT;
        this.address = address || HOST;
        
        this.init();
    }
    
    init() {
        this._queue = Array();
        let server = this;
       
        let onClientConnected = (sock) => {
            
            let clientName = `${sock.remoteAddress}:${sock.remotePort}`;
            console.log(`new client connected: ${clientName}`);

            sock.on('data', (data) => {
                console.log(`${clientName} Says: ${data}`);
                let cmd = data.toString().trim().split(" ")[0];
                if(cmd === 'give'){
                    sock.write(this.qShift())
                }
            });
       
            sock.on('close', () => {
                console.log(`connection from ${clientName} closed`);
            });
       
            sock.on('error', (err) => {
                console.log(`Connection ${clientName} error: ${err.message}`);
            });
        }
       
        server.connection = net.createServer(onClientConnected);
       
        server.connection.listen(PORT, HOST, function() {
            console.log(`Server started at: ${HOST}:${PORT}`);
        });

        return onClientConnected.sock

    }

    get queue() {
        return this._queue;
    }

    qPush(item) {
        this._queue.push(item);
    }

    qShift() {
        if (this._queue.length > 0) {
            return String(this._queue.shift());
        } else {
            return String(-1);
        }
    }
}
module.exports = Server;
