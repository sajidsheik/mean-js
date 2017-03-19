(function () {
  'use strict';

  describe('Mongodbs Route Tests', function () {
    // Initialize global variables
    var $scope,
      MongodbsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MongodbsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MongodbsService = _MongodbsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('mongodbs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/mongodbs');
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
          MongodbsController,
          mockMongodb;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('mongodbs.view');
          $templateCache.put('modules/mongodbs/client/views/view-mongodb.client.view.html', '');

          // create mock Mongodb
          mockMongodb = new MongodbsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Mongodb Name'
          });

          // Initialize Controller
          MongodbsController = $controller('MongodbsController as vm', {
            $scope: $scope,
            mongodbResolve: mockMongodb
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:mongodbId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.mongodbResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            mongodbId: 1
          })).toEqual('/mongodbs/1');
        }));

        it('should attach an Mongodb to the controller scope', function () {
          expect($scope.vm.mongodb._id).toBe(mockMongodb._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/mongodbs/client/views/view-mongodb.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MongodbsController,
          mockMongodb;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('mongodbs.create');
          $templateCache.put('modules/mongodbs/client/views/form-mongodb.client.view.html', '');

          // create mock Mongodb
          mockMongodb = new MongodbsService();

          // Initialize Controller
          MongodbsController = $controller('MongodbsController as vm', {
            $scope: $scope,
            mongodbResolve: mockMongodb
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.mongodbResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/mongodbs/create');
        }));

        it('should attach an Mongodb to the controller scope', function () {
          expect($scope.vm.mongodb._id).toBe(mockMongodb._id);
          expect($scope.vm.mongodb._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/mongodbs/client/views/form-mongodb.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MongodbsController,
          mockMongodb;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('mongodbs.edit');
          $templateCache.put('modules/mongodbs/client/views/form-mongodb.client.view.html', '');

          // create mock Mongodb
          mockMongodb = new MongodbsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Mongodb Name'
          });

          // Initialize Controller
          MongodbsController = $controller('MongodbsController as vm', {
            $scope: $scope,
            mongodbResolve: mockMongodb
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:mongodbId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.mongodbResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            mongodbId: 1
          })).toEqual('/mongodbs/1/edit');
        }));

        it('should attach an Mongodb to the controller scope', function () {
          expect($scope.vm.mongodb._id).toBe(mockMongodb._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/mongodbs/client/views/form-mongodb.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
