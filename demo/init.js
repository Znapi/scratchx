var connected = false;

function finishInitialization(ext) {

  /* Set block function definitions */

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
  console.log("Done");
}
