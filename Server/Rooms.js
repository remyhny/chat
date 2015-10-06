var Users = require('./Users.js');
var Mongo = require('./MongoDb.js');


function Room(io, path) {
    this.io = io;
    this.path = path;
    this.count = 0;
    this.lstUsers = {};
    this.lstLogin = [];

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
        user.socket.emit('information', { login: user.login, img: user.img , pseudo : user.pseudo});
    }

    this.sendAuth = function (user) {
        user.socket.emit('auth', true);
    }

    this.sendEvent = function (type, message) {
        for (i in this.lstUsers) {
            this.lstUsers[i].socket.emit(type, message);
        }
    }



    this.init = function () {
        var self = this;
        console.log('init');
        var mongo = new Mongo('chat');

        this.io
            .of('/' + this.path)
            .on('connection', function (socket) {
                var user;
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
                        user = new Users(login, socket, self.count, mongo);
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
                            mongo.find('messages', 'schemaMessage').then(function (data) {
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
                            text: message,
                            date: new Date().toTimeString().split(' ')[0]
                        };
                        mongo.add(msg, 'messages', 'schemaMessage');
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
                        delete user;
                    }
                    self.updateListLogin();
                    self.sendEvent('updatelstUser', self.lstLogin);
                });
            });
    };


}

module.exports = Room;
