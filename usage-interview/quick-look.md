# 速记手册

> 网站集合：
> https://fe.ecool.fun/
> 参考：
> https://juejin.cn/post/7204594495996198968

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

## 12. 原型链图

原型：
- 原型（prototype）是函数function对象的一个属性，它定义了构造函数制造出来的对象（new运算符调用的函数）的公共祖先
- 通过构造函数产生的对象可以继承到该原型的属性和对象，原型也是对象。
- 隐式原型(__proto__-->每个实例上都有的属性)和显式原型（prototype-->构造函数的属性）
- 对象的原型（对象原型的最顶端是null）

原型链：
- 在原型上再加一个原型，再加一个原型..把原型连成链，访问顺序也是按照这个链的顺序跟作用域链一样，叫做原型链

```mermaid
flowchart
  foo[const foo = new Foo]
  Foo[function Foo]
  obj[const obj = new Object]
  Object[function Object]
  foo--__proto__-->Foo.prototype--__proto__-->Object.prototype--__proto__-->null
  Foo--prototype-->Foo.prototype--constructor-->Foo
  obj--__proto__-->Object.prototype
  Object.prototype--constructor-->Object
  Object--prptotype-->Object.prototype
  Object--__proto__-->Function.prototype
  Function--prototype-->Function.prototype--constructor-->Function
  Function.prototype--__proto__-->Function
  Foo--__proto__-->Function.prototype--__proto__-->Object.prototype
```

## 13. css属性继承

所有元素都可继承的：
- visibility
- cursor

子元素可继承的：
- letter-spacing、word-spacing、white-spacing
- line-height
- font、color
- text-(decoration、transform、indent、align)、direction

列表元素可继承的：
- list-style

表格元素可继承的：
- border-collapse

不可继承的属性，若想和父元素保持一致，可将该属性设置为inherit

## 15. vue组件通信方式

vue2：
- 父子通信：
  - props、emits
  - slot
  - `v-bind:val.sync`(父)和`emit('update:val', data)`(子)
  - `v-model:obj='xxx'`(父)和`emit(updateValue, data)`，且子组件传入props obj，同时作用于input(子)
  - `v-model="xxx"`(父)和`emit(input, data)`，且子组件传入props value，同时作用于input(子)
- 祖孙通信：
  - $attrs(传过来的非props的v-bind属性)、$listeners(接收所有绑定的事件)，可使用`v-bind="$attrs"`和`v-on="$listeners"`全部传递
  - $refs、$children、$parent、$root
  - provide`(void => {}`、inject(`arr`)
- 跨组件通信：
  - 全局事件总线
  - mixin(mixin配置的内容都会混入到当前组件中)
  - vuex
  - [pubsubjs](https://www.npmjs.com/package/pubsub-js)(JavaScript的发布订阅库)

vue3:
- props、emits
- v-model
- refs
- provide、inject
- eventBus（通过第三方库：mitt、tiny-emitter）
- vuex
- pinia

<!-- tabs:start -->

<!-- tab:全局事件总线 -->
```vue
new Vue({
  beforeCreate() {
    Vue.prototype.$bus = this
  }
})
// 1. 接收数据
this.$bus.$on('receiveParams', data)

// 2. 发送数据
this.$bus.$emit('receiveParams', data)
```
<!-- tabs:end -->

## 16. 重绘repaint和重排reflow(回流)

重绘：结构未变化，只是改变了某个元素的外观风格，而不影响周围或内部的布局时，会发生重绘，情况有：
- 改变背景属性
- 改变字体颜色
- visibility属性变化
- box-shadow变更

重排：结构、尺寸、排版发生了变化，或者说页面上元素的占位面积、定位方式、边距等发生了变化，会引起重排，情况有：
- 网页初始化时
- 增删dom节点时
- 移动dom节点、给dom节点添加动画
- 窗口大小发生变化时、页面滚动时
- 元素内容发生变化时、元素尺寸发生变化时、元素字体大小种类变化时
- 查询调用某些属性时（offsetxxx、scrollXXX、clientXXX、设置style属性、调用getComputedStyle）

注意：
- **重排一定会引发重绘**，因为得重新定义结构布局，然后渲染css样式

优化技巧：
- 不适应table布局，table布局的一个改动会造成整个table重新布局
- 读、写操作不放在同一个语句
- 不一条条修改dom样式（不如修改css class）
- 复杂动画的元素使用绝对定位，脱离文档流，不影响其他节点
- 使用虚拟dom
- 避免使用css表达式

## 17. 宏任务、微任务、同步任务

事件循环的本质
- 作为单线程js对异步事件的处理机制
- 仅有一个主线程js的处理逻辑，保证主线程有序、高效、非阻塞的处理

事件循环处理逻辑：
- 同步任务、异步任务（又分为微任务、宏任务，且宏任务优先级高）分别进入不同的执行场所
- 同步任务直接在主线程执行，异步任务则在事件队列event queue中等待
- 当全部同步任务执行完毕后，再去event queue中执行异步回调的函数，异步回调的函数进入到主线程执行
- 异步任务内部的内容，又依次进行上述步骤，这样的机制，叫做事件循环

执行顺序：
- 代码执行顺序：同步任务 -> 微任务 -> 宏任务
- 微任务执行顺序：process.nextTick -> Promise
- 宏任务执行顺序：setImmediate -> setTimeout -> setInterval -> I/O操作 -> ajax

微任务：
- Promise里面的(then、catch、finally)
- async/await
- process.nextTick
- Object.observe(实时监测js对象的变化)
- MutationObserver(监听DOM树的变化)

宏任务：
- 整体代码script
- setTimeout、setInterval、setImmediate
- I/O操作（输入输出，比如文件读取、网络请求）
- ui render（dom渲染）
- ajax

注意：
- vue.nextTick用于在下次dom更新（宏任务）循环结束后执行的延迟回调，在修改数据之后立即使用 nextTick 来获取更新后的 DOM。 nextTick主要使用了宏任务和微任务。 根据执行环境分别尝试采用Promise（微）、MutationObserver（微）、setImmediate（宏），如果以上都不行则采用setTimeout定义了一个异步方法，多次调用nextTick会将方法存入队列中，通过这个异步方法清空当前队列

## 18. css样式隔离

样式隔离方案：
- scoped：例如vue中的`<style scoped>`
- BEM：防止命名冲突，其中B(block)、E(element)、M(modifier)，例如`class="block-subblock__element--modifier"`
  - 解决方式是通过namespace，可使用tailwind css、isolation（css isolation、angular component styles）
- css-loader：css模块话，将css类名加上哈希值
- css in js：使用js编写css，让css拥有独立的作用域，阻止代码泄露到外部，防止样式冲突
- 预处理器
- shadow DOM（比如微前端）

## 19. 事件委托、事件冒泡、事件捕获

事件委托（事件代理）：
- 即事件（比如点击事件、鼠标移动事件等）本来是加在子元素上，却加在父祖元素上来监听，利用了事件冒泡的原理，因为事件最终都会加在父级上触发执行效果
- 事件委托的好处是减少事件注册，节省内存占用，新增节点时，后续节点自动拥有之前绑定的事件
- 事件委托的缺陷是逻辑变多时，可能会出现事件误判

事件冒泡：
- 事件会从目标节点流向文档根节点，途中会经过目标节点的各个父级节点，

事件捕获：
- 事件从文档根节点流向目标节点，途中会经过目标节点的各个父级节点

注意：
- 事件的处理过程：先捕获，后冒泡
- 事件处理过程中，若某个节点定义了多个同类型事件，某个事件使用了`event.stopImmediatePropagation()`，其他同类型事件不会执行
- 阻止事件的默认操作（比如点击a标签会跳转，点击提交按钮会将数据提交到服务器等）可以用`event.preventDefault();`来阻止
- 阻止事件冒泡和事件捕获：`e.stopPropagation()`
- `addEventListener(event,fn,useCapture)`：第三个参数表示是否触发事件捕获过程
- addEventListener和on的区别：on事件会被后面的on事件覆盖，前者不会

## 20. 遇到的难解决的问题

难解决的问题分为两种：
1. 业务问题，需求不清。这时需要拉上懂业务的同事理清需求，必要的时候需要调整设计。同时自主学习，增强对业务的了解。
2. 技术问题，可能是由于之前技术栈限制导致需求难以实现，或者说现有技术导致实现需求会有性能、可维护性问题，或者是自身储备或者周边资源不足(比如说没有现成的组件库)导致工期比预想长。可以通过最小限度实现需求、请教公司或同项目组的同事寻找合适的工具、交叉集成其他框架等方式解决，但最重要的是及早沟通。

注意：
- 遵循star法则回答

## 21. 前端模块化

> 参考：  
> https://juejin.cn/post/7193887403570888765  
> https://juejin.cn/post/6844903744518389768  
> https://juejin.cn/post/7166046272300777508  

## 22. 前端性能优化

> 参考：  
> https://juejin.cn/post/7188894691356573754  
> https://juejin.cn/post/7080066104613142559  


## 23. token刷新

解决方案：
- 后端返回过期时间，前端判断token过期时间，去调用刷新token接口
- 后端拦截请求，验证token是否过期，过期则重新生成token将其放在响应头中，前端在响应拦截器中判断是否有无新token，有则进行替换（请求后）
- 使用定时器定时刷新token接口
- 在请求拦截器(比如`axios.interceptors.request.use`)中拦截，判断token是否将要过期，调用刷新token接口（请求前）


关键词解析：
- 认证(authentication)：验证当前用户的身份
- 授权(authorization)：用户授予第三方应用访问该用户某些资源的权限
- 凭证(credentials)：实现认证和授权的前提是需要一种媒介（证书）来标记访问者的身份，而凭证就是这个媒介
- JWT(JSON Web Token)：跨域认证解决方案，一种认证授权机制
- access token：访问资源接口时所需要的资源凭证
- refresh token：用于刷新access token的token
- cookie：本地存储，会在浏览器下次向同一服务器再次发起请求时被携带并发送到服务器上，顶级域名下共享cookie

> 参考：https://juejin.cn/post/6844904034181070861

## 24. Tree-shaking

> 参考:   
> https://juejin.cn/post/7109296712526594085    
> https://juejin.cn/post/7002410645316436004    

**dead code**定义：
- 代码不会被执行，代码不可到达（它所处的位置）
- 代码执行的结果不会被用到
- 代码只会影响死变量（只写不读的变量，即该变量不会对其他内容产生影响）

定义：
- tree shaking是一种基于es module规范的dead code elimination技术，它会在运行过程中静态分析模块之间的导入导出，确定ESM模块中哪些导出值未被其他模块使用，并将其删除，以此来实现打包产物的优化
- tree shaking是一个通常用于描述移除JavaScript上下文中未引用代码dead code行为的术语

作用：
- 减少最终的构建体积

**在webpack中启动tree shaking的三个条件**：
1. 使用ESM编写代码
2. 配置`optimization.usedExports = true`，启动标记功能
3. 启动代码优化功能，有下列三种方式：
   - 配置`mode = production`
   - 配置`optimization.minimize = true`
   - 提供`optimization.minimizer`数组

```js
// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true
  }
}

```

**关闭tree shaking**：
- 在package.json中设置一级字段`sideEffects: false`，表示所有代码都不包含副作用，这时所有代码都会按照插件默认规则进行tree shaking
- 在package.json中设置一级字段`sideEffects`为一个数组，数组值表示会产生副作用的文件，此时数组内匹配到的文件将不会被tree shaking
- 在webpack.config.js的rules字段中对应规则下设置sideEffects字段选择是否进行tree shaking

<!-- tabs:start -->
<!-- tab:package.json -->
```json
// package.json
{
  // 所有的代码都不会被tree shaking
  "sideEffects": true,
  // 数组内匹配到的文件不会被tree shaking
  "sideEffects": ["./src/app.js", "*.css"]
}
```

<!-- tab:webpack.config.json -->
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        },
        sideEffects: false || []
      }
    ]
  }
}
```
<!-- tabs:end -->

**tree shaking最佳实践**:
- 避免无意义的赋值或引用,即被赋值的变量后续未被使用到
- 在调用前使用`/*#__PURE__*/`备注,告诉webpack该次函数调用不会对上下文环境产生副作用,可以进行tree shaking
- 禁止Babel转译模块的导入导出语句,因为会导致webpack无法对转义后的模块导入导出内容做静态分析,使得tree shaking失效
- 优化导出值的粒度,在exports中,不能进行赋值/初始化操作,应该初始化赋值完毕后,再用exports将该变量导出
- 使用支持tree shaking的包,比如使用lodash-es替代lodash

## 25. 虚拟dom和真实dom的区别

背景:
- DOM的缺陷:dom节点的操作会影响到渲染流程,同时Dom节点的增删改都会触发样式计算、布局、绘制等任务（重排的过程），同时还会触发重绘
- 一个复杂的页面中，重排和重绘非常消耗资源，也非常费时

虚拟DOM做的事情：
1. 将页面改变的内容应用到虚拟DOM（一个JS对象）上
2. 调整虚拟DOM的内部状态
3. 虚拟DOM收集到足够多改变时，再将变化一次性应用到真实的DOM上（也是调用dom操作的一步，若直接操作真实dom，就没有前面2步，会发生频繁的重排重绘操作）

## 26. 组件封装的一些技巧

1. 插槽的用法：组件封装时，需要考虑到通用性。比如一个dialog组件，需要显示中间的信息和底部的操作按钮。此时需要考虑的场景是当组件使用时，是否需要中间/底部栏，则在封装组件的时候，通过`v-if='$slot.name'`判断用户是否使用了相应的中间/底部栏，否则会一直展示中间/底部栏的位置。
2. 组件封装时，组件通信的技巧：通过vue语法糖`.sync`来进行组件间的传值，用法如下：使用该组件时：`:data.sync="sync"`，自定义组件内部通过某些点击事件来传送该值到父组件中：`this.$emit('update:data', value)`
3. 自定义组件注册：在使用`Vue.component()`注册组件时，第一个参数可以使用组件的名字(`component.name)`，此处的name即exports里面的name
4. 组件注册自定义属性的时候，在自定义组件内部使用props时，需验证属性的类型，以及默认值等信息。同时在使用该组件时，不一定必须使用`v-bind`对属性进行绑定，因为默认情况下是字符串，同时对于一些显示隐藏的属性，可根据是否有值来判定/设置相应的class。
5. 输入框组件封装重点：`v-model`的使用技巧。使用组件时：`v-model="value"`，自定义组件内部：`:value="value" @input="handleInput" handleInput (e) { this.$emit('input', e.target.value) }`，这样才能实现数据的双绑定。
6. 输入框组件密码显隐：展示密码和展示右侧的图标。密码的显隐切换是由type类型来控制的，故当传入密码显示属性`password`时，type应进行判断，有password则通过password来判断是否在password和text之间切换，无password属性则直接为password。控制password的变化需要在自定义组件内部加一个passwordVisible属性来切换

## 27. 防抖和节流

定义：
- **防抖**：在规定的时间内，若上一次的操作未执行（或未执行完毕）（通过一个标志变量来判断是否执行完毕），*则取消上一次内容的执行（比如清除定时器），转而执行当前次的操作*
- **节流**：在规定的时间内，若上一个的操作未执行（或未执行完毕）（通过一个标志变量来判断是否执行完毕），*则不做任何操作（即退出函数，忽略当前次操作），而上一次操作正常执行*

**应用场景**：
- 防抖：输入框输入内容后请求api获取结果
- 节流：输入联想、内容拖动、滚动条滚动、计算鼠标移动的距离，此时需要在一段时间内触发操作，节流比较适合，使用防抖时会一直取消上一次操作，可能在这段时间内不会返回任何内容，影响用户观感

<!-- tabs:start -->

<!-- tab:防抖 -->
```js
function debounce (fn, delay = 200) {
  let timer = 0
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = 0
    }, delay)
  }
}
```

<!-- tab:节流 -->
```js
function throttle (fn, delay = 200) {
  let timer = 0
  return function () {
    if (timer) {
      return false
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = 0
    }, delay)
  }
}
```
<!-- tabs:end -->

## 28. Object.defineProperty和Proxy的区别

**Object.defineProperty(obj, prop, desc)**:

定义：
- 直接在一个对象上定义一个新属性，或者修改对象的已有属性，返回该对象

作用：
- 在vue2中，对于未初始化的对象属性，不能进行直接赋值，可通过$set或Object.assign进行赋值
- 不能监听数组变化：在vue2中，不能直接对数组下标进行赋值，不能直接修改数组长度，可通过$set（赋值）、splice（赋值，修改长度）正常操作
- 必须（深层）遍历（嵌套）对象：只能劫持对象的属性，所以需要对每个属性进行遍历，而属性若是对象，则需深度遍历
- 兼容性好，能够兼容ie

**new Proxy(target, handler)**：

定义：
- 创建一个对象的代理，实现对对象基本操作的拦截和自定义（属性查找、赋值、枚举、函数调用等）

作用：
- 能够针对整个对象，而非对象的某个属性
- 拦截处理函数handler有13种之多
- 返回一个新对象，而不是原有对象


## 29. vue diff算法原理

> https://juejin.cn/post/7204594495996198968#heading-14

## 30. vue中key的作用和原理

- key作为vue中vnode标记的唯一id，在patch过程中通过key判断两个vnode是否相同，使diff操作更准确快速
- 不加key，vue可能会根据就地更新的策略选择复用节点，导致保留了之前节点的状态
- 尽量不要使用索引作为key

## 31. vuex中actions和mutations的区别

**mutations**：
- 能够直接修改state
- 同步

**actions**：
- 需调用mutations，间接修改state
- 能够执行异步操作

## 32. Vue SSR的理解

概念：
- SSR（服务端渲染），将vue在客户端把标签渲染成html的工作放在服务端完成，然后再把html直接返回给客户端

优点：
- SSR有着更好的SEO，直接返回的就是渲染好的页面，搜索引擎能直接爬取到，而SPA的内容是通过ajax请求获取到的文件（比如js等），搜索引擎爬取不到
- 首屏加载速度更快，直接返回渲染后的html结构（直接就是完整的html页面），而SPA需要等待所有vue编译后的js文件都下载完成后，才开始进行页面的渲染（页面的渲染是通过js文件进行的）

缺点：
- 需要足够的服务器负载，因为渲染操作是在服务器上进行的，可使用缓存策略
- 部分vue api不支持

## 33. Composition API和Options API的区别

> https://juejin.cn/post/7204594495996198968#heading-24
