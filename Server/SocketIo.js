"use strict";
var Rooms = require('./Rooms.js');

class SocketIo {
    static initServer(httpServer) {
        if (!this.io) {
            this.io = require('socket.io').listen(httpServer, { origins: '*:*' });
            this.rooms = [];
        } else {
            console.log('listener socket.io déjà existant');
        }
    }

    static createRoom(path) {
        if (this.io) {
            var room = new Rooms(this.io, path);
            this.rooms.push(room);
            room.init();
        } else {
            console.log('aucun listener socket.io');
        }
    }

    static getRoom() {
        return this.rooms;
    }
};

module.exports = SocketIo;
