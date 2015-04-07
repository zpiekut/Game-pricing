// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var methodOverride = require('method-override');
var passport       = require('passport');
var flash          = require('connect-flash');
var morgan         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var session        = require('express-session');

var Nerd		   = require('./app/models/Nerd');
var Game		   = require('./app/models/Game');
var User           = require('./app/models/User'); 
var UserGame       = require('./app/models/UserGame');

// configuration ===========================================
	
// config files
var db = require('./config/db');
var port = process.env.PORT || 8080; // set our port
mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)
// mongoose.connect('mongodb://localhost/mydb');

// var mysql      = require('mysql');
    // var connection = mysql.createConnection({
    //   host     : 'localhost',
    //   user     : 'zach',
    //   password : 'root',
    //   database : 'games_app'
    // });
    // connection.connect();
    // connection.query('SELECT ?? FROM ??', [ ['title', 'console'], 'games'], function(err, rows, fields) {
    //   if (err) throw err;

    //   console.log('The solution is: ', rows);
    // });
// connection.end();

require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
// get all data/stuff of the body (POST) parameters 
app.use(bodyParser()); // get information from html forms
// app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ==================================================

require('./app/routes')(app, passport, Game, User, UserGame); // pass our application into our routes

// start app ===============================================
app.listen(port);	
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app

