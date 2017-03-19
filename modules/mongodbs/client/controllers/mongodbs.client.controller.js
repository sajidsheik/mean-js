(function () {
  'use strict';

  // Mongodbs controller
  angular
    .module('mongodbs')
    .controller('MongodbsController', MongodbsController);

  MongodbsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'mongodbResolve'];

  function MongodbsController ($scope, $state, $window, Authentication, mongodb) {
    var vm = this;

    vm.authentication = Authentication;
    vm.mongodb = mongodb;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Mongodb
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.mongodb.$remove($state.go('mongodbs.list'));
      }
    }

    // Save Mongodb
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.mongodbForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.mongodb._id) {
        vm.mongodb.$update(successCallback, errorCallback);
      } else {
        vm.mongodb.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('mongodbs.view', {
          mongodbId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
