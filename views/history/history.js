'use strict';

angular.module('calcApp.history', [])
    .controller('HistoryCtrl', ['$scope','$modalInstance', 'history', 'historyService', function ($scope, $modalInstance, history, historyService) {

        $scope.history = history;

        $scope.close = function () {
            $modalInstance.close();
        };

        $scope.clear = function () {
            historyService.clear();
            $scope.history = [];
        };
    }]);