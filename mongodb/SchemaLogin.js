var mangoose = require('mongoose');

var SchemaLogin = new mangoose.Schema({
    login: String,
    pseudo : String,
    img: String,
    color: String
});

exports.schema = SchemaLogin;