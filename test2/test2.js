$('input[type="submit"]').mousedown(function(){
  $(this).css('background', '#2ecc71');
});
$('input[type="submit"]').mouseup(function(){
  $(this).css('background', '#1abc9c');
});

var regform_flag = false;
$('#regform').click(function(){
  if (!regform_flag) {
    $('.register').fadeToggle('slow');
    $(this).toggleClass('green');
    regform_flag = true;
  } else {
    $(".register").hide();
    $('#regform').removeClass('green');
    regform_flag = false;
  }
});



$(document).mouseup(function (e)
{
    var container = $(".register");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        container.hide();
        $('#regform').removeClass('green');
    }
});