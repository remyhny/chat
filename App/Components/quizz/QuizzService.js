app.service('QuizzService', ['SocketService', function (SocketService) {
    this.initQuizz = function (options) {
        var plugin = {
            label: 'quizz',
            method: 'launchQuizz',
            opts: options
        };
        SocketService.emit('plugin', plugin);
    };

    this.addQuestion = function (question) {
        var plugin = {
            label: 'quizz',
            method: 'addQuizzQuestion',
            opts: question
        };
        SocketService.emit('plugin', plugin);
    };

    this.getQuestions = function(){
        var plugin = {
            label : 'quizz',
            method: 'getQuestions',
            opts : null
        }

        SocketService.emit('plugin', plugin);
    }

    SocketService.addListener('newMessage', 'quizz', function (message) {
        if (!message.IA) {
            var plugin = {
                label: 'quizz',
                method: 'checkResponseUser',
                opts: {
                    pseudo: message.from,
                    text: message.text.toString()
                }
            };
            SocketService.emit('plugin', plugin);
        }
    });

    SocketService.addListener('getQuestions', 'quizz', function (questions) {
        console.log(questions);
    });
}]);