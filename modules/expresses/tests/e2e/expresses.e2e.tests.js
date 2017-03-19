'use strict';

describe('Expresses E2E Tests:', function () {
  describe('Test Expresses page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/expresses');
      expect(element.all(by.repeater('express in expresses')).count()).toEqual(0);
    });
  });
});
