module.exports =function(str){

	var cssFile;
	if (str == 'theme1'){
		cssFile = '../css/theme1.css'
	}else if (str == 'theme2'){
		cssFile = '../css/theme2.css'
	}else if (str == 'theme3'){
		cssFile = '../css/theme3.css'
	}else if (str == 'theme4'){
		cssFile = '../css/theme4.css'
	}else if (str == 'theme5'){
		cssFile = '../css/theme5.css'
	}else if (str == 'theme6'){
		cssFile = '../css/theme6.css'
	}; console.log("theme assigned: " + cssFile);
	  return cssFile;
}