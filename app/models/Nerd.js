// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// define our nerd model
var NerdSchema = new Schema({
	name: String
});
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Nerd', NerdSchema);
