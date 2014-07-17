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

				//assumes uid can be id1 or id2
				client.query("SELECT username FROM users WHERE id in ((select id2 from friendships where id1=$1)" + 
				      		    " union (select id1 from friendships where id2=$1))", [uid], function(err,result){
					if(result.rows.length != 0) {
						var friends = [];
						for (var i in result.rows) {
							friends[friends.length] = result.rows[i].username;
						}
						res.render("meet.jade", {friends: friends});
					} else {
						res.render('meet.jade');
					}
				});
			});
		} else {
			res.redirect('/index');
		}
	});
	done();
});
}
