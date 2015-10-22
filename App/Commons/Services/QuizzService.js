app.service('QuizzService', ['$q', 'SocketService', function($q, SocketService) {
	this.initQuizz = function(callback) {
		SocketService.emit('initQuizz', callback);
	};

	this.addQuestion = function(question) {
		SocketService.emit('addQuizzQuestion', question);
	};
}]);