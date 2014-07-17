module.exports = function(app, pg, auth) {

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



//logout link
app.get('/index', function(req,res) {

	auth=0;
	res.render("index.jade");
});

}