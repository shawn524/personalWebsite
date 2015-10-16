// Fade in div elements on page load
$('.divfade').each(function(i) {
  $(this).fadeOut(0).delay(1000*i).fadeIn(1850);
});

// Hide about me section on load
$("#about").hide();

// Show and hide about me section when face is clicked
$('#face').click(function() {
	$("#about").slideToggle();
});
// Can also hide it from within #about
$('#about').click(function() {
	$("#about").slideToggle();
});


// Flip between open and closed mouth images
$('#face').hover(function() {
    this.src = 'assets/img/open.png';
}, function() {
    this.src = 'assets/img/closed.png';
});