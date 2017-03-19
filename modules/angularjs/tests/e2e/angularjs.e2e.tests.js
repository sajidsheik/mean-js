'use strict';

describe('Angularjs E2E Tests:', function () {
  describe('Test Angularjs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/angularjs');
      expect(element.all(by.repeater('angularj in angularjs')).count()).toEqual(0);
    });
  });
});
