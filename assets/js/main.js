// Hide about me section on load
$("#about").hide();
// Show about me section when face is clicked
$('#face').click(function() {
	$("#about").slideToggle();
});
// Flip between open and closed mouth images
$('#face').hover(function () {
    this.src = 'assets/img/open.png';
}, function () {
    this.src = 'assets/img/closed.png';
});