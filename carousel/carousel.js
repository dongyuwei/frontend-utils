var litb = window.litb || {};
/**
 * @param  {Object} config
 */
litb.touchCarousel = function(config) {
	function supportTransform3d() {
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
	}

	function swipeDirection(x1, x2, y1, y2) {
		var xDelta = Math.abs(x1 - x2),
			yDelta = Math.abs(y1 - y2);
		return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
	}

	function bindTouchEvent(el, leftCallback, rightCallback) {
		var touch = {},
			swipeTimeout;

		function touchStart(e) {
			e.preventDefault();
			touch.x1 = e.touches[0].pageX;
			touch.y1 = e.touches[0].pageY;
		}

		function touchMove(e) {
			e.preventDefault();
			touch.x2 = e.touches[0].pageX;
			touch.y2 = e.touches[0].pageY;
		}

		function touchEnd(e) {
			e.preventDefault();
			if((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {
				clearTimeout(swipeTimeout);
				swipeTimeout = setTimeout(function() {
					var dir = swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2);
					if(dir === 'Left') {
						leftCallback();
					}
					if(dir === 'Right') {
						rightCallback();
					}
					touch = {};
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
	}
	//---------------------------------------------------------------------\\
	var container = config.container;
	container.css('overflow', 'visible');
	container[0].innerHTML = '<div class="touchcarousel-wrapper">' + container[0].innerHTML + '</div>' + '<a href="#" class="arrow-holder left"><span class="arrow-icon left"></span></a>' + '<a href="#" class="arrow-holder right"><span class="arrow-icon right"></span></a>';

	var box = container.find('ul');
	var left = container.find('.arrow-holder.left');
	var right = container.find('.arrow-holder.right');
	var first = box.children(":first");
	var totalWidth = first.outerWidth(true) * box.children().length;
	box.css('width', totalWidth);
	box.children(":last").addClass('last');

	var width = first.width();
	var step = first.outerWidth(true) * (config.itemsPerMove || 1);


	if(box.position().left === 0) {
		left.addClass('disabled');
	}

	var span = 0;
	function transform(element, dir, duration,dx) {
		var style = element[0].style;
		span = dir === 'left' ? element.position().left + dx : element.position().left - dx;
		style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = duration + 'ms';
		style.MozTransform = style.webkitTransform = 'translate3d(' + span + 'px,0,0)';
		style.msTransform = style.OTransform = 'translateX(' + span + 'px)';

		element.bind('transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd', afterTransition);
	};

	var cssTranslate3dSupported = supportTransform3d();

	function afterTransition(){
		if(box.position().left < 0){
			left.removeClass('disabled');
		} else{
			left.addClass('disabled');
		}
		
		if(Math.round(box.position().left) === 0){
			left.addClass('disabled');
		}

		if(Math.abs(box.position().left) + container.outerWidth() + 20 >= totalWidth) {
			right.addClass('disabled');
		} else {
			right.removeClass('disabled');
		}
	}
	function moveTo(direction, e) {
		e && e.preventDefault();
		
		if(direction === 'left' && left.hasClass('disabled')) {
			return false;
		}
		if(direction === 'right' && right.hasClass('disabled')) {
			return false;
		}
		var dx = step;
		if(direction === 'left' && Math.abs(box.position().left) < step){
			dx = Math.abs(box.position().left);
		}
		if(direction === 'right' && Math.abs(box.position().left) + container.outerWidth() + step > totalWidth){
			dx = totalWidth - Math.abs(box.position().left) - container.outerWidth();
		}
		if(cssTranslate3dSupported){
			transform(box, direction, 500,dx);
		}else{
			box.animate({
				left: (direction === 'left' ? '+=' : '-=') + dx
			}, 500, 'swing', afterTransition);
		}
		
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
	bindTouchEvent(box, function(e) {
		moveTo('right');
	}, function(e) {
		moveTo('left');
	});
};