// web.js
var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');
var cookieParser = require("cookie-parser");
var mongo = require('mongodb');


app.use(logfmt.requestLogger());
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

var mongoUri = process.env.MONGOLAB_URI ||"mongodb://willtheuser:password1@kahana.mongohq.com:10020/app27110801" ||"mongodb://localhost/mydb";

//database URL server & locals
var db = process.env.DATABASE_URL || "postgres://localhost:5432/localdb" || "postgres://ilya:1234@localhost:5432/ilya" || "postgres://cmrglpqggskkzm:0cHW2gJuje_TapEfKLBiRalp8h@ec2-54-225-101-60.compute-1.amazonaws.com:5432/dcls3gldouub19";

//handles login cookie validations
var validate = require('./validate.js');
// fetches user theme
var fetchTheme = require('./fetchTheme.js');
var assignTheme = require('./assignTheme.js');

//handles URL route requests
require('./register.js')(app,pg, db, validate);
require('./schedule.js')(app,pg, db, validate, fetchTheme, assignTheme);
require('./meet.js')(app, pg, db, validate);
require('./chat.js')(app, pg, db, validate);
//handles login/logout & hide & seek game logic
require('./lia.js')(app, pg, db, validate);
//require('./chat_server.js')(app, mongo, mongoUri, validate,pg,db);

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
