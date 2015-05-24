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
  ext.queue_packet=function(packet,callback){callback();};
  ext.flush_packets=function(){};
  ext.read_inbound=function(callback){callback();};

  var descriptor = {
    blocks: [
      // Block type, block name, function name
      ['w', 'Queue packet %m.packets', 'queue_packet'],
      [' ', 'Send queued packets', 'flush_outbound'],
      ['w', 'Process inbound queue', 'read_inbound'],
    ],
    menus: {
      packets: ['null', 'menu test']
    },
    url: 'http://znapi.github.io/scratchx/demo/about.html'
  };

  ScratchExtensions.register('Demo extension', descriptor, ext);
// <<


/*********************\
* Program begins here *
\*********************/


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

var connected = false;
var finishInitialization;
// Initialization: Step 1
// Get socket.io
includeFile(resourcesURL + "socket.io.min.js", // Callback

// Initialization: Step 2
function(gotSocketIO) {
  if(!gotSocketIO) {
    ext._getStatus=function(){return{status:0, msg:'Could not retrieve socket.io'}};
    // This extension does no more work from here on because the socket.io coudl not be retrieved
  }
  else {
    // Get rest of extension initialization now that socket.io has been retrieved function definitions
    includeFile(resourcesURL + "init.js", // Callback

// Initialization: Step 3
function(gotRest) {
  if(!gotRest) {
    ext._getStatus=function(){return{status:0, msg:'Could not retrieve initialization file'}};
    // The extension does no more work from here on because the initialization file could not be retrieved
  }
  else {
    // Finish initialization with the file just loaded
    finishInitialization(ext);
    ext._getStatus();
  }
});
  }
});

// <<
})({});
