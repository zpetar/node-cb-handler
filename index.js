/**
 * Created by petarz on 12/30/2015.
 */
var defaultErrorHandler = function(err) {
  throw new Error(err);
};

function argShouldBeFunction() {
  throw new TypeError('function argument needs to be a function');
}

function extractDataArguments(args) {
  var dataArguments = [], i;
  if (args) {
    for (i = 0; i < args.length; i++) {
      if (i !== 0) {
        dataArguments.push(args[i]);
      }
    }
  }
  return dataArguments;
}

function CallbackHandler() {
  var errorHandler, publicAPI = {};

  function processCallback(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('Callback not provided');
    }
    return function(err) {
      var data;
      if (err) {
        errorHandler ? errorHandler(err) : defaultErrorHandler(err);
        return;
      }
      data = extractDataArguments(arguments);
      callback.apply(null, data);
    };
  }

  function setErrorHandler(handler) {
    if (typeof handler === 'function') {
      errorHandler = handler;
    } else {
      argShouldBeFunction();
    }
  }

  function getErrorHandler() {
    return errorHandler;
  }

  publicAPI.process = processCallback;
  Object.defineProperty(publicAPI, 'errorHandler', {
    get: getErrorHandler,
    set: setErrorHandler
  });
  return publicAPI;
}

function setDefault(handler) {
  if (typeof handler === 'function') {
    defaultErrorHandler = handler;
  } else {
    argShouldBeFunction();
  }
}

Object.defineProperty(CallbackHandler, 'defaultErrorHandler', {
  get: function() {return defaultErrorHandler;},
  set: setDefault
});

module.exports = CallbackHandler;

