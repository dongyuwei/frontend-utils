//todo: 1 左右滚动状态控制 2 自动滚动轮播 3 touchmove移动
var litb = window.litb || {};
/**
 * @param  {Object} config
 */
litb.touchCarousel = function(config) {
	
	function swipeDirection(x1, x2, y1, y2) {
		var xDelta = Math.abs(x1 - x2),
			yDelta = Math.abs(y1 - y2);
		return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
	}

	function bindTouchEvent(el, leftCallback, rightCallback) {
		var touch = {}, swipeTimeout;

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

	function moveTo(direction, e) {
		e && e.preventDefault();
		if(direction === 'left' && left.hasClass('disabled')) {
			return false;
		}
		if(direction === 'right' && right.hasClass('disabled')) {
			return false;
		}
		var dir = direction === 'left' ? '+=' : '-=';
		// step = direction === 'left' ? 137  : step + 1;
		// if(Math.abs(box.position().left) + container.outerWidth() + width > totalWidth){
		// 	step = totalWidth - Math.abs(box.position().left) - container.outerWidth() ;
		// }
		box.animate({
			left: dir + step
		}, 500, 'swing', function() {
			if(box.position().left < 0) {
				left.removeClass('disabled');
			} else {
				left.addClass('disabled');
			}
			if(Math.abs(box.position().left) + container.outerWidth() + width > totalWidth) {
				right.addClass('disabled');
			} else {
				right.removeClass('disabled');
			}
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

	bindTouchEvent(box, function(e) {
		moveTo('left');
	}, function(e) {
		moveTo('right');
	});
};