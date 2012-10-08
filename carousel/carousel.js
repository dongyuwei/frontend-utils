//todo: 1 左右滚动状态控制 2 自动滚动轮播 3 touchmove移动
var litb = window.litb || {};
/**
 * @param  {Object} config
 */
litb.touchCarousel = function(config) {
	function touchDirection(el, leftCallback,rightCallback) {
		var fingerCount = 0;
		var startX = 0;
		var startY = 0;
		var curX = 0;
		var curY = 0;
		var deltaX = 0;
		var deltaY = 0;
		var horzDiff = 0;
		var vertDiff = 0;
		var minLength = 72;
		var swipeLength = 0;
		var swipeAngle = null;
		var swipeDirection = null;

		function touchStart(event) {
			event.preventDefault();
			fingerCount = event.touches.length;
			if(fingerCount == 1) {
				startX = event.touches[0].pageX;
				startY = event.touches[0].pageY;
			} else {
				touchCancel(event);
			}
		}

		function touchMove(event) {
			event.preventDefault();
			if(event.touches.length == 1) {
				curX = event.touches[0].pageX;
				curY = event.touches[0].pageY;
			} else {
				touchCancel(event);
			}
		}

		function touchEnd(event) {
			event.preventDefault();
			if(fingerCount == 1 && curX != 0) {
				swipeLength = Math.round(Math.sqrt(Math.pow(curX - startX, 2) + Math.pow(curY - startY, 2)));
				if(swipeLength >= minLength) {
					caluculateAngle();
					determineSwipeDirection();
					touchCancel(event);
				} else {
					touchCancel(event);
				}
			} else {
				touchCancel(event);
			}
		}

		function touchCancel(event) {
			fingerCount = 0;
			startX = 0;
			startY = 0;
			curX = 0;
			curY = 0;
			deltaX = 0;
			deltaY = 0;
			horzDiff = 0;
			vertDiff = 0;
			swipeLength = 0;
			swipeAngle = null;
			swipeDirection = null;
		}

		function caluculateAngle() {
			var X = startX - curX;
			var Y = curY - startY;
			var Z = Math.round(Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2)));
			var r = Math.atan2(Y, X);
			swipeAngle = Math.round(r * 180 / Math.PI);
			if(swipeAngle < 0) {
				swipeAngle = 360 - Math.abs(swipeAngle);
			}
		}

		function determineSwipeDirection() {
			if((swipeAngle <= 45) && (swipeAngle >= 0)) {
				swipeDirection = 'left';
			} else if((swipeAngle <= 360) && (swipeAngle >= 315)) {
				swipeDirection = 'left';
			} else if((swipeAngle >= 135) && (swipeAngle <= 225)) {
				swipeDirection = 'right';
			} else if((swipeAngle > 45) && (swipeAngle < 135)) {
				swipeDirection = 'down';
			} else {
				swipeDirection = 'up';
			}
			processingRoutine(swipeDirection);
		}

		function processingRoutine(swipeDirection) {
			if(swipeDirection == 'left') {
				leftCallback();
			} else if(swipeDirection == 'right') {
				rightCallback();
			}
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
	container.css('overflow','visible');
	container[0].innerHTML = '<div class="touchcarousel-wrapper">' 
		+ container[0].innerHTML 
		+ '</div>' 
		+ '<a href="#" class="arrow-holder left"><span class="arrow-icon left"></span></a>'
		+ '<a href="#" class="arrow-holder right"><span class="arrow-icon right"></span></a>';

	var box = container.find('ul');
	var left = container.find('.arrow-holder.left');
	var right = container.find('.arrow-holder.right');
	var first = box.children(":first");
	var totalWidth = first.outerWidth(true) * box.children().length;
	box.css('width', totalWidth);
	box.children(":last").addClass('last');
	
	var width = first.width();
	var step = first.outerWidth(true) * (config.itemsPerMove || 1);


	if(box.position().left === 0){
		left.addClass('disabled');
	}

	function moveTo(direction,e) {
		e && e.preventDefault();
		if(direction ==='left' && left.hasClass('disabled')){
			return false;
		}
		if(direction ==='right' && right.hasClass('disabled')){
			return false;
		}
		var dir = direction === 'left' ? '+=' : '-=';
		// step = direction === 'left' ? 137  : step + 1;
		// if(Math.abs(box.position().left) + container.outerWidth() + width > totalWidth){
		// 	step = totalWidth - Math.abs(box.position().left) - container.outerWidth() ;
		// }
		console.log(dir + step)
		box.animate({
			left: dir + step
		}, 500, 'swing', function() {
			if(box.position().left < 0){
				left.removeClass('disabled');
			}else{
				left.addClass('disabled');
			}
			if(Math.abs(box.position().left) + container.outerWidth() + width > totalWidth){
				right.addClass('disabled');
			}else{
				right.removeClass('disabled');
			}
		});
	}

	var userAgent = navigator.userAgent.toLowerCase();
	var clickEvent = (userAgent.indexOf('iphone') != -1 || userAgent.indexOf('ipod') != -1) ? 'tap' : 'click';

	left.bind(clickEvent, function(e){
		moveTo('left',e);
	});
	right.bind(clickEvent, function(e){
		moveTo('right',e);
	});
	
	touchDirection(box,function(e){
		moveTo('left');
	},function(e){
		moveTo('right');
	});
};