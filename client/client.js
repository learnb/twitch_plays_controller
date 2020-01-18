'use strict';

const net = require('net');
const PORT = 3010;
const HOST = 'dev.bryanlearn.com';

class Client {
    constructor(port, address) {
        this.socket = new net.Socket();
        this.address = address || HOST;
        this.port = port || PORT;
        this.init();
    }

    init() {
        var client = this;
        client.socket.connect(client.port, client.address, () => {
            console.log(`Client connected to: ${client.address} :  ${client.port}`);
        });

        client.socket.on('close', () => {
            console.log('Client closed');
        });
    }

   sendMessage(message) {
       var client = this;
       return new Promise((resolve, reject) => {

           client.socket.write(message);

           client.socket.on('data', (data) => {
               //console.log(data.toString());
               resolve(data);
           });

           client.socket.on('error', (err) => {
               reject(err);
           });
       });
   }

   disconnect() {
       var client = this;
       return new Promise((resolve, reject) => {
           client.socket.destroy();
           resolve("exit");
           client.socket.on('error', (err) => {
               reject(err);
           });
       });
   }
}
module.exports = Client;
