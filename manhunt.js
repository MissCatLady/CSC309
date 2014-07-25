module.exports = function(app, pg, db, validate, fetchTheme, assignTheme) {
var cssFile;
//game 3 man hunt
app.get('/manhunt', function(req,res) {

	console.log("Action /manhunt");

	validate(req,pg,db, function(data) {
        var uid = data;
        fetchTheme(req, pg, db, uid, function(data1){
            cssFile = assignTheme(data1);
            if (uid > 0) {
                 res.render('manhunt.jade', {myTheme:cssFile});
              
    				
    			}else{
                console.log("redirected from games");
                res.redirect('/index');
            }
    		  });
        });
        
		
});

}