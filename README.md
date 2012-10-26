libs and some resource for lightinthebox's frontend
libs and some resource for lightinthebox's frontend

jquery.lazyload.js(see https://github.com/tuupola/jquery_lazyload) for `img` lazy-load or `TEXTAREA` lazy-render:
My modification:
 1. adjust for jquery v1.3.1(data api has bug?)
 2. handle img `error` event
 3. `scroll` event optimization
 4. ipad support(`touchmove` event)
 5. unbind `scroll` event after all imgs loaded
 6. taobao's BigRender support(lazy render the html in `TEXTAREA` ) 
 7. select all lazy-rendered img and textarea by `data-lazy` Property , which is $("[data-lazy]") in jQuery;
 8. all lazy-rendered img and textarea should have `lazy-render` class

carousel.js ([demo](http://session.im/lightinthebox/carousel/slide.html)): 基于对商业产品TouchCarousel.js的黑盒分析，实现了其部分特色功能：
 1. 支持桌面浏览器及touch设备(touchmove swipe)；
 2. **支持touchmove speed探测，有基本加速度运动效果**；
 3. 可自动轮番播放图片；
 4. 支持图片pagingNav；
 5. 支持css3 translate3d（不支持时自动降级到普通动画）。


lightinthebox/thirdpartylinks/chrome_dev_tools/HAREntry.js: 
 **给chrome_dev_tools打了补丁，使其导出HTTP HAR文件时附加上请求的initiator信息（用于收集统计外链请求之源）**

