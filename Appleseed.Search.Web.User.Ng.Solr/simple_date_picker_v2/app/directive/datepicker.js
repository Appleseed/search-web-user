define(['app', 'directive/datepickerCtrl'], function (app) {
    app.directive('datepicker', function () {
        return {
            restrict: 'A',
            controller: 'datepickerCtrl',
            controllerAs: 'dp',
            templateUrl: 'app/directive/datepicker.html',
            scope: {
                'value': '='
            },
            link: function (scope, element, attribute) {
            }
        };
    });
});