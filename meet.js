module.exports =function(app, pg, db, validate){
	
var bodyParser = require('body-parser');
//allows parsing of POST information
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/meet', function(req,res) {

	validate(req,pg,db, function(data) {
		var uid = data;
		if (uid > 0) {
			pg.connect(db, function(err, client, done) {
				if (err) {
					return console.error('Problem fetching client from pool', err);
				}
				var friends =[];
				var attendees =[];
				var requests =[];
				var friendreqs =[];
				var suggestions =[];
				client.query("select username from users where id in((select id2 from friendships where id1=$1" + 
					     ") union (select id1 from friendships where id2=$1))",[uid], function(err,result) {
							if (err) {
										return console.error('Problem fetching client from pool', err);
							}
					for (var i in result.rows) {
						friends[friends.length] = result.rows[i].username;
					}
					client.query("select username from users where id in(select from_uid from friendrequests where to_uid=$1)" ,[uid], function(err,result){
						for (var i in result.rows) {
							friendreqs[friendreqs.length] = result.rows[i].username;
						}
						client.query("select eid from goingto where uid=$1",[uid], function(err,result){	
							if(result.rows.length ==0) {
								client.query("select username from users where id in(select from_uid from invited where to_uid=$1)" ,[uid], function(err,result){
									if (err) {
										return console.error('Problem fetching client from pool', err);
									}
									for (var i in result.rows) {
										requests[requests.length] = result.rows[i].username;
									}
									res.render("makemeet.jade", {friends: friends,requests: requests, friendreqs:friendreqs});
								});
								done();
							} else {
								var eid = result.rows[0].eid
								client.query("select username from users where id in (select uid from goingto where uid<>$1 and eid =$2)",[uid, eid], function(err,result){
									for (var i in result.rows) {
										attendees[attendees.length] = result.rows[i].username;
									}
									client.query("select place_id,location from locationsuggestions where eid = $1", [eid], function(err,result){ 
										if (err) {
											return console.error('Problem fetching client from pool', err);
										}
										for (var i in result.rows) {
											suggestions[suggestions.length] = result.rows[i].username;
										}
										res.render("meet.jade", {friends: friends, attendees: attendees, friendreqs:friendreqs, suggestions:result.rows});
									});
									done();								
								});
								done();
							}
						});
						done();
					});
					done();
				});
				done();
			});
		} else {
			res.redirect('/index');
		}
	});
	
});
app.get('/makemeet', function(req,res) {

	validate(req,pg,db, function(data) {
		var uid = data;
		if (uid > 0) {
			pg.connect(db, function(err, client, done) {
				if (err) {
					return console.error('Problem fetching client from pool', err);
				}
				client.query("select eid from goingto where uid=$1",[uid], function(err,result){
					if(result.rows.length == 0) {
						client.query("insert into events(uid) values($1)",[uid], function(err,result){
						if (err) {
							console.log("Problem checking in",err);
							res.send(false);
						} else {							
							console.log(result);
							client.query("insert into goingto(eid,uid) values((select id from events where uid=$1),$1)",[uid], function(err,result){
								if (err) {
									console.log("Problem checking in",err);
									res.send(false);
								} else {
									res.redirect('/meet');
								}		
							});
							done();
						}	
						});
					}
					
				});
				done();
			});
		}
	});
});

app.get('/leavemeet', function(req,res) {

	validate(req,pg,db, function(data) {
		var uid = data;
		if (uid > 0) {
			pg.connect(db, function(err, client, done) {
				if (err) {
					return console.error('Problem fetching client from pool', err);
				}
				client.query("select eid from goingto where uid=$1",[uid], function(err,result){
					if(result.rows.length != 0) {
						var eid = result.rows[0].eid
						client.query("delete from goingto where uid=$1",[uid], function(err,result){
							if (err) {
								console.log("Problem checking in",err);
								res.send(false);
							}
						});
						done();
						client.query("delete from events where uid=$1",[uid], function(err,result){
							if (err) {
								console.log("Problem checking in",err);
								res.send(false);
							}
						});	
						done();
						res.redirect('/meet');
					}
					
				});
				done();
			});
		}
	});
});

app.post("/invite", function(req,res) {
	validate(req,pg,db, function(data) {
		var uid = data;
		console.log(req.body.mydropdown);
		if (uid > 0) {
			pg.connect(db, function(err, client, done) {
				if (err) {
					return console.error('Problem fetching client from pool', err);
				}
				for (var i in req.body.mydropdown) {
					client.query("insert into invited(from_uid,to_uid,eid) values($1,(select id from users where username=$2),(select eid from goingto where uid=$1))",[uid,req.body.mydropdown[i]], function(err,result){
						if (err) {
							console.log("Problem checking in",err);
						} else {
						}		
					});
					done();
				}
			});
		}
		res.redirect('/meet');
	});
});

app.post("/friendresponse", function(req,res) {
	validate(req,pg,db, function(data) {
		var uid = data;
		if (uid > 0) {
			console.log(req.body);
			pg.connect(db, function(err, client, done) {
				if (err) {
					return console.error('Problem fetching client from pool', err);
				}
				if (req.body.submit="Accept") {
					client.query("insert into friendships(id1,id2) values ($1,(select id from users where username=$2))", [uid,req.body.name], function(err,result){
						if (err) {
							console.log("Problem checking in",err);
						}
					});
					done();
					client.query("delete from friendrequests where from_uid=$1 and to_uid = (select id from users where username=$2))", [uid,req.body.name], function(err,result){
						if (err) {
							console.log("Problem checking in",err);
						}
					});
					done();
				}
			});
		}
		res.redirect('/meet');
	});
});

app.post("/locationvote", function(req,res) {
	validate(req,pg,db, function(data) {
		var uid = data;
		if (uid > 0) {
			console.log(req.body);
			pg.connect(db, function(err, client, done) {
				if (err) {
					return console.error('Problem fetching client from pool', err);
				}
				if (req.body.submit="Accept") {
					client.query("update goingto set pref_loc =$2 where uid = $1", [uid,req.body.location], function(err,result){
						if (err) {
							console.log("Problem checking in",err);
						}
					});
					done();
					client.query("select pref_loc,cast(count(uid) as float)/(select count(uid) from goingto where eid in (select eid from goingto where uid=$1)) as ratio from goingto where eid in (select eid from goingto where uid=$1) group by pref_loc order by ratio", [uid], function(err,result){
						if (err) {
							console.log("Problem checking in",err);
						}
						if (parseFloat(result.rows[0].ratio) > 0.6) {
							client.query("update events set location =$2 where id in (select eid from goingto where uid=$1)", [uid,result.rows[0].pref_loc], function(err,result){
								if (err) {
									console.log("Problem checking in",err);
								}
							});
							done();
						}
					});
					done();
				}
			});
		}
		res.redirect('/meet');
	});
});
app.post("/requestresponse", function(req,res) {
	validate(req,pg,db, function(data) {
		var uid = data;
		if (uid > 0) {
			console.log(req.body);
			pg.connect(db, function(err, client, done) {
				if (err) {
					return console.error('Problem fetching client from pool', err);
				}
				if (req.body.submit="Accept") {
					client.query("insert into goingto(uid,eid) values ($1,(select eid from users,goingto where uid=id and username=$2))", [uid,req.body.name], function(err,result){
						if (err) {
							console.log("Problem checking in",err);
						}
					});
					done();
					client.query("delete from invited where from_uid=$1 and to_uid = (select id from users where username=$2))", [uid,req.body.name], function(err,result){
						if (err) {
							console.log("Problem checking in",err);
						}
					});
					done();
				}
			});
		}
		res.redirect('/meet');
	});
});
app.post("/addfriend", function(req,res) {
	validate(req,pg,db, function(data) {
		var uid = data;
		console.log(req.body.mydropdown);
		if (uid > 0) {
			pg.connect(db, function(err, client, done) {
				if (err) {
					return console.error('Problem fetching client from pool', err);
				}
				client.query("((select * from friendrequests where (from_uid = $1 and to_uid = (select id from users where email=$2)) or (from_uid = (select id from users where email=$2) and to_uid = $1)) union (select id1 as from_uid,id2 as to_uid from friendships where (id1 = $1 and id2 = (select id from users where email=$2)) or (id1 = (select id from users where email=$2) and id2 = $1)))", [uid,req.body.email], function(err,result){
					console.log(err);
					if(result.rows==0) {
						client.query("insert into friendrequests(from_uid,to_uid) values($1,(select id from users where email=$2))", [uid,req.body.email], function(err,result){
							if (err) {
								console.log("Problem checking in",err);
							}		
						});
						done();
					}
				});
				done();
			});
		}
		res.redirect('/meet');
	});
});

app.post("/location", function(req,res) {
	validate(req,pg,db, function(data) {
		var uid = data;
		if (uid > 0) {
			var lat = parseFloat(req.body.latitude);
			var lon = parseFloat(req.body.longitude);
			pg.connect(db, function(err, client, done) {
				if (err) {
					return console.error('Problem fetching client from pool', err);
				} 
				client.query("update goingto set latitude=$1,longitude=$2 where uid=$3",[lat,lon,uid], function(err,result) {
					if (err) {
						console.log("Problem checking in",err);
						res.send(false);
					} else {
						res.send(true);
					}
				});
				done();
			});
		}
	});
});

app.post("/suggest", function(req,res) {
	validate(req,pg,db, function(data) {
		var uid = data;
		if (uid > 0) {
			pg.connect(db, function(err, client, done) {
				if (err) {
					return console.error('Problem fetching client from pool', err);
				} 
				client.query("insert into locationsuggestions(eid,place_id,location) values((select eid from goingto where uid=$1),$2,$3)",[uid,req.body.place_id,req.body.location_name], function(err,result) {
					if (err) {
						console.log("Problem checking in",err);
					} else {
					}				
					res.redirect("/meet");
				});
				done();
			});
		}
	});
});
app.get("/location", function(req,res) {
	validate(req,pg,db, function(data) {
		var uid = data;		
		if (uid > 0) {
			var name = req.query.name;
			pg.connect(db, function(err, client, done) {
				if (err) {
					return console.error('Problem fetching client from pool', err);
				} 
				client.query("select latitude,longitude from goingto,users where users.id = goingto.uid and users.username =$1",[name], function(err,result) {
					if (err) {
						console.log("Problem checking in",err);
						res.send("");
					} else {
						console.log(name);
						res.send([result.rows[0].latitude,result.rows[0].longitude]);
					}
				});
				done();
			});
		}
	});
});

app.get("/center", function(req,res) {
	validate(req,pg,db, function(data) {
		var uid = data;
		if (uid > 0) {
			var name = req.query.name;
			pg.connect(db, function(err, client, done) {
				if (err) {
					return console.error('Problem fetching client from pool', err);
				} 
				client.query("select avg(latitude) as lat ,avg(longitude) as lon,events.location as loc from goingto,events where goingto.eid = events.id and events.id in(select eid from goingto where uid = $1) group by events.location",[uid], function(err,result) {
					if (err) {
						console.log("Problem checking in",err);
					} else {
						console.log(name);
						res.send([result.rows[0].lat,result.rows[0].lon,result.rows[0].loc]);
					}
				});
				done();
			});
		}
	});
});
}
