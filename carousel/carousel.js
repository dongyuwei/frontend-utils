var litb = window.litb || {};
litb.mobile = litb.mobile || {};
$.extend(litb.mobile,{
	supportTransform3d: function(){
		var supported = false;
	    var div = $('<div style="position:absolute;">Translate3d Test</div>');
	    $('body').append(div);
	    div.css(
	    {
	        'transform' : "translate3d(3px,0,0)",
	        '-moz-transform' : "translate3d(3px,0,0)",
	        '-webkit-transform' : "translate3d(3px,0,0)",
	        '-o-transform' : "translate3d(3px,0,0)",
	        '-ms-transform' : "translate3d(3px,0,0)"
	    });
	    supported = (div.offset().left === 3);
	    div.empty().remove();
	    return supported;
	},
	swipeDirection: function(x1, y1, x2, y2){
		var xDelta = Math.abs(x1 - x2),
			yDelta = Math.abs(y1 - y2);
		return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
	},
	bindTouchEvent: function (el, leftCallback, rightCallback) {
		var touch = {}, swipeTimeout;

		function touchStart(e) {
			touch.start = new Date().getTime();
			touch.x1 = e.touches[0].pageX;
			touch.y1 = e.touches[0].pageY;
		}

		function touchMove(e) {
			e.preventDefault();
			touch.x2 = e.touches[0].pageX;
			touch.y2 = e.touches[0].pageY;
		}

		function touchEnd(e) {
			typeof touch.x2 === 'number' && e.preventDefault();

			touch.end = new Date().getTime();
			touch.speed = litb.mobile.speed(touch.x1,touch.y1,touch.x2,touch.y2 , touch.end - touch.start);
			e.touch = touch;

			if((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {
				clearTimeout(swipeTimeout);
				swipeTimeout = setTimeout(function() {
					var dir = litb.mobile.swipeDirection(touch.x1, touch.y1, touch.x2, touch.y2);
					if(dir === 'Left') {
						leftCallback(e);
					}
					if(dir === 'Right') {
						rightCallback(e);
					}
					e.touch = touch = {};
				}, 0);
			}
		}

		function touchCancel(e) {
			e.preventDefault();
			clearTimeout(swipeTimeout);
			touch = {};
		}

		el.bind('touchstart', function(e) {
			touchStart(e.originalEvent);
		});
		el.bind('touchmove', function(e) {
			touchMove(e.originalEvent);
		});
		el.bind('touchend', function(e) {
			touchEnd(e.originalEvent);
		});
		el.bind('touchcancel', function(e) {
			touchCancel(e.originalEvent);
		});
	},
	transform: function transform(element, dir,dx,duration,transitionEnd,distance) {
		element.unbind('transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd');
		var style = element[0].style;
		distance = typeof distance === "number" ? distance : (dir === 'left' ? element.position().left + dx : element.position().left - dx);
		style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = duration + 'ms';
		style.transform = style.MozTransform = style.webkitTransform = 'translate3d(' + distance + 'px,0,0)';
		style.msTransform = style.OTransform = 'translateX(' + distance + 'px)';
		element.bind('transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd', transitionEnd);
	},
	speed:function(x1,y1,x2,y2,time){
		return Math.sqrt( Math.pow(Math.abs(x2 - x1),2) +  Math.pow(Math.abs(y2 - y1),2))/time;
	}
});

/**
 * @param  {Object} config
 */
litb.touchCarousel = function(config) {
	config = $.extend({
		duration  : 500, //动画持续时间
		itemsPerMove : 1, //每次滑动的(图片)个数
		noTransform3d : false, // 不使用css3 Transform3d

		autoPlay  : false, //自动播放
		autoPlayDelay : 1000,

		pagingNav : false //显示paging
	},config);

	var container = config.container;
	container.css('overflow', 'visible');
	container[0].innerHTML = '<div class="touchcarousel-wrapper">' + container[0].innerHTML + '</div>' + '<a href="#" class="arrow-holder left"><span class="arrow-icon left"></span></a>' + '<a href="#" class="arrow-holder right"><span class="arrow-icon right"></span></a>';
	var box;

	if(config.pagingNav){
		config.itemsPerMove = 1;

		var paging = [];
		container.find('li').each(function(i){
			paging.push('<a class="tc-paging-item" href="#">Index</a>'.replace('Index',i));
		});
		container[0].innerHTML += '<div class="tc-paging-container">'+
		    '<div class="tc-paging-centerer">'+
		        '<div class="tc-paging-centerer-inside">'+
		        	paging.join('') + 
		        '</div>'+
		    '</div>'+
		'</div>';
		paging = container.find('a.tc-paging-item');
		$(paging[0]).addClass('current');
		container.find('div.tc-paging-centerer-inside').live('click',function(e){
			e.preventDefault();
			var target = e.target;

			if(autoplayTimer){
				clearInterval(autoplayTimer);
				autoplayTimer = 0;
				box.unbind('transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd');
			}
			
			if(cssTranslate3dSupported && !config.noTransform3d){
				litb.mobile.transform(box, 'left',0,config.duration,afterTransition,-(step * parseFloat(target.innerHTML)));
			}else{
				box.animate({
					left: -(step * parseFloat(target.innerHTML))
				}, config.duration, 'swing', afterTransition);
			}
		});

	}

	box = container.find('ul');
	var left = container.find('.arrow-holder.left');
	var right = container.find('.arrow-holder.right');

	if(config.autoPlay){
		left.hide();
		right.hide();
	}

	var first = box.children(":first");
	var totalWidth = first.outerWidth(true) * box.children().length;
	box.css('width', totalWidth);
	box.children(":last").addClass('last');
	if(box.position().left === 0) {
		left.addClass('disabled');
	}

	var width = first.width();
	var step = first.outerWidth(true) * config.itemsPerMove;

	function afterTransition(){
		var iLeft = box.position().left;
		if( iLeft >= 0 || Math.round(iLeft) === 0){
			box.trigger('leftEnd');
			left.addClass('disabled');
		} else{
			left.removeClass('disabled');
		}
		
		if(Math.abs(iLeft) + container.outerWidth() + 20 >= totalWidth) {
			right.addClass('disabled');
			box.trigger('rightEnd');
		} else {
			right.removeClass('disabled');
		}

		if(config.pagingNav && paging){
			var index = Math.round(Math.abs(iLeft)/step);
			paging.removeClass('current');
			$(paging[index]).addClass('current');
		}
	}

	var cssTranslate3dSupported = litb.mobile.supportTransform3d();
	function moveTo(direction,e) {
		e && e.preventDefault();
		
		if(direction === 'left' && left.hasClass('disabled')) {
			return false;
		}
		if(direction === 'right' && right.hasClass('disabled')) {
			return false;
		}

		var dx = step;
		if(e && e.touch){//touchmove
			dx = e.touch.speed * config.duration;
		}

		if(direction === 'left' && Math.abs(box.position().left) < Math.max(step,dx) ){
			dx = Math.abs(box.position().left);
		}
		if(direction === 'right' && Math.abs(box.position().left) + container.outerWidth() + Math.max(step,dx) > totalWidth){
			dx = totalWidth - Math.abs(box.position().left) - container.outerWidth() + 3;
		}

		if(cssTranslate3dSupported && !config.noTransform3d){
			litb.mobile.transform(box, direction,dx,config.duration,afterTransition);
		}else{
			box.animate({
				left: (direction === 'left' ? '+=' : '-=') + dx
			}, config.duration, 'swing', afterTransition);
		}
	}

	if(config.autoPlay){
		var autoplayTimer;
		autoplayTimer = setInterval(function(){
			moveTo('right');
		},config.autoPlayDelay);
		box.unbind('rightEnd');
		box.unbind('leftEnd');
		box.bind('rightEnd',function(){
			clearInterval(autoplayTimer);
			autoplayTimer && (autoplayTimer = setInterval(function(){
				moveTo('left');
			},config.autoPlayDelay));
		});
		box.bind('leftEnd',function(){
			clearInterval(autoplayTimer);
			autoplayTimer && (autoplayTimer = setInterval(function(){
				moveTo('right');
			},config.autoPlayDelay));
		});
	}

	var userAgent = navigator.userAgent.toLowerCase();
	var clickEvent = (userAgent.indexOf('iphone') != -1 || userAgent.indexOf('ipod') != -1) ? 'tap' : 'click';

	left.bind(clickEvent, function(e) {
		moveTo('left', e);
	});
	right.bind(clickEvent, function(e) {
		moveTo('right', e);
	});

	//touchmove时反方向滑动
	litb.mobile.bindTouchEvent(box, function(e) {
		moveTo('right',e);
	}, function(e) {
		moveTo('left',e);
	});
};