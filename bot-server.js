// Twitch bot libs
const tmi = require('tmi.js');
const opts = require('./conf.js');

// Controller input server libs
const Server = require('./server');
const controller_input_server = new Server();


/* Twitch Bot */
console.log(opts)

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  const fullCmd = msg.trim().split(" "); // get first and second 'word' (!cmd opt)
  const command = fullCmd[0];
  const opt = fullCmd[1];

  // If the command is known, let's execute it
  if (command === '!i' || command === '!input') {
    sendInput(opt);
    client.say(target, `${context.username} entered: ${opt}`);
    //console.log(`* Executed ${command} ${opt}`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

// Function called when input command is issued
function sendInput(opt) {
    controller_input_server.qPush(opt);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

/* Controller input server */

// 1 minute request summary
setInterval(requestReport, 60*1000, controller_input_server);

function requestReport(_server) {
    console.log(`Estimated requests/minute: ${_server.rpm}`);
    _server.reqClear()
}
