var Users = require('./Users.js');

function Room(io, path) {
    this.io = io;
    this.path = path;
    this.count = 0;
    this.lstUsers = {};

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
                });

                socket.on('enter', function () {
                    self.sendInformation(user);
                });

                socket.on('sendMessage', function (message) {
                    msg = {
                        from: user.login,
                        text: message
                    }
                    self.sendEvent('newMessage', msg);
                });

                socket.on('disconnect', function () {
                    console.log('disconnect');
                    if (user && self.lstUsers[user.index]) {
                        delete self.lstUsers[user.index];
                        delete user;
                    }
                });
            });
    };

    this.sendInformation = function (user) {
        user.socket.emit('information', user.login);
    }

    this.sendEvent = function (type, message) {
        for (i in this.lstUsers) {
            this.lstUsers[i].socket.emit(type, message);
        }
    }
}

module.exports = Room;