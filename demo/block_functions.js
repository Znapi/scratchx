var connected = false;

function initializeBlocks(ext, appi) {

  /* Set block function definitions */

  // Send a packet over the network immediately
  ext.send_packet = function(packet) {
    if(!appi.connected) return;
  }

  // Add packet to the outbound queue
  ext.queue_packet = function(packet, callback) {
    if(!appi.connected) callback();
    callback();
  }

  // Send all packets in the outbound queue
  ext.flush_outbound = function() {
    if(!appi.connected) return;
  }

  // Process all packets in the inbound queue
  ext.read_inbound = function(callback) {
    if(!appi.connected) callback();
    callback();
  }

  // Set whether or not inbound packets should be processed when they are
  // recieved. A true means that read_inbound never has to be called by Scratch.
  ext.set_recieve_action = function(processOnRecieve) {
    if(!appi.connected) return;
    appi.read_inbound_on_recieve = processOnRecieve;
  }
}
