﻿app
    .controller('ChatCtrl', ['$location', '$scope', '$window', 'SocketService', 'EmoticonService', function ($location, $scope, $window, socketService, EmoticonService) {
        this.user = null;
        this.message = null;
        this.messages = [];
        this.listUsers = [];
        this.hasLostFocus = false;
        this.manualScroll = false;
        this.chatBox = null;
        this.hasLostFocus = false;
        this.isHistory = false;
        this.nbMessages = 0;
        this.watchMessages = null;
        this.showPanel = false;
        this.emoticonService = EmoticonService;

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
        this.keyDown = function (event) {
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

            if (socketService.status == enumStatus.connected) {

                socketService.addListener('information', 'chat', function (user) {
                    self.user = user;
                    $scope.$apply();
                });

                socketService.addListener('updatelstUser', 'chat', function (listUsers) {
                    self.listUsers = listUsers;
                    $scope.$apply();
                });

                socketService.addListener('history', 'chat', function (history) {
                    self.isHistory = true;
                    if (history) {
                        self.messages = history.reverse();
                        for (var i = 0, l = self.messages.length; i < l; i++) {
                            self.messages[i].text = self.emoticonService.searchEmoticon(self.messages[i].text);
                        }
                    }
                    $scope.$apply();
                });

                socketService.addListener('newMessage', 'chat', function (newMessage) {
                    if (newMessage) {
                        newMessage.text = self.emoticonService.searchEmoticon(newMessage.text);
                        self.messages.push(newMessage);
                        $scope.$apply();
                    }
                });

                socketService.emit('enter');

            } else {
                $location.path('/');
            }
        };

        this.init();

        $scope.$on('$destroy', function () {
            if (typeof self.watchMessages === 'function') {
                self.watchMessages();
            }
        });
    }]);
