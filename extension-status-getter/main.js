(function(ext) {

ext.get_ext_status = function(name) {
  return ScratchExtensions.getStatus(name).status;
}

ext.get_ext_status_message = function(name) {
  return ScratchExtensions.getStatus(name).msg;
}

ext._shutdown=function(){};
ext._getStatus=function(){return{status:2,msg:'Ready'}};

var extName = 'Extension Status Getter';

ScratchExtensions.register(extName,
  {
    blocks: [
      ['r', 'status code of extension %s', 'get_ext_status', extName],
      ['r', 'status message of extension %s', 'get_ext_status_message', extName]
    ],
    url: 'https://github.com/Znapi/scratchx/wiki/Extension-Status-Getter'
  },
  ext);

})({});
