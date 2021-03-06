module.exports = function(app, pg, db, validate, fetchTheme, assignTheme) {

var encrypt = require("crypto");

Recaptcha = require('recaptcha').Recaptcha;
var bodyParser = require('body-parser');
//allows parsing of POST information
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var cssFile;
var PRIVATE_KEY = '6LfA-vcSAAAAAJOf3xHeUP0blVEb6Nv0nFDdoe8L';
var PUBLIC_KEY = '6LfA-vcSAAAAAJSn7n0oK5SKIUSrUlhHS-TDR2Tj';


//A3 Report
app.get('/report', function(req,res) {

  res.render("report.jade")  

});

app.get('/about', function(req,res) {
    res.redirect('/report');
})

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

    //prevents cross site scripting from index page
    res.locals.csrf = encodeURIComponent(req.csrfToken());

	pg.connect(db, function(err, client, done) {
		if (err) {
			return console.error('Problem fetching client from pool', err);
		}

		client.query("select * from users where email=$1",[req.body.email], function(err, result){
		
        if(result.rows.length != 0){

            var attempts = result.rows[0].attempts;
            var regdate = result.rows[0].regdate;
            var password = encrypt.createHash("sha1").update(req.body.password + regdate).digest("hex");

            //incorrect password increases attempts
            if (password != result.rows[0].password) {
                client.query("update users set attempts=attempts+1 where email=$1", [req.body.email]);
                done();
                res.locals.captcha = true;
                res.locals.message = "Please confirm you are not a robot.";
                return res.render("index.jade");

            //check for captcha's after 1st bad attempt
            } else if (attempts >= 1) {
                var data = {
                    remoteip:  req.connection.remoteAddress,
                    challenge: req.body.recaptcha_challenge_field,
                    response:  req.body.recaptcha_response_field
                };
                var recaptcha = new Recaptcha(PUBLIC_KEY, PRIVATE_KEY, data);

                recaptcha.verify(function(success, error_code) {
                    console.log("verifying");
                    checkPass(result,client,done,req,res, password, function(data) {
                        console.log("waiting for checkpasscallback");
                        if (success && data) {
                            console.log("in success and data");
                            return res.redirect("/meet");
                        } else {
                            console.log("captcha wrong")
                            res.locals.captcha = true;
                            res.locals.message = "Please confirm you are not a robot.";
                            return res.render("index.jade");
                        }
                     });
                    
                });                

            //first good attempt
            } else {

                //set cookies
                checkPass(result, client, done, req, res, password, function(valid) {
                    return res.redirect("/meet");  
                });

            }

		}else{
            console.log("no email");
			res.clearCookie('token');
			res.locals.message = "No user registered with that e-mail";
			return res.render("index.jade");
		}

		});
		done();
	});

});

function checkPass(result, client, done, req, res, password, callback) {

    if (password == result.rows[0].password) {
        console.log("checkpass");
        var currdate = new Date();
        //hash user email and current date as token
        var token = encrypt.createHash("sha1").update(req.body.email + currdate.toString()).digest("hex");
        //update token in database
        client.query("update users set token=$1 where id=$2",[token, result.rows[0].id]);

        //create cookie token
        res.cookie('token', token);
        callback(1);
    }else {
        console.log("increase attempts");
        client.query("update users set attempts=attempts+1 where email=$1", [req.body.email]);
        done();
        res.locals.message = "Invalid Login";
        callback(0);
    }
}

//logout link
app.get('/index', function(req,res) {
    validate(req, pg, db, function(data) {
        var uid = data;

        pg.connect(db, function(err,client,done) {
            if (err) {
                return console.error('Problem fetching client from pool', err);
            }

            client.query("update users set attempts=$1 where id=$2", [0, uid]);
            done();

        });
        res.clearCookie('token');
        //prevents cross site scripting from index page
        res.locals.csrf = encodeURIComponent(req.csrfToken());
	    res.render("index.jade");
    });

});

app.get('/games', function(req,res) {

    //prevents cross site scripting from games page
    res.locals.csrf = encodeURIComponent(req.csrfToken());

	validate(req,pg,db, function(data) {
		var uid = data;
		if(uid > 0){
            fetchTheme(req, pg, db, uid, function(data1){
                cssFile = assignTheme(data1);

                pg.connect(db, function(err, client, done) {
                    if (err) {
                        return console.error('Problem fetching client from pool', err);
                    }

                    client.query("select * from games where $1=any (players)", [uid], function(err,result){
                        done();
                        var games = [];

                        for (var i in result.rows) {
                            games[games.length] = {type:result.rows[i].game_type, token:result.rows[i].game_token};
                        }

                        res.render("games.jade", {games: games, myTheme:cssFile});
                    });
                });
            });
		}else{
			res.redirect('/index');
		}
	});

});




//------------game2

app.get('/hidenseek', function(req,res) {

	//prevents cross site scripting from hidenseek page
    res.locals.csrf = encodeURIComponent(req.csrfToken());

	validate(req,pg,db, function(data) {
        var uid = data;
        
        if (uid > 0) {
             fetchTheme(req, pg, db, uid, function(data1){
                cssFile = assignTheme(data1);

                pg.connect(db, function(err, client, done) {
                    if (err) {
                        return console.error('Problem fetching client from pool', err);
                    }

                   client.query("select username, id from goingto, users where uid = id and eid in (select eid from goingto where uid=$1)",[uid], function(err, result) {
                     if(result.rows.length != 0) {
                            var friends = [];

                            for (var i in result.rows) {
                                if (result.rows[i].id != parseInt(uid)) {
                                friends[friends.length] = {username:result.rows[i].username, id:result.rows[i].id};
                                }
                            }

                            res.render("hidenseek.jade", {friends: friends, newgame:true, found:"No players found.", myTheme:cssFile});

                        } else {
                            res.locals.message = "Not in a meeting. Start a meeting!";
                            res.redirect("/meet")
                        }

                   });

                    done();
                });
            });
        }else{
            
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


            if (typeof(req.body.mydropdown) == "string") {
                var indropdown = req.body.mydropdown.split(",");
            } else {
                var indropdown = req.body.mydropdown;
            }
			for (var i in indropdown) {

                players.push(parseInt(indropdown[i]));
                
			}

			
			var randnum = Math.floor(Math.random()*players.length);
			var seeker = parseInt(players[randnum]);
            var isseeker = false;
            if(uid == seeker)
                isseeker = true;

			
			var currdate = new Date();
			var gametoken = encrypt.createHash("sha1").update(uid + currdate.toString() + "HNS").digest("hex");
			var found = getFound(gametoken);
            console.log("1");
			pg.connect(db, function(err, client, done) {
                
				if (err) {
					return console.error('Problem fetching client from pool', err);
				}
                //for game data
				client.query("insert into games values($1, 'Hide & Seek')" ,[gametoken],function(err,result){
					
                    if (err) {
						console.log('Problem inserting game token into database', err);
					} else {
						console.log('Added Hide & Seek Game');
					}
				});

                var flag = 0;
                for (var i in players) {

                    var playeruid = [];
                  
                    client.query("select * from users where id=$1",[players[i]] , function(err,result) {
                       
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

                                //for game data
                                client.query("insert into locations values($1,array[-1,-1],$2,$3, false)", [userid, gametoken, player_type],function(err,result){
                                    
                                    if (err) {
                                        console.log('Problem inserting into locations table', err);
                                    } else {
                                        console.log('Added Player ' + userid  + ' into locations as ' + player_type);
                                    }
                                });
                                done();


                                if (flag == players.length ) {
                                    
                                    client.query("update games set players=$1 where game_token=$2",[playeruid, gametoken], function(err, result) {
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
                done();
                }

			});
		}else{
			res.redirect('/index');
		}
	});

});

app.get("/startgame", function(req,res) {

    //prevents cross site scripting from hidenseek page
    res.locals.csrf = encodeURIComponent(req.csrfToken());
    
    validate(req,pg,db, function(data) {
        var uid = data;

         fetchTheme(req, pg, db, uid, function(data1){
                cssFile = assignTheme(data1);

                getGameInfo(uid, req.query.token, function(data) {
                    
        			var data = data;
        			data.push("Hide & Seek");
        			console.log(data);
                    res.render("hidenseek.jade", {newgame: false, token: req.query.token, gamedata: data, myTheme:cssFile});
                });
        });
    });

});

app.post("/gamecheckin", function(req,res) {
	validate(req,pg,db, function(data) {
        var uid = data;
        var coords = [parseFloat(req.body.latitude), parseFloat(req.body.longitude)];
        var game2token = req.body.game2token;

        pg.connect(db, function(err, client, done) {
            if (err) {
                return console.error('Problem fetching client from pool', err);
            }
            //update coordinates
            client.query("update locations set place=$1 where userid=$2 and game_token = $3",[coords,uid,game2token], function(err,result) {
                done();
                if (err) {
                    console.log("Problem checking in",err);
                    res.send(false);
                } else {
                    client.query("select * from locations where game_token = $1 and found = false order by player_type desc",[game2token], function(err, result){
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
                                        client.query("update locations set found = true where game_token = $1 and userid = $2",[game2token,result.rows[i].userid], function(err, result){

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
	
	var game2token = req.query.game2token;
	var coords = [];
	validate(req,pg,db, function(data) {
        var uid = data;
    	pg.connect(db, function(err, client, done) {
    		if (err) {
                return console.error('Problem fetching client from pool', err);
            }
    		client.query("select u.id, u.username, l.place, l.found from locations as l inner join users as u on u.id = l.userid where l.game_token=$1 and player_type != 'seeker'",[game2token], function(err,result) {
    			if (err) {
    				console.log("Can't find game token", err);
    			} else {
    				for (var x=0; x < result.rows.length; x++) {
    				    coords[coords.length] = {id: result.rows[x].id, username: result.rows[x].username, coords: result.rows[x].place, found: result.rows[x].found};
    				}
    			}
    			
    			res.send(coords);
    		});
            done();
    	});
	});

});

app.get("/endgame", function(req,res) {
	
 	var game2token = req.query.game2token;
 	
	pg.connect(db, function(err, client, done) {
		if (err) {
                return console.error('Problem fetching client from pool', err);
            }
		client.query("delete from locations where game_token=$1",[game2token], function(err, result){
			if (err) {
				console.log("Cannot delete game from locations", err);
			} else {

				console.log("from locations " + result + game2token);
				res.send(true);

			}
		});
		done();
		client.query("delete from games where game_token=$1",[game2token], function(err, result) {
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
		client.query("select * from games where game_token=$1",[req.query.game2token], function(err, result) {
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

		client.query("select * from locations where game_token=$1 order by userid asc",[gametoken], function(err, result) {
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

		client.query("select * from locations where player_type='seeker' and userid=$1",[userid], function(err, result){
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
        
        callback([isseeker.toString(),gametoken, uid]);
	});
}

}



