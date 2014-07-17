module.exports = function(req, pg, db, callback){

	console.log("in validate");

	if(!req.cookies.token){
		callback(-1);
		
	} else {

	pg.connect(db, function(err, client, done) {
		if (err) {
			callback('Problem fetching client from pool', err);
		} 

		client.query("select * from users where token='" + req.cookies.token + "'", function(err, result){
			if(result.rows.length == 0){
				callback(-1);
			}else{
				console.log("loggin result:" +  result.rows[0].id);
				callback(result.rows[0].id);
			}
		});

		done();
		
	});
	

	}
}