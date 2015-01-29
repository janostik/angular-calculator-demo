'use strict';

// Declare app level module which depends on views, and components
angular.module('calcApp', [
    'ngRoute',
    'ui.bootstrap',
    'calcApp.calc',
    'calcApp.history',
    'calcApp.historyService',
    'calcApp.version'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/calc'});
    }]);
