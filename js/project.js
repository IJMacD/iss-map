$(function() {
	var canvas = $('canvas'),
		context = canvas[0].getContext("2d"),
		canvasWidth = canvas.width(),
		canvasHeight = canvas.height();
	canvas[0].width = canvasWidth;
	canvas[0].height = canvasHeight;
});