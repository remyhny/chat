app.service('QuizzService', ['$q', 'SocketService', function($q, SocketService) {
	this.initQuizz = function(options) {
		SocketService.emit('initQuizz', options);
	};

	this.addQuestion = function(question) {
		SocketService.emit('addQuizzQuestion', question);
	};
}]);