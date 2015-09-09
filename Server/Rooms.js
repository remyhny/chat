﻿var Users = require('./Users.js');
var Mongo = require('./MongoDb.js');


function Room(io, path) {
    this.io = io;
    this.path = path;
    this.count = 0;
    this.lstUsers = {};
    this.lstLogin = [];

    this.init = function () {
        console.log('init');
        var mongo = new Mongo('chat');
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
                    if (user) {
                        if (user.firstEnter) {
                            mongo.find().then(function (data) {
                                user.socket.emit('history', data);
                                user.firstEnter = false;
                            });
                        }
                        self.sendInformation(user);
                        self.sendEvent('updatelstUser', self.lstLogin);

                    }
                });

                socket.on('sendMessage', function (message) {
                    if (user) {
                        msg = {
                            from: user.login,
                            img: user.img,
                            color: user.color,
                            text: message,
                            date: new Date().toLocaleString()
                        };
                        mongo.add(msg);
                        self.sendEvent('newMessage', msg);
                    }
                });

                socket.on('disconnect', function () {
                    if (user && self.lstUsers[user.index]) {
                        console.log('disconnect : ' + user.login);
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
            this.lstLogin.push({
                login: this.lstUsers[i].login,
                img: this.lstUsers[i].img
            });
        }
    }

    this.sendInformation = function (user) {
        user.socket.emit('information', { login: user.login, img: user.img });
    }

    this.sendEvent = function (type, message) {
        for (i in this.lstUsers) {
            this.lstUsers[i].socket.emit(type, message);
        }
    }
}

module.exports = Room;
