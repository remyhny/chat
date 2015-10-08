function Quizz() {
	this.isInit = false;
	this.listOfQuestions = [];
	// this.currentQuestion = {
	// 	id: 1,
	// 	label: "Who is in the pit ?",
	// 	response: "Papachou"
	// };

	// this.checkResponse = function (response) {
	// 	var self = this;
	// 	var prom = new Promise(function (resolve, reject) {
	//         resolve(true);
	// 	});
	//     return prom;
	// };

	this.addQuestion = function(question) {
		var self = this;
		self.listOfQuestions.push(question);
	};

	this.initQuizz = function() {
	 	var self = this;
	    var prom = new Promise(function (resolve, reject) {
	    	self.addQuestion({
				id: 1,
				label: "Who is in the pit ?",
				response: "Papachou"
			});

	    	self.isInit = true;
	        resolve(true);
	    });
	    return prom;
	};
}

module.exports = Quizz;