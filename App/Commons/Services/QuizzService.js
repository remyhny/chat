app.service('QuizzService', ['$q', 'SocketService', function($q, SocketService) {
	this.initQuizz = function() {
		SocketService.emit('initQuizz');
	};
}]);