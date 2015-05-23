(function(ext) {

  /**
  Epic code found in this SO answer: http://stackoverflow.com/a/20518446/3390450
  Uses an ajax to load a file on the same domain synchonously and without jQuery,
  with purely JavaScript, no html <script> tags. Helpful for Scratch JavaScript
  extensions, where there is no html file to put tags in.
  */
  function includeFile(url) {
    var ajax = new XMLHttpRequest();
    ajax.open('GET', url, false); // <-- the 'false' makes it synchronous
    ajax.onreadystatechange = function() {
    var script = ajax.response || ajax.responseText;
    if(ajax.readyState === 4) {
      switch(ajax.status) {
        case 200:
        eval.apply(window, [script]);
        console.log("script loaded: ", url);
        break;

        default:
        console.log("ERROR: script not loaded: ", url);
      }
    }
  };
  ajax.send(null);
  }

  var socket = io('localhost:25565');
  var connectedToHelperApp = false;
  /**
  Open a socket on port 25565 and attempt to connect to helper app.
  Currently, this function will not return until it is connected to the helper
  app.
  */
  function connectToHelperApp() {
    //socket = io('localhost:25565');
    socket.on('connect', function() {
      console.log("Connected");
      connectedToHelperApp = true
    });
    //socket.on('event', function(data){console.log("Event recieved");});
    //socket.on('disconnect', function(){console.log("Disconnected");});
  }

  // Cleanup function when the extension is unloaded
  ext._shutdown = function() {
    //TODO tell helper app to close
    //     close sockets
    socket.on('disconnect', function(){console.log("Disconnected");});
    socket.close; socket.Cleanup;
  };

  // Status reporting code
  // Use this to report missing hardware, plugin or unsupported browser
  ext._getStatus = function() {
    //TODO ping helper app
    if(connectedToHelperApp) {
      return {status: 2, msg: 'Ready'};
    }
    else {
      return {status: 0, msg: 'Not connected to helper app'}
    }
  };

  ext.queue_packet = function() {

  };

  ext.flush_packets = function() {

  };

  // Block and block menu descriptions
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

  // Register the extension
  ScratchExtensions.register('Demo extension', descriptor, ext);

  /* Code to run on start */
  includeFile("http://znapi.github.io/scratchx/demo/socket.io.min.js");
  connectToHelperApp();

})({});
