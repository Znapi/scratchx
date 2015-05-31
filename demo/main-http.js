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

ext.open_gui=function(){alert("Extension is still initializing\nGUI not loaded")};
ext.create_variable=function(){};
ext.delete_variable=function(){};

ext.poll_get_server=function(){return false};
ext.set_peer_finder_service=function(){};
ext.became_finder_service=function(){return false};
ext.get_ip_address=function(){};

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
    ['--'],
    ['h', 'When needs new peer finder service', 'poll_get_server'],
    [' ', 'tell extension that peer finder service is %s', 'set_peer_finder_service', "000.000.000.000"],
    ['h', 'When became peer finder service', 'became_finder_service'],
    ['r', 'ip address', 'get_ip_address'],
  ],
  menus: {
    do: ["do", "don't"],
    packets: ['place holder'],
  },
  url: 'https://github.com/Znapi/scratchx/wiki/'
};

ScratchExtensions.register('Demo extension', descriptor, ext);


/*********************\
* Program begins here *
\*********************/

/*
The purpose of the code executed in this file is to retrieve all neccessary
resources, and, if successful, retrieve and run the initialization file.
*/

var status = {status: 1, msg: "Trying to connect to helper app"};
ext._getStatus=function(){return status}

var variables = [];
var packets; // Object with keys for packet names, and are used to access id number associated with packet

var needNewPeerFinderService = true;
var peerFinderService = null;
ext.poll_get_peer_finder_service = function() {
  return !(needNewPeerFinderService = false);
}
ext.set_peer_finder_service = function(newIP) {
  peerFinderService = newIP;

}
var becamePeerFinderService = false;
ext.became_peer_finder_service = function() {
  return !(becamePeerFinderService = false);
}
var myIP = null;
ext.get_ip_address = function() {
  return myIP;
}

ext.open_gui = function() {
  guiGo(location);
}
ext.create_variable = function() {
  guiGo("create_var");
}
ext.delete_variable = function() {
  guiGo("delete_var");
}

ext.queue_packet = function(packetName) {

}
ext.flush_outbound = function() {

}
ext.send_packet = function(packetName) {

}
ext.read_inbound = function(callback) {
  callback();
}
var readWhenRecieved = false;
ext.set_recieve_action = function(action) {
  if(action === "do") readWhenRecieved = true;
  else                readWhenRecieved = false;

}

function guiGo(location) {
  connectToHA();
}

function reregisterExtension() {
  ScratchExtensions.unregister('Demo extension');
  ScratchExtensions.register('Demo extension', descriptor, ext);
}

ext._shutdown = function() {

}

var url = "http://localhost:25565"
function connectToHA() {
  var ajax = new XMLHttpRequest();
  ajax.open('GET', url, true);
  ajax.responseType = "arraybuffer";
  ajax.onreadystatechange = function() {
    if(ajax.readyState === 4) {
      switch(ajax.status) {
        case 200:
        console.log("Connection successful");
        var id = new Int8Array(ajax.response);
        console.log(id[0] + id[1] + id[2]);
        break;

        case 409:
        console.log("Another scratch instance is already connected");
        break;

        default:
        console.log("Connection failed")
      }
    }
  };
  ajax.send();
}

})({});
