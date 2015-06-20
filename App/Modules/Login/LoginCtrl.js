app
    .controller('LoginCtrl', ['$location', 'SocketService', function ($location, socketService) {
        socketService.initSocket();
        var socket = socketService.socket;
        this.connection = function () {
            socket.emit('login', this.login);
            $location.path('chat');
        };
    }])
