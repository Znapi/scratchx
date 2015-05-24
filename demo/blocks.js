function setBlockFunctions(ext) {
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
}
