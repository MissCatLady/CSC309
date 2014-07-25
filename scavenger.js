module.exports = function(app, pg, db, validate, fetchTheme, assignTheme) {

var cssFile;
//game 1: scavenger hunt in action
app.get('/scavenger', function(req,res) {

	validate(req,pg,db, function(data) {
        var uid = data;
        if (uid > 0) {
            fetchTheme(req, pg, db, uid, function(data1){
                cssFile = assignTheme(data1);
                res.render('scavenger.jade', {myTheme:cssFile});
                 });
          
				
			}else{
            console.log("redirected from games");
            res.redirect('/index');
        }
		  });       
		
});

}