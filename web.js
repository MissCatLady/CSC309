// web.js
var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');
var cookieParser = require("cookie-parser");


app.use(logfmt.requestLogger());
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

//database URL
var db = process.env.DATABASE_URL || "postgres://localhost:5432/localdb" || "postgres://cmrglpqggskkzm:0cHW2gJuje_TapEfKLBiRalp8h@ec2-54-225-101-60.compute-1.amazonaws.com:5432/dcls3gldouub19";

//handles login cookie validations
var validate = require('./validate.js');
//handles URL route requests

//require('./router.js')(app, pg, db, validate);
require('./register.js')(app,pg, db, validate);
require('./lia.js')(app, pg, db, validate);
require('./meet.js')(app, pg, db, validate);




var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
