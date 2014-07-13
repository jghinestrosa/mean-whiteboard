'use strict';

describe('Directive: menuBar', function () {

  // load the directive's module
  beforeEach(module('meanWhiteboardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<menu-bar></menu-bar>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the menuBar directive');
  }));
});
