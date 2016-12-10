define(['app'], function(app) {
    app.controller('indexCtrl',  function ($scope) {
        $scope.fdate = "2016-03-17T00:00:00";
        $scope.$watch('fdate', function (oldVal, newVal) {
            console.log("fdate: " + $scope.fdate);
        });
    });
});