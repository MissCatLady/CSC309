module.exports =function(app, pg, db, validate){

	
var bodyParser = require('body-parser');
//allows parsing of POST information
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//register on index
app.post('/register', function(req, res){
	pg.connect(db, function(err, client, done) {
		if (err) {
			return console.error("Can't fetch client from server", err);
		}
		var insert ="insert into users (id, username,email,password,token, gender,dob) values (default,'"+req.body.name+"','"+req.body.email+"','"+req.body.password+"', null, null, null) returning id";
		client.query("insert into users (id, username,email,password,token, gender,dob) values (default,'"+req.body.name+"','"+req.body.email+"','"+req.body.password+"', null, null, null) returning id", function(err, result){
			if(err)
				throw err;
			res.redirect('/index');
			
		});
		var privInsert = "insert into privacy (id, uid, content,location,ginvite,finvite) values(default, 1,'fi','fi','fi','fi')";
		client.query(privInsert, function(err){
			if (err)
				throw err;
		})
		done();
	});
});


app.get('/settings', function(req,res) {

	
	res.render("settings.jade");
	
	/*pg.connect(db, function(client, err, done){
		if (err){
			return console.error("Can't fetch client from server", err);
		}
		var profileSettings = "select * from users where id='" +uid + "'";
		client.query(profileSettings,function(err,result){
			if (results.rows.length !=0){
			
			}
		
		});
		
		
	
	});
	validate(req,pg,db, function(data) {
		var uid = data;
		if(uid > 0){
			res.render("settings.jade");
		}else{
			res.redirect('/index');
		}
	});*/
});

app.get('/tester', function(req, res){

	res.send("to print out stuff");
});
app.get('/schedule', function(req,res) {

	validate(req,pg,db, function(data) {
		var uid = data;
		if(uid > 0){
			res.render("schedule.jade");
		}else{
			res.redirect('/index');
		}
	});
});

}