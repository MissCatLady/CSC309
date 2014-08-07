module.exports = function(app, pg, db, validate, fetchTheme, assignTheme) {
var encrypt = require("crypto");

Recaptcha = require('recaptcha').Recaptcha;
var bodyParser = require('body-parser');
//allows parsing of POST information
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var cssFile;
//game 1: scavenger hunt in action
app.get('/scavenger', function(req,res) {

    //prevents cross site scripting from scavenger page
    res.locals.csrf = encodeURIComponent(req.csrfToken());

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
/*app.post('/startscav',function(req,res){
    
    res.locals.csrf = encodeURIComponent(req.csrfToken());
    console.log("thhhhhhhhhhhhhhhhhhhhhhheeeeeeeeeeeeeeeeeeeeeeeeee sssssstttttttttttarrrrrrrrrrrrrtssssssssssssscccccccaaaaaaaaaaavvvvvvvvvv");
    validate(req,pg,db, function(data) {
    var uid = data;
    var originlat = req.body.latitude;
    var originlong = req.body.longitude;
    console.log(originlong+""+originlat);
    //if the user id is bigger than 0 (not -1) then that means the id is valid, then use it
    if(uid>0){
        pg.connect(db, function(err, client, done) {
            if (err) {
                return console.error('Problem fetching client from pool', err);
            }
            client.query("insert into scav values($1,$2,$3)",[uid,originlong,originlat], function(err,result) {
                if (err) {
                    console.log("error from inserting", err);
                } else {
                    console.log("muhahahahahahaha");
                }
                
            });
            done();
        });

        }
    });



});*/

app.get('/startscav',function(req,res){
    res.locals.csrf = encodeURIComponent(req.csrfToken());
    console.log("aight")
    validate(req,pg,db, function(data) {
    var uid = data;
        pg.connect(db, function(err, client, done) {
            if (err) {
                return console.error('Problem fetching client from pool', err);
            }
            client.query("select level from scavrank where userid = $1",[uid], function(err,result) {
                if (err) {
                    console.log("error from selecting", err);
                } else {
                //if the user with this user id has played this game before simply load the result, else insert with level 1
                    if(result.rows.length!=0){
                    console.log(result.rows[0]);
                    res.send(result.rows[0]);
                }
                    else{

                            client.query("insert into scavrank values($1,$2)",[uid,1],function(err,result){
                                done();

                            });

                        
                        }
                }
                
            });
            done();
        });
    });

});

 app.post('/winscav',function(req,res){
    res.locals.csrf = encodeURIComponent(req.csrfToken());
    console.log("helleooo");
    validate(req,pg,db, function(data) {
    var uid = data;
    if(uid!=-1){
    var playerrank;
    if(parseInt(req.body.rank)<=3){
     playerrank = parseInt(req.body.rank);
    }
    else{
        playerrank=1;
    }
        pg.connect(db, function(err, client, done) {
            if (err) {
                return console.error('Problem fetching client from pool', err);
            }
            client.query("update scavrank set level=$2 where userid=$1",[uid,playerrank], function(err,result) {
                if (err) {
                    console.log("error in posting", err);
                } else {
                   done();
                }
                
            });
            done();
        });

    }
    });

    });



}