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
		else {
	}

	var source = new EventSource('/stream');
	source.addEventListener('message', function(msg) {
    	var data = JSON.parse(msg.data);
		$("#messageList").append('<li><div><img src="imgs/mashiyat1.jpg"></img></div> <span id ="time">' +
												data.time.substring(16,21) + '</span><span id ="text">' + data.username + ':' + 
												data.content);
	}, false);

	$.get("/chat", function(data) {
		var txt =""
		for (i = 0; i < data[0].length ;i++) {
			$("#messageList").append('<li><div><img src="imgs/mashiyat1.jpg"></img></div> <span id ="time">' +
												data[0][i].time.substring(0,5) + '</span><span id ="text">' + data[0][i].username + ':' + 
												data[0][i].content);
		}
	});
});
$(document).ready(function(){
    $(".chatbutton").click(function(){
    $("#smallchat").slideToggle("slow");

  });
});

