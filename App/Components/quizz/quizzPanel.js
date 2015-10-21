app.directive('quizzPanel', function () {
	return {
        restrict: 'E',
        scope: {
        	user: '=',
            showPanel: '='
        },
        templateUrl: '/Components/quizz/quizzView.html',
        controller: ['$scope', 'QuizzService', function($scope, quizzService) {
            $scope.question = null;
            $scope.response = null;

            $scope.launchQuizz = function() {
                quizzService.initQuizz();
                $scope.showPanel = false;
            };

            $scope.reset = function () {
                $scope.question = null;
                $scope.response = null;
            };

            $scope.addQuestion = function () {
                if($scope.question && $scope.response) {
                    var question = {
                        label: $scope.question,
                        response: $scope.response,
                        author: $scope.user.login
                    };

                    quizzService.addQuestion(question);
                    $scope.reset();
                }
            };
        }]
    };
});