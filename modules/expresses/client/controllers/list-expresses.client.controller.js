(function () {
  'use strict';

  angular
    .module('expresses')
    .controller('ExpressesListController', ExpressesListController);

  ExpressesListController.$inject = ['ExpressesService'];

  function ExpressesListController(ExpressesService) {
    var vm = this;

    vm.expresses = ExpressesService.query();
  }
}());
