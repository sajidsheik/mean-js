(function () {
  'use strict';

  // Expresses controller
  angular
    .module('expresses')
    .controller('ExpressesController', ExpressesController);

  ExpressesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'expressResolve'];

  function ExpressesController ($scope, $state, $window, Authentication, express) {
    var vm = this;

    vm.authentication = Authentication;
    vm.express = express;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Express
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.express.$remove($state.go('expresses.list'));
      }
    }

    // Save Express
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.expressForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.express._id) {
        vm.express.$update(successCallback, errorCallback);
      } else {
        vm.express.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('expresses.view', {
          expressId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
