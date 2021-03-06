require('events').EventEmitter.defaultMaxListeners = 0
const ViGEmClient = require('vigemclient');

const Client = require('./client');
const client = new Client();

const REQUEST_TIMEOUT = 100;
const CONSUME_TIMEOUT = 100;

const MAX_QUEUE_SIZE = 100;

/* Setup virtual controller */
let gamepad_client = new ViGEmClient();
gamepad_client.connect(); // connect to ViGEmBus driver

let controller = gamepad_client.createX360Controller(); // create virtual xbox 360 controller
controller.connect(); // plug in virtual controller

var busy = false;
var queue = Array();

// start requesting input
setTimeout(requestInput, REQUEST_TIMEOUT);

// start consuming input
setTimeout(consumeInput, CONSUME_TIMEOUT);

// requests new input from server then adds it to queue
function requestInput(){
    // start next request
    setTimeout(requestInput, REQUEST_TIMEOUT);

    // only send request if not busy, otherwise do nothing
    if (!busy) {
        busy = true;
        client.sendMessage('give').then(giveSuccess, giveFail);
    }
}

// reads next input from queue
function consumeInput() {
    //console.log(`queue length: ${queue.length}`);
    
    setTimeout(consumeInput, CONSUME_TIMEOUT);
   
    // consume next item if queue is not empty 
    if (queue.length > 0) { // next input ready
        takeAction(String(queue.shift()));
    } else {                // no inputs ready
        //console.log("no inputs");
    }
}

// called when 'give' request successfully returns a value
function giveSuccess(data) {
    if (data != "-1") { // server sent valid new input
        // push item to queue
        if (queue.length < MAX_QUEUE_SIZE) {
            queue.push(data);
        } else { // drop if queue is full
            console.log(`QUEUE FULL! dropped ${data}`);
        }
    }
    busy = false;
}

// called when 'give' request fails to return a value
function giveFail(err) {
    console.error(err);
    busy = false;
}

// called when input is read
function takeAction(input) {
    console.log(input);
    //robot.typeString(input);

    // buttons
    if (input == "a"){
        controller.button.A.setValue(true);
        setTimeout((bool) => {controller.button.A.setValue(bool)}, 500, false);
    }
    if (input == "b"){
        controller.button.B.setValue(true);
        setTimeout((bool) => {controller.button.B.setValue(bool)}, 500, false);
    }
    
    // dpad
    if (input == "up"){
        controller.axis.dpadVert.setValue(1);
        setTimeout((val) => {controller.axis.dpadVert.setValue(val)}, 500, 0);
    }
    if (input == "down"){
        controller.axis.dpadVert.setValue(-1);
        setTimeout((val) => {controller.axis.dpadVert.setValue(val)}, 500, 0);
    }
    if (input == "left"){
        controller.axis.dpadHorz.setValue(-1);
        setTimeout((val) => {controller.axis.dpadHorz.setValue(val)}, 500, 0);
    }
    if (input == "right"){
        controller.axis.dpadHorz.setValue(1);
        setTimeout((val) => {controller.axis.dpadHorz.setValue(val)}, 500, 0);
    }
}

process.on('warning', e => {} );
