(function(ext) {

  /**
  Epic code found in this SO answer: http://stackoverflow.com/a/20518446/3390450
  Uses an ajax to load a file on the same domain synchonously and without jQuery,
  with purely JavaScript, no html <script> tags. Helpful for Scratch JavaScript
  extensions, where there is no html file to put tags in.
  */
  function includeFile(url, callback) {
    var ajax = new XMLHttpRequest();
    ajax.open('GET', url, false); // <-- the 'false' makes it synchronous
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

  //var socket = io('localhost:25565');
  //var connectedToHelperApp = false;
  /**
  Open a socket on port 25565 and attempt to connect to helper app.
  Currently, this function will not return until it is connected to the helper
  app.
  */
  /*function connectToHelperApp() {
    //socket = io('localhost:25565');
    socket.on('connect', function() {
      console.log("Connected");
      connectedToHelperApp = true
    });
    //socket.on('event', function(data){console.log("Event recieved");});
    //socket.on('disconnect', function(){console.log("Disconnected");});
  }*/

  ext._shutdown = function() {
    //socket.on('disconnect', function(){console.log("Disconnected");});
    //socket.close; socket.Cleanup;
  };

  ext._getStatus = {status: 1, msg: 'Initializing'};
  ext.queue_packet=function(){};
  ext.flush_packets=function(){};

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

  /* Code to run on start, after resources are loaded and required declarations made */

  // Start by retrieveing socket.io, which is necessary to connect to helper app
  includeFile("http://znapi.github.io/scratchx/demo/socket.io.min.j", function(gotSocketIO) {
    if(gotSocketIO) {
      // Leave status as unready, and continue to next step of initialization
    }
    else {
      ext._getStatus = {status:0, msg:'Could not retrieve socket.io'};
      // This extension does no more work from hereon.
    }
  });
  //pconnectToHelperApp();

})({});
