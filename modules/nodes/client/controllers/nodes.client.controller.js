(function () {
  'use strict';

  // Nodes controller
  angular
    .module('nodes')
    .controller('NodesController', NodesController);

  NodesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'nodeResolve'];

  function NodesController ($scope, $state, $window, Authentication, node) {
    var vm = this;

    vm.authentication = Authentication;
    vm.node = node;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Node
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.node.$remove($state.go('nodes.list'));
      }
    }

    // Save Node
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.nodeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.node._id) {
        vm.node.$update(successCallback, errorCallback);
      } else {
        vm.node.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('nodes.view', {
          nodeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
