require(
    [
        'app',
        'directive/datepicker',
        'indexCtrl'

    ],
    function (app) {
        app.config([
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',
        function (
            	$controllerProvider,
            	$compileProvider, $filterProvider, $provide
            	) {
            app.register = {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service,
                constant: $provide.constant
            };
          
        }
    ]);
        angular.bootstrap(document, ['testApp']);
    });
