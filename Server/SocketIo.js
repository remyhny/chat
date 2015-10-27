"use strict";

var ChatRoom = require('./Rooms/ChatRoom.js');
var logger = require('./Debug.js');
var Users = require('./Users.js');

class SocketIo {
    static initServer(httpServer) {
        if (!this.io) {
            this.io = require('socket.io').listen(httpServer, { origins: '*:*' });
            this.rooms = [];
        } else {
            logger.log('error', 'listener socket.io déjà existant');
        }
    }

    static createRoom(path) {
        if (this.io) {
            var room = new ChatRoom(this, path);
            this.rooms.push(room);
            room.init();
        } else {
            logger.log('error', 'aucun listener socket.io');
        }
    }

    static getRoom() {
        return this.rooms;
    }
};

module.exports = SocketIo;
