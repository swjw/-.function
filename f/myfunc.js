	//运动框架
	function animate(obj,targetJson,time,callback){
		if(window.navigator.userAgent.indexOf("MSIE") != -1){
			var interval = 50;	
		}else{
			var interval = 10;
		}
		//得到现在的状态当作信号量；这个信号量是所有要变化属性的集合；
		var nowJson = {};//信号量对象；
		//给信号量对象添加属性，添加什么属性，目标对象中有什么属性，这里就添加什么属性
		//值就是当前的计算样式
		for(var k in targetJson)
		{
			nowJson[k] = parseFloat(fetchComputedStyle(obj,k));
		}
		console.log(nowJson);
		//我们思考一下，我们的动画是10毫秒执行一次，而用户让我们time毫秒执行完毕动画
		//也就是说，总执行函数次数：
		var maxcount = time/interval;
		var count = 0;
		//继续深入思考，动画总次数是maxcount次，那么每一次动画变化的步长就有了啊！
		//所以我们现在要再来一个JSON，放置所有属性的步长
		var stepJson = {};
		for(var k in targetJson)
		{	//捎带脚，把每个targetJSON中的值都去掉px
			targetJson[k] = parseFloat(targetJson[k]);
			stepJson[k] = (targetJson[k] - nowJson[k])/maxcount;
		}
		//至此，三个非常重要的JSON整理完毕。分别是：
		//信号量JSON ：  nowJson
		//终点JSON ：  	targetJson
		//步长JSON ：  stepJson
		//这三个JSON所有的k都一样。
		// console.log(semaphoreJson);
		// console.log(targetJson);
		// console.log(stepJson);
		//总体思路就是nowJson每一帧都在变
		var timer = null;
		timer = setInterval(function (){
			for(var k in targetJson)
			{
				nowJson[k] +=stepJson[k]; 
				if(k!='opacity')
				{
					obj.style[k] = nowJson[k] + 'px';
				}else{
					obj.style[k] = nowJson[k];
					obj.style.filter = "alpha(opacity=" + (nowJson[k] * 100) + ")";
				}
			}
			//console.log(nowJson);
			//计数器；
			count++;
			if(count == maxcount)
			{
				//次数够了，所以停表。
				//这里抖一个小机灵，我们强行让obj跑到targetJSON那个位置
				/*for(var k in targetJson)
				{	
					if(k!='opacity'){
						obj.style[k] =parseFloat( targetJson[k]) +'px';
					}else{
						obj.style[k] = targetJson[k];
						obj.style.filter = "alpha(opacity=" + (targetJson[k] * 100) + ")";
					}	
				}*/
			
			//停表
			clearInterval(timer);
			callback&&callback();	//调用回调函数
			}
		},interval)
		function fetchComputedStyle(obj,attr){
		return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
		}
	}			
	/*
	说明：获得元素相应属性值；不能获取未定义属性值
	@obj ----->元素本身
	@attr ------>要获取元素的属性值的属性
	*/
	function getStyle(obj,attr){
		return obj.currentStyle? obj.currentStyle[attr]: getComputedStyle(obj)[attr];
		}
	/*
	说明：抖函数；使一个元素上下左右抖动
	@obj ---->元素本身
	@attr ----->抖动方向("top"和"left")
	@endFn---->回调函数（可有可无）
	*/
	function shake(obj,attr,endFn){
			if (obj.onoff) {return};//加开关修复抖函数
			obj.onoff=true;
			 var arr = [];
			var num = 0;
			var k=null;
			for(var i=20;i>0;i-=2)
			{
				arr.push(i,-i);
			}
			arr.push(0)
			clearInterval(shake.timer)
			shake.timer=setInterval(function(){
				obj.style[attr]=parseInt(getStyle(obj,attr))+arr[num]+"px";
				num++
				if (num==arr.length)
				{
				clearInterval(shake.timer)
				obj.onoff = false;
				endFn&&endFn();
				}
			},100)
			}
	/*
	说明：传入一个数num，如果该数小于10，返回其前面加0的字符串，如果大于10则返回该数的字符串；
	@num----->传入的数。
	*/	
	function twoNum(num){
		if(num<10)
		{
			return "0"+num;
		}
		else{
			return ""+num;
		}
	}
	/*
	说明：传入x和y两数，返回在x-y之间的随机数；
	*/
	function getRandom(x,y){
		return Math.round(Math.random()*(y-x)+x);
		}
	/*
	说明：控制元素的透明度渐变效果
	@obj------>要传入的元素
	@dir------->透明度渐变的速度
	@target----->透明度变化的目标
	@endFn----->回调函数（可有可无）；
	*/
	function Opacity(obj,dir,target,endFn){
			if(target>100||target<0)
			{
				alert('输入范围不对');
				return
			}
			dir=getStyle( obj, 'opacity')*100 < target?dir:-dir;
			clearInterval(obj.timer);
			obj.timer=setInterval(function(){
			var speed = getStyle(obj,'opacity')*100+dir;
			if(dir<0&&speed<target||dir>0&&speed>target)
			{
				speed=target;
			}
			obj.style.opacity=speed/100;
			if(speed==target)
			{
				clearInterval(obj.timer);
				endFn&&endFn();
			}
			},14)
			}
	/*
	说明：数组去重函数；传入一个数组，返回去重过后的数组；
	@arr----->需要去重的数组；
	*/
	function arrQc(arr){
		for(var i=0;i<arr.length;i++)
		{
		for(var j=i+1;j<arr.length;j++)
		{
			if(arr[i]==arr[j])
			{
				arr.splice(j,1);
				j--;
			}
		}
		}
		return arr;
	}
	/*
	说明：获取元素的位置；
	@obj------->要获取位置的元素；
	*/
	function getPos(obj){
			var pos = {left:0,top:0}

			while(obj)
			{
			pos.left+= obj.offsetLeft;
			pos.top += obj.offsetTop;
			obj = obj.offsetParent;
			}
			return pos;
		}
	/*
	说明：通过类名获得元素；
	@parent------->父级元素；
	@TagName------->要通过类名获得的元素标签名；
	@className------->类名；
	*/
	function getElementsByClassName(parent,TagName,className){
		var oAll = parent.getElementsByTagName(TagName);
		var arr=[];
		for(var i=0;i<oAll.length;i++)
		{
		/*if(oAll[i].className=='div1')
		{
			arr.push(oAll[i]);
		}*/
		var arr1 = oAll[i].className.split(" ");
		for(var j=0;j<arr1.length;j++)
		{
			if(arr1[j]==className)
			{
				arr.push(oAll[i]);
				break;
			}
		}
		}
		return arr
	}
	/*
	说明：为元素添加class
	@obj------->要添加class的元素
	@className--------->为元素添加的className;
	*/
	function addClass(obj,className){
		var arr = obj.className.split(" ");
		for(var i=0;i<arr.length;i++){
		if(arr[i]==className)
		{	alert('ok');
			return
		}
		}
		arr.push(className);
		obj.className=arr.join(" ");
	}
	/*
	说明：数组的indexOf()方法，找到数组中的元素，并返回该元素在数组中的位置；
	@arr---->传入的数组
	@v------>需在数组中返回位置的元素
	*/
	function arrIndexOf(arr,v){
		for(var i=0;i<arr.length;i++)
		{
			if(arr[i]===v)
			{
				return i;
			}
		}
		return -1;
	}
	/*
	说明：删除元素class；
	@obj------->要删除class的元素；
	@className-------->要删除的class值；
	*/
	function removeClass (obj,className){
		var arr1= obj.className.split(" ");
		var _index = arrIndexOf(arr1,className);
		if(_index != -1){
			arr1.splice(_index,1);
			obj.className=arr1.join(" ");
		}
	}
	/*
	说明：事件绑定的第二种方式，可以让一个元素的一个事件同时触发2个事件函数
	@obj------>要绑定事件的元素
	@evname-------->事件名称
	@fn----------->事件函数
	*/
	function bind(obj,evname,fn){
		obj.addEventListener?obj.addEventListener(evname,fn,false):obj.attachEvent('on'+evname,function(){
			fn.call(obj);
		})
	}
	/*
	说明：拖曳函数
	@obj-------->要拖曳的元素
	*/
		function drag (obj){
		obj.onmousedown = function (ev){
		var ev = ev || event;
		//获取鼠标点击位置与元素的左右距离；
		var disX = ev.clientX-obj.offsetLeft;
		var disY = ev.clientY-obj.offsetTop;
		if(obj.setCapture)
		{
			obj.setCapture();
		}
		document.onmousemove = function (ev)
		{
			var ev = ev || event;
			var L = ev.clientX-disX;
			var T = ev.clientY-disY;
			/*if(L<100)//改变该值可以实现磁性吸附效果；
			{
				L = 0;
			}else if(L>document.documentElement.clientWidth - oDiv.offsetWidth)
			{
				L = document.documentElement.clientWidth - oDiv.offsetWidth;
			}
			if(T<0)
			{
				T = 0;
			}else if(T>document.documentElement.clientHeight - oDiv.offsetHeight)
			{
				T = document.documentElement.clientHeight- oDiv.offsetHeight;
			}
			oDiv.style.left = L+'px';
			oDiv.style.top = T+'px';
			//该段代码可限制拖曳范围；
			*/
			obj.style.left = L+'px';
			obj.style.top = T+'px';
			}
			document.onmouseup = function (){
		   	 document.onmouseup =document.onmousemove = null;
		  	 if(obj.releaseCapture)
			{
			obj.releaseCapture();
			}
		}
		return false;
		}
	}
	
	//得到cookie；
	function getCookie(key){
		var arr1 = document.cookie.split('; ');
		for(var i = 0;i<arr1.length;i++)
		{
			var arr2 = arr1[i].split('=');
			if(arr2[0]==key)
			{
				return decodeURI(arr2[1]);
			}
		}
	}
	//设置cookie；
	function setCookie(key,value,t){
		var oDate = new Date();
		oDate.setDate(oDate.getDate()+t);
		oDate.toGMTString();
		document.cookie = key+'='+encodeURI(value)+';expires='+oDate;
	}
	//删除cookie；
	function removeCookie(key){
		setCookie(key,'',-1);
	}


	// 设置和获取元素进行的2d转换，注意只能获取通过该函数设置的属性；
	function cssTransform(el,attr,val){
		if(arguments.length == 3)
		{
				if(!el.transform)
			{
				 el.transform = {};
			}
			el.transform[attr] = val;
			var sVal = '';
			for(var s in el.transform)
			{
				switch (s)
				{
					case 'translateX':
					case 'translateY':
					sVal += s+'('+val+'px)';
					break;
					case 'rotateX':
					case 'rotateY':
					case 'rotate':
					case 'skewX':
					case 'skewY':
					case 'skew':
					sVal += s+'('+val+'deg)';
					break;
					case 'scale':
					case 'scaleX':
					case 'scaleY':
					sVal += s+'('+val+')';
					break;
				}
				el.style.WebkitTransform =el.style.transform =sVal;
			}
		}else{
				if(!el.transform)
				{
					if(attr = 'scale')
					{
						return 1;
					}else{
						return 0;
					}
				}else{
					return el.transform[attr];
				}
		}	
	}