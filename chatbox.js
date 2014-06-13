$(function(){
        $("#textbox").keypress(function(event){
			//event 13 refers to enter function
            if ( event.which == 13){
                if ( $("#enter").prop("checked") ){
 
                    console.log("enter pressed, checkbox is checked");
                    
					//when send button is clicked and checked box is checked it will perform the same code as enter is clicked
					$("send").click();
					event.preventDefault();
					
					}
 
				}
			});
});
	
$("#send").click(function(){

			var newMessage = $("#textbox").val();
			$("#textbox").val("");
			 var prevState = $("#container").html();
			$("#container").html(prevState + "" + newMessage);
			
});