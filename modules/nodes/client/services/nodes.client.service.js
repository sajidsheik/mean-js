// Nodes service used to communicate Nodes REST endpoints
(function () {
  'use strict';

  angular
    .module('nodes')
    .factory('NodesService', NodesService);

  NodesService.$inject = ['$resource'];

  function NodesService($resource) {
    return $resource('api/nodes/:nodeId', {
      nodeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
