(function(ext) {

ext.get_ext_status = function(extName) {
  return ScratchExtensions.getStatus(extName).status;
}

ext.get_ext_status_message = function(extName) {
  return ScratchExtensions.getStatus(extName).msg;
}

ext._shutdown=function(){};
ext._getStatus=function(){return{status:2,msg:'Ready'}};

var descriptor = {
  blocks: [
    // Block type, block name, function name
    ['r', 'status code of extension %s', 'get_ext_status'],
    ['r', 'staus message of extension %s', 'get_ext_status_message']
  ],
  //menus: {},
  //url: 'http://znapi.github.io/scratchx/demo/about.html'
};

ScratchExtensions.register('Extension status getter', descriptor, ext);

})({});