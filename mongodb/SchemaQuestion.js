var mangoose = require('mongoose');

var SchemaQuestion = new mangoose.Schema({
	id: Number,
    label: String,
    response: String,
    author: String
});

exports.schema = SchemaQuestion;