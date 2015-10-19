var Users = require('./Users.js'),
 Mongo = require('./MongoDb.js'),
 Html5Entities = require('html-entities').Html5Entities,
 Quizz = require('./Quizz.js');

function Room(io, path) {
    this.io = io;
    this.path = path;
    this.count = 0;
    this.lstUsers = {};
    this.lstLogin = [];
    this.quizz = null;

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
        user.socket.emit('information', { login: user.login, img: user.img, pseudo: user.pseudo });
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
        var entities = new Html5Entities();

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
                            mongo.find('messages', 'schemaMessage', true, 100).then(function (data) {
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
                            text: entities.encode(message),
                            date: new Date().toTimeString().split(' ')[0]
                        };
                        mongo.add(msg, 'messages', 'schemaMessage');
                        self.sendEvent('newMessage', msg);

                        if(self.quizz && self.quizz.isInit && self.quizz.currentQuestion) {
                            self.quizz.checkResponse(message, user);
                        };
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

                socket.on('initQuizz', function() {
                    var msg = {
                        from: "System",
                        text: "",
                        date: ""
                    };

                    if(self.quizz && self.quizz.isInit) {
                        msg.text = "Omg " + user.login + "! There is already a quizz in progress, noob!";
                        msg.date = new Date().toTimeString().split(' ')[0];

                        self.sendEvent('newMessage', msg);
                    } else {
                        var quizz = new Quizz(self, mongo);
                        quizz.initQuizz().then(function() {
                            self.quizz = quizz;

                            msg.text = user.login + " has started a quizz.";
                            msg.date = new Date().toTimeString().split(' ')[0];

                            self.sendEvent('newMessage', msg);
                            quizz.runQuizz();
                        });
                    }
                });
            });
    };
}

module.exports = Room;
