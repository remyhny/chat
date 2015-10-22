app.directive('quizzPanel', function () {
	return {
        restrict: 'E',
        scope: {
        	user: '=',
            showPanel: '='
        },
        templateUrl: '/Components/quizz/quizzView.html',
        controller: ['$scope', 'QuizzService', function($scope, quizzService) {
            $scope.defaultQuizzConfig = {
                numberOfQuestions: 5,
                questionInterval: 5,
                answerDelay: 10
            };

            $scope.quizzConfig = null;
            $scope.question = null;
            $scope.response = null;

            var feedback = function(success, message) {
                if(success) {
                    $scope.showPanel = false;
                }
                else {
                    alert(message);
                }
            };

            $scope.launchQuizz = function(quizzForm) {
                if(quizzForm && quizzForm.$valid && $scope.quizzConfig) {
                    quizzService.initQuizz(feedback);
                }                
            };

            $scope.resetQuizzForm = function () {
                $scope.quizzConfig = angular.copy($scope.defaultQuizzConfig);
            };

            $scope.resetQuestionForm = function () {
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
                    $scope.resetQuestionForm();
                }
            };

            $scope.resetQuizzForm();
        }]
    };
});