$(document).ready(function(){
    $("#bt1").click(function(){
		document.getElementById("buttonclicked").value ="update";
		console.log("update");
    });
})

$(document).ready(function(){
    $("#bt2").click(function(){
		document.getElementById("buttonclicked").value ="accept";
		console.log("accept");
    });
})
    
$(document).ready(function(){
    $("#bt3").click(function(){
		document.getElementById("buttonclicked").value ="reject";
		console.log("reject");
    });
})


