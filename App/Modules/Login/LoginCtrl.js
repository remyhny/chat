app
    .controller('LoginCtrl', ['$location', 'SocketService', function ($location, socketService) {
        socketService.initSocket();
        var socket = socketService.socket;
        this.connection = function () {
            if (this.login.length > 0) {
                socket.emit('login', this.login);
                $location.path('chat');
            }
        };
    }])
