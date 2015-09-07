var mongoose = require('mongoose');
var schemaMessage = require('../mongodb/SchemaMessage.js');

var db = mongoose.connection;
db.on('error', function (error) {
    console.log('erreur de connection : ', error);
})
db.on('disconnected', function () {
    console.log('deconnection base');
})
db.on('connected', function () {
    console.log('Connection base')
})

function MongoDb(database) {
    var _database = database;

    var connect = function () {
        mongoose.connect('mongodb://localhost/' + _database);
    };

    var disconnect = function () {
        mongoose.connection.close();
    };

    this.add = function (value) {
        connect();
        var model = mongoose.model('messages', schemaMessage.schema);
        var addvalue = new model(value);
        addvalue.save(function () {
            disconnect();
        });
    }

    this.find = function () {
        var p = new Promise(function (resolve, reject) {
            connect();
            var model = mongoose.model('messages', schemaMessage.schema);
            var query = model.find().sort({ '$natural': -1 }).limit(50);
            query.exec(function (err, data) {
                resolve(data);
                disconnect();
            })
        });
        return p;
    }
}

module.exports = MongoDb;