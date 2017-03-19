(function () {
  'use strict';

  angular
    .module('mongodbs')
    .controller('MongodbsListController', MongodbsListController);

  MongodbsListController.$inject = ['MongodbsService'];

  function MongodbsListController(MongodbsService) {
    var vm = this;

    vm.mongodbs = MongodbsService.query();
  }
}());
