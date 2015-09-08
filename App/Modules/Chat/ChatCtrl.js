app
    .controller('ChatCtrl', ['$location', '$scope', '$window', 'SocketService', function ($location, $scope, $window, socketService) {
        this.user = null;
        this.messages = [];
        this.listUsers = [];
        this.hasLostFocus = false;
        this.manualScroll = false;
        this.chatBox = null;
        this.hasLostFocus = false;

        //// Event touche enter////
        this.keyUp = function (event) {
            if (event.keyCode === 13) {
                this.sendMessage();
            }
        };

        ////Envoyer un message////
        this.sendMessage = function () {
            if (this.message) {
                socketService.socket.emit('sendMessage', this.message);
                this.message = null;
            }
        };
    
        ////initialisation des sockets////
        this.init = function () {
            var self = this;

            if (socketService.isInit && socketService.socket) {

                socketService.socket.on('information', function (user) {
                    self.user = user;
                    $scope.$apply();
                });

                socketService.socket.on('updatelstUser', function (listUsers) {
                    self.listUsers = listUsers;
                    $scope.$apply();
                });

                socketService.socket.on('history', function (history) {
                    self.messages = history.reverse();
                    $scope.$apply();
                });

                socketService.socket.on('newMessage', function (newMessage) {
                    if (newMessage) {
                        self.messages.push(newMessage);
                        $scope.$apply();
                    }
                });

                socketService.socket.emit('enter');

            } else {
                $location.path('/');
            }
        };

        this.init();
    }])
