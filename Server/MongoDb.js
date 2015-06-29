var mongoose = require('mongoose');
function MongoDb(database) {
    this.database = 'mongodb://localhost/' + database;
    this.connectBdd = null;
}

module.exports = MongoDb;