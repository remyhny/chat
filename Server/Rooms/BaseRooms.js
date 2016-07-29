"use strict";

var Mongo = require('../MongoDb.js');

var activePlugin = [
    {
        "label": "quizz",
        "require": require('../Plugins/Quizz.js')
    }
]

class Room {
    constructor(SocketIo, path) {
        this.socketIo = SocketIo;
        this.io = SocketIo.io;
        this.path = path;
        this.mongo = new Mongo('chat');
        this.plugins = {};
        console.log('init', path);
    };

   

    init() {
        var self = this;
        for (let i = 0; i < activePlugin.length; i++) {
            this.plugins[activePlugin[i]['label']] = new activePlugin[i]['require'](self, self.mongo);
        };

        this.io
            .of('/' + this.path)
            .on('connection', function (socket) {
                self.eventSocket(socket);
                self.eventPlugin(socket);
            });
    };

    eventPlugin(socket) {
        var self = this;
        socket.on('plugin', function (plugin) {
            if (self.plugins[plugin.label] && self.plugins[plugin.label][plugin.method]) {
                self.plugins[plugin.label][plugin.method](plugin.opts, socket);
            }
        });

    }

    eventSocket(socket) {
        console.log('connection a la room');
    }

}

module.exports = Room;