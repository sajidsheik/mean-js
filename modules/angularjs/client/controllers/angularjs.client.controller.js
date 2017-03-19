(function () {
  'use strict';

  // Angularjs controller
  angular
    .module('angularjs')
    .controller('AngularjsController', AngularjsController);

  AngularjsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'angularjResolve'];

  function AngularjsController ($scope, $state, $window, Authentication, angularj) {
    var vm = this;

    vm.authentication = Authentication;
    vm.angularj = angularj;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Angularj
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.angularj.$remove($state.go('angularjs.list'));
      }
    }

    // Save Angularj
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.angularjForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.angularj._id) {
        vm.angularj.$update(successCallback, errorCallback);
      } else {
        vm.angularj.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('angularjs.view', {
          angularjId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
