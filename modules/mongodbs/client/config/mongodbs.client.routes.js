(function () {
  'use strict';

  angular
    .module('mongodbs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('mongodbs', {
        abstract: true,
        url: '/mongodbs',
        template: '<ui-view/>'
      })
      .state('mongodbs.list', {
        url: '',
        templateUrl: 'modules/mongodbs/client/views/list-mongodbs.client.view.html',
        controller: 'MongodbsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Mongodbs List'
        }
      })
      .state('mongodbs.create', {
        url: '/create',
        templateUrl: 'modules/mongodbs/client/views/form-mongodb.client.view.html',
        controller: 'MongodbsController',
        controllerAs: 'vm',
        resolve: {
          mongodbResolve: newMongodb
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Mongodbs Create'
        }
      })
      .state('mongodbs.edit', {
        url: '/:mongodbId/edit',
        templateUrl: 'modules/mongodbs/client/views/form-mongodb.client.view.html',
        controller: 'MongodbsController',
        controllerAs: 'vm',
        resolve: {
          mongodbResolve: getMongodb
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Mongodb {{ mongodbResolve.name }}'
        }
      })
      .state('mongodbs.view', {
        url: '/:mongodbId',
        templateUrl: 'modules/mongodbs/client/views/view-mongodb.client.view.html',
        controller: 'MongodbsController',
        controllerAs: 'vm',
        resolve: {
          mongodbResolve: getMongodb
        },
        data: {
          pageTitle: 'Mongodb {{ mongodbResolve.name }}'
        }
      });
  }

  getMongodb.$inject = ['$stateParams', 'MongodbsService'];

  function getMongodb($stateParams, MongodbsService) {
    return MongodbsService.get({
      mongodbId: $stateParams.mongodbId
    }).$promise;
  }

  newMongodb.$inject = ['MongodbsService'];

  function newMongodb(MongodbsService) {
    return new MongodbsService();
  }
}());
