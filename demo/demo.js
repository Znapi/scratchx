(function(ext) {

    /**************************
    * Required extension code *
    ***************************/

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {
      //TODO tell helper app to close
      //     close sockets
    };

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        //TODO ping helper app
        return {status: 2, msg: 'Ready'};
    };

    ext.my_first_block = function() {
        // Code that gets executed when the block is run
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', 'my first block', 'my_first_block'],
        ]
        //menus: {},
        url: 'http://znapi.github.io/scratchx/demo/about.html'
    };

    // Register the extension
    ScratchExtensions.register('My first extension', descriptor, ext);


    /************************
     * Comm with helper app *
     ************************/

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

})({});
