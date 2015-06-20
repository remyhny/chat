app
    .controller('ChatCtrl', ['$location', '$scope', 'SocketService', function ($location, $scope, socketService) {
        this.login = null;
        this.messages = [];
        var socket = null;

        this.keyup = function (event) {
            if (event.keyCode === 13) {
                this.sendMessage();
            }
        };

        this.sendMessage = function () {
            if (this.message) {
                socket.emit('sendMessage', this.message);
            }
        };
    
        this.init = function () {
            var self = this;
            if (socketService.isInit) {
                socket = socketService.socket;
                socket.on('information', function (login) {
                    self.login = login;
                    $scope.$apply();
                });

                socket.on('newMessage', function (newMessage) {
                    if (newMessage) {
                        self.messages.push(newMessage);
                        $scope.$apply();
                    }
                });

                socket.emit('enter');

            } else {
                $location.path('/');
            }
        };

        this.init();
    }])
