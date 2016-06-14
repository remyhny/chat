app
    .controller('LoginCtrl', ['$scope', '$location', 'SocketService', function ($scope, $location, socketService) {
        var self = this;
        this.status = socketService.status;

        this.connection = function () {
            if (this.login.length > 0) {
                if (socketService.status != enumStatus.connected) {
                    this.status = enumStatus.connecting;
                    socketService.initSocket().then(this.isConnected, this.isError);
                }
                else if (socketService.status == enumStatus.connected) {
                    socketService.emit('login', self.login);
                }
            }
        };

        this.isConnected = function (status) {
            this.status = status;
            socketService.addListener('auth', 'login', function () {
                $location.path('chat');
                $scope.$apply();
            });
            socketService.emit('login', self.login);
        };

        this.isError = function(status){
            self.status = status;
        };

    }]);
