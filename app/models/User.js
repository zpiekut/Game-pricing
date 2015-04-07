// grab the mongoose module
var mongoose 	= require('mongoose');
var bcrypt    	= require('bcrypt-nodejs');
//var UserGame	= require('./UserGame');
var Game		= require('./Game');

var UserGameSchema = mongoose.Schema({
	_game 		: {type: mongoose.Schema.Types.ObjectId, ref: 'Game'},
	isCIB		: Boolean,
	user_price	: String
});

//var Schema 		= mongoose.Schema;
var userSchema = mongoose.Schema({
  local       : {
    email     : String,
    password  : String
  },
  // games: [{type: mongoose.Schema.Types.ObjectId, ref: 'Game'}],
  games: [UserGameSchema]
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// var UserGame = new Schema({
//     title     	: String,
//   	loose_price	: String,
//   	cib_price	: String,
//   	genre		: String,
//   	console		: String,
//   	upc			: String,
//   	user_price	: String,
//   	isCIB		: Boolean
// });

// var userSchema 	= new Schema({
// 	name: String,
// 	games: [UserGame]
// });
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('User', userSchema);
