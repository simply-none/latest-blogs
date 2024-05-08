# vue

## vue组件通信方式

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

::: code-group

```vue [全局事件总线]
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
:::

## vue diff算法原理

> https://juejin.cn/post/7204594495996198968#heading-14

## vue中key的作用和原理

- key作为vue中vnode标记的唯一id，在patch过程中通过key判断两个vnode是否相同，使diff操作更准确快速
- 不加key，vue可能会根据就地更新的策略选择复用节点，导致保留了之前节点的状态
- 尽量不要使用索引作为key

## vuex中actions和mutations的区别

**mutations**：
- 能够直接修改state
- 同步

**actions**：
- 需调用mutations，间接修改state
- 能够执行异步操作

## Vue SSR的理解

概念：
- SSR（服务端渲染），将vue在客户端把标签渲染成html的工作放在服务端完成，然后再把html直接返回给客户端

优点：
- SSR有着更好的SEO，直接返回的就是渲染好的页面，搜索引擎能直接爬取到，而SPA的内容是通过ajax请求获取到的文件（比如js等），搜索引擎爬取不到
- 首屏加载速度更快，直接返回渲染后的html结构（直接就是完整的html页面），而SPA需要等待所有vue编译后的js文件都下载完成后，才开始进行页面的渲染（页面的渲染是通过js文件进行的）

缺点：
- 需要足够的服务器负载，因为渲染操作是在服务器上进行的，可使用缓存策略
- 部分vue api不支持

## Composition API和Options API的区别

> https://juejin.cn/post/7204594495996198968#heading-24

## css样式隔离

样式隔离方案：
- scoped：例如vue中的`<style scoped>`
- BEM：防止命名冲突，其中B(block)、E(element)、M(modifier)，例如`class="block-subblock__element--modifier"`
  - 解决方式是通过namespace，可使用tailwind css、isolation（css isolation、angular component styles）
- css-loader：css模块话，将css类名加上哈希值
- css in js：使用js编写css，让css拥有独立的作用域，阻止代码泄露到外部，防止样式冲突
- 预处理器
- shadow DOM（比如微前端）
