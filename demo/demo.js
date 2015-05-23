(function(ext) {

  /************************************************************************\
  * Scratch Extension boilerplate code                                     *
  * Filled in progammatically later when all resources are properly loaded *
  \************************************************************************/


  ext._shutdown=function(){};
  ext._getStatus=function(){return{status: 1, msg: 'Initializing'}};
  ext.queue_packet=function(){};
  ext.flush_packets=function(){};

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

  ScratchExtensions.register('Demo extension', descriptor, ext);



  /***********************\
  * Program begins here   *
  \***********************/


  /**
  Epic code found in this SO answer: http://stackoverflow.com/a/20518446/3390450,
  But changed to be asynchronomous.
  It includes a .js file by url, and to prevent warnings, it is done
  asynchronoumously and calls the callback function, whose only parameter should
  be a boolean that says if the file could be loaded or not.
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

  // Start by retrieveing socket.io, which is necessary to connect to helper app
  includeFile("http://znapi.github.io/scratchx/demo/socket.io.min.js", function(gotSocketIO) {
    if(!gotSocketIO) {
      ext._getStatus=function(){return{status:0, msg:'Could not retrieve socket.io'}};
      // This extension does no more work from here on because the socket.io was not loaded
    }
    else {
      // Continue to next step of initialization
// <<

var connected = false;
ext._getStatus = function() {
  if(connected){return{status: 2, msg: 'Ready'};}
  else{return{status: 1, msg: 'Not connected to helper app'};}
};



// <<
    }
  });

})({});
