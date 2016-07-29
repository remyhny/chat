"use strict";
var Html5Entities = require('html-entities').Html5Entities;

class Quizz {
    constructor(room, mongo) {
        this.isInit = false;
        this.numberOfQuestions = 5;
        this.listOfQuestions = [];
        this.room = room;
        this.questionInterval = 5000;
        this.answerDelay = 10000;
        this.currentQuestion = null;
        this.questionDelayTimeoutId = null;
        this.mongo = mongo;
        this.entities = new Html5Entities();
    }

    formatQuestion(question) {
        return "Question: " + question.label;
    };

    formatResponse(question, user) {
        var response = "";

        if (user) {
            response = "Good job " + user + "! ";
        }

        return response + "The good answer was: " + question.response;
    };

    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    checkResponse(message, user) {
        if (message.toLowerCase() === this.currentQuestion.response.toLowerCase()) {
            clearTimeout(this.questionDelayTimeoutId);
            this.displayResponse(this.currentQuestion, user);
        }
    };

    displayResponse(question, user) {
        var msg = {
            from: "Quizz",
            text: this.formatResponse(question, user),
            date: new Date().toTimeString().split(' ')[0],
            IA: true
        };

        this.room.sendEvent('newMessage', msg);
        this.removeQuestion();
        this.currentQuestion = null;

        if (this.listOfQuestions.length) {
            this.startQuestion(this.questionInterval);
        } else {
            this.endQuizz();
        }
    };

    displayQuestion(question) {
        var self = this;
        var msg = {
            from: "Quizz",
            text: this.formatQuestion(question),
            date: new Date().toTimeString().split(' ')[0],
            IA: true
        };

        this.room.sendEvent('newMessage', msg);
        this.currentQuestion = question;
        this.questionDelayTimeoutId = setTimeout(this.displayResponse.bind(self), this.answerDelay, question);
    };

    startQuestion(delay) {
        var self = this;
        var msg = {
            from: "Quizz",
            text: "Get ready! Next question in " + delay / 1000 + " seconds. " + this.listOfQuestions.length + " question(s) left.",
            date: new Date().toTimeString().split(' ')[0],
            IA: true
        };

        this.room.sendEvent('newMessage', msg);
        setTimeout(this.displayQuestion.bind(self), delay, this.listOfQuestions[0]);
    };

    addQuestion(question) {
        this.listOfQuestions.push(question);
    };

    removeQuestion() {
        this.listOfQuestions.shift();
    };

    runQuizz() {
        this.startQuestion(this.questionInterval);
    };

    endQuizz() {
        var msg = {
            from: "Quizz",
            text: "End of quizz.",
            date: new Date().toTimeString().split(' ')[0],
            IA: true
        };

        this.room.sendEvent('newMessage', msg);
        this.isInit = false;
        this.currentQuestion = null;
    };

    getQuestions(opts, socket) {
        this.mongo.find('questions', 'schemaQuestion').then(function (data) {
            socket.emit('getQuestions', data);
        });
    }

    initQuizz(options) {
        var self = this;
        var prom = new Promise(function (resolve, reject) {
            self.mongo.find('questions', 'schemaQuestion').then(function (data) {

                if (data && data.length) {
                    var listOfId = [];

                    self.numberOfQuestions = options.numberOfQuestions * 1000;
                    self.questionInterval = options.questionInterval * 1000;
                    self.answerDelay = options.answerDelay * 1000;
                    if (data.length < self.numberOfQuestions) {
                        self.numberOfQuestions = data.length;
                    }
                    while (self.listOfQuestions.length < self.numberOfQuestions) {
                        var random = self.getRandom(0, data.length - 1);
                        if (listOfId.indexOf(random) === -1) {
                            listOfId.push(random);
                            self.addQuestion(data[random]);
                        }
                    }
                    self.isInit = true;
                    resolve(true);
                } else {
                    var msg = {
                        from: "Quizz",
                        text: "There is no question in database. Please add questions before launching a quizz.",
                        date: new Date().toTimeString().split(' ')[0],
                        IA: true
                    };

                    self.room.sendEvent('newMessage', msg);
                }
            });
        });
        return prom;
    };

    launchQuizz(options) {
        var msg = {
            from: "System",
            text: "",
            date: "",
            IA : true
        };
        var self = this;

        if (self.isInit) {
            msg.text = "Omg " + options.pseudo + "! There is already a quizz in progress, noob!";
            msg.date = new Date().toTimeString().split(' ')[0];

            self.room.sendEvent('newMessage', msg);
        } else {
            self.initQuizz(options).then(function () {
                msg.text = options.pseudo + " has started a quizz.";
                msg.date = new Date().toTimeString().split(' ')[0];
                self.room.sendEvent('newMessage', msg);
                self.runQuizz();
            });
        }
    };

    addQuizzQuestion(question) {
        var self = this;
        var mongoOpts = {
            limit: 1,
            reverse: true
        };
        self.mongo.find('questions', 'schemaQuestion', mongoOpts).then(function (data) {
            var response = self.entities.encode(question.response);
            var newQuestion = {
                id: 1,
                label: question.label,
                response: response,
                author: question.author
            }
            if (data && data.length) {
                var lastQuestion = data[data.length - 1];

                if (lastQuestion) {
                    newQuestion.id = lastQuestion.id + 1;
                }
            }
            self.mongo.add(newQuestion, 'questions', 'schemaQuestion');
        });
    };

    checkResponseUser(response) {
        if (this.isInit && this.currentQuestion && response.text) {
            this.checkResponse(response.text, response.pseudo);
        }
    }
}

module.exports = Quizz;