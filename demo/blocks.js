function setBlockFunctions(ext) {
  ext.queue_packet = function() {

  }

  ext.flush_packets = function(callback) {
    callback();
  }
}
