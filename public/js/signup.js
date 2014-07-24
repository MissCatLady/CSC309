/*<!--Drop down registration code-->
<!--Attribution: Miro Karilahti-->
<!--Found: http://codepen.io/miroot/details/qwIgC-->
<!--Status: Edited-->*/

$('input[type="submit"]').mousedown(function(){
  $(this).css('background', '#2ecc71');
});
$('input[type="submit"]').mouseup(function(){
  $(this).css('background', '#1abc9c');
});

var regform_flag = false;
$('#regform').click(function(){
  if (!regform_flag) {
    $('.register').fadeToggle('slow');
    $(this).toggleClass('green');
    regform_flag = true;
  } else {
    $(".register").hide();
    $('#regform').removeClass('green');
    regform_flag = false;
  }
});



$(document).mouseup(function (e)
{
    var container = $(".register");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        container.hide();
        $('#regform').removeClass('green');
    }
});

document.addEventListener("DOMContentLoaded", function() {

var input_validity = function() {
	var input = document.createElement("input"); 
	return "setCustomValidity" in input; 
} 

if(input_validity()) { 
	var usernameInput = document.getElementById("userField");
	usernameInput.setCustomValidity(usernameInput.title);
	var pwd1Input = document.getElementById("pwd1");
	pwd1Input.setCustomValidity(pwd1Input.title);
	var pwd2Input = document.getElementById("pwd2"); 
	
	// input key handlers
	
	usernameInput.addEventListener("keyup", function() { 
		usernameInput.setCustomValidity(this.validity.patternMismatch ? usernameInput.title : "");
	}, false); 
	
	pwd1Input.addEventListener("keyup", function() { 
		this.setCustomValidity(this.validity.patternMismatch ? pwd1Input.title : ""); 
		if(this.checkValidity()) { 
	
		pwd2Input.pattern = this.value;
		pwd2Input.setCustomValidity(pwd2Input.title); 
	}
	else {
		pwd2Input.pattern = this.pattern; pwd2Input.setCustomValidity(""); 
		} 
	}, false);
	
	pwd2Input.addEventListener("keyup", function() { 
		this.setCustomValidity(this.validity.patternMismatch ? pwd2Input.title : ""); 
	}, false); 
} }, false);