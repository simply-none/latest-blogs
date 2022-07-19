# vue-router迁移指南

**创建路由**：
- 不支持base属性，通过路由模式函数的第一个参数替代
- 不支持fallback属性，可以直接使用[html5 history api](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)进行历史会话访问

```javaScript
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // 路由模式
  history: createWebHashHistory(),
  // 路由对象数组
  routers: []
})
```

**路由模式**：history选项的变更，它的值的切换需要从vue-router导入对应的函数，比如：
- `history`对应于`createWebHistory()`函数
- `hash`对应于`createWebHashHistory()`函数
- `abstract`对应于`createMemoryHistory()`函数

**单页面应用基路径设置**：
- 基础路径作为路由模式函数的第一个参数传入，之后匹配的路由都会加上这个基础路径前缀
- 例如：`history: createWebHashHistory('/base-dir/')`