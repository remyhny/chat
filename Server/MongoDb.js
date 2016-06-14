"use strict";

var collection = {
    'schemaMessage': require('../mongodb/SchemaMessage.js').schema,
    'schemaLogin': require('../mongodb/SchemaLogin.js').schema,
    'schemaQuestion': require('../mongodb/SchemaQuestion.js').schema
};

var confOpts = {
    'search': {
        method: 'equals'
    },
    'property': {
        method: 'where'
    },
    'reverse': {
        method: 'sort',
        value: { '$natural': -1 }
    },
    'limit': {
        method: 'limit'
    }
};

var defaultOpts = {
    'limit': 100,
    'reverse': true
};

class MongoDb {
    constructor(database) {
        this.mongoose = require('mongoose');
        this.db = this.mongoose.connection;
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

    find(name, schema, opts) {
        if (!opts) opts = defaultOpts;
        if (name, schema) {
            var model = this.mongoose.model(name, collection[schema]).find();
            for (let idx in opts) {
                if (confOpts[idx] && opts[idx]) {
                    if (confOpts[idx].value) {
                        model = model[confOpts[idx].method](confOpts[idx].value)
                    } else {
                        model = model[confOpts[idx].method](opts[idx]);
                    }
                }
            };
            return model.exec();
        }
    }
}

module.exports = MongoDb;