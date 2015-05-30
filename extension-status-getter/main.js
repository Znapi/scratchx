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
    ['r', 'status code of extension %s', 'get_ext_status'],
    ['r', 'staus message of extension %s', 'get_ext_status_message']
  ],
  //url: 'http://znapi.github.io/scratchx/demo/about.html'
};

ScratchExtensions.register('Extension Status Getter', descriptor, ext);

})({});
