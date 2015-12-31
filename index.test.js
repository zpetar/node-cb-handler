/**
 * Created by petarz on 12/30/2015.
 */
describe('Module: cb-handler', function() {
  var Handler = require('./index.js');

  it('should exists', function() {
    expect(Handler).toBeDefined();
  });

  it('should be a function', function() {
    expect(typeof Handler).toBe('function');
  });

  it('should has a property named \'defaultErrorHandler\'', function() {
    expect(Handler.defaultErrorHandler).toBeDefined();
  });

  describe('when module is executed', function() {
    var handler;
    beforeEach(function() {
      handler = Handler();
    });

    it('should return the object with the right API', function() {
      expect(typeof handler.handle).toBe('function');
      expect(typeof handler.errorHandler).toBeDefined();
    });

    describe('when errorHandler property is set', function() {
      var errorHandler = function(err) {};
      beforeEach(function() {
        handler.errorHandler = errorHandler;
      });

      it('should use that error handler while handling errors', function() {
        expect(handler.errorHandler).toEqual(errorHandler);
      });
    });

    describe('when errorHandler property is set as a non function object', function() {
      var error;
      it('should throw an error', function() {
        try {
          handler.errorHandler = {};
        } catch(err) {
          error = err;
        }
        expect(error).toBeDefined();
      });
    });

    describe('when \'handle\' function is called', function() {
      var wrappedCb,
        dataCb = jasmine.createSpy('dataCb'),
        errorHandler = jasmine.createSpy('errorHandler'),
        mockedError = new Error('test-error');

      beforeEach(function() {
        wrappedCb = handler.handle(dataCb);
      });

      it('should call the data cb if no error happened', function() {
        var mockedData = {};
        wrappedCb(null, mockedData);
        expect(dataCb).toHaveBeenCalledWith(mockedData);
      });

      it('should call the data cb too if multiple data objects has been passed', function() {
        var mockedData1 = {}, mockedData2 = {};
        wrappedCb(null, mockedData1, mockedData2);
        expect(dataCb).toHaveBeenCalledWith(mockedData1, mockedData2);
      });

      it('should call the data cb if no data available', function() {
        wrappedCb(null);
        expect(dataCb).toHaveBeenCalled();
      });

      describe('when error happens', function() {
        describe('when an error handler is not provided nor default one is set', function() {
          it('should throw that error', function() {
            expect(function() {
              wrappedCb(mockedError);
            }).toThrowError(Error);
          });
        });

        describe('when just default handler is provided', function() {
          beforeEach(function() {
            Handler.defaultErrorHandler = errorHandler;
            wrappedCb(mockedError);
          });

          it('should use it to handle the error', function() {
            expect(errorHandler).toHaveBeenCalledWith(mockedError);
          })
        });

        describe('when error handler is defined on handler instance', function() {
          beforeEach(function() {
            handler.errorHandler = errorHandler;
            wrappedCb(mockedError);
          });

          it('should use it to handle the error', function() {
            expect(errorHandler).toHaveBeenCalledWith(mockedError);
          });
        });

        describe('when second argument to handle function is passed', function() {
          describe('when that argument is a function', function() {
            var additionalErrorHandler = jasmine.createSpy('additionalErrorHandler'),
              wrappedCb;
            beforeEach(function() {
              wrappedCb = handler.handle(dataCb, additionalErrorHandler);
            });

            it('should call that handler', function() {
              wrappedCb(mockedError);
              expect(additionalErrorHandler).toHaveBeenCalledWith(mockedError);
            });
          });

          describe('when that argument is a non function', function() {
            var wrappedCb;
            beforeEach(function() {
              handler.handle(dataCb, {});
            });
            it('should throw an error', function() {
              expect(function() {
                wrappedCb(null);
              }).toThrow();
            });
          });
        });
      });
    });

    describe('when \'handle\' function is called with non function object', function() {
      it('should thrown a type error', function() {
        expect(function() {
          handler.handle({});
        }).toThrowError(TypeError, 'function argument needs to be a function');
      });
    });
  });
});
