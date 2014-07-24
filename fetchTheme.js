module.exports = function(req, pg, db, uid, callback){

	console.log("in fetch theme");
	
	if(!req.cookies.token){
		callback(-1);
		
	} else{
		pg.connect(db, function(err, client, done) {
			if (err) {
				callback('Problem fetching client from pool', err);
			} 
			console.log("uid is ", uid);
			client.query("select * from themes where uid="+ uid, function(err, result){
				if(result.rows.length == 0){
					callback(-1);
				}else{
					console.log("fetching theme:" + result.rows[0].theme);
					callback(result.rows[0].theme);
				}
			});
			done();
		});
	}
}



