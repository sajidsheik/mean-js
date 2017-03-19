(function () {
  'use strict';

  describe('Angularjs Route Tests', function () {
    // Initialize global variables
    var $scope,
      AngularjsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AngularjsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AngularjsService = _AngularjsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('angularjs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/angularjs');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AngularjsController,
          mockAngularj;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('angularjs.view');
          $templateCache.put('modules/angularjs/client/views/view-angularj.client.view.html', '');

          // create mock Angularj
          mockAngularj = new AngularjsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Angularj Name'
          });

          // Initialize Controller
          AngularjsController = $controller('AngularjsController as vm', {
            $scope: $scope,
            angularjResolve: mockAngularj
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:angularjId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.angularjResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            angularjId: 1
          })).toEqual('/angularjs/1');
        }));

        it('should attach an Angularj to the controller scope', function () {
          expect($scope.vm.angularj._id).toBe(mockAngularj._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/angularjs/client/views/view-angularj.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AngularjsController,
          mockAngularj;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('angularjs.create');
          $templateCache.put('modules/angularjs/client/views/form-angularj.client.view.html', '');

          // create mock Angularj
          mockAngularj = new AngularjsService();

          // Initialize Controller
          AngularjsController = $controller('AngularjsController as vm', {
            $scope: $scope,
            angularjResolve: mockAngularj
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.angularjResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/angularjs/create');
        }));

        it('should attach an Angularj to the controller scope', function () {
          expect($scope.vm.angularj._id).toBe(mockAngularj._id);
          expect($scope.vm.angularj._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/angularjs/client/views/form-angularj.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AngularjsController,
          mockAngularj;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('angularjs.edit');
          $templateCache.put('modules/angularjs/client/views/form-angularj.client.view.html', '');

          // create mock Angularj
          mockAngularj = new AngularjsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Angularj Name'
          });

          // Initialize Controller
          AngularjsController = $controller('AngularjsController as vm', {
            $scope: $scope,
            angularjResolve: mockAngularj
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:angularjId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.angularjResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            angularjId: 1
          })).toEqual('/angularjs/1/edit');
        }));

        it('should attach an Angularj to the controller scope', function () {
          expect($scope.vm.angularj._id).toBe(mockAngularj._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/angularjs/client/views/form-angularj.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
