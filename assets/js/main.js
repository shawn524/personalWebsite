$(document).ready(function() {
  // Fade in div elements on page load
  $('.divfade').each(function(i) {
    $(this).fadeOut(0).delay(1000*i).fadeIn(1850);
  });

})
