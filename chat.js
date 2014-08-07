module.exports =function(app, pg, db, validate){
var bodyParser = require('body-parser');
var sanitizer = require('sanitizer');
//allows parsing of POST information
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var openConnections = [];
var openConnectionsEvents = [];

app.get("/stream", function(req,res) {
console.log("streaming");
	validate(req,pg,db, function(data) {
		var uid = data;
		if (uid > 0) {
			pg.connect(db, function(err, client, done) {
				client.query("select eid from goingto where uid=$1",[uid], function(err,result){
					if (err) {
						console.log("Problem checking in",err);
						res.send(false);
					} else {
					}
					if (result.rows.length > 0) {
						var eid = result.rows[0].eid
					} 

					req.socket.setTimeout(Infinity);
				 
					// send headers for event-stream connection
					// see spec for more information
					res.writeHead(200, {
						'Content-Type': 'text/event-stream',
						'Cache-Control': 'no-cache',
						'Connection': 'keep-alive'
					});
					res.write('\n');
					openConnections.push(res);
					openConnectionsEvents.push(eid);

				});
				done();
			});
		}
	});
	req.on('close', function(){
		openConnectionsEvents.splice(openConnections.indexOf(res), 1);
		openConnections.splice(openConnections.indexOf(res), 1);
	});
});

app.get("/chat", function(req,res) {
	validate(req,pg,db, function(data) {
		var uid = data;
		if (uid > 0) {
			pg.connect(db, function(err, client, done) {
				if (err) {
					return console.error('Problem fetching client from pool', err);
				} 
				client.query("select content,username,time from messages,users where messages.uid = users.id and messages.eid in (select eid from goingto where uid =$1) order by time asc",[uid], function(err,result) {
					if (err) {
						console.log("Problem checking in",err);
					} else {
						res.send([result.rows]);
					}
				});
				done();
			});
		}
	});
});

app.post("/message", function(req,res) {
	var message = sanitizer.sanitize(req.body.content);
	console.log(message);
	validate(req,pg,db, function(data) {
		var uid = data;
		if (uid > 0) {
			pg.connect(db, function(err, client, done) {
				if (err) {
					return console.error('Problem fetching client from pool', err);
				} 
				client.query("insert into messages(uid,eid,content) values($1,(select eid from goingto where uid=$1),$2)",[uid,message], function(err,result) {
					if (err) {
						res.send(false);
						console.log("Problem checking in",err);
					} else {
						res.send(true);
					}				
				});
				done();
				client.query("select eid,username from goingto,users where uid=$1 and uid=id",[uid], function(err,result) {
					if (err) {
						console.log("Problem checking in",err);
					} else {
						if (result.rows.length !=0) {
							var eid = result.rows[0].eid;
							for (var i in openConnectionsEvents) {
								if (eid == openConnectionsEvents[i]) {
									var d = Date();
									openConnections[i].write('data:' + JSON.stringify({content:message,time:d,username:result.rows[0].username}) + '\n' + d + '\n\n'); // Note the extra newline
    							}
							}
						}
					}				
				});
				done();
			});
		}
	});

});

}
