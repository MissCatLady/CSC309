$(function() {      
  //Enable swiping...
  $(".content").swipe( {
  //Generic swipe handler for all directions
  swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
          
  if (window.location.pathname.indexOf("test4.html")>0) {
    if (direction=="left") {
      window.location="../test2.html";
    } else if (direction=="right"){
      window.location="#";
    }
 
  } else if (window.location.pathname.indexOf("games")>0) {
    break;
  } else if (window.location.pathname.indexOf("settings")>0) {
    break;
  } else {
    break;
  }

  },
  //Default is 75px, set to 0 for demo so any distance triggers swipe
  threshold:5
  });
});