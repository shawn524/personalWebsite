$("#about").hide();
$('#face').click(function() {
	$("#about").toggle();
});
$('#face').hover(function () {
    this.src = 'assets/img/open.png';
}, function () {
    this.src = 'assets/img/closed.png';
});