app
    .controller('ChatCtrl', ['$location', '$scope', '$window', 'SocketService', function ($location, $scope, $window, socketService) {
        this.user = null;
        this.messages = [];
        this.listUsers = [];
        this.hasLostFocus = false;
        this.manualScroll = false;
        this.chatBox = null;
        this.hasLostFocus = false;
        this.isHistory = false;
        this.nbMessages = 0;
        this.watchMessages = null;
        this.isConfig = true;


        document.title = 'Chat';
        var self = this;

        this.onblur = function () {
            self.watchMessages = $scope.$watch('CC.messages.length', function (value) {
                self.nbMessages++;
                document.title = 'Chat - ' + self.nbMessages + ' nouveau(x) messages';
            });
        };

        this.onfocus = function () {
            self.nbMessages = 0;
            if (typeof self.watchMessages === 'function') {
                self.watchMessages();
            }
            document.title = 'Chat';
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
                socketService.emit('sendMessage', this.message);
                this.message = null;
            }
        };

        ////initialisation des sockets////
        this.init = function () {
            var self = this;

            if (socketService.isInit && socketService.socket) {

                socketService.addListener('information', 'chat', function (user) {
                    self.user = user;
         
                    //var configCanvas = document.getElementById('configCanvas');
                    //var context = configCanvas.getContext('2d');
                    //console.log(user.img);
                    //var imageObj = new Image();
                    //imageObj.onload = function () {
                    //    context.drawImage(this, 0, 0);
                    //};
                    //imageObj.src = user.img;

                    $scope.$apply();
                })

                socketService.addListener('updatelstUser', 'chat', function (listUsers) {
                    self.listUsers = listUsers;
                    $scope.$apply();
                })

                socketService.addListener('history', 'chat', function (history) {
                    self.isHistory = true;
                    if (history) {
                        self.messages = history.reverse();
                    }
                    $scope.$apply();
                })

                socketService.addListener('newMessage', 'chat', function (newMessage) {
                    if (newMessage) {
                        self.messages.push(newMessage);
                        $scope.$apply();
                    }
                })

                socketService.emit('enter');

            } else {
                $location.path('/');
            }
        };

        this.init();

        $scope.$on('$destroy', function () {

        });
    }])
