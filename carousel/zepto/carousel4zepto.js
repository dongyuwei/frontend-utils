;(function($) {
	var tools = {};
	$.extend($.fn, {
		carousel: function(config) {
			config = $.extend({
				//每次滑动的(图片)个数
	            itemsPerMove    : 1,
	            //item(图片) width
	            itemWidth       : 128,
	            //动画持续时间
	            duration        : 500,
	            //无限循环
	            loop            : false,
	            // 不使用css3 Transform3d
	            noTransform3d   : false,
	            
	            //自动播放
	            autoPlay        : false,
	            autoPlayDelay   : 1000
			}, config);

			var container = this;
			var listEl;
			listEl = container.find('ul');
			var left = container.find('.arrow-holder.left');
			var right = container.find('.arrow-holder.right');

			if(config.autoPlay) {
				left.hide();
				right.hide();
			}
			var first = $(listEl.children()[0]);
			var totalWidth = first.width() * listEl.children().length;
			listEl.css('width', totalWidth);
			if(listEl.position().left === 0) {
				left.addClass('disabled');
			}

			var width = first.width();
			var step = first.width() * config.itemsPerMove;

			function afterTransition() {
				var iLeft = listEl.position().left;
				if(iLeft >= 0 || Math.round(iLeft) === 0) {
					listEl.trigger('leftEnd');
					left.addClass('disabled');
				} else {
					left.removeClass('disabled');
				}

				if(Math.abs(iLeft) + container.width() + 20 >= totalWidth) {
					right.addClass('disabled');
					listEl.trigger('rightEnd');
				} else {
					right.removeClass('disabled');
				}

				if(config.pagingNav && paging) {
					var index = Math.round(Math.abs(iLeft) / step);
					paging.removeClass('current');
					$(paging[index]).addClass('current');
				}
			}

			var usingTransform = tools.supportTransform3d() && !config.noTransform3d;

			function moveTo(direction, e) {
				e && e.preventDefault();

				if (!config.loop && ((direction === 'left' && left.hasClass('disabled')) 
	                || (direction === 'right' && right.hasClass('disabled')))) {
	                return false;
	            }

				var dx = step;
				if(e && e.touch) { //touchmove
					dx = e.touch.speed * config.duration;
				}
				var initDx = dx;
				if(direction === 'left' && Math.abs(listEl.position().left) < Math.max(step, dx)) {
					dx = Math.abs(listEl.position().left);
					if(config.loop && dx === 0){//loop to last item
	                    var l = -(totalWidth - container.width() + initDx );
	                    usingTransform ? tools.translate(listEl,l,0) : listEl.css('left', l);
	                    dx = initDx;
	                }
				}
				if(direction === 'right' && Math.abs(listEl.position().left) + container.width() + Math.max(step, dx) > totalWidth) {
					dx = totalWidth - Math.abs(listEl.position().left) - container.width();
					if(config.loop && dx === 0){//loop to first item
	                    usingTransform ? tools.translate(listEl,initDx,0) : listEl.css('left', initDx);
	                    dx = initDx;
	                }
				}

				if(usingTransform) {
					tools.transform(listEl, direction, dx, config.duration, afterTransition);
				} else {
					listEl.animate({
						left: direction === 'left' ? listEl.position().left + dx : listEl.position().left - dx
					}, config.duration, 'swing', afterTransition);
				}
			}

			if(config.autoPlay) {
				var autoplayTimer;
				autoplayTimer = setInterval(function() {
					moveTo('right');
				}, config.autoPlayDelay);
				listEl.off('rightEnd');
				listEl.off('leftEnd');
				listEl.on('rightEnd', function() {
					clearInterval(autoplayTimer);
					autoplayTimer && (autoplayTimer = setInterval(function() {
						moveTo('left');
					}, config.autoPlayDelay));
				});
				listEl.on('leftEnd', function() {
					clearInterval(autoplayTimer);
					autoplayTimer && (autoplayTimer = setInterval(function() {
						moveTo('right');
					}, config.autoPlayDelay));
				});
			}

			var userAgent = navigator.userAgent.toLowerCase();
			var clickEvent = (userAgent.indexOf('iphone') != -1 || userAgent.indexOf('ipod') != -1) ? 'tap' : 'click';

			left.on(clickEvent, function(e) {
				moveTo('left', e);
			});

			right.on(clickEvent, function(e) {
				moveTo('right', e);
			});

			//touchmove时反方向滑动
			tools.onTouchEvent(listEl, function(e) {
				moveTo('right', e);
			}, function(e) {
				moveTo('left', e);
			});
		}
	});
	
	$.extend(tools, {
		supportTransform3d: function() {
			var supported = false;
			var div = $('<div style="position:absolute;">Translate3d Test</div>');
			$('body').append(div);
			div.css({
				'transform': "translate3d(3px,0,0)",
				'-moz-transform': "translate3d(3px,0,0)",
				'-webkit-transform': "translate3d(3px,0,0)",
				'-o-transform': "translate3d(3px,0,0)",
				'-ms-transform': "translate3d(3px,0,0)"
			});
			supported = (div.offset().left - $(div[0].offsetParent).offset().left === 3);
			div.empty().remove();
			return supported;
		},
		swipeDirection: function(x1, y1, x2, y2) {
			var xDelta = Math.abs(x1 - x2),
				yDelta = Math.abs(y1 - y2);
			return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
		},
		onTouchEvent: function(el, leftCallback, rightCallback) {
			var touch = {},
				swipeTimeout;

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
				touch.speed = tools.speed(touch.x1, touch.y1, touch.x2, touch.y2, touch.end - touch.start);
				e.touch = touch;

				if((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {
					clearTimeout(swipeTimeout);
					swipeTimeout = setTimeout(function() {
						var dir = tools.swipeDirection(touch.x1, touch.y1, touch.x2, touch.y2);
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

			el.on('touchstart', function(e) {
				touchStart(e);
			});
			el.on('touchmove', function(e) {
				touchMove(e);
			});
			el.on('touchend', function(e) {
				touchEnd(e);
			});
			el.on('touchcancel', function(e) {
				touchCancel(e);
			});
		},
		translate:function(element,distance,duration){
            var style = element[0].style;
            style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = duration + 'ms';
            style.transform = style.MozTransform = style.webkitTransform = 'translate3d(' + distance + 'px,0,0)';
            style.msTransform = style.OTransform = 'translateX(' + distance + 'px)';
            style.transitionTimingFunction = style.webkitTransitionTimingFunction = style.mozTransitionTimingFunction = style.msTransitionTimingFunction = style.oTransitionTimingFunction = 'ease-in-out';
        },
        transform: function transform(element, dir, dx, duration, transitionEnd, distance) {
            element.off('transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd');
            var style = element[0].style;
            distance = typeof distance === "number" ? distance : (dir === 'left' ? element.position().left + dx : element.position().left - dx);
            this.translate(element,distance,duration);
            element.on('transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd', transitionEnd);
        },
		speed: function(x1, y1, x2, y2, time) {
			return Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2)) / time;
		}
	});
})(Zepto)