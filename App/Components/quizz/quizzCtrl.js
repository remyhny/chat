"use strict";

app.controller('QuizzCtrl', ['QuizzService', function (QuizzService) {

    this.quizzService = QuizzService;
    this.defaultQuizzConfig = {
        numberOfQuestions: 5,
        questionInterval: 5,
        answerDelay: 10,
    };

    this.quizzConfig = null;
    this.question = null;
    this.response = null;

    this.launchQuizz = function () {
        this.quizzConfig.pseudo = this.user;
        this.quizzService.initQuizz(this.quizzConfig);
    };

    this.resetQuizzForm = function () {
        this.quizzConfig = angular.copy(this.defaultQuizzConfig);
    };

    this.resetQuestionForm = function () {
        this.question = null;
        this.response = null;
    };

    this.addQuestion = function () {
        if (this.question && this.response) {
            var question = {
                label: this.question,
                response: this.response,
                author: this.user.login
            };

            this.quizzService.addQuestion(question);
            this.resetQuestionForm();
        }
    };

    this.resetQuizzForm();

    this.init = function (user) {
        this.user = user.login;
    };
}])
