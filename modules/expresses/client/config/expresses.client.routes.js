(function () {
  'use strict';

  angular
    .module('expresses')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('expresses', {
        abstract: true,
        url: '/expresses',
        template: '<ui-view/>'
      })
      .state('expresses.list', {
        url: '',
        templateUrl: 'modules/expresses/client/views/list-expresses.client.view.html',
        controller: 'ExpressesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Expresses List'
        }
      })
      .state('expresses.create', {
        url: '/create',
        templateUrl: 'modules/expresses/client/views/form-express.client.view.html',
        controller: 'ExpressesController',
        controllerAs: 'vm',
        resolve: {
          expressResolve: newExpress
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Expresses Create'
        }
      })
      .state('expresses.edit', {
        url: '/:expressId/edit',
        templateUrl: 'modules/expresses/client/views/form-express.client.view.html',
        controller: 'ExpressesController',
        controllerAs: 'vm',
        resolve: {
          expressResolve: getExpress
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Express {{ expressResolve.name }}'
        }
      })
      .state('expresses.view', {
        url: '/:expressId',
        templateUrl: 'modules/expresses/client/views/view-express.client.view.html',
        controller: 'ExpressesController',
        controllerAs: 'vm',
        resolve: {
          expressResolve: getExpress
        },
        data: {
          pageTitle: 'Express {{ expressResolve.name }}'
        }
      });
  }

  getExpress.$inject = ['$stateParams', 'ExpressesService'];

  function getExpress($stateParams, ExpressesService) {
    return ExpressesService.get({
      expressId: $stateParams.expressId
    }).$promise;
  }

  newExpress.$inject = ['ExpressesService'];

  function newExpress(ExpressesService) {
    return new ExpressesService();
  }
}());
