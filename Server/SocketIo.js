var Rooms = require('./Rooms.js');

function SocketIo(httpServer) {
    this.httpServer = httpServer;
    this.io = require('socket.io').listen(this.httpServer, { origins: '*:*' });
    this.tabRoom = [];

    this.createRoom = function (path) {
        return new Rooms(this.io, path);
    }
}

module.exports = SocketIo;
