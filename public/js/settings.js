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
	window.localStorage.setItem('themeDisplay', "noTheme");
	document.getElementById("myMonth").value = document.getElementById("mValue").value;
	document.getElementById("myDays").value = document.getElementById("dValue").value;
	document.getElementById("myYears").value = document.getElementById("yValue").value;
	// loaded profile settings from DB
	// loaded privacy settings from DB
	// loaded theme settings from DB
});

$(document).ready(function(){
	$("#female").click(function(){
		console.log("female");
		var gen = document.getElementById("hiddenGender");
		gen.value = "female";
		
	});
});
$(document).ready(function(){
	$("#male").click(function(){
		console.log("male");
		var gen = document.getElementById("hiddenGender");
		gen.value = "male";
	});
});
// question 1
$(document).ready(function(){
	$("#radio1").click(function(){
		console.log("q1everyone");
		var q1 = document.getElementById("question1");
		q1.value = "E";
	});
});

$(document).ready(function(){
	$("#radio2").click(function(){
		console.log("q1filter");
		console.log(document.getElementById("question1").value);
		var q1 = document.getElementById("question1");
		q1.value = "F";
		console.log(document.getElementById("question1").value);
	});
});

// question 2
$(document).ready(function(){
	$("#radio3").click(function(){
		console.log("q2everyone");
		var q2 = document.getElementById("question2");
		q2.value = "E";
	});
});

$(document).ready(function(){
	$("#radio4").click(function(){
		console.log("q2filter");
		console.log(document.getElementById("question2").value);
		var q2 = document.getElementById("question2");
		q2.value = "F";
		console.log(document.getElementById("question2").value);
	});
});

// question 3
$(document).ready(function(){
	$("#radio5").click(function(){
		console.log("q3everyone");
		var q3 = document.getElementById("question3");
		q3.value = "E";
	});
});

$(document).ready(function(){
	$("#radio6").click(function(){
		console.log("q3filter");
		var q1 = document.getElementById("question3");
		q1.value = "F";
	});
});

// question 4
$(document).ready(function(){
	$("#radio7").click(function(){
		console.log("q4everyone");
		var q4 = document.getElementById("question4");
		q4.value = "E";
	});
});

$(document).ready(function(){
	$("#radio8").click(function(){
		console.log("q4filter");
		var q4 = document.getElementById("question4");
		q4.value = "F";
	});
});
// themes

$(document).ready(function(){
	$(".theme").click(function(){
		console.log($(this).id);
		var t = document.getElementById("selectTheme");
		t.value = $(this).id;
		var theme = document.getElementById("tempThemeDisplay");
		theme.href = "../css/"+$(this).id+".css";
		window.localStorage.themeDisplay = "../css/"+$(this).id+".css";
	});
});

$(document).ready(function(){
	$("privacySave").click(function(){
		console.log("privacy save clicked");
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

/*
	var month = document.getElementById("myMonth")
	month.value = "May";
	var day = document.getElementById("myDays")
	day.value = "30";
	var year = document.getElementById("myYears")
	year.value = "1989";*/

