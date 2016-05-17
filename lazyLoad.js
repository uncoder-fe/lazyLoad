function LazyLoad(opt){
	/*** 默认配置选项 */
	var default_option = {
		container:'body',
		delay:300,
		pics:0
	}
	/** 合并用户配置项 */
	var options = _extern(default_option,opt);
	/**
	 * 初始化lazyload
	 */
	var init = (function(){
		var container = options['container'];
		var delay = options['delay'];
		var loadIndex = options['pics'];
		// 暂时只做这个选择
		var imgs = document.querySelectorAll(container+' img');
		// 设定了首次加载个数
		if(loadIndex){
			imgs.forEach(function(item,index){
				if(index <= loadIndex-1){
					item.src = item.dataset['src'];
				}
			});
		}else{
			// 激活图片平铺迭代器
			loadFirstScreen(imgs,loadIndex);
		}
		/**
		 * [后面需要加入节流函数...]
		 */
		window.addEventListener("scroll",_debounce(function(){
			imgs.forEach(function(item,index){
				var src = item.src;
				if(!src){
					var status = checkStatus(item);
					if(status){
						item.src = item.dataset['src'];
					}
				}
			});
		},delay));
	})(options);
	
	/**
	 * 迭代加载第一屏所有图片
	 */
	function loadFirstScreen(imgs,index){
		if(index >= imgs.length){ return;}
		var img = new Image();
			img.src = imgs[index].dataset['src'];
			img.addEventListener("load",function(){
				imgs[index].src = this.src;
				var status = checkStatus(imgs[index]);
				if(status){
					//继续迭代加载图片，直到第一屏铺满
					index = index + 1;
					loadFirstScreen(imgs,index);
				}
			});
			img.addEventListener("error",function(){
				imgs[index].src = '默认错误图片地址';
				var status = checkStatus(imgs[index]);
				if(status){
					//继续迭代加载图片，直到第一屏铺满
					index = index + 1;
					loadFirstScreen(imgs,index);
				}
			});
	}
	/**
	 * 检测距离顶部的位置
	 */
	function checkStatus(el){
		/** 窗体高度 */
		var SH = window.innerHeight;
		/** 图片大小 */
		var height = el.offsetHeight;
		/** 距离视窗顶部的位置 */
		var elTop = el.getBoundingClientRect().top;
		/** 100是滚动时候提前的距离 */
		if(elTop + height >= SH + 100){
			return false;
		}
		return true;
	}
	/**
	 * 拷贝对象属性，这里只考虑一层数据
	 * @return {[obj]} [返回合并后的对象]
	 */
	function _extern(toTarget, fromTarget) {
	    var newFromTarget = _shallowCopy(fromTarget);
	    var newToTarget = _shallowCopy(toTarget);
	    var keys = Object.keys(fromTarget);
	    keys.forEach(function(item, index, arry) {
	        newToTarget[item] = newFromTarget[item];
	    });
	    return newToTarget;
	}

	/**
	 * 复制一个对象自身的可枚举属性
	 * @param  {[obj]} obj [对象]
	 * @return {[obj]}     [对象]
	 */
	function _shallowCopy(obj){
		var result = null;
		result = iterator(obj);
		return result;
	}
	/**
	 * 克隆对象迭代器
	 * @param  {[type]} obj [对象]
	 * @return {[type]}     [对象]
	 */
	function iterator(obj){
		var newObj = Object.create({});
		for(var i in obj){
			if(obj.hasOwnProperty(i)){
				var type = Object.prototype.toString.call(obj[i]);
				switch (type){
					case "[object Array]":
						var newArry = [];
						obj[i].forEach(function(item,index){
							newArry[index] = item;
						});
						newObj[i] = newArry;
						break;
					case "[object Object]":
						newObj[i] = iterator(obj[i]);
						break;
					case "[object Number]":
						newObj[i] = obj[i];
						break;
					case "[object String]":
						newObj[i] = obj[i];
						break;
					case "[object Function]":
						newObj[i] = obj[i];
						break;
					case "[object HTMLDocument]":
						newObj[i] = obj[i];
						break;
					default:
						console.log("未处理类型，修改上方代码...");
						break;
				}
			}
		}
		return newObj;
	}
	/**
	 * 防抖处理
	 */
	function _debounce(func,wait){
		var timeout, args, context, timestamp;
		var later = function(){
			var last = Date.now()-timestamp;
			if(last < wait && last > 0){
				timeout = setTimeout(later, wait - last);
			}else{
				timeout = null;
				func.apply(context, args);
				if (!timeout) context = args = null;
			}
		}
		return function(){
			context = this;
			args = arguments;
			timestamp = Date.now();
			// 如果延时不存在，重新设定延时
			if(!timeout){ timeout = setTimeout(later,wait)};
		}
	}
}