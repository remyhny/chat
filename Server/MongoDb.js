var mongoose = require('mongoose');
var collection = {
    'schemaMessage': require('../mongodb/SchemaMessage.js').schema,
    'schemaLogin': require('../mongodb/SchemaLogin.js').schema
};


var db = mongoose.connection;
db.on('error', function (error) {
    //console.log('erreur de connection : ', error);
})
db.on('disconnected', function () {
    //console.log('deconnection base');
})
db.on('connected', function () {
    //console.log('Connection base')
})

function MongoDb(database) {
    var _database = database;

    var connect = function () {
        mongoose.connect('mongodb://localhost/' + _database);
    };

    var disconnect = function () {
        mongoose.connection.close();
    };

    this.add = function (value, name, schema) {
        var model = mongoose.model(name, collection[schema]);
        return new model(value).save();
    }

    this.find = function (name, schema, search) {
        var model = mongoose.model(name, collection[schema]);
        if (!search) {
            return model.find().sort({ '$natural': -1 }).limit(100).exec();
        } else {
            return model.find({login : search}).sort({ '$natural': -1 }).limit(100).exec();
        }
    }

    connect();
}

module.exports = MongoDb;