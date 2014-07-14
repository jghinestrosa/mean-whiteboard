'use strict';

describe('Service: colorConversionFactory', function () {

  // load the service's module
  beforeEach(module('meanWhiteboardApp'));

  // instantiate service
  var colorConversionFactory;
  beforeEach(inject(function (_colorConversionFactory_) {
    colorConversionFactory = _colorConversionFactory_;
  }));

  it('should do something', function () {
    expect(!!colorConversionFactory).toBe(true);
  });

});
