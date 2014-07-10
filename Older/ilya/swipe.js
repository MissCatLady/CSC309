$(document).on("pagecreate",function(){
  $("nav").on("swiperight",function(){
    var location = window.location.pathname;
    location = location.substring(location.lastIndexOf("/")+1);
    switch(location) {
    case "index.html":
        window.location = "location.html";
        break;
    case "location.html":
        window.location = "chat.html";
        break;
    case "chat.html":
        window.location = "index.html";
        break;
    default:
        break;
    } 
  });                       
});
$(document).on("pagecreate",function(){
  $("nav").on("swipeleft",function(){
    var location = window.location.pathname;
    location = location.substring(location.lastIndexOf("/")+1);
    switch(location) {
    case "index.html":
        window.location = "chat.html";
        break;
    case "location.html":
        window.location = "index.html";
        break;
    case "chat.html":
        window.location = "location.html";
        break;
    default:
        break;
    } 
  });                       
});