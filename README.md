### 说明
首屏加载，滚动加载图片
### 用法
```javascript
var lazyload = new LazyLoad({
        delay:500,
        //pics:2
    });
```
- delay滚动时延迟触发时间（滚动防抖）
- pics可以手动指定首屏加载图片个数，不指定则自动加载满首屏