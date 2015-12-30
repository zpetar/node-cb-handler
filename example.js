/**
 * Created by petarz on 12/30/2015.
 */
var CbHandler = require('./index.js'),
  cbHandler = new CbHandler();

CbHandler.defaultErrorHandler = function(err) {
  console.log('Default handler: %s', err);
};


cbHandler.errorHandler = function(err) {
  console.log('this is my predefined handler: %s', err);
};

function test(number, cb) {
  if (number === 0) {
    return cb(null, {data: 'Some data'});
  }
  cb(new Error('test-error'));
}

test(0, cbHandler.process(function(data) {
  console.log(data);
}));

test(1, cbHandler.process(function() {}));


