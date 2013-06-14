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

**carousel plugin for jQuery ([demo](http://session.im/lightinthebox/carousel/slide.html))**: 
特色功能：
 1. 支持桌面浏览器及touch设备(touchmove swipe)；
 2. **auto detect speed of touchmove，有加速度运动效果**；
 3. supports auto play；
 4. supports infinite loop；
 5. 支持css3 translate3d（不支持时自动降级到普通动画）。

**carousel plugin for zepto.js ([demo](http://session.im/lightinthebox/carousel/zepto/slide.html))**
```
$('#carousel-demo').carousel({
   itemsPerMove: 2,
   duration: 500
});
```

thirdpartylinks/chrome_dev_tools/HAREntry.js: 
 **给chrome_dev_tools打了补丁，使其导出HTTP HAR文件时附加上请求的initiator信息（用于收集统计外链请求之源）**

