'use strict';

describe('Mongodbs E2E Tests:', function () {
  describe('Test Mongodbs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/mongodbs');
      expect(element.all(by.repeater('mongodb in mongodbs')).count()).toEqual(0);
    });
  });
});
