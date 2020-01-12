const Client = require('./client');
const client = new Client();

var busy = false;

// first request for next input
setTimeout(nextInput, 100);

function nextInput(){
    // start next request
    setTimeout(nextInput, 100);

    // only send request if not busy, otherwise do nothing
    if (!busy) {
        busy = true;
        client.sendMessage('give')
        .then((data)=> {
            busy = false;
            console.log(`Received: ${data}`);
            return data
        })
        .catch((err) => { console.error(err); })
    }
}
