'use strict';

describe('Directive: listenKeypress', function () {

  // load the directive's module
  beforeEach(module('meanWhiteboardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<listen-keypress></listen-keypress>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the listenKeypress directive');
  }));
});
