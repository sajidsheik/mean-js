(function () {
  'use strict';

  describe('Nodes Route Tests', function () {
    // Initialize global variables
    var $scope,
      NodesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _NodesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      NodesService = _NodesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('nodes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/nodes');
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
          NodesController,
          mockNode;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('nodes.view');
          $templateCache.put('modules/nodes/client/views/view-node.client.view.html', '');

          // create mock Node
          mockNode = new NodesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Node Name'
          });

          // Initialize Controller
          NodesController = $controller('NodesController as vm', {
            $scope: $scope,
            nodeResolve: mockNode
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:nodeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.nodeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            nodeId: 1
          })).toEqual('/nodes/1');
        }));

        it('should attach an Node to the controller scope', function () {
          expect($scope.vm.node._id).toBe(mockNode._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/nodes/client/views/view-node.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          NodesController,
          mockNode;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('nodes.create');
          $templateCache.put('modules/nodes/client/views/form-node.client.view.html', '');

          // create mock Node
          mockNode = new NodesService();

          // Initialize Controller
          NodesController = $controller('NodesController as vm', {
            $scope: $scope,
            nodeResolve: mockNode
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.nodeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/nodes/create');
        }));

        it('should attach an Node to the controller scope', function () {
          expect($scope.vm.node._id).toBe(mockNode._id);
          expect($scope.vm.node._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/nodes/client/views/form-node.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          NodesController,
          mockNode;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('nodes.edit');
          $templateCache.put('modules/nodes/client/views/form-node.client.view.html', '');

          // create mock Node
          mockNode = new NodesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Node Name'
          });

          // Initialize Controller
          NodesController = $controller('NodesController as vm', {
            $scope: $scope,
            nodeResolve: mockNode
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:nodeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.nodeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            nodeId: 1
          })).toEqual('/nodes/1/edit');
        }));

        it('should attach an Node to the controller scope', function () {
          expect($scope.vm.node._id).toBe(mockNode._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/nodes/client/views/form-node.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
