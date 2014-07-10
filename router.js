module.exports = function(app, pg, auth) {

var bodyParser = require('body-parser');
//allows parsing of POST information
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var db = process.env.DATABASE_URL || "postgres://localhost:5432/localdb";

var uid = 0;
var name = "";
var players = [];

//index page
app.get('/', function(req,res) {
		res.render('index.jade');
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
			uid = result.rows[0].id;
			name = result.rows[0].name;
			players.push[name];
			auth=1;
			res.render("meet.jade");
		}else{
			res.locals.message = "Invalid Login";
			res.render("index.jade");
		}

		done();

		});
	});

});


app.get('/meet', function(req,res) {

	if (auth) {
		res.render('meet.jade');
	} else {
		login(res);
	}
	});


app.get('/games', function(req,res) {
	if (auth) {
 		res.render('games.jade');
 	} else {
 		login(res);
 	}
	});

app.get('/hidenseek', function(req,res) {

	if (auth) {

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
				friends[friends.length] = result.rows[i].username;
			}

			res.render("hidenseek.jade", {friends: friends});

		} else {
			res.locals.message = "No friends. Add Friends";
			res.render('hidenseek.jade');
		}
		});
	done();

    });

	} else {
		login(res);
	}
});

app.post ('/getseeker', function(req,res) {

	//adds current players to players[]
	for (var i in req.body.mydropdown) {
		players.push(req.body.mydropdown[i]);
	}
	
	console.log("GAME STARTED");
	var randnum = Math.floor(Math.random()*players.length);
	var seeker = players[randnum];


	if (players[0] == seeker) {
		res.locals.whoisseeker = "You are the seeker!";
	} else {
		res.locals.whoisseeker = seeker + " is the seeker!";
	}


});

//logout link
app.get('/index', function(req,res) {

	auth=0;
	res.render("index.jade");
});

//Sends back to index
function login(res) {
	res.locals.message = "Please Login";
	res.render('index.jade');
}



}