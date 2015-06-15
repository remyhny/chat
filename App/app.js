'use strict';

var app = angular.module('chat', [
        'ngRoute'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'Modules/Login/loginView.html',
            controller: 'LoginCtrl'
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }]);