define(['app'], function (app) {
    app.controller('datepickerCtrl', function ($scope) {        
        $('.date').datepicker({ autoclose: true, todayHighlight: true });
        var inputDate = new Date(moment($scope.value));
        $scope.value = moment(inputDate).format("MM-DD-YYYY");
        $('.date').datepicker('setDate', inputDate);
        $scope.$watch('value', function (newVal) {                  
        });
    });
});