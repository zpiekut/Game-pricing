module.exports = function(app, passport, Game, User, UserGame) {
	// server routes ===========================================================
	// handle things like api calls
	// authentication routes
	// middleware to use for all requests

	//var Game 		= require('./models/Game');
	//var User 		= require('./models/User');
	//var UserGame 	= require('./models/UserGame');

	app.use(function(req, res, next) {
	    // do logging
	    console.log('Something is happening.');
	    next(); // make sure we go to the next routes and don't stop here
	});

	app.get('/app', isLoggedIn, function(req, res) {
		res.sendfile('./public/app.html');
	});

	app.get('/login', function(req, res) {
		res.sendfile('./public/login.html');
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/app',
		failureRedirect : '/login'
	}));

	app.get('/signup', function(req, res) {
		res.sendfile('./public/signup.html');
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/app',
		failureRedirect : '/signup'
	}));	

	app.get('/profile', isLoggedIn, function(req, res) {
		res.sendfile('./public/profile.html');
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	app.get('/api', function(req, res) {
	    res.json({ message: 'hooray! welcome to our api!' });   
	});

	app.route('/api/games')

	    // create a nerd (accessed at POST http://localhost:8080/api/bears)
	    .post(function(req, res) {
	        
	        var game = new Game();      // create a new instance of the Bear model
	        game.title = req.body.title;  // set the bears name (comes from the request)

	        // save the game and check for errors
	        game.save(function(err) {
	            if (err)
	                res.send(err);

	            res.json({ message: 'Game created!' });
	        });
	        
	    })

	    // get all the bears (accessed at GET http://localhost:8080/api/bears)
	    .get(function(req, res) {
	        Game.find(function(err, games) {
	            if (err)
	                res.send(err);

	            res.json(games);
	        });
	    });

	app.route('/api/games/:game_id')

	    // get the game with that id (accessed at GET http://localhost:8080/api/bears/:game_id)
	    .get(function(req, res) {
	        Game.findById(req.params.game_id, function(err, game) {
	            if (err)
	                res.send(err);
	            res.json(game);
	        });
	    })

	    // update the game with this id (accessed at PUT http://localhost:8080/api/bears/:game_id)
	    .put(function(req, res) {

	        // use our game model to find the game we want
	        Game.findById(req.params.game_id, function(err, game) {

	            if (err)
	                res.send(err);

	            game.title = req.body.title;  // update the bears info

	            // save the game
	            game.save(function(err) {
	                if (err)
	                    res.send(err);

	                res.json({ message: 'Game updated!' });
	            });

	        });
	    })

	    // delete the game with this id (accessed at DELETE http://localhost:8080/api/game/:game_id)
	    .delete(function(req, res) {
	        Game.remove({
	            _id: req.params.game_id
	        }, function(err, game) {
	            if (err)
	                res.send(err);

	            res.json({ message: 'Successfully deleted' });
	        });
	    });

	app.route('/api/search/:search_query')

	    .get(function(req, res) {
	        Game.find({
	            $text: { $search: req.params.search_query} 
	        }, function(err, games) {
	            if (err)
	                res.send(err);
	            res.json(games);
	        });
	    });

	app.route('/api/users')
	    .get(function(req, res) {
	        User.find().lean().populate({ path: 'games'}).exec(function(err, users) {
	        	var options = {
			      path: 'games._game',
			      model: 'Game'
			    };
			    if (err) return res.send(err);
	        	User.populate(users, options, function(err, data) {
		            if (err) res.send(err);
		            console.log(data);
		            res.json(data);
		        });
	        });
	    });
	    
	app.route('/api/users/:user_id')

	    // get the game with that id (accessed at GET http://localhost:8080/api/bears/:game_id)
	    .get(function(req, res) {
	        //User.populate('_game').findById(req.params.user_id, function(err, user) {
	        // User.findOne({ _id:  req.params.user_id })
	        // .exec(function(err, user) {
	        // 	console.log(user);
	        //     if (err) res.send(err);
	        //     console.log(user);
	        //     res.json(user);
	        // });
	        User.findOne({ _id:  req.params.user_id })
	        .lean()
	        .populate({ path: 'games'})
	        .exec(function(err, users) {
	        	var options = {
			      path: 'games._game',
			      model: 'Game'
			    };
			    if (err) return res.send(err);
	        	User.populate(users, options, function(err, data) {
		            if (err) res.send(err);
		            console.log(data);
		            res.json(data);
		        });
	        });
	    })

	    .put(function(req, res) {
	        // use our game model to find the game we want
	        //User.findById(req.params.user_id, function(err, user) {
	        User.findOne({ _id: req.params.user_id}).exec(function(err, user) {
	            if (err) {
	                console.log('Error getting user');
	                res.send(err);
	            }
	            Game.findById(req.body.game._id, function(err, game) {
		            if (err) res.send(err);
		            console.log(req.body);
		            //console.log('Game: '+req.body.game);
		            var newGame 		= new UserGame({ _game: req.body.game._id, isCIB: req.body.game.isCIB});
		            newGame.isCIB 		= req.body.game.isCIB;
		            newGame.user_price 	= req.body.game.user_price;
		            console.log('New Game: '+newGame);
		            user.games.push(newGame); // add the game
		            console.log('works');

		            //user.games.push(req.body.game._id);
		            // user.games.id 		= req.body.game._id; // add the game
		            // console.log('GameId: '+user.games.id );
		            // user.games.isCIB 		= req.body.game.isCIB; // add the game
		            // user.games.user_price 	= req.body.game.user_price; // add the game

		            // save the game
		            user.save(function(err) {
		                if (err) {
		                    console.log('Error saving');
		                    res.send(err);
		                }
		                newGame._game = game;
		                console.log(newGame._game);
		                res.json(game);
		            });
		        });
	        });
	    });    

	app.route('/api/users/:user_id/1/:game_id/1')
	    .put(function(req, res) {
	        // console.log(req.params.game_id);
	        User.findOne({ _id:  req.params.user_id })
	        .populate({ path: 'games'})
	        .exec(function(err, users) {
	        	var options = {
			      path: 'games._game',
			      model: 'Game'
			    };
			    if (err) return res.send(err);
	        	User.populate(users, options, function(err, user) {
		            if (err) res.send(err);
		            for(var ii = user.games.length-1; ii >= 0; ii--) {
		            	console.log(user.games[ii]._game._id+"  "+req.params.game_id);
		                if(user.games[ii]._game._id == req.params.game_id) {
		                    console.log('FOUND'); 
		                    user.games[ii].isCIB = req.body.isCIB;
	                    	user.games[ii].user_price = req.body.user_price;
	                    	break;
		                }
		            }
		            console.log('Saving Game'); 
		            user.save(function(err) {
		                if (err) {
		                    console.log('Error saving');
		                    res.send(err);
		                }
		                res.json({ message: 'User game updated!' });
		            });
		        });
	        });


	        // User.findById(req.params.user_id, function(err, user) {
	        //     if (err) {
	        //         console.log('Error getting user');
	        //         res.send(err);
	        //     }
	        //     for(var ii = user.games.length-1; ii >= 0; ii--) {
	        //         if(user.games[ii]._id == req.params.game_id) {
	        //             console.log('FOUND'); 
	        //             // console.log('Cur: '+user.games[ii].isCIB+'  New: '+req.body.isCIB); 
	        //             user.games[ii].isCIB = req.body.isCIB;
	        //             user.games[ii].user_price = req.body.user_price;
	        //             // conditions = { _id: req.params.user_id };
	        //             // update = '{$set: {games['+ii+'].console: BUTTS}}';
	        //             // options = { upsert: true };
	        //             // //console.log(query);
	        //             // User.update(conditions, update, options, function(err, doc) {
	        //             //     console.log(doc);
	        //             // });
	        //             break;
	        //         }
	        //     }

	        //     console.log('Saving Game'); 
	        //     user.save(function(err) {
	        //         if (err) {
	        //             console.log('Error saving');
	        //             res.send(err);
	        //         }
	        //         res.json({ message: 'User game updated!' });
	        //     });
	        // });
	    }) 

	    .delete(function(req, res) {
	    	User.findOne({ _id:  req.params.user_id })
	        .populate({ path: 'games'})
	        .exec(function(err, users) {
	        	var options = {
			      path: 'games._game',
			      model: 'Game'
			    };
			    console.log("Users: "+users)
			    if (err) return res.send(err);
	        	User.populate(users, options, function(err, user) {
		            if (err) res.send(err);
		            console.log("User: "+user);
		            for(var ii = user.games.length-1; ii >= 0; ii--) {
		            	console.log(user.games[ii]._game._id+"  "+req.params.game_id);
		                if(user.games[ii]._game._id == req.params.game_id) {
		                    console.log('FOUND'); 
		                    user.games.splice(ii, 1);
	                    	break;
		                }
		            }
		            console.log('Saving Game'); 
		            user.save(function(err) {
		                if (err) {
		                    console.log('Error saving');
		                    res.send(err);
		                }
		                res.json({ message: 'User game updated!' });
		            });
		        });
	        });

	        // User.findById(req.params.user_id, function(err, user) {
	        //     if (err) {
	        //         console.log('Error getting user');
	        //         res.send(err);
	        //     }
	        //     console.log(req.params);
	        //     for(var ii = user.games.length-1; ii >= 0; ii--) {
	        //         //console.log(user.games[ii]._id+"  "+req.body.game);
	        //         //console.log(user.games[ii]._id == req.body.game_id);
	        //         if(user.games[ii]._id == req.params.game_id) {                   
	        //             console.log('FOUND'); 
	        //             user.games.splice(ii, 1);
	        //             break;
	        //         }
	        //     }
	        //     // save the game
	        //     user.save(function(err) {
	        //         if (err) {
	        //             console.log('Error saving');
	        //             res.send(err);
	        //         }

	        //         res.json({ message: 'User games updated!' });
	        //     });

	        // });
	    });

	//app.use('/api', router);
	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', isLoggedIn, function(req, res) {
		console.log('Something is happening.');
		res.sendfile('./public/index.html');
		//res.sendfile('./public/login.html');
	});
};

function isLoggedIn (req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/login');
		//res.sendfile('./public/login.html');
}
