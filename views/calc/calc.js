'use strict';

angular.module('calcApp.calc', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/calc', {
            templateUrl: 'views/calc/calc.html',
            controller: 'CalcCtrl'
        });
    }])

    .controller('CalcCtrl', ['$scope', 'historyService', '$modal', '$window',function ($scope, historyService, $modal, $window) {
        $scope.expression = "0";
        var finished = true;

        //Vertical button group not scaling when small screen. Function used for conditional ng-class.
        $scope.getWidth = function() {
            return $window.innerWidth;
        };

        $scope.isExpressionValid = function () {
            return /^([-]?[0-9]*\.?[0-9]+[\/\+\-\*])+([0-9]*\.?[0-9]+)$/.test($scope.expression);
        };

        $scope.isNumberLast = function() {
            return /[0-9]+$/.test($scope.expression);
        };

        $scope.isStart = function() {
            return finished;
        }

        $scope.containsDelimiter = function () {
            //Contains delimiter or ends with +|/|-|*
            return /([0-9]+\.[0-9]*)$/.test($scope.expression) || /[\/\+\-\*]$/.test($scope.expression);
        };

        $scope.pressed = function (key) {
            if(finished) $scope.expression = "0";
            if($scope.expression === "0" && key !== ".") {
                $scope.expression = "";
            }
            $scope.expression += key;
            finished = false;
        };

        $scope.clear = function () {
            if(finished) return;
            historyService.push({exp: $scope.expression, success: false });
            $scope.expression = "0";
            finished = true;
        };

        $scope.eval = function() {
            var result = eval($scope.expression);
            historyService.push({exp: $scope.expression, success: true, result: result });
            $scope.expression = result;
            finished = true;
        };

        //Modal window
        $scope.showHistory = function () {

            var modalInstance = $modal.open({
                templateUrl: 'views/history/history.html',
                controller: 'HistoryCtrl',
                size: 'lg',
                resolve: {
                    history: function () {
                        return historyService.list();
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

    }]);