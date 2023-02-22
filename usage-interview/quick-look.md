# 速记手册

## 1. 对象的数据属性和访问器属性

数据属性：
- writable：值是否可写
- value
- enumerable：值是否可枚举
- configurable：数据属性是否可修改

访问器属性：
- get:
- set:
- enumerable:
- configurable:

相关方法：
- `Object.defineProperty(obj, key, { // descriptor obj })`
- `Object.defineProperties(obj, { key: { // descriptor obj}, ...})`
- `Object.getOwnPropertyDescriptor(obj, key)`

## 2. toString()和valueOf()

toString:
- 将对象转成一个原始值

valueOf:


注意：
- 数字的强制转换和原始值的强制转换，会优先调用valueOf()
- Date对象优先调用toString()，若该方法返回非原始值，则会调用valueOf()
- String()、alert()优先调用对象的toString()，
- 强制类型转换的地方有：在进行`+`、`==`运算时，一方有非数字类型

## 3. 如何实现设置localStorage的有效期？

实现思路：
- 第一种：
  1. 调用setItem存值时，将item存储为一个对象格式，里面包含属性有value、expires（过期时间格式，转为统一的time时间戳格式）
  2. 取值时，将过期时间戳expires与当前的时间戳对比，过期则清空
  3. 清空逻辑有：比如定时器、用户操作时、窗口聚焦时、鼠标滚动时等
- 第二种：查看是否有开源的组件，进行调用

## 4. 浏览器的缓存策略（强缓存和协商缓存）？

> 参考：
> https://www.jianshu.com/p/2961ce10805a
> https://blog.csdn.net/Huangmiaomiao1/article/details/125862342
> https://blog.csdn.net/m0_65335111/article/details/127348516

## 5. 数组的常用方法

修改数组：
- fill(value, start, end)
- pop()
- shift()
- push(value, ...)
- unshift(value, ...)
- splice(start, count, value, ...)

返回新数组：
- `concat(value, arr, ...)`
- filter(value, index, arr)
- find
- flat(depth)：数组扁平化
- flatMap(value, index, arr)：返回若直接返回value，功能和flat(1)类似，否则遍历元素，返回每个的结果
- map(value, index, arr)
- reduce((value, index, arr) => {}, initval)
- slice(start, end)

返回迭代器对象：
- keys()
- values()
- entries()

其他：
- find/findLast
- findIndex/findLastIndex
- reverse()
- forEach
- some，一个truth即返回true
- every，所有truth即返回true
- sort(sortFn)
- includes(value, fromIndex)
- join(value)
- Array.from(arr, newArrCallback)：对类数组/可迭代对象转为数组，同时对新数组进行map回调，返回返回新的值
- Array.of(value, ...):将参数表列转为一个数组

## 6. 异步编程

包含：
- Promise
- async-await
- generator
- 回调函数，将同步变异步，类似f1(f2)的方式，可结合settimeout一起，简单但高耦合
- 事件监听
- 发布订阅模式（观察者模式）

## 7. 闭包

> 参考：
> https://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html
> https://zh.javascript.info/closure

> 闭包使用场景：
> https://juejin.cn/post/6844903619595075592
> https://segmentfault.com/a/1190000023425946

定义：
- 闭包是能够读取其他函数内部变量的函数
- 由于只有函数内部的子函数才能够读取函数的局部变量，故闭包可以理解为定义在一个函数内部的函数
- 闭包是指一个函数可以记住其外部变量并可以访问这些变量

## 8. 引入css和执行js会阻塞html的渲染吗？

从浏览器输入url到页面渲染的过程中，html通过html解析器生产DOM树，css通过css解析器解析成css对象，然后组成CSSOM树，解析过程互不影响，是并行解析的。**但是**，渲染树需要结合DOM树和CSSOM树才能够生成，这一步会阻塞html的渲染。

具备async和defer属性的script会异步执行脚本，其中：
- async：脚本返回后，若html未解析完，浏览器会暂停解析html，先让js引擎执行代码，这时会阻塞html的渲染
- defer：脚本返回后，若html未解析完，浏览器会继续解析html，在html解析完毕后再执行js代码，不会阻塞html的渲染

## 9. 类型判断的方式

typeof：
- 能准确判断所有基础数据类型，引用类型会判断为object
- null会判断为object
- Function和函数会判断为function

instanceof：
- 能准确判断引用数据类型，不能判断基础数据类型（得不到正确的结果，因为基础类型类型Number等其实都是对象）


`Object.prototype.toString.call(value)`：
- 能够获取到所有准确的数据类型

## 10. css选择器分类

- 基础选择器：
  - 标签选择器（元素选择器，`div`）
  - id选择器（`#title`）
  - class选择器（`.title`）
  - 通配符选择器（`*`）
  - 群组选择器（逗号选择器，`div, p, span`）
- 关系选择器：
  - 后代选择器（空格选择器，`.parent .child`）
  - 子代选择器（大于号选择器，`div>.first`）
  - 相邻选择器（加号选择器，`.first+.second`）
  - 兄弟选择器（选择器，`div~p`）
- 属性选择器：
  - `div[class]`
  - `div[class='parent']`
  - `div[class^='par']`
  - `div[class$='par']`
  - `div[class*='par']`，属性值里面包含该字符串即可
  - `div[class~='par']`，属性值必须完全匹配
  - `div[class|='par']`，匹配以par或par-开头的
- 伪类选择器：用于选择元素
  - :first-child, :nth-child(n)
  - :first-of-type(表示第一个子元素)，:nth-of-type(n)
  - :not()
  - :link, :visited, :hover, :active
- 伪元素选择器
  - :before, :after
  - ::first-letter, ::first-line(分别表示第一个字母和第一行)

## 11. 深拷贝和浅拷贝