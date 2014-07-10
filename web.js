// web.js
var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');


app.use(logfmt.requestLogger());


app.use(express.static(__dirname + '/public'));

//authentication var
var auth=0;

//handles URL route requests
require('./router.js')(app, pg, auth);


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
