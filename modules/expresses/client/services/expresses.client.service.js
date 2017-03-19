// Expresses service used to communicate Expresses REST endpoints
(function () {
  'use strict';

  angular
    .module('expresses')
    .factory('ExpressesService', ExpressesService);

  ExpressesService.$inject = ['$resource'];

  function ExpressesService($resource) {
    return $resource('api/expresses/:expressId', {
      expressId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
