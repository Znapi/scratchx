var connected = false;

function initialize(ext) {

  /* Set block function definitions */

  // Send a packet over the network immediately
  ext.send_packet = function(packet) {

  }

  // Add packet to the outbound queue
  ext.queue_packet = function(packet, callback) {
    callback();
  }

  // Send all packets in the outbound queue
  ext.flush_outbound = function() {

  }

  // Process all packets in the inbound queue
  ext.read_inbound = function(callback) {
    callback();
  }

  var read_inbound_on_recieve = true;
  // Set whether or not inbound packets should be processed when they are
  // recieved. A true means that read_inbound never has to be called by Scratch.
  ext.set_recieve_action = function(processOnRecieve) {
    read_inbound_on_recieve = processOnRecieve;
    if(read_inbound_on_recieve) read_inbound(); // Read all unread packets
  }

  /* Set up connection to helper app */

  var socket = io("http://localhost:25565");
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

  ext._getStatus = function() {
    if(connected){return{status: 2, msg: 'Ready'};}
    else{return{status: 1, msg: 'Not connected to helper app'};}
  };

  ext._shutdown = function() {
    //TODO tell helper app to shut off server
  };
}
