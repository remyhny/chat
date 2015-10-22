var mongoose = require('mongoose');
var collection = {
    'schemaMessage': require('../mongodb/SchemaMessage.js').schema,
    'schemaLogin': require('../mongodb/SchemaLogin.js').schema,
    'schemaQuestion': require('../mongodb/SchemaQuestion.js').schema
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
        var p = new Promise(function (resolve, reject) {
            var model = mongoose.model(name, collection[schema]);
            var addvalue = new model(value);
            addvalue.save(function () {
                resolve();
            });
        });
        return p;
    }

    this.find = function(name, schema, reverse, limit, property, search) {
        var p = new Promise(function (resolve, reject) {
            var model = mongoose.model(name, collection[schema]);
            var query = model.find();

            if(search && property) {
                query.where(property).equals(search);
            }

            if(reverse) {
                query.sort({ '$natural': -1 })
            }

            if(limit && limit !== 0) {
                query.limit(limit);
            }

            query.exec(function (err, data) {
                resolve(data);
            })
        });
        return p;
    };

    connect();
}

module.exports = MongoDb;