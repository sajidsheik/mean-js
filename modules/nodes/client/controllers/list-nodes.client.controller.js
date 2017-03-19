(function () {
  'use strict';

  angular
    .module('nodes')
    .controller('NodesListController', NodesListController);

  NodesListController.$inject = ['NodesService'];

  function NodesListController(NodesService) {
    var vm = this;

    vm.nodes = NodesService.query();
  }
}());
