// grab the mongoose module
var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema;
// define our nerd model
var GameSchema 	= new Schema({
	title: String,
	loose_price: String,
	cib_price: String,
	new_price: String,
	genre: String,
	console: String,
	upc: String
});
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Game', GameSchema);
