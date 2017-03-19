'use strict';

describe('Nodes E2E Tests:', function () {
  describe('Test Nodes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/nodes');
      expect(element.all(by.repeater('node in nodes')).count()).toEqual(0);
    });
  });
});
