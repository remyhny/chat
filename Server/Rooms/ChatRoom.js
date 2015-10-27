"use strict";

var BaseRooms = require('./BaseRooms');
var Html5Entities = require('html-entities').Html5Entities;
var Users = require('../Users.js');

class ChatRoom extends BaseRooms {
    constructor(SocketIo, path) {
        super(SocketIo, path);
        this.lstUsers = {};
        this.lstLogin = [];
        this.count = 0;
        this.entities = new Html5Entities();
    }

    updateListLogin() {
        this.lstLogin = [];
        for (var i in this.lstUsers) {
            this.lstLogin.push({
                login: this.lstUsers[i].login,
                img: this.lstUsers[i].img
            });
        }
    };

    eventSocket(socket) {
        var user;
        var self = this;
        socket.on('login', function (login) {
            var updateList = function () {
                var msg = {
                    from: "System",
                    text: user.login + " joined the chat.",
                    date: new Date().toTimeString().split(' ')[0]
                };
                self.sendEvent('newMessage', msg);
                self.updateListLogin();
                self.sendAuth(user);
            }

            if (!user) {
                user = new Users(login, socket, self.count, self.mongo);
                user.initUser().then(function () {
                    self.lstUsers[self.count] = user;
                    self.count++;
                    updateList();
                });
            } else {
                user.login = login;
                user.initUser().then(function () {
                    updateList();
                });
            }
        });



        socket.on('enter', function () {
            if (user) {
                if (user.firstEnter) {
                    self.mongo.find('messages', 'schemaMessage').then(function (data) {
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
                var msg = {
                    from: user.login,
                    img: user.img,
                    color: user.color,
                    text: self.entities.encode(message),
                    date: new Date().toTimeString().split(' ')[0]
                };
                self.mongo.add(msg, 'messages', 'schemaMessage');
                self.sendEvent('newMessage', msg);
            }
        });

        socket.on('disconnect', function () {
            if (user && self.lstUsers[user.index]) {
                var msg = {
                    from: "System",
                    text: user.login + " quit the chat.",
                    date: new Date().toTimeString().split(' ')[0]
                };

                self.sendEvent('newMessage', msg);
                delete self.lstUsers[user.index];
                user = null;
            }
            self.updateListLogin();
            self.sendEvent('updatelstUser', self.lstLogin);
        });
    }

    sendInformation(user) {
        user.socket.emit('information', { login: user.login, img: user.img, pseudo: user.pseudo });
    };

    sendAuth(user) {
        user.socket.emit('auth', true);
    };

    sendEvent(type, message) {
        for (var i in this.lstUsers) {
            this.lstUsers[i].socket.emit(type, message);
        }
    }
}

module.exports = ChatRoom;