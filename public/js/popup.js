

/*

Attribution: Joel Peterson
Status: Minor Name Edits

*/

function loadPopup(){
	//loads popup only if it is disabled
	if($("#bgPopup").data("state")==0){
		$("#bgPopup").css({
			"opacity": "0.7"
		});
		$("#bgPopup").fadeIn("medium");
		$("#places-popup").fadeIn("medium");
		$("#bgPopup").data("state",1);
	}
}

function disablePopup(){
	if ($("#bgPopup").data("state")==1){
		$("#bgPopup").fadeOut("medium");
		$("#places-popup").fadeOut("medium");
		$("#bgPopup").data("state",0);
	}
}

function centerPopup(){
	var winw = $(window).width();
	var winh = $(window).height();
	var popw = $('#places-popup').width();
	var poph = $('#places-popup').height();
	$("#places-popup").css({
        "position" : "absolute",
        "top" : winh/2-poph/2,
        "left" : winw/2-popw/2
	});
	//IE6
	$("#bgPopup").css({
		"height": winh	
	});
}

$(document).ready(function() {
   $('places').focus();
   $("#bgPopup").data("state",0);
   $("#places").click(function(){ 
   		centerPopup();
		loadPopup(); 
	});

   	$("#checkingame").click(function() {
   		centerPopup();
		loadPopup(); 
		$.post("/creategame", $('#selectplayers').serialize(), function(data){
			if (data[0]) {
        		$("#whoisseeker").append("You are the seeker.");
        	}
        	//check local storage
    	    try {
              (window.localStorage.getItem) // will throw in Firefox under some settings
            } catch(e){
              return; // quit because dom.storage.enabled is false
            }

            //old game is overridden
            window.localStorage.setItem('game2token', data[1]);
            window.localStorage.setItem('playersuid', data[2]);
            window.localStorage.setItem('players', data[3])
            window.localStorage.setItem('isseeker', data[0]);
            window.localStorage.setItem('points', data[5]);
            window.localStorage.setItem('mygameid', data[4]);

      	});

    });

  
   $("#popupClose").click(function(){
	   	disablePopup();
	
   });

   $("#bgPopup").click(function(){
   		disablePopup();
   });

	
   $(document).keypress(function(e){
		if(e.keyCode==27) {
			disablePopup();	
		}
	});
});

//Recenter the popup on resize - Thanks @Dan Harvey [http://www.danharvey.com.au/]
$(window).resize(function() {
centerPopup();
});



