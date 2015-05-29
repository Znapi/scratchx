(function(ext) {
var resourcesURL = "http://znapi.github.io/scratchx/demo/"; // Where other neccessary js files can be found

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

ext.open_gui=function(){alert("Extension is still initializing\nGUI not loaded")};
ext.create_variable=function(){};
ext.delete_variable=function(){};
ext.queue_packet=function(){};
ext.flush_outbound=function(){};
ext.send_packet=function(){};
ext.read_inbound=function(c){c()};
ext.set_recieve_action=function(){};

ext._shutdown=function(){};
ext._getStatus=function(){return{status:1,msg:'Initializing'}};

var descriptor = {
  blocks: [
    // Block type, block name, function name
    [null, 'Open Packet GUI', 'open_gui'],
    [null, 'Create new Network Variable', 'create_variable'],
    [null, 'Delete Network Variable', 'delete_variable'],
    ['--'],
    [' ', 'queue packet %m.packets', 'queue_packet'],
    [' ', 'send queued packets', 'flush_outbound'],
    [' ', 'send packet %m.packets', 'send_packet'],
    ['-'],
    ['w', 'read recieved packets', 'read_inbound'],
    [' ', '%m.do read packets when recieved', 'set_recieve_action', "do"],
  ],
  menus: {
    do: ["do", "don't"],
    packets: ['place holder'],
  },
  url: 'http://znapi.github.io/scratchx/demo/about.html'
};

ScratchExtensions.register('Demo extension', descriptor, ext);


/*********************\
* Program begins here *
\*********************/

/*
The purpose of the code executed in this file is to retrieve all neccessary
resources, and, if successful, retrieve and run the initialization file.
*/

/**
Credit to here: http://stackoverflow.com/a/20518446/3390450,
Small change to be asynchronous.
It includes a .js file by url, and to prevent warnings, it is done
asynchronously and calls a callback function when it's done, and whose only
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

// Initialization: Step 1
// Get socket.io
includeFile(resourcesURL+"socket.io-client.min.js", // Callback

// Initialization: Step 2
function(gotSocketIO) {
  if(!gotSocketIO) {
    ext._getStatus=function(){return{status:0, msg:'Could not retrieve socket.io'}};
    // This extension does no more work from here on because the socket.io is neccessary for the extension
  }
  else {
    // Finish initialization
    var status = {status: 1, msg: "Trying to connect to helper app"};
    ext._getStatus=function(){return status;}
    // Here it begins asking the server for connection
    var socket = io("http://localhost:25565");
    socket.on("connect", function() {
      console.log("Connected!");
      status = {status: 2, msg: "Ready"};
      socket.emit('get_packet_defs');
      console.log("requested packet defs");
    });
    /*socket.on("reconnect", function() {
      socket.emit('get_packet_defs');
    });*/
    socket.on("disconnect", function() {
      console.log("Disconnected!");
      status = {status: 1, msg: "Disconnected by helper app! Restart the helper app's server"};
    });

    var variables = [];

    var packets; // Object with keys for packet names, and are used to access id number associated with packet
    socket.on('new_packet_defs', function(newPacketNames) { // An array of packet names, with index corresponding to id
      console.log("recieved new packet defs");
      packets = new Object();
      descriptor.packets = new Array(0);
      for(var index in newPacketNames) {
        console.log(index + newPacketNames[index]);
        packets[newPacketNames[index]] = index;
        descriptor.packets.push(newPacketNames[index]);
      }
    });

    ext.open_gui = function() {
      guiGo(location);
      socket.emit('get_packet_defs');
    }
    ext.create_variable = function() {
      guiGo("create_var");
    }
    ext.delete_variable = function() {
      guiGo("delete_var");
    }
    ext.queue_packet = function(packetName) {
      socket.emit('queue_packet', packets[packetName]);
    }
    ext.flush_outbound = function() {
      socket.emit('flush_outbound');
    }
    ext.send_packet = function(packetName) {
      socket.emit('send_packet', packets[packetName]);
    }
    ext.read_inbound = function(callback) {
      socket.emit('read_inbound')
      callback();
    }
    var readWhenRecieved = false;
    ext.set_recieve_action = function(action) {
      if(action === "do") readWhenRecieved = true;
      else readWhenRecieved = false;
      socket.emit('set_recieve_action', readWhenRecieved);
    }

    function guiGo(location) {
      socket.emit('gui', location);
    }
  }

});
})({});
