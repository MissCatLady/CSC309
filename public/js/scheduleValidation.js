document.addEventListener("DOMContentLoaded", function() {

var input_validity = function() {
	var input = document.createElement("input"); 
	return "setCustomValidity" in input; 
} 

if(input_validity()) { 
	var loc = document.getElementById("locInput");
	loc.setCustomValidity(loc.title);
	
	// input key handlers
	
	loc.addEventListener("keyup", function() { 
		loc.setCustomValidity(this.validity.patternMismatch ? loc.title : "");
	}, false); 

} }, false);