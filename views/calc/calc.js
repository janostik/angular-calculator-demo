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
        $scope.trace = "";
        var buffer = null;
        var action = null;
        var finished = true;

        //Vertical button group not scaling when small screen. Function used for conditional ng-class.
        $scope.getWidth = function() {
            return $window.innerWidth;
        };

        $scope.getAction = function() {
            return action;
        };

        $scope.isExpressionValid = function () {
            //return /^([-]?[0-9]*\.?[0-9]+[\/\+\-\*])+([0-9]*\.?[0-9]+)$/.test($scope.expression);
            return buffer !== null && action !== null && $scope.expression.length > 0;
        };

        $scope.isNumberLast = function() {
            return /[0-9]+$/.test($scope.expression);
        };

        $scope.isStart = function() {
            return finished;
        };

        $scope.containsDelimiter = function () {
            //Contains delimiter or ends with +|/|-|*
            return /([0-9]+\.[0-9]*)$/.test($scope.expression) || /[\/\+\-\*]$/.test($scope.expression);
        };

        $scope.pressed = function (key) {
            if(finished) $scope.expression = "0";
            if($scope.expression === "0" && key !== ".") {
                $scope.expression = "";
            }
            if(!/[0-9\.]/.test(key) && !finished) {
                processAction();
                action = key;
                finished = true;
            } else {
                $scope.expression += key;
                finished = false;
            }
            $scope.trace += key;
        };

        function processAction() {
            if(buffer !== null && action !== null) {
                buffer = parseFloat(buffer);
                switch (action) {
                    case "+": buffer += parseFloat($scope.expression); break;
                    case "-": buffer -= parseFloat($scope.expression); break;
                    case "*": buffer *= parseFloat($scope.expression); break;
                    case "/": buffer /= parseFloat($scope.expression); break;
                }
                $scope.expression = buffer;
            } else {
                buffer = $scope.expression;
            }
        }

        $scope.clear = function () {
            if($scope.trace.length > 0) {
                historyService.push({exp: $scope.trace, success: false });
            }
            $scope.expression = "0";
            reset();
        };

        $scope.eval = function() {
            processAction();
            historyService.push({exp: $scope.trace, success: true, result: buffer });
            $scope.expression = buffer;
            reset();
        };

        function reset() {
            buffer = null;
            action = null;
            $scope.trace = "";
            finished = true;
        }

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