/*<!--New message javascript-->*/
var id = 0;
var vis
$(document).ready(function(){
  $('input[type="submit"]').click(function(){
    if (document.getElementById("message").value != "")
    var d = new Date()
    $("#messageList").append('<li id="'+ id + 
			      '"><div><img src="imgs/mashiyat1.jpg"></img></div> <span id ="time">'+
			      d.getHours() + ':' + d.getMinutes()  +'</span><span id ="text">' + 
			      document.getElementById("message").value + '</span></li>');
    document.getElementById("message").value = "";
    id = id + 1;
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
});
$(document).ready(function(){
    $(".chatbutton").click(function(){
    $("#smallchat").slideToggle("slow");

  });
});