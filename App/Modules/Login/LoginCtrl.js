app
    .controller('LoginCtrl', ['$location', 'SocketService', function ($location, socketService) {
        this.isDisconnect = false;
        this.socketService = socketService;
        if (!socketService.socket && socketService.isInit) {
            this.isDisconnect = true;
        }
        this.connection = function () {
            var self = this;
            if (this.login.length > 0) {
                if (!socketService.socket || (socketService.socket && !socketService.socket.connected)) {
                    socketService.initSocket().then(function () {
                        socketService.socket.emit('login', self.login);
                        $location.path('chat');
                    });
                }
                else if (socketService.socket && socketService.socket.connected) {
                    socketService.socket.emit('login', self.login);
                    $location.path('chat');
                }
            }
        };
    }])
