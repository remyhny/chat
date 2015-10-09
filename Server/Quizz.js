function Quizz(room) {
	this.isInit = false;
	this.listOfQuestions = [];
	this.room = room;
	this.questionInterval = 10000;
	this.answerDelay = 10000;
	this.questionDelayTimeoutId = null;

	var formatQuestion = function(question) {
		return "Question: " + question.label;
	};

	var formatResponse = function(question) {
		return "The good answer was: " + question.response;
	};

	this.displayResponse = function(question, quizz, user) {
		var msg = {
            from: "Quizz",
            text: formatResponse(question),
            date: new Date().toTimeString().split(' ')[0]
        };

        quizz.room.sendEvent('newMessage', msg);
        quizz.removeQuestion();

        if(quizz.listOfQuestions.length) {
			quizz.startQuestion(quizz.questionInterval);
        } else {
        	quizz.endQuizz();
        }
	};

	this.displayQuestion = function(question, quizz) {
		var msg = {
            from: "Quizz",
            text: formatQuestion(question),
            date: new Date().toTimeString().split(' ')[0]
        };

        quizz.room.sendEvent('newMessage', msg);
        quizz.questionDelayTimeoutId = setTimeout(quizz.displayResponse, quizz.answerDelay, question, quizz);
	};

	this.startQuestion = function(delay) {
		var msg = {
            from: "Quizz",
            text: "Get ready! Next question in " + delay / 1000 + " seconds.",
            date: new Date().toTimeString().split(' ')[0]
        };

		this.room.sendEvent('newMessage', msg);
		setTimeout(this.displayQuestion, delay, this.listOfQuestions[0], this);
	};

	this.addQuestion = function(question) {
		this.listOfQuestions.push(question);
	};

	this.removeQuestion = function() {
		this.listOfQuestions.shift();
	};

	this.runQuizz = function() {
		this.startQuestion(this.questionInterval);
	};

	this.endQuizz = function () {
		var msg = {
            from: "Quizz",
            text: "End of quizz.",
            date: new Date().toTimeString().split(' ')[0]
        };

		this.room.sendEvent('newMessage', msg);
		this.room.quizz = null;
	};

	this.initQuizz = function() {
	 	var self = this;
	    var prom = new Promise(function (resolve, reject) {
	    	// Fetch questions from database
	    	self.addQuestion({
				id: 1,
				label: "Who is in the pit ?",
				response: "Papachou"
			});
			self.addQuestion({
				id: 2,
				label: "Who is not in the pit ?",
				response: "Mamanchou"
			});

	    	self.isInit = true;
	        resolve(true);
	    });
	    return prom;
	};
}

module.exports = Quizz;