/*<!--New message javascript-->*/
var id = 0;
var vis
$(document).ready(function(){
	$("#submittext").click(function(){		
		if (document.getElementById("message").value != "") {
			$.post("/message", {content:document.getElementById("message").value}, function(data) {
				if (data) {
				}
			});
		}
	$('#message').focus();
	});
});
$(document).ready(function(){
	if ($(window).width() < 540) {
		$("#chat").appendTo("#smallchat");
		$("#smallchat").hide();
	}
});
$(document).ready(function(){
    $(".chatbutton").click(function(){
    $("#smallchat").slideToggle("slow");

  });
});

