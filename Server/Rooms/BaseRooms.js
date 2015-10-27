'use strict'

var logger = require('../Debug.js');
var Mongo = require('../MongoDb.js');

class Room {
    constructor(SocketIo, path) {
        this.socketIo = SocketIo;
        this.io = SocketIo.io;
        this.path = path;
        this.mongo = new Mongo('chat');
        logger.log('info','init: ' + path);
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
        logger.log('info', 'connection a la room');
    }

}

module.exports = Room;
