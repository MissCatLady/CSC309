/*<!--New message javascript-->*/
var id = 0;
var vis
$(document).ready(function(){
  $('input[type="submit"]').click(function(){
    if (document.getElementById("message").value != "")
    $("#messageList").append('<li id="'+ id + 
			      '"><div><img src="imgs/mashiyat1.jpg"></img></div>:<p>' + 
			      document.getElementById("message").value +
			      '</p></li>');
    document.getElementById("message").value = "";
    id = id + 1;
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
    $("#chatbutton").click(function(){
    $("#smallchat").slideToggle("slow");
  });
});