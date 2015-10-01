'use strict';

var app = angular.module('modules', [
        'ngRoute',
        'ngSanitize'
])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
       .when('/chat', {
           templateUrl: 'Modules/Chat/chatView.html',
           controller: 'ChatCtrl',
           controllerAs: 'CC'
       })
     .when('/login', {
         templateUrl: 'Modules/Login/loginView.html',
         controller: 'LoginCtrl',
         controllerAs: 'LC'
     })
    $routeProvider.otherwise({ redirectTo: '/login' });
}]);