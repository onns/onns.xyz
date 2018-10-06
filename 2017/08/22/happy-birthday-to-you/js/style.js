$(document).ready(function() {
	$('.anchor-scroll').anchorScroll({
	    scrollSpeed: 800
	 });
});
n = 1
function goo(timer) {
	document.getElementById('a' + n).click();
	n = n + 1;
	if(n == 20) {
		clearInterval(timer);
		document.getElementById('audio').play();
	}
}
window.onload = function() {
	document.getElementById('a20').click();
	var timer = window.setInterval(function(){goo(timer);}, 1500);
}