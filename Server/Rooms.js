﻿var Users = require('./Users.js');

function Room(io, path) {
    this.io = io;
    this.path = path;
    this.count = 0;
    this.lstUsers = {};
    this.lstLogin = [];

    this.init = function () {
        console.log('init');
        var self = this;
        this.io
            .of('/' + this.path)
            .on('connection', function (socket) {
                console.log('connection');
                var user;

                socket.on('login', function (login) {
                    if (!user) {
                        user = new Users(login, socket, self.count);
                        self.lstUsers[self.count] = user;
                        self.count++;
                    } else {
                        user.login = login;
                    }
                    console.log('login : ', user.login);
                    self.updateListLogin();
                });

                socket.on('enter', function () {
                    if(user){
                        self.sendInformation(user);
                        self.sendEvent('updatelstUser', self.lstLogin);
                    }
                });

                socket.on('sendMessage', function (message) {
                    if(user){
                        msg = {
                            from: user.login,
                            img : user.img,
                            text: message
                        };
                        self.sendEvent('newMessage', msg);
                    }
                });

                socket.on('disconnect', function () {
                    console.log('disconnect : ' + user.login);
                    if (user && self.lstUsers[user.index]) {
                        delete self.lstUsers[user.index];
                        delete user;
                    }
                    self.updateListLogin();
                    self.sendEvent('updatelstUser', self.lstLogin);
                });
            });
    };

    this.updateListLogin = function () {
        this.lstLogin = [];
        for (i in this.lstUsers) {
            this.lstLogin.push(this.lstUsers[i].login);
        }
    }

    this.sendInformation = function (user) {
        user.socket.emit('information', {login : user.login, img : user.img});
    }

    this.sendEvent = function (type, message) {
        for (i in this.lstUsers) {
            this.lstUsers[i].socket.emit(type, message);
        }
    }
}

module.exports = Room;