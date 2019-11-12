function $(v)
{
	if(typeof v==='function')
	{
		window.onload = v;
	} 
	else if(typeof v==='string') 
	{
		return document.getElementById(v);
	} 
	else if(typeof v==='object') 
	{
		return v;
	}
}

function check()
{
	alert('Right');
}

function getStyle(obj,attr)
{
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
}

function doMove(obj,attr,dir,target,endFn) 
{
	dir=parseInt(getStyle(obj,attr))<target?dir:-dir;
	clearInterval(obj.timer);
	obj.timer=setInterval(function()
	{
		var speed=parseInt(getStyle(obj,attr))+dir;
		if(speed>target&&dir>0||speed<target&&dir<0)
		{
			speed=target;
		}
		obj.style[attr]=speed+'px';
		if (speed==target) 
		{
			clearInterval( obj.timer );
			endFn && endFn();
		}
	},16);
}

function objectShake(obj,attr,endFn)
{
	var pos=parseInt(getStyle(obj,attr));	
	var arr=[];
	var num=0;
	var timer=null;
	for(var i=10;i>0;i-=2)
	{
		arr.push(i,-i);
	}
	arr.push(0);	
	clearInterval(timer);
	timer=setInterval(
	function ()
	{
		obj.style[attr]=pos+arr[num]+'px';
		num++;
		if(num===arr.length)
		{
			clearInterval(obj.shake);
			endFn&&endFn();
		}
	},50);
}

function opacityChange(obj,endFn)
{
	if(obj.style.opacity)return;
	var arr=[];
	var num=0;
	var timer=null;
	for(var i=1;i>0;i-=0.2)
	{
		arr.push(i);
	}
	arr.push(0);	
	clearInterval(timer);
	timer=setInterval(
	function ()
	{
		obj.style.opacity=arr[num];
		num++;
		if(num===arr.length)
		{
			clearInterval(obj.shake);
			endFn&&endFn();
		}
	},200);
}

function opacityShow(obj,endFn)
{
	var arr=[];
	var num=0;
	var timer=null;
	for(var i=0;i<1;i+=0.2)
	{
		arr.push(i);
	}
	arr.push(1);	
	clearInterval(timer);
	timer=setInterval(
	function ()
	{
		obj.style.opacity=arr[num];
		num++;
		if(num===arr.length)
		{
			clearInterval(obj.shake);
			endFn&&endFn();
		}
	},200);
}

function addDiv(id,num,css,endFn)
{
	var oFoot=$(id);
	var str='';
	for(var i=0;i<num;i++)
	{
		str+='<div '+css+'></div>';
	}
	oFoot.innerHTML+=str;
	endFn&&endFn();
}
