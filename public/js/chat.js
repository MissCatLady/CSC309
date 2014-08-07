/*<!--New message javascript-->*/
var id = 0;
var vis
$(document).ready(function(){
	$("#submittext").click(function(){ 
		submitmsg(); 
	});
	$('#submittext').keypress(function(e){
        if(e.which == 13){//Enter key pressed
            submitmsg();
        }
    });
	
});


function submitmsg() {
	if (document.getElementById("message").value != "") {
	var csrf = $('#csrf').val();
	if (csrf) {
		var action = "/message?_csrf=" + csrf;
	} else {
		var action = "/message";
	}
	$.post(action, {content:document.getElementById("message").value}, function(data) {
		if (data) {
			console.log(document.getElementById("message").value);
		}
	});
	}
	$('#message').focus();

	document.getElementById("message").value = "";
}

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
		$("#messageList").append('<li><div><img src="imgs/anon.png"></img></div> <span id ="time">' +
												data.time.substring(16,21) + '</span><span id ="text">' + data.username + ':' + 
												data.content);

		var mheight = $("#messageList").height();
		$('#chatbox').scrollTop(mheight);

	}, false);





	//for game creation
	$("#places").click(function(){
		source.close();
	});

	//for new event
	$('.link').click(function() {
		source.close();
	});



	$.get("/chat", function(data) {
		var txt =""
		for (i = 0; i < data[0].length ;i++) {
			$("#messageList").append('<li><div><img src="imgs/anon.png"></img></div> <span id ="time">' +
												data[0][i].time.substring(0,5) + '</span><span id ="text">' + data[0][i].username + ':' + 
												data[0][i].content);
		}
		var mheight = $("#messageList").height();
		$('#chatbox').scrollTop(mheight);


		
		
		
	});
});
$(document).ready(function(){
    $(".chatbutton").click(function(){
    $("#smallchat").slideToggle("slow");
  });

   $( window ).resize(function() {
  		location.reload();
	}); 
});

