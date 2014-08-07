module.exports =function(app, pg, db, validate){

var encrypt = require("crypto");
var bodyParser = require('body-parser');
//allows parsing of POST information
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set of global variables for user specific settings
var FN ; var LN; var bday; var bmonth; var byear; var uemail; var upswrd; 
var fgen; var mgen; 

var Eq1; var Fq1; var Eq2; var Fq2; 
var Eq3; var Fq3; var Eq4; var Fq4; 
var utheme1;var utheme2;var utheme3;var utheme4;var utheme5;var utheme6;
var cssFile;

var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

//register on index
app.post('/register', function(req, res){
	
	res.locals.csrf = encodeURIComponent(req.csrfToken());
	pg.connect(db, function(err, client, done) {
		if (err) {
			 return console.error("Register: Can't fetch client from server", err);
		}else {
			console.log("REGISTER: Connected to DB successfully!!!");
			var validateUserName = "select username from users where username=$1";
			var validateEmail = "select email from users where email=$2";
			client.query(validateUserName,[req.body.name], function(err, result){
				if (err){
					return console.log("problem validating user name",err);
				}else {
					if (result.rows.length == 0){
						client.query(validateEmail,[req.body.email], function(err, result){
							if (err){
								return console.log("problem validating email",err);
							}else {
								if (result.rows.length == 0){
									registerUser(req, res, client, err);
								}else {
									console.log("email uniqueness voilation");
									res.locals.regMsg = "Email already exists";
									res.render('/index');
								}
							}
						});done();
					}else {
						console.log("username uniqueness voilation");
						res.locals.regMsg = "Username already exists, Please choose another username";
						res.render('/index');
					}
				}
			}); done();
		}
	});
});

function registerUser(req, res, client, err){


	var currdate = new Date();
	//hash password with reg date salt
	var date = currdate.toString();
	var password = encrypt.createHash("sha1").update(req.body.password + date).digest("hex");

	client.query("insert into users (id, username,email,password,token, regdate) values (default,$1,$2,$3, null, $4) returning id",[req.body.name,req.body.email,password,date], function(err, result){
		if(err){
			return console.log("Register User function: insert failed", err);
		}else{
			console.log("REGISTER: User registered successfully");
			if (result.rows.length != 0){
				var uid = result.rows[0].id;
				var privInsert = "insert into privacy (id, uid, content,location,ginvite,finvite) values(default,$1,'F','F','F','F')";
				client.query(privInsert,[uid], function(err){
					if(err){
						return console.log("Register: privacy insert failed", err);}
				}); done();
				var themeInsert = "insert into themes (id,uid,theme) values (default,$1,'theme1')";
				client.query (themeInsert,[uid],function(err){
					if (err){
						return console.log("Register: theme insert failed",err);
					}
				}); done();
				var profSettings = "insert into UserInfo (uid,gender,dob,fname,lname) values ($1,null, null ,null, null)";
				client.query (profSettings,[uid],function(err){
					if (err){
						return console.log("Register: insert for user info failed", err)}
				}); done();
				var currdate = new Date();
				var token = encrypt.createHash("sha1").update(req.body.email + currdate.toString()).digest("hex");
				client.query("update users set token=$1 where id=$2",[token,result.rows[0].id]);
				res.cookie('token', token);
			}else {
				return console.log("register failed, cant get user id", err);
			}
		}
		res.redirect('/meet');
	});done();
}

// Get user specific settings page if the user exists
app.get('/settings', function(req,res) {
	
	//prevents cross site scripting from form actions in meet
	res.locals.csrf = encodeURIComponent(req.csrfToken());
	
	validate(req,pg,db, function(data) {
		var uid = data;
		console.log("UID", uid);
		if(uid > 0){ 
			pg.connect(db, function(err, client, done){
				if (err) {
					return console.error('Problem fetching client from pool', err);
				}else{
					console.log("SETTINGS: Connected to DB successfully!!!");
					var myQuery = "select t1.email, t1.password, t4.gender, t4.dob, t4.fname, t4.lname, t2.content, t2.location,t2.finvite, t2.ginvite, t3.theme from users t1 join privacy t2 on t1.id = t2.uid join themes t3 on t1.id = t3.uid join userinfo t4 on t1.id = t4.uid where t1.id=$1";
					client.query(myQuery,[uid], function(err, result){
						if (err) {
							return console.log("Unable to get settings", err);
						}
						if (result.rows.length !=0){
							// profile stuff
							FN = result.rows[0].fname; LN = result.rows[0].lname;
							uemail = result.rows[0].email;
							upswrd = result.rows[0].password;
							if (result.rows[0].gender == "F" || result.rows[0].gender == "f"){
								fgen = true; mgen = false;
							}else if (result.rows[0].gender == "M" || result.rows[0].gender == "m"){
								fgen = false; mgen = true;
							}else {fgen = mgen = false;}
							//console.log("bday", result.rows[0].dob == null)
							if (result.rows[0].dob != null){
								bday = result.rows[0].dob;
								bday = bday.getDate();
								bmonth = result.rows[0].dob;
								bmonth = month[bmonth.getMonth()]
								byear = result.rows[0].dob;
								byear = byear.getFullYear();
							}else {console.log("bday", result.rows[0].dob)}
							// privacy stuff
							if (result.rows[0].content == "F" || result.rows[0].content == "f"){
								Fq1 = true; Eq1 = false;
							}else {Fq1 = false; Eq1 = true;}
							if (result.rows[0].location == "F" || result.rows[0].location == "f"){
								Fq2 = true; Eq2 = false;
							}else {Fq2 = false; Eq2 = true;}
							if (result.rows[0].finvite == "F" || result.rows[0].finvite == "f"){
								Fq3 = true; Eq3 = false;
							}else {Fq3 = false; Eq3 = true;}
							if (result.rows[0].ginvite == "F" || result.rows[0].ginvite == "f"){
								Fq4 = true; Eq4 = false;
							}else {Fq4 = false; Eq4 = true;}

							// theme stuff
							if (result.rows[0].theme == 'theme1'){
								utheme1 = true;
								utheme2 = utheme3 = utheme4 = utheme5 = utheme6 = false;
								cssFile = '../css/theme1.css'
							}else if (result.rows[0].theme == 'theme2'){
								utheme2 = true;
								utheme1 = utheme3 = utheme4 = utheme5 = utheme6 = false;
								cssFile = '../css/theme2.css'
							}else if (result.rows[0].theme == 'theme3'){
								utheme3 = true;
								utheme1 = utheme2 = utheme4 = utheme5 = utheme6 = false;
								cssFile = '../css/theme3.css'
							}else if (result.rows[0].theme == 'theme4'){
								utheme4 = true;
								utheme1 = utheme2 = utheme3 = utheme5 = utheme6 = false;
								cssFile = '../css/theme4.css'
							}else if (result.rows[0].theme == 'theme5'){
								utheme5 = true;
								utheme1 = utheme2 = utheme3 = utheme4 = utheme6 = false;
								cssFile = '../css/theme5.css'
							}else if (result.rows[0].theme == 'theme6'){
								utheme6 = true;
								utheme1 = utheme2 = utheme3 = utheme4 = utheme5 = false;
								cssFile = '../css/theme6.css'
							};
							res.render('settings.jade', {myTheme:cssFile, fname:FN, lname:LN, email:uemail, password:upswrd, fem:fgen, mal:mgen, dayV:bday, monthV:bmonth, yearV:byear, q1F:Fq1, q1E:Eq1, q2F:Fq2, q2E:Eq2, q3F:Fq3, q3E:Eq3, q4F:Fq4, q4E:Eq4, theme1:utheme1, theme2:utheme2, theme3:utheme3,theme4:utheme4,theme5:utheme5,theme6:utheme6});
						}
					});done();
				}
				done();
			});
		}else{
			res.redirect('/index');
		}
	});
});

// Post profile settings to server
app.post('/settingsProfile', function(req, res){
	validate(req,pg,db, function(data) {
		var uid = data;
		console.log("Post Profile Settings UID", uid);
		if(uid > 0){
			pg.connect(db, function(err, client, done) {
				if (err) {
					return console.error("Post Settings profile, Can't fetch client from server", err);
				}else {
					console.log("profile: Connected to DB successfully!!!");
					var q1 = "select email, password from users where id=$1";
					var q2 = "select * from userinfo where uid=$1";
					client.query(q1,[uid], function(err, result){
						if(err){
							return console.log("post prof settings: q1 connection failed", err);
						}else{
							console.log(" User profile fetched from server successfully");
							if (result.rows.length != 0){
								var password = req.body.password;
								var email = req.body.email;
								client.query("update users set email=$2 where id=$1", [uid, email]);
								client.query("update users set password=$2 where id=$1", [uid, password]);
								console.log(" Users table updated successfully");
							}else {
								console.log("post profile setting, q1 result was zero rows", err);
							}
						}
					});done();
					client.query(q2,[uid],function(err, result){
						if(err){
							return console.log("post prof settings: q2 connection failed", err);
						}else {
							console.log(" Additional User info fetched from server successfully");
							if (result.rows.length != 0){
								var fname = req.body.fname;
								var lname = req.body.lname;
								var day = req.body.Day;
								var month = req.body.month;
								var year = req.body.Year;
								var gen = req.body.sex;
								var myDob = year+"-" +month+"-"+ day;
								console.log("gen", gen);
								if (gen != ""){
									if ( gen == "male")
										{gen = 'M';}
									else
										{gen = "F"}
								client.query("update userinfo set gender=$2 where uid=$1",[uid, gen]);
								}
								client.query("update userinfo set fname=$2 where uid=$1" ,[uid, fname]);
								client.query("update userinfo set lname=$2 where uid=$1", [uid, lname]);
								client.query("update userinfo set dob=$2 where uid=$1",[uid,myDob]);
								//console.log(typeof day,"day", day);
								//console.log (day instanceof String); console.log (month instanceof String);
								console.log(" additional User info updated successfully");
							}else {
								console.log("post profile setting, q2 result was zero rows", err);
							}
						}
					});done();
					res.redirect('/settings');
				}
			});
		}else{
			res.redirect('/index');
		};										
	});
});

// Post privacy settings to server
app.post('/settingsPrivacy', function(req, res){
	console.log("in privacy");
	validate(req,pg,db, function(data) {
		var uid = data;
		console.log("UID", uid);
		if(uid > 0){
			pg.connect(db, function(err, client, done) {
				if (err) {
					return console.error("Can't fetch client from server", err);
				}else {
					console.log("Privacy: Connected to DB successfully!!!");
					client.query("select * from privacy where uid=$1",[uid], function(err, result){
						if(err){
							return console.log("privacy, fetching failed",err);
						}else{
							console.log("User privacy fetched from server successfully");
							if (result.rows.length != 0){
								//var prevAns1 = result.rows[0].content;	var prevAns2 = result.rows[0].location;
								//var prevAns3 = result.rows[0].finvite;	var prevAns4 = result.rows[0].ginvite;
								var q1 = req.body.ques1;	var q2 = req.body.ques2;
								var q3 = req.body.ques3;	var q4 = req.body.ques4;
								//console.log("1", prevAns1,"2", prevAns2, "3", prevAns3,"4", prevAns4);
								console.log( "1", q1,"2", q2, "3",q3,"4",q4 )
								var ans1; var ans2; var ans3; var ans4;
								if (q1 != ""){
									if (q1 == "F" )
										ans1 = 'F'; 
									else
										ans1 = "E"
									client.query("update privacy set content=$2 where uid=$1",[uid, ans1]);
								}
								if (q2 != ""){
									if (q2 == "F")
										ans2 = 'F';
									else
										ans2 = "E"
									client.query("update privacy set location=$2 where uid=$1",[uid, ans2]);
								}
								if (q3 != ""){
									if (q3 == "F")
										ans3 = 'F';
									else
										ans3 = "E"
									client.query("update privacy set finvite=$2 where uid=$1", [uid,ans3]);
								}
								if (q4 != ""){
									if (q4 == "F")
										ans4 = 'F';
									else
										ans4 = "E"
									client.query("update privacy set ginvite=$2 where uid=$1",[uid,ans4]);
								}
								console.log(" User privacy updated successfully "+ ans1+ " "+  ans2+ " "+ ans3+ " "+ans4);
								res.redirect('/settings');
							}else {
								return console.log("privacy resulting rows were empty",err);
							}
						}
					});done();
				}
			});
		}else{
			res.redirect('/index');
		};					
							
	});
});


// Post user theme settings to server
app.post('/settingsThemes', function(req, res){
	validate(req,pg,db, function(data) {
		var uid = data;
		console.log("Post themes, UID", uid);
		if(uid > 0){
			pg.connect(db, function(err, client, done) {
				if (err) {
					return console.error("Themes: Can't fetch client from server", err);
				}else {
					console.log("themes: Connected to DB successfully!!!");
					client.query("select theme from themes where uid=$1",[uid], function(err, result){
						if(err){
							return console.log("themes, fetching failed",err);
						}else{
							console.log(" User theme fetched from server successfully");
							if (result.rows.length != 0){
								var theme = req.body.theme;
								console.log(req.body);
								if (theme != ""){
									client.query("update themes set theme=$2 where uid=$1",[uid, theme]);
									console.log(" User theme updated successfully");
								}res.redirect('/settings');
							}else {
								console.log("themes, resulting rows were zzero",err);
							}
						}
					});done();
				}
			});
		}else{
			res.redirect('/index');
		};					
							
	});
});

}