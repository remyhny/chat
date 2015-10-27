'use strict'


var Mongo = require('../MongoDb.js');

class Room {
    constructor(SocketIo, path) {
        this.socketIo = SocketIo;
        this.io = SocketIo.io;
        this.path = path;
        this.mongo = new Mongo('chat');
        console.log('init', path);
    };

   

    init() {
        var self = this;
        this.io
            .of('/' + this.path)
            .on('connection', function (socket) {
                self.eventSocket(socket);
            });
    };

    eventSocket(socket) {
        console.log('connection a la room');
    }

}

module.exports = Room;