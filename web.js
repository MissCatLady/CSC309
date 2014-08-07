require('newrelic');

if(process.env.NODETIME_ACCOUNT_KEY) {
  require('nodetime').profile({
    accountKey: process.env.NODETIME_ACCOUNT_KEY,
    appName: 'Find Me' // optional
  });
}

// web.js
var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');
var cookieParser = require("cookie-parser");
var session = require('express-session');
var csrf = require('csurf');


//database URL server & locals
var db = process.env.DATABASE_URL ||{ host: 'ec2-54-225-101-60.compute-1.amazonaws.com',user: 'cmrglpqggskkzm',password: '0cHW2gJuje_TapEfKLBiRalp8h',database: 'dcls3gldouub19',ssl: true }|| "postgres://localhost:5432/FINDMEDB" || "postgres://cmrglpqggskkzm:0cHW2gJuje_TapEfKLBiRalp8h@ec2-54-225-101-60.compute-1.amazonaws.com:5432/dcls3gldouub19";

app.use(logfmt.requestLogger());
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(session({secret:'poop', saveUninitialized: true,resave: true}));
app.use(csrf());





//handles login cookie validations
var validate = require('./validate.js');
// fetches user theme
var fetchTheme = require('./fetchTheme.js');
var assignTheme = require('./assignTheme.js');

//handles registration
require('./register.js')(app,pg, db, validate);
//handles schedules
require('./schedule.js')(app,pg, db, validate, fetchTheme, assignTheme);
//meeting & friendlist functionality
require('./meet.js')(app, pg, db, validate, fetchTheme, assignTheme);
//chat box for games & meet
require('./chat.js')(app, pg, db, validate);
//handles login/logout and hide & seek game logic
require('./hidenseek.js')(app, pg, db, validate, fetchTheme, assignTheme);
//scavenger hunt game 
require('./scavenger.js')(app,pg,db,validate, fetchTheme, assignTheme);
//manhunt game
require('./manhunt.js')(app,pg,db,validate, fetchTheme, assignTheme);

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
