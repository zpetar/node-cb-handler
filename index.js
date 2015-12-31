/**
 * Created by petarz on 12/30/2015.
 */
var defaultErrorHandler = function(err) {
    throw new Error(err);
  },
  noop = function() {};

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
  var errorHandler,
    publicAPI = {};

  function handleCallback(callback, passErrorFurther) {
    if (typeof callback !== 'function') {
      argShouldBeFunction();
      return;
    }

    callback = callback || noop;
    return function(err) {
      var data;
      if (err) {
        errorHandler ? errorHandler(err) : defaultErrorHandler(err);
        if (passErrorFurther) {
          passErrorFurther(err);
        }
        return;
      }
      data = extractDataArguments(arguments);
      callback.apply(publicAPI, data);
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

  publicAPI.handle = handleCallback;
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

function getDefault() {
  return defaultErrorHandler;
}

Object.defineProperty(CallbackHandler, 'defaultErrorHandler', {
  get: getDefault,
  set: setDefault
});

module.exports = CallbackHandler;

