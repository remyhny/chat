var Mongo = require('./MongoDb.js');

function Quizz(room, mongo) {
	this.isInit = false;
	this.listOfQuestions = [];
	this.room = room;
	this.questionInterval = 5000;
	this.answerDelay = 10000;
	this.currentQuestion = null;
	this.questionDelayTimeoutId = null;	
    var mongo = mongo;

	var self = this;

	var formatQuestion = function(question) {
		return "Question: " + question.label;
	};

	var formatResponse = function(question, user) {
		var response = "";

		if(user) {
			response = "Good job " + user.login + "! ";
		}

		return response + "The good answer was: " + question.response;
	};

	this.checkResponse = function(message, user) {
		if(message.toLowerCase() === self.currentQuestion.response.toLowerCase()) {
			clearTimeout(self.questionDelayTimeoutId);
			self.displayResponse(self.currentQuestion, user);
		}
	};

	this.displayResponse = function(question, user) {
		var msg = {
            from: "Quizz",
            text: formatResponse(question, user),
            date: new Date().toTimeString().split(' ')[0]
        };

        self.room.sendEvent('newMessage', msg);
        self.removeQuestion();
        self.currentQuestion = null;

        if(self.listOfQuestions.length) {
			self.startQuestion(self.questionInterval);
        } else {
        	self.endQuizz();
        }
	};

	this.displayQuestion = function(question) {
		var msg = {
            from: "Quizz",
            text: formatQuestion(question),
            date: new Date().toTimeString().split(' ')[0]
        };

        self.room.sendEvent('newMessage', msg);
		self.currentQuestion = question;
        self.questionDelayTimeoutId = setTimeout(self.displayResponse, self.answerDelay, question);
	};

	this.startQuestion = function(delay) {
		var msg = {
            from: "Quizz",
            text: "Get ready! Next question in " + delay / 1000 + " seconds.",
            date: new Date().toTimeString().split(' ')[0]
        };

		self.room.sendEvent('newMessage', msg);
		setTimeout(self.displayQuestion, delay, self.listOfQuestions[0]);
	};

	this.addQuestion = function(question) {
		self.listOfQuestions.push(question);
	};

	this.removeQuestion = function() {
		self.listOfQuestions.shift();
	};

	this.runQuizz = function() {
		self.startQuestion(self.questionInterval);
	};

	this.endQuizz = function () {
		var msg = {
            from: "Quizz",
            text: "End of quizz.",
            date: new Date().toTimeString().split(' ')[0]
        };

		self.room.sendEvent('newMessage', msg);
		self.room.quizz = null;
		self.currentQuestion = null;
	};

	this.initQuizz = function() {
		// var q1 = {
  //   		id: 1,
		// 	author: "Papachou",
		// 	label: "Who is not in the pit?",
		// 	response: "Mamanchou"
		// };

		// mongo.add(q1, 'questions', 'schemaQuestion');

	    var prom = new Promise(function (resolve, reject) {
	    	// Fetch questions from database
	        mongo.find('questions', 'schemaQuestion').then(function (data) {
	        	if(data && data.length) {	        		
					self.addQuestion(data[0]);
					self.addQuestion(data[1]);

			    	self.isInit = true;
			        resolve(true);
	        	}
	        });
	    });
	    return prom;
	};
}

module.exports = Quizz;