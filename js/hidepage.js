
$(document).ready(function() {
	$('#content-2').hide();
	$('#button-submit').click(function(e) {
	e.preventDefault();
	$('#content-1').hide();
	$('#content-2').show();
	});

	function show_page2(){	
	$('#content-1').hide();
	$('#content-2').show();
	}	
});