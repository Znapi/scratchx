(function(ext) {

ext.read=function(a,c){c("");};
ext.write=function(a,b,c){c();};
ext.make=function(a,c){c();};

ext._shutdown=function(){};
ext._getStatus=function(){return{status:1,msg:'Waiting for helper app'}};

ScratchExtensions.register('Simple File I/O',
  {
    blocks: [
        ['R', 'read from file %s', 'read', 'todo.txt'],
        ['w', 'write %s to file %s', 'write', 'hello world', 'text.txt'],
        ['w', 'create file %s', 'make', 'text.txt']
    ],
    url: 'https://github.com/Znapi/scratchx/wiki/Simple-File-IO'
  },
  ext);

var check = new XMLHttpRequest();

check.onreadystatechange = function() {if(check.readyState===4){

    console.log("Helper app responded!");
    ext._getStatus=function(){return{status:2,msg:'Ready'}};

    ext.read = function(dir, callback) {
        var r = new XMLHttpRequest();

        r.onreadystatechange = function() {
            if(r.readyState===4)
                callback(r.responseText);
        };
        r.open('GET', 'http://localhost:8080/'+dir, true);
        r.send();
    };

    ext.write = function(text, dir, callback) {
        var r = new XMLHttpRequest();

        r.onreadystatechange = function() {
            if(r.readyState===4)
                callback();
        };
        r.open('PUT', 'http://localhost:8080/'+dir, true);
        r.send(text);
    };

    ext.make = function(dir, callback) {
        var r = new XMLHttpRequest();

        r.onreadystatechange = function() {
            if(r.readyState===4)
                callback();
        };
        r.open('POST', 'http://localhost:8080/'+dir, true);
        r.send();
    };

}};
check.open('OPTIONS', 'http://localhost:8080/', true);
check.send();

})({});
