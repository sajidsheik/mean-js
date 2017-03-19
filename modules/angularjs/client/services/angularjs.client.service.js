// Angularjs service used to communicate Angularjs REST endpoints
(function () {
  'use strict';

  angular
    .module('angularjs')
    .factory('AngularjsService', AngularjsService);

  AngularjsService.$inject = ['$resource'];

  function AngularjsService($resource) {
    return $resource('api/angularjs/:angularjId', {
      angularjId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
