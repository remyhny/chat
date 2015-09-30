app
    .controller('LoginCtrl', ['$scope', '$location', 'SocketService', function ($scope, $location, socketService) {
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
                        socketService.addListener('auth', 'login', function () {
                            console.log('auth');
                            $location.path('chat');
                            $scope.$apply();
                        })
                        socketService.emit('login', self.login);
                    });
                }
                else if (socketService.socket && socketService.socket.connected) {
                    socketService.emit('login', self.login);
                }
            }
        };
    }])
