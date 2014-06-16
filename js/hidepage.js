
$(document).ready(function() {
	$('.game').hide();
	$('#button-submit').click(function(e) {
	e.preventDefault();
	$('.col-l form').hide();
	$('.game').show();
	});	
});