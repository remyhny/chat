app
    .controller('ChatCtrl', ['$location', '$scope', '$window', 'SocketService', function ($location, $scope, $window, socketService) {
        this.login = null;
        this.messages = [];
        this.listUsers = [];
        this.socket = null;
        this.hasLostFocus = false;
        this.manualScroll = false;
        this.chatBox = null;
        this.endOfChat = null;
        this.hasLostFocus = false;


        //// gestion du scroll manuel ou automatique////
        $window.onblur = function () {
            this.hasLostFocus = true;
            this.manualScroll = true;
        };

        $window.onfocus = function () {
            this.hasLostFocus = false;
        };

        this.scrollToEndOfChat = function () {
            if (this.manualScroll || this.hasLostFocus) return;
            this.endOfChat.scrollIntoView(true);
        };

        //// Event touche enter////
        this.keyUp = function (event) {
            if (event.keyCode === 13) {
                this.sendMessage();
            }
        };


        ////Envoyer un message////
        this.sendMessage = function () {
            if (this.message) {
                this.socket.emit('sendMessage', this.message);
                this.message = null;
            }
        };
    
        ////initialisation des sockets////
        this.init = function () {
            var self = this;

            ///initialisation du scroll de la chatBox
            this.chatBox = document.getElementById('wrapperConvers');
            this.endOfChat = document.getElementById('endOfChat');
            this.chatBox.onscroll = function () {
                if (this.chatBox) {
                    if (this.chatBox.scrollTop >= this.chatBox.scrollHeight - this.chatBox.offsetHeight - 100) {
                        this.manualScroll = false;
                    } else {
                        if (!this.manualScroll) {
                            this.manualScroll = true;
                        }
                    }
                }
            };


            if (socketService.isInit) {
                this.socket = socketService.socket;
                this.socket.on('information', function (login) {
                    self.login = login;
                    $scope.$apply();
                });

                this.socket.on('updatelstUser', function (listUsers) {
                    self.listUsers = listUsers;
                    $scope.$apply();
                });

                this.socket.on('newMessage', function (newMessage) {
                    if (newMessage) {
                        self.messages.push(newMessage);
                        $scope.$apply();
                        self.scrollToEndOfChat();
                    }
                });

                this.socket.emit('enter');

            } else {
                $location.path('/');
            }
        };

        this.init();
    }])
