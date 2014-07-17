$(function () {
  //start timer 
  $("#first").countdown({
    until:'+5m',
    onExpiry: startGame,
    format: 'MS',
    compact: true,
    alwaysExpire: true
  });

  $('.game').hide();
  $('#map-canvas').hide();
  //allows earlier entry to game
  $("#g2checkin").click(function(e) {
    e.preventDefault();
    startGame();
  }); 

  //timer expiry action
  function startGame() {
    $.get('/startgame', function(data) {
      $('#selectplayers').hide();
      $('.game').show();
      
      $("#bgPopup").fadeOut("medium");
      $("#places-popup").fadeOut("medium");
      google.maps.event.trigger(map, 'resize');
    });
  }

});