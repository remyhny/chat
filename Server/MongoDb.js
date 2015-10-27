"use strict";

var collection = {
    'schemaMessage': require('../mongodb/SchemaMessage.js').schema,
    'schemaLogin': require('../mongodb/SchemaLogin.js').schema
};

class MongoDb {
    constructor(database) {
        this.mongoose = require('mongoose');
        this.db = this.mongoose.connection;
        //db.on('error', function (error) {
        //    console.log('erreur de connection : ', error);
        //})
        //db.on('disconnected', function () {
        //    console.log('deconnection base');
        //})
        //db.on('connected', function () {
        //    console.log('Connection base')
        //})
        this._database = database;
        this._connect();
    }

    _connect() {
        if (this._database) {
            this.mongoose.connect('mongodb://localhost/' + this._database);
        }
    }

    add(value, name, schema) {
        var model = this.mongoose.model(name, collection[schema]);
        return new model(value).save();
    }

    find(name, schema, search) {
        if (name, schema) {
            var model = this.mongoose.model(name, collection[schema]);
            if (!search) {
                return model.find().sort({ '$natural': -1 }).limit(100).exec();
            } else {
                return model.find({ login: search }).sort({ '$natural': -1 }).limit(100).exec();
            }
        }
    }
}

module.exports = MongoDb;