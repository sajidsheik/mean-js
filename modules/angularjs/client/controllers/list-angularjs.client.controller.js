(function () {
  'use strict';

  angular
    .module('angularjs')
    .controller('AngularjsListController', AngularjsListController);

  AngularjsListController.$inject = ['AngularjsService'];

  function AngularjsListController(AngularjsService) {
    var vm = this;

    vm.angularjs = AngularjsService.query();
  }
}());
