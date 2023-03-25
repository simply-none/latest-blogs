# vue3知识汇览

## nextTick用法

```javascript
import { nextTick } from 'vue'
// 使用await形式
// nexttick之前代码（此时DOM未更新）
// ......
await nextTick()
// nexttick之后的代码（此时DOM已经更新，可以获取到新的dom）
// ......

// 和vue2一样的方式
nextTick(() => {
  // 获取更新后的dom
  // ......
})
```

## Vue-router

### 基础知识

```typescript
// 创建路由
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(baseUrl),
  routes: []
})

// 路由跳转，路由对象属性有：path、query、hash、params、name，谨记params不能和path一起使用
import { useRouter } from 'vue-router'

const router = useRouter()

router.push({
  // 路由对象
})

// 获取当前路由
import { useRouter, useRoute } from 'vue-router'
// 1. 使用useRoute
const route = useRoute()
// 2. 使用router
const router = useRouter()
const route = router.currentRoute.value

```

### 路由传参

**布尔模式**：

定义：在路由配置中，path同级目录，设置props属性（boolean形式），当为true时，route.params将被设置为组件的props，定义id prop后此时获取route.params.id（路由path：`path: '/user/:id`）可直接通过props.id获取到。当存在命名视图的路由时，props属性是一个对象形式，分别为每个命名视图设置布尔值

```typescript
const routes = [
  {
    path: '/user/:id',
    name: 'user',
    component: User,
    // 将路由参数传递给User组件
    props: true
  },
  {
    path: '/user/:id',
    components: {
      default: User,
      sidebar: Sidebar
    },
    props: {
      default: true,
      sidebar: true
    }
  }
]
```

**函数模式**：

```typescript
const routes = [
  {
    path: '/user',
    component: User,
    // 此时会将路由参数换成对象作为props传递给User组件
    props: route => ({id: route.query.userId})
  }
]
```

### 动态路由

**添加路由**：
- `router.addRoute({path: '/about', name: 'about', component: About})`
- 嵌套路由，添加admin的子路由children：`router.addRoute('admin', {xxx})`

**删除路由**：
- `router.removeRoute('about')
- 当添加多个name相同的路由时，后面的会替换前面的
- `const removeRoute = router.addRoute(xxx); removeRoute()`
