
//@author:IlyaSam

$(document).on("pagecreate",function(){
  $(".content").on("swiperight",function(){
    var location = window.location.pathname;
    location = location.substring(location.lastIndexOf("/")+1);
    switch(location) {
    case "meet.html":
        window.location = "chat.html";
        break;
    case "chat.html":
        window.location = "games.html";
        break;
    case "games.html":
        window.location = "settings.html";
        break;
    default:
        break;
    } 
  });                       
});


$(document).on("pagecreate",function(){
  $(".content").on("swipeleft",function(){
    var location = window.location.pathname;
    location = location.substring(location.lastIndexOf("/")+1);
    switch(location) {
    case "settings.html":
        window.location = "games.html";
        break;
    case "games.html":
        window.location = "chat.html";
        break;
    case "chat.html":
        window.location = "meet.html";
        break;
    default:
        break;
    } 
  });                       
});