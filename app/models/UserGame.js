var mongoose 	= require('mongoose');
var Game 		= require('./Game.js');

var UserGameSchema = mongoose.Schema({
	_game 		: {type: mongoose.Schema.Types.ObjectId, ref: 'Game'},
	isCIB		: Boolean,
	user_price	: String
});

module.exports = mongoose.model('UserGame', UserGameSchema);