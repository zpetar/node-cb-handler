/**
 * Created by petarz on 12/30/2015.
 */
var defaultErrorHandler = function(err) {
    throw new Error(err);
  },
  noop = function() {},
  Emitter = require('events');

function argShouldBeFunction() {
  throw new TypeError('function argument needs to be a function');
}

function extractDataArguments(args) {
  var dataArguments = [], i;
  if (args) {
    for (i = 1; i < args.length; i++) {
      dataArguments.push(args[i]);
    }
  }
  return dataArguments;
}

function CallbackHandler() {
  var publicAPI = new Emitter();

  function emitError(err) {
    publicAPI.listeners('error').length ?
      publicAPI.emit('error', err) : defaultErrorHandler(err);
  }

  function handleCallback(callback) {
    if (typeof callback !== 'function') {
      argShouldBeFunction();
      return;
    }

    callback = callback || noop;
    return function(err) {
      var data;
      if (err) {
        emitError(err);
        return;
      }
      data = extractDataArguments(arguments);
      callback.apply(publicAPI, data);
    };
  }


  publicAPI.handle = handleCallback;
  return publicAPI;
}

function setDefault(handler) {
  if (typeof handler === 'function') {
    defaultErrorHandler = handler;
  } else {
    argShouldBeFunction();
  }
}

function getDefault() {
  return defaultErrorHandler;
}

Object.defineProperty(CallbackHandler, 'defaultErrorHandler', {
  get: getDefault,
  set: setDefault
});

module.exports = CallbackHandler;

