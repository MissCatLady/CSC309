/*<!--Map change javascript-->*/
$(document).ready(function(){
  $(".dotstyle ul li a").click(function(){
    if ($(this).parent().attr("class")!="current") {
      switch($(this).attr("id")){
      case "mylocation":
	$("#map-canvas").show();
        $("#location div h4").text("My Location");
      changeMap(43.659699, -79.397586);
	break;
      case "benlocation":
        $("#location div h4").text("Mashiyat's Location");
	$("#map-canvas").show();
      changeMap(43.659691, -79.355580);
        break;
      case "addfriend":
        $("#location div h4").text("Add A Friend");
	//$("#map-canvas").hide();
        break;
      default:
        break;
      }
      $(".current").removeClass("current");
      $(this).parent().addClass("current");
    } 
  });
});
function changeMap(lat,lng) {
  gMap = new google.maps.Map(document.getElementById("map-canvas")); 
  gMap.setZoom(15);      // This will trigger a zoom_changed on the map
  gMap.setCenter(new google.maps.LatLng(lat, lng));
  gMap.setMapTypeId(google.maps.MapTypeId.ROADMAP);
}