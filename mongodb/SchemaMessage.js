var mangoose = require('mongoose');

var SchemaMessage = new mangoose.Schema({
    from: String,
    text: String,
    img : String,
    date: String,
    color : String
});

exports.schema = SchemaMessage;