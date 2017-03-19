// Mongodbs service used to communicate Mongodbs REST endpoints
(function () {
  'use strict';

  angular
    .module('mongodbs')
    .factory('MongodbsService', MongodbsService);

  MongodbsService.$inject = ['$resource'];

  function MongodbsService($resource) {
    return $resource('api/mongodbs/:mongodbId', {
      mongodbId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
}
    
  
}());
