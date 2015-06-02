(function(ext) {

ext.get_ext_status = function(extName) {
  return ScratchExtensions.getStatus(extName).status;
}

ext.get_ext_status_message = function(extName) {
  return ScratchExtensions.getStatus(extName).msg;
}

ext._shutdown=function(){};
ext._getStatus=function(){return{status:2,msg:'Ready'}};

var extName = 'Extension Status Getter';
var descriptor = {
  blocks: [
    ['r', 'status code of extension %s', 'get_ext_status', extName],
    ['r', 'staus message of extension %s', 'get_ext_status_message', extName]
  ],
  url: 'https://github.com/Znapi/scratchx/wiki/Extension-Status-Getter'
};

ScratchExtensions.register('Extension Status Getter', descriptor, ext);

})({});
