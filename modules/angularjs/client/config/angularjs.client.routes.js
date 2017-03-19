(function () {
  'use strict';

  angular
    .module('angularjs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('angularjs', {
        abstract: true,
        url: '/angularjs',
        template: '<ui-view/>'
      })
      .state('angularjs.list', {
        url: '',
        templateUrl: 'modules/angularjs/client/views/list-angularjs.client.view.html',
        controller: 'AngularjsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Angularjs List'
        }
      })
      .state('angularjs.create', {
        url: '/create',
        templateUrl: 'modules/angularjs/client/views/form-angularj.client.view.html',
        controller: 'AngularjsController',
        controllerAs: 'vm',
        resolve: {
          angularjResolve: newAngularj
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Angularjs Create'
        }
      })
      .state('angularjs.edit', {
        url: '/:angularjId/edit',
        templateUrl: 'modules/angularjs/client/views/form-angularj.client.view.html',
        controller: 'AngularjsController',
        controllerAs: 'vm',
        resolve: {
          angularjResolve: getAngularj
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Angularj {{ angularjResolve.name }}'
        }
      })
      .state('angularjs.view', {
        url: '/:angularjId',
        templateUrl: 'modules/angularjs/client/views/view-angularj.client.view.html',
        controller: 'AngularjsController',
        controllerAs: 'vm',
        resolve: {
          angularjResolve: getAngularj
        },
        data: {
          pageTitle: 'Angularj {{ angularjResolve.name }}'
        }
      });
  }

  getAngularj.$inject = ['$stateParams', 'AngularjsService'];

  function getAngularj($stateParams, AngularjsService) {
    return AngularjsService.get({
      angularjId: $stateParams.angularjId
    }).$promise;
  }

  newAngularj.$inject = ['AngularjsService'];

  function newAngularj(AngularjsService) {
    return new AngularjsService();
  }
}());
