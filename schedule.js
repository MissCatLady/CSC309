module.exports =function(app, pg, db, validate, fetchTheme, assignTheme){

var bodyParser = require('body-parser');
//allows parsing of POST information
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var cssFile;

app.get('/schedule', function(req,res) {

	validate(req,pg,db, function(data) {
		var uid = data;
		if(uid > 0){
			fetchTheme(req, pg, db, uid, function(data1){
				cssFile = assignTheme(data1);
				console.log("fetched theme is: " + cssFile); 
				renderSchedule(pg, db, req, res, uid);
			});
		}else{
			res.redirect('/index');
		}
	});
});

function renderSchedule(pg, db, req, res, uid){

	pg.connect(db, function(err, client, done) {
		if (err){
			return console.error('render Schedule: Problem fetching client from pool', err);
		}else {
			var friends =[];
			var scheduledMeetings = []; // fectch friend list
			client.query("select username from users where id in((select id2 from friendships where id1=$1" + 
					     ") union (select id1 from friendships where id2=$1))",[uid], function(err,result){
				if (err){
					return console.log("render Schedule : problem getting friend list from DB",err);
				}else{   // going to get friend list
					console.log("render schedule: query was successful");
					if (result.rows.length != 0){  // yes there is a friend list
						for (var i in result.rows) {
						friends[friends.length] = result.rows[i].username;
						} // got friend list now fetch future meet items three queries
						
						// query 1 meeting created by the user uid
						client.query("select mid, date, time from FutureMeetings where moid=" + uid, function(err, result){
							if (err){
								return console.log("render schedule: problem getting future meetings q1", err);
							}else {// going to get meet items query 1
								console.log("render schedule: query 1 was a success");
								if (result.rows.length != 0){
									for (var i in result.rows){
										var date = result.rows[i].date;
										var title = result.rows[i].mid+": "+ date.toDateString() +" @" + result.rows[i].time ;
										console.log(title);
										scheduledMeetings[scheduledMeetings.length] = title;
									}
								}//query 2 meets he has been invited to but not accepted
							client.query("select t1.mid, t1.date, t1.time from futuremeetings t1 join futureinvited t2 on t1.mid = t2.mid and t2.to_uid ="+ uid, function(err, result){
							if (err){return console.log("render schedule: problem getting future meetings q2", err);
							} else { // going to get invited to meetings
								console.log("render schedule: query 2 was a success");
								if (result.rows.length != 0){
									for (var i in result.rows){
										var date = result.rows[i].date;
										var title = result.rows[i].mid +": " + date.toDateString()+" @" + result.rows[i].time ;
										console.log(title);
										scheduledMeetings[scheduledMeetings.length] = title;
									}
								}// query 3 meetings he has accepted, i.e goingto
							client.query("select mid, date, time from futuremeetings where mid in(select mid from FutureGoingTo where uid=" +uid +")", function(err, result){
							if (err){return console.log("render schedule: problem getting future meetings q3", err);}
							else{
								console.log("render schedule: query 3 was a success");
								if (result.rows.length != 0){
									for (var i in result.rows){
										var date = result.rows[i].date;
										var title = result.rows[i].mid +": " + date.toDateString()+" @" + result.rows[i].time ;
										console.log(title);
										scheduledMeetings[scheduledMeetings.length] = title;
									}
								}console.log("going to render");
								res.render('schedule.jade', {myTheme:cssFile, friends:friends, schedules:scheduledMeetings});
							}});	
						}});
					}});
						
					}else {console.log("query successful but this person has no friends:( sad"); // render empty schedule page
						res.render('schedule.jade', {noFriends:true,myTheme:cssFile, friends:friends, schedules:scheduledMeetings});
					}
				}});
		}done() 
		});
}									


app.post('/sendInvitation', function (req, res){

	validate(req,pg,db, function(data) {
		var uid = data;
		if(uid > 0){
			console.log('sendInvitation');
			pg.connect(db, function(err, client, done){
				if (err) { 
					return console.error("connection failed fetching client",err)
				}else{
					if (req.body.mydropdown == undefined){
						res.redirect('/schedule');
					}else{
						var date = req.body.mydate;
						date = date.split("/")[2]+ "-" + date.split("/")[0]+ "-" + date.split("/")[1];
						createFutureMeeting(client, err, uid, req.body.mylocation, req.body.mytime, date, req.body.mydropdown, res) ;
					}
				}
			done();
			});	
		}else{
			res.redirect('/index');
		}
	});
});

function createFutureMeeting(client, err, moid, location, time, date, friendlist, res){
	var insertQ = "insert into futuremeetings(mid, moid, location, time, date) values (default,"+moid+",'"+location+"','"+time+"', '"+date+"') returning mid";
	client.query (insertQ,function(err, result){
		if (err){
			return console.log("new future meet insert failed",err);
		}else {
			if (result.rows.length != 0){
				var mid = result.rows[0].mid;
				console.log(mid, 'meet id');
				if (Array.isArray(friendlist)) {
					for (friend in friendlist){
						var username = friendlist[friend];
							console.log("friend", username);
							sendInvite(client, err, username, mid, moid)
					}
				} else {
					var username = friendlist;
					console.log("friend", username);
					sendInvite(client, err, username, mid, moid)
				}
				res.redirect('/schedule');
			}
		}
	});
}


function sendInvite(client, err, username, mid, moid){
	client.query("select id from users where username ='"+ username+"'", function(err,result){
		if (err){ return console.log("client connection failed in send invite function",err)}
		else{
			if (result.rows.length != 0){
				var uid = result.rows[0].id;
				console.log("username has id ", result.rows[0].id);
				var insertQ = "insert into futureinvited(mid, moid, to_uid) values ("+mid+","+moid+","+uid+")";
				client.query (insertQ,function(err){
						if (err){
							return console.log("send invite insert failed",err);
						}
				});
			}else{ return console.log("username was not found, should never come here ")};
		}
	});
}

/* FUTUURE MEET ITEM */
app.get('/futureMeeting', function (req, res){

	validate(req,pg,db, function(data) {
		var uid = data;
		if(uid > 0){
			var meetItem = req.query.futureMeets
			console.log(meetItem, "item selected");
			if (meetItem == undefined){ res.redirect('/schedule');}
			else { // if a meet item is selected fetch that items information
				fetchTheme(req, pg, db, uid, function(data1){
				cssFile = assignTheme(data1);
				var mid = meetItem.split(":")[0]; console.log(mid, "mid");
				pg.connect(db, function(err, client, done) {
					if (err){
						return console.error('future meeting: Problem fetching client from pool', err);
					}else { // send 3 queries to find meeting info
						var finvited = []; var fgoingTo = [];
						var myMid = parseInt(mid);
						// query 1 
						client.query("select * from futuremeetings where mid="+myMid, function(err, result){
							if (err) {return console.log("future meetings:query failed", err);}
							else{ console.log("future meetings:query successful",result.rows.length );
								if (result.rows.length !=0){
									var t = result.rows[0].time; var loc = result.rows[0].location;
									var d = result.rows[0].date;
									var m = (parseInt(d.getMonth()) + 1).toString();
									//console.log(d, "date", m);
									//console.log(d.getMonth(), "date");
									//console.log(d.getFullYear(), "date");
									//console.log(d.getDate(), "date");
									var newD = m +"-"+d.getDate() + "-"+ d.getFullYear();
									console.log(newD);
								}// query 2 to get  who is invited yet not has accepted
								client.query("select username from users where id in(select to_uid from futureinvited where mid=" +myMid+")", function(err, result){
										if (err){ return console.log("future meet: problem getting future meetings", err);}
										else {console.log("future meet: query was a success for invited ppl");
												if (result.rows.length != 0){
													for (var i in result.rows){
														finvited[finvited.length] = result.rows[i].username;
													}
												}
								// query 3 to get ppl who are going to the meeting
								client.query("select username from users where id in (select uid from futuregoingTo where mid="+ myMid+ ")",function(err, result){
										if (err){return console.log("future meet: query 3 failed",err)}
										else{console.log("future meet: query was a success for going t ppl");
											if(result.rows.length !=0){
												for (var i in result.rows){
													fgoingTo[fgoingTo.length] = result.rows[i].username;
												}
											}decideFutureMeetLook(cssFile,loc,newD,t,finvited,fgoingTo, myMid, uid, res);// --> renders the page	
										}});
								}});
							}});
					}done()
					
					});
				});
			}
		} else{ res.redirect('/index');  }
	});
})

function decideFutureMeetLook(cssFile,location, date, time, finvited,fgoingTo, mid, uid, res){

	pg.connect(db, function(err, client, done) {
		if (err){return console.log("connection failed",err)}
		else{
			console.log("connection success");
			// 3 queries to find the look 
			// q1 to decide if the user is the creator of the meeting
			client.query("select mid, moid from futuremeetings where moid="+uid + "and mid =" +mid, function(err, result){
				if (err) {return console.log("query failed", err)}
				else{
					console.log("query succes");
					if (result.rows.length != 0 ){
						console.log("uid " + uid +" is the creator of this meeting")
						return res.render('futureMeetItem.jade', {myTheme:cssFile,mylocation:location, mytime:time, mydate:date, owner:true, invitedlist:finvited, attendees:fgoingTo, myID:mid});
					}else{ // find if user has accepted the invite or not since he is not the owner of this meeting
						console.log("user was invited/going to this meeting");
						// q2 to see if he is going to this meeting,
						client.query("select uid from futuregoingTo where mid="+mid +" and uid ="+uid, function(err, result){
							if (err) {return console.log("query failed", err)}
							else{ console.log("query succes");
								if (result.rows.length != 0 ){
									console.log("user going to this meeting", result.rows);
									return res.render('futureMeetItem.jade', {myTheme:cssFile,mylocation:location, mytime:time, mydate:date, invitedlist:finvited, attendees:fgoingTo, myID:mid});
								} else { //user is invited but has not accepted
									res.render('futureMeetItem.jade', {myTheme:cssFile,mylocation:location, mytime:time, mydate:date, notOwner:true, notAC:true, invitedlist:finvited, attendees:fgoingTo, myID:mid});
								}
						}});
					}
				}
			});
		}done();
	});
}


app.post('/meetItemActions', function (req, res){

	validate(req,pg,db, function(data) {
		var uid = data;
		if(uid > 0){
				console.log('meetItem actions', req.body.myMeetItem);
				console.log('mid', req.body.myID);
				var action = req.body.myMeetItem;
				pg.connect(db, function(err,client, done){
					if (err){return console.log("connection failed",err)}
					else {
						if (action == "update"){
							update(client, req);
						}else if (action == "accept"){
							accept(client, req, err, uid);
						}else if (action == "reject"){
							reject(client, req, err, uid);
						}res.redirect('back')//?futureMeets='+req.body.futureMeets); //futureMeeting?futureMeets=1%3A+Tue+Dec+09+2014+%4010+pm
					}
				done();
				});
		}else{
			res.redirect('/index');
		}
	});
});

function update(client, req){
	
	var loc = req.body.mylocation; var time = req.body.mytime;
	var date = req.body.mydate; var mid = req.body.myID;
	if (date.indexOf("-") > -1){ date = date.split("-")[2]+ "-" + date.split("-")[0]+ "-" + date.split("-")[1]
	}else {
	date = date.split("/")[2]+ "-" + date.split("/")[0]+ "-" + date.split("/")[1]; }
	client.query("update futuremeetings set location='"+ loc + "' where mid ="+mid);
	client.query("update futuremeetings set time='" +time + "' where mid ="+mid);
	client.query("update futuremeetings set date='" +date+ "' where mid ="+mid);
}

function reject(client, req, err, uid){
	
	var mid = req.body.myID;
	delRecord(client, err, "delete from futureinvited where mid="+ mid + "and to_uid ="+ uid);
	
}

function accept(client, req, err, uid){

	var mid = req.body.myID;
	delRecord(client, err, "delete from futureinvited where mid="+ mid + "and to_uid ="+ uid);
	pg.connect(db, function(err, client, done){
		if (err) {return console.log("connection failed",err)}
		else{
			client.query("insert into futuregoingto (uid, mid) values("+uid+","+mid+")", function(err){
				if (err){
					return console.log("accept query failed");
				}
			});
		}done();
	});
}

function delRecord(client, err, myQuery){
	pg.connect(db, function(err, client, done){
		if (err) {return console.log("connection failed",err)}
		else {
			client.query(myQuery, function(err){
				if (err){
					return console.log("delete record failed");
				}else{
					console.log("delete was successful");
				}
			});
		}
	done();
	});
}


}