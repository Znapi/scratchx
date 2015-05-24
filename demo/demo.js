(function(ext) {

  /************************************\
  * Scratch Extension boilerplate code *
  \************************************/

  /*
  This is the boilerplate code required for an extension that is minimally
  pre-filled in. It  is filled in progammatically after the extension loads by
  code that runs on load.
  Only neccessary parts are filled in for end user experience. The status is
  explicitly set to 'unready' because the extension still has to initialize
  after it is loaded.
  */


  ext._shutdown=function(){};
  ext._getStatus=function(){return{status: 1, msg: 'Initializing'}};
  ext.queue_packet=function(callback){callback();};
  ext.flush_packets=function(){};

  var descriptor = {
    blocks: [
      // Block type, block name, function name
      [' ', 'queue packet %m.packets', 'queue_packet'],
      ['w', 'send queued packets', 'flush_packets']
    ],
    menus: {
      packets: ['null', 'menu test']
    },
    url: 'http://znapi.github.io/scratchx/demo/about.html'
  };

  ScratchExtensions.register('Demo extension', descriptor, ext);

// <<

  /******************************\
  * Program begins here on load  *
  \******************************/


/**
Credit to here: http://stackoverflow.com/a/20518446/3390450,
Small change to be asynchronomous.
It includes a .js file by url, and to prevent warnings, it is done
asynchronoumously and calls a callback function when it's done, and whose only
parameter should be a boolean that says if the file could be loaded or not.
*/
function includeFile(url, callback) {
  var ajax = new XMLHttpRequest();
  ajax.open('GET', url, true); // <-- a 'false' makes it synchronous
  ajax.onreadystatechange = function() {
    var script = ajax.response || ajax.responseText;
    if(ajax.readyState === 4) {
      switch(ajax.status) {
        case 200:
        eval.apply(window, [script]);
        console.log("script loaded: ", url);
        callback(true);
        break;

        default:
        console.log("ERROR: script not loaded: ", url);
        callback(false);
      }
    }
  };
  ajax.send(null);
}
var resourcesURL = "http://znapi.github.io/scratchx/demo/";

// Initialization: Step 1
function getSocketIO() {
  includeFile(resourcesURL + "socket.io.min.js", getBlocks);
}

// Initialization: Step 2
function getBlocks(gotSocketIO) {
  if(!gotSocketIO) {
    ext._getStatus=function(){return{status:0, msg:'Could not retrieve socket.io'}};
    // This extension does no more work from here on because the socket.io was not loaded
  }
  else {
    // Continue to next step of initialization: set block functions
    //includeFile(resourcesURL + "blocks.js", )
    // Continue to last step of initialization: set up connection to helper app
// <<

var connected = false;
ext._getStatus = function() {
  if(connected){return{status: 2, msg: 'Ready'};}
  else{return{status: 1, msg: 'Not connected to helper app'};}
};

// Connect to helper app
var socket = io("http://localhost:25565");
ext._shutdown = function() {
  //TODO tell helper app to shut off server
}

socket.on('connect', function() {
  connected = true;
  console.log("Connected!");
});
socket.on('error', function() {
  connected = false;
  console.log("Connection error!");
});
socket.on('disconnect', function() {
  connected = false;
  console.log("Disconnected!");
});

// <<
  }
}
getSocketIO();
// <<
})({});
