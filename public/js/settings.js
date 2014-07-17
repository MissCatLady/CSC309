$(document).ready(function(){
	
	//create drop down for months
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September" ,"October", "November", "December"];
	for(i = 0; i < months.length; i++) {
		var month = months[i];
		var elem = document.createElement("OPTION");
		elem.text = month;
		elem.value = month;
		document.getElementById("myMonth").appendChild(elem);
	};
	// create drop down for days
	var days = range(1,32);
	for(i = 0; i < days.length; i++) {
		var day = days[i];
		var elem = document.createElement("OPTION");
		elem.text = day;
		elem.value = day;
		document.getElementById("myDays").appendChild(elem);
	};
	
	//create drop down for years
	var years = range(2014,1905, -1);
	for(i = 0; i < years.length; i++) {
		var year = years[i];
		var elem = document.createElement("OPTION");
		elem.text = year;
		elem.value = year;
		document.getElementById("myYears").appendChild(elem);
	};
	
	// load profile settings from DB
	// load privacy settings from DB
	// load theme settings from DB
});

$(document).ready(function(){
	$("#profileSave").click(profileSave);
	$("#privacySave").click(privacySave);
	document.getElementById("radio9").addEventListener('click',function() {
	console.log("fdf");

	var theme = document.getElementById("currTheme");
	theme.href = "../css/theme1.css";
	window.sessionStorage.setItem('th',"../css/theme1.css");
	});
});
profileSave=function(){

	var fn = document.getElementById("FN");
	fn.value = "Vera";
	var ln = document.getElementById("LN");
	ln.value = "Rizvi";
	var fn = document.getElementById("email");
	fn.value = "verarizvi@gmail.com";
	var ln = document.getElementById("pswrd");
	ln.value = "password";
	var month = document.getElementById("myMonth")
	month.value = "May";
	var day = document.getElementById("myDays")
	day.value = "30";
	var year = document.getElementById("myYears")
	year.value = "1989";
	document.getElementById("male").checked = false;
	document.getElementById("female").checked = true;
}

privacySave=function(){

	document.getElementById("radio1").checked = true;
	document.getElementById("radio2").checked = false;
	document.getElementById("radio3").checked = true;
	document.getElementById("radio4").checked = false;
	document.getElementById("radio5").checked = true;
	document.getElementById("radio6").checked = false;
	document.getElementById("radio7").checked = true;
	document.getElementById("radio8").checked = false;
}
$(document).ready(function(){
	$("#female").click(function(){
		console.log("female");
	});
});

/**
* Underscore is an open-source component of DocumentCloud. 
* Underscore.js 1.6.0
* http://underscorejs.org
* (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
* Underscore may be freely distributed under the MIT license.
*/
range=function(n,t,r){

arguments.length<=1&&(t=n||0,n=0),r=arguments[2]||1;
for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=new Array(e);e>u;)i[u++]=n,n+=r;return i}