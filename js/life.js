// var date = new Date();
// date.setFullYear(2071,7,4);
// date.setHours(0);
// date.setMinutes(0);
// date.setSeconds(0);
// date.setMilliseconds(0);
// date.getTime();
var percent = 0;
var date = new Date();
b = date.getTime();
a = 839088000000;
c = 3205843200000;
percent = ((b - a) / (c - a) * 100).toFixed(8);
var stop = null;
function draw() {
	var canvas = document.getElementById('canvas');
	var content = canvas.getContext('2d');
	var width = window.innerWidth + 50;
	var height = window.innerHeight + 50;
	canvas.width = width;
	canvas.height = height;
	var rangeValue = percent;
	var nowRange = 0;
	var lineWidth = 2;
	var r = height / 2; 
	var cR = r - 16 * lineWidth;
	var sX = 0;
	var sY = height / 2;
	var axisLength = width;
	var waveWidth = 0.015;
	var waveHeight = 10;
	var speed = 0.09;
	var xOffset = 0;
	content.lineWidth = lineWidth;
	var drawSin = function(xOffset){
		content.save();
		var points=[];
		content.beginPath();
		for(var x = sX; x < sX + axisLength; x += 20 / axisLength){
			var y = -Math.sin((sX + x) * waveWidth + xOffset);
			var dY = height * (1 - nowRange / 100 );
			points.push([x, dY + y * waveHeight]);
			content.lineTo(x, dY + y * waveHeight);  
		}
		content.lineTo(axisLength, height);
		content.lineTo(sX, height);
		content.lineTo(points[0][0],points[0][1]);
		content.fillStyle = '#06B9D1';
		content.fill();
		content.restore();
	};
	var render = function(){
		content.clearRect(0, 0, width, height);
		rangeValue = percent;
		if(nowRange <= rangeValue){
			var tmp = 1;
			nowRange += tmp;
		}
		if(nowRange > rangeValue){
			var tmp = 1;
			nowRange -= tmp;
		}
		drawSin(xOffset);
		xOffset += speed;
		stop = requestAnimationFrame(render);
	}
	render();  
}
window.onresize = function(){
	window.cancelAnimationFrame(stop);
	draw();
}

window.onload = function(){
	draw();
	setInterval(function(){
		var date = new Date();
		b = date.getTime();
		a = 839088000000;
		c = 3205843200000;
		document.getElementById("day").innerHTML = Math.floor((b - a) / 86400000) + " days";
		document.getElementById("percent").innerHTML = ((b - a) / (c - a) * 100).toFixed(8) + " %";
	}, 100);
}