module.exports = function(app, pg, db, validate) {

var encrypt = require("crypto");

var bodyParser = require('body-parser');
//allows parsing of POST information
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//index page
app.get('/', function(req,res) {

	validate(req,pg,db, function(data) {
		var uid = data;
		if(uid > 0){
			res.redirect("/meet");
		}else{
			res.redirect('/index');
		}
	});
});

//login on index
app.post('/login', function(req, res){

	pg.connect(db, function(err, client, done) {
		if (err) {
			return console.error('Problem fetching client from pool', err);
		}

		client.query("select * from users where email='"
		+ req.body.email + "' and password='" + req.body.password + "'", function(err, result){
		if(result.rows.length != 0){

			var currdate = new Date();
			//hash user email and current date as token
			var token = encrypt.createHash("sha1").update(req.body.email + currdate.toString()).digest("hex");
			//update token in database
			client.query("update users set token='" + token + "' where id=" + result.rows[0].id);
			//create cookie token
			res.cookie('token', token);
			res.redirect("/meet");

		}else{
			res.clearCookie('token');
			res.locals.message = "Invalid Login";
			res.render("index.jade");
		}

		});
		done();
	});

});


//logout link
app.get('/index', function(req,res) {
	res.clearCookie('token');
	res.render("index.jade");

});

app.get('/games', function(req,res) {

	validate(req,pg,db, function(data) {
		var uid = data;
		if(uid > 0){

            pg.connect(db, function(err, client, done) {
                if (err) {
                    return console.error('Problem fetching client from pool', err);
                }

                client.query("select * from games where " + uid + "= any (players)", function(err,result){
                    done();
                    var games = [];

                    for (var i in result.rows) {
                        games[games.length] = {type:result.rows[i].game_type, token:result.rows[i].game_token};
                    }

                    res.render("games.jade", {games: games});
                });
            });
		}else{
			res.redirect('/index');
		}
	});

});



//game 1: scavenger hunt in action
app.get('/hidenseek', function(req,res) {

	console.log("Action /scavenger");

	validate(req,pg,db, function(data) {
        var uid = data;
        console.log("UID "+ uid);
        if (uid > 0) {
                        res.render('scavenger.jade');
           });
         }else{
            console.log("redirected from games");
            res.redirect('/index');
        }
    });


//------------game2

app.get('/hidenseek', function(req,res) {

	console.log("Action /hidenseek");

	validate(req,pg,db, function(data) {
        var uid = data;
        console.log("UID "+ uid);
        if (uid > 0) {

            pg.connect(db, function(err, client, done) {
                if (err) {
                    return console.error('Problem fetching client from pool', err);
                }

                //assumes uid can be id1 or id2
                client.query("select * from users where id in((select id2 from friendships where id1="
                + uid + ") union (select id1 from friendships where id2=" + uid + "))",
                function(err,result){
                    if(result.rows.length != 0) {
                        var friends = [];

                        for (var i in result.rows) {
                            friends[friends.length] = {username:result.rows[i].username, id:result.rows[i].id};
                        }

                        res.render("hidenseek.jade", {friends: friends, newgame:true, found:"No players found."});

                    } else {
                        res.locals.message = "No friends. Add Friends";
                        res.render('hidenseek.jade');
                    }
                });
                done();
            });

        }else{
            console.log("redirected from games");
            res.redirect('/index');
        }
    });
});

app.post('/creategame', function(req,res) {

	console.log("Creating new game");

	validate(req,pg,db, function(data) {
		var uid = data;
		var players = [uid];
		if(uid > 0){

            console.log("READ SKJDLSDA " + req.body.mydropdown);

            if (typeof(req.body.mydropdown) == "string") {
                var indropdown = req.body.mydropdown.split(",");
            } else {
                var indropdown = req.body.mydropdown;
            }
			for (var i in indropdown) {

                players.push(parseInt(indropdown[i]));
                
			}

			console.log("PLayers " + players);
			var randnum = Math.floor(Math.random()*players.length);
			var seeker = parseInt(players[randnum]);
            var isseeker = false;
            if(uid == seeker)
                isseeker = true;

			console.log(seeker + " is the seeker.")

			var currdate = new Date();
			var gametoken = encrypt.createHash("sha1").update(uid + currdate.toString() + "HNS").digest("hex");
			var found = getFound(gametoken);
			pg.connect(db, function(err, client, done) {
				if (err) {
					return console.error('Problem fetching client from pool', err);
				}

				client.query("insert into games values('" + gametoken + "', 'Hide & Seek')" ,function(err,result){
					if (err) {
						console.log('Problem inserting game token into database', err);
					} else {
						console.log('Added Hide & Seek Game');
					}
				});

                var flag = 0;
                for (var i in players) {

                    var playeruid = [];
                    console.log("checking for players id:" + players[i]);
                    client.query("select * from users where id=" + players[i] , function(err,result) {
                        if (err) {
                            console.log('Problem finding user', err);
                        } else {
                            if (result.rows.length != 0) {
                                var userid = result.rows[0].id;
                                playeruid.push(userid);
                                flag = flag + 1;

                                var player_type = "hider";
                                if (userid == seeker) {
                                    player_type = "seeker";
                                }

                                client.query("insert into locations values(" + userid + ",array[-1,-1],'" + gametoken + "','" + player_type + "', false)",function(err,result){
                                    if (err) {
                                        console.log('Problem inserting into locations table', err);
                                    } else {
                                        console.log('Added Player ' + userid  + ' into locations as ' + player_type);
                                    }
                                });

                                if (flag == players.length ) {
                                    console.log("print this in here");
                                    client.query("update games set players=array[" + playeruid.toString() + "] where game_token='" + gametoken + "'", function(err, result) {
                                        if (err) {
                                            console.log("Players=" + playeruid + " - token=" + gametoken);
                                            console.log("Problem updating players for games ", err);
                                        }
                                    });

                                    done();
                                    res.send([isseeker, gametoken, playeruid, players, uid, found]);
                                }
                            }
                        }
                    });
                }
			});
		}else{
			res.redirect('/index');
		}
	});

});

app.get("/startgame", function(req,res) {

    console.log("at /startgame");
    validate(req,pg,db, function(data) {
        var uid = data;

        console.log("Game Token: " + req.query.token);

        getGameInfo(uid, req.query.token, function(data) {
            console.log("calling game info");
			var data = data;
			data.push("Hide & Seek");
			console.log(data);
            res.render("hidenseek.jade", {newgame: false, token: req.query.token, gamedata: data});
        });
    });

});

app.post("/gamecheckin", function(req,res) {
	validate(req,pg,db, function(data) {
        var uid = data;
        var coords = [parseFloat(req.body.latitude), parseFloat(req.body.longitude)];
        var game2token = req.body.game2token;
        console.log("Game check-in: " + game2token);
        pg.connect(db, function(err, client, done) {
            if (err) {
                return console.error('Problem fetching client from pool', err);
            }
            //update coordinates
            client.query("update locations set place=array[" + coords + "] where userid=" + uid + " and game_token = '" + game2token + "'", function(err,result) {
                done();
                if (err) {
                    console.log("Problem checking in",err);
                    res.send(false);
                } else {
                    client.query("select * from locations where game_token = '" + game2token + "' and found = false order by player_type desc", function(err, result){
                        done();
                        if (result) {
                        if(result.rows.length <= 1){
                            console.log("All players found.")
                            //Game is over.
                        }else{
                            console.log("Checking distances between seeker and hider.");
                            var seekerCoords = result.rows[0].place;
                            for (var i in  result.rows) {
                                if (i != "0" && result.rows[i].place[0] != -1) {
                                    var hiderCoords = result.rows[i].place;
                                    if(distance(seekerCoords, hiderCoords) < 0.01){
                                        console.log("Seeker found hider.");
                                        client.query("update locations set found = true where game_token = '" + game2token + "' and userid = " + result.rows[i].userid, function(err, result){

                                        });
                                    }
                                }
                            }
                            res.send([true, data]);
                        }}
                   });
                }
            });
        });
	});
});

//return info on locations of friends
app.get("/friendlocations", function(req,res) {
	console.log("in /friendlocations");
	var game2token = req.query.game2token;
	var coords = [];
	validate(req,pg,db, function(data) {
        var uid = data;
    	pg.connect(db, function(err, client, done) {
    		if (err) {
                return console.error('Problem fetching client from pool', err);
            }
    		client.query("select u.id, u.username, l.place, l.found from locations as l inner join users as u on u.id = l.userid where l.game_token='" + game2token + "' and player_type != 'seeker'", function(err,result) {
    			if (err) {
    				console.log("Can't find game token", err);
    			} else {
    				for (var x=0; x < result.rows.length; x++) {
    				    coords[coords.length] = {id: result.rows[x].id, username: result.rows[x].username, coords: result.rows[x].place, found: result.rows[x].found};
    				}
    			}
    			console.log(coords);
    			res.send(coords);
    		});
            done();
    	});
	});

});

app.get("/endgame", function(req,res) {
	console.log("in /endgame");
 	var game2token = req.query.game2token;
 	console.log(game2token);
	pg.connect(db, function(err, client, done) {
		if (err) {
                return console.error('Problem fetching client from pool', err);
            }
		client.query("delete from locations where game_token='" + game2token + "'", function(err, result){
			if (err) {
				console.log("Cannot delete game from locations", err);
			} else {

				console.log("from locations " + result + game2token);
				res.send(true);

			}
		});
		done();
		client.query("delete from games where game_token='" + game2token + "'", function(err, result) {
			if (err) {
				console.log("Cannot delete token from games", err);
			} else {

				console.log("from games " + result + game2token);

			}
		});
		done();
	});

});

app.get("/checkgame", function(req,res) {

	pg.connect(db, function(err, client, done) {
		if (err) {
                return console.error('Problem fetching client from pool', err);
        }
		client.query("select * from games where game_token='" + req.query.game2token + "'", function(err, result) {
			if (err) {
				console.log("Cannot find game", err);
			} else {

				if (result.rows.length == 0) {
					res.send(false);
				} else {
					res.send(true);
				}

			}
		});
		done();

	});

});

function getFound(gametoken, callback) {
	var found = [];

	pg.connect(db, function(err, client, done) {
		if (err) {
			return console.error('Problem fetching client from pool', err);
		}

		client.query("select * from locations where game_token='" + gametoken + "' order by userid asc", function(err, result) {
			if (err) {
				return console.error('Cannot get game token from locations for point update', err);
			} else {
				if (result.rows.length != 0 ){
					for (var i in result.rows) {
						found.push(result.rows[i].found);
					}
					callback(found);
				}
			}
		});
		done();
	});
}

function isseeker(userid, callback) {
	pg.connect(db, function(err,client,done) {
		if(err) {
            console.error("Problem with pool", err);
        }

		client.query("select * from locations where player_type='seeker' and userid=" + userid, function(err, result){
			if(err) {
				console.error("Can't find userid", err);
			} else {
				if (result.rows.length != 0) {
					callback(true);
				} else {
					callback(false);
				}
			}

		});

		done();
	});
}

function distance( coord1, coord2 )
{
  var xs = coord1[0] - coord2[0];
  xs = xs * xs;

  var ys = coord1[1] - coord2[1];
  ys =  ys * ys;

  return Math.sqrt( xs + ys );
}

function getGameInfo(uid, gametoken, callback) {
	//gets game info for the players that didn't start the game
	isseeker(uid, function(isseeker) {
        console.log("does this run");
        callback([isseeker.toString(),gametoken, uid]);
	});
}

}



