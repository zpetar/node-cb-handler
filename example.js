/**
 * Created by petarz on 12/30/2015.
 */
var CbHandler = require('./index.js'),
  fs = require('fs'),
  cbHandler = new CbHandler(),
  handle = cbHandler.handle;

// if error handler is not defined on specific cbHandler instance
// default one will be called
// if default one is not defined by the client, an error will be thrown inside of the module
CbHandler.defaultErrorHandler = function(err) {
  console.log('Default handler: %s', err);
};

// if error handler on the instance is defined
// default one will be ignored
cbHandler.errorHandler = function(err) {
  console.log('this is predefined handler: %s', err);
};


function getFileContent(filePath, cb) {
  var cbHandler = new CbHandler(),
    handle = cbHandler.handle;
  cbHandler.errorHandler = cb;

  fs.stat(filePath, handle(function(stat) {
    if (!stat.isDirectory()) {
      fs.readFile(filePath, handle(function(content) {
        cb(null, content.toString());
      }));
    }
  }));
}


getFileContent('abrakadabra', handle(function(content) {
  console.log(content);
}));
// OUTPUT: this is predefined handler: Error: ENOENT, stat 'c:\EXPERIMENTS\cb-handler\abrakadabra'

getFileContent('./node-cb-handler/index.js', handle(function(content) {
  console.log(content);
}));

//OUTPUT: actual content of the file


