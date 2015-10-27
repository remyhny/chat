"use strict";

var conf = require('../conf.json');
var Mongo = require('./MongoDb.js');

class User {
    constructor(login, socket, index, mongo) {
        this.login = login;
        this.socket = socket;
        this.index = index;
        this.firstEnter = true;
        this.img = null;
        this.color = null;
    }

    getImg() {
        if (conf.users[this.login]) {
            return conf.users[this.login].img;
        }
        return "Contents/images/1.jpg";
    }

    getColor() {
        if (conf.users[this.login]) {
            return conf.users[this.login].color;
        }
        return "black";
    }

    initUser() {
        var self = this;
        var p = new Promise(function (resolve, reject) {
            self.img = self.getImg();
            self.color = self.getColor();
            resolve(true);
        });
        return p;
    }
}

module.exports = User;