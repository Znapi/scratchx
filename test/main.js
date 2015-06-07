(function(ext) {

/************************************\
* Scratch Extension boilerplate code *
\************************************/

ext.need_net_vars=function(){return false};
ext.new_net_var=function(x,c){c()};
ext.update_block_palette=function(c){c()};
ext.reset_net_vars=function(c){c()};

ext.set_net_var=function(x,y,c){c()};
ext.add_to_net_var=function(x,y,z,c){c()};
ext.remove_from_net_var=function(x,y,c){c()};
ext.remove_segment_from_net_var=function(x,y,z,c){c()};

ext.set_buffering=function(){};
ext.flush_outbound=function(){};
ext.read_inbound=function(c){c()};

ext._shutdown=function(){};
var status={status:1,msg:'Needs to initialize'};
ext._getStatus=function(){return status};

var descriptor = {
  blocks: [
    // Variable definitions
    ['h', 'declare network variables', 'need_net_vars'],
    ['w', 'declare network variable %s', 'new_net_var'],
    ['w', 'update block palette', 'update_block_palette'],
    ['w', 'delete all network variables', 'reset_net_vars'],
    ['-'],
    // Variables
      // Variable reporters go here
    ['w', 'set %d.v to %s', 'set_net_var', 'variable'],
    ['w', 'add %s at %d.l of %d.v', 'add_to_net_var', '', 'end', 'variable'],
    ['w', 'remove letter %d.l of %d.v', 'remove_from_net_var', '1', 'variable'],
    ['w', 'remove letters %d.l to %d.l of %d.v', 'remove_segment_from_net_var', '1', '10', 'variable'],
    ['-'],
    // Buffering
    ['', 'set buffering of %m.s stream to %b', 'set_buffering', 'outbound', false],
    ['', 'send outbound buffer', 'flush_outbound'],
    ['w', 'read inbound buffer', 'read_inbound'],
  ],
  menus: {
    s: ['outbound', 'inbound'],
    l: ['beggining', 'end'],
    v: [],
  },
  url: 'https://github.com/Znapi/scratchx/wiki/'
};

ScratchExtensions.register('Network Extension', descriptor, ext);


/*********************\
* Program begins here *
\*********************/

status = {status: 1, msg: "Trying to connect to helper app"};

function makeRequest(request, callback) {
  var r = new XMLHttpRequest();
  r.open(request.method, request.requestUrl, true);
  if(request.hasOwnProperty('responseType'))
    r.responseType = request.responseType;
  if(request.hasOwnProperty('headers')) {
    for(var header in request.headers) {
      r.setRequestHeader(header, request.headers[header]);
    }
  }
  if(callback !== undefined) {
    r.onreadystatechange = function() {
      if(r.readyState===4)
        callback(r);
    };
  }
  if(request.hasOwnProperty('body')) {
    r.send(request.body)
  }
  else r.send();
}

function DefaultRequestCallback(s) {
  return Function('r', "if(r.status===200)console.log('" + s + " successful');else console.log('" + s + " failed');");
}

function HelperApp() {
  var localhost = 'http://localhost:25565';
  var id = null;
  var url = null;

  this.connect = function() {
    makeRequest({
      method: 'POST',
      requestUrl: localhost,
      responseType: 'arraybuffer',
    },
    function(r) {
      switch(r.status) {
        case 200:
        console.log("Connection successful");
        var tmp = new Int8Array(r.response);
        id = '/' + new String(tmp[0]) + new String(tmp[1]) + new String(tmp[2]);
        url = localhost + id;
        console.log(url);
        status = {status: 1, msg: "Ready"};
        break;

        default:
        console.log("Connection failed")
      }
    });
  }

  this.disconnect = function() {
    if(id!==null)
    makeRequest({
      method: 'DELETE',
      requestUrl: url,
    },
    new DefaultRequestCallback("Disconnection"));
    id = null;
  }

  this.ping = function() {
    makeRequest({
      method: 'GET',
      requestUrl: url,
    },
    new DefaultRequestCallback("Ping"));
  }
}
var helperapp = new HelperApp();

helperapp.connect();

/*ext._shutdown = function() {
  helperapp.disconnect();
}*/

function ScratchVariables() {
  var needNetVarDefs = false;
  this.array = new Array(0);
  this.names = {};

  this.needDecls = function() {
    return needNetVarDefs;
  }
  this.requireDecls = function() {
    needNetVarDefs = true;
  }
  this.gettingDecls = function() {
      needNetVarDefs = false;
  }
}
ScratchVariables.prototype.append = function(name) {
  this.names[name] = this.array.push(0) - 1; // Assign name to index to value
}
ScratchVariables.prototype.delete = function(name) {
  this.array.splice(this.names[name], 1); // Delete index and value, then delete name
  delete this.names[name];
}
ScratchVariables.prototype.createVariable = function(name) {
  if(this.names.hasOwnProperty(name))
    alert("Cannot create new variable with name '" + name + "\n'Variable name is already in use");
  else {
    this.append(name);
    console.log("Here");
    console.log(JSON.stringify(this.names));
    console.log("here");
  }
}
ScratchVariables.prototype.deleteVariable = function(name) {
  if(!this.names.hasOwnProperty(name))
    alert("Cannot delete variable with name '" + name + "'\nVariable name not used");
  else {
    this.delete(name);
    console.log(JSON.stringify(this.names));
  }
}
ScratchVariables.prototype.deleteAllVariables = function() {
  this.array = new Array(0);
  this.names = {};
}
var scratchVariables = new ScratchVariables();

function BlockPalette() {
  var beforeVariables = [
    ['h', 'declare network variables', 'need_net_vars'],
    ['w', 'declare network variable %s', 'new_net_var'],
    ['w', 'update block palette', 'update_block_palette'],
    ['w', 'delete all network variables', 'reset_net_vars'],
    ['-'],
  ];
  var variables = [];
  var afterVariables = [
    ['w', 'set %d.v to %s', 'set_net_var', 'variable'],
    ['w', 'add %s at %d.l of %d.v', 'add_to_net_var', '', 'end', 'variable'],
    ['w', 'remove letter %d.l of %d.v', 'remove_from_net_var', '1', 'variable'],
    ['w', 'remove letters %d.l to %d.l of %d.v', 'remove_segment_from_net_var', '1', '10', 'variable'],
    ['-'],
    // Buffering
    ['', 'set buffering of %m.s stream to %b', 'set_buffering', 'outbound', false],
    ['', 'send outbound buffer', 'flush_outbound'],
    ['w', 'read inbound buffer', 'read_inbound'],
  ];
  this.rebuildBlockPalette = function(variableNames) {
    variables = new Array(0);
    for(var name in variableNames)
      variables.push(['r', name, 'r_' + name]);
    if(variables.length!==0)
      variables.push(['-']);
    descriptor.blocks = new Array(0).concat(beforeVariables).concat(variables).concat(afterVariables);
    //console.log(JSON.stringify(descriptor.blocks));

    ScratchExtensions.unregister('Network Extension');
    ScratchExtensions.register('Network Extension', descriptor, ext);
  }
}
var blockPalette = new BlockPalette();

ext.need_net_vars = function() {
  if(!scratchVariables.needDecls())
    return false;
  scratchVariables.gettingDecls();
  return true;
}
ext.new_net_var = function(name, callback) {
  if(name==="")
    alert("Variable names must contain at least one character");
  else
    scratchVariables.createVariable(name);
  callback();
}
ext.reset_net_vars = function(callback) {
  scratchVariables.deleteAllVariables();
  blockPalette.rebuildBlockPalette({});
  scratchVariables.requireDecls();
  callback();
}
ext.update_block_palette = function(callback) {
  //console.log("Rebuilding block palette");
  blockPalette.rebuildBlockPalette(scratchVariables.names);
  callback();
}

scratchVariables.requireDecls();

//ScratchExtensions.loadExternalJS("http://znapi.github.io/scratchx/unnamed/main.min.js");
})({});
