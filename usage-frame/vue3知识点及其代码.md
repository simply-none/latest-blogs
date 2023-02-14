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

### 导航守卫

**全局前置守卫beforeEach**：

作用：用于权限控制

```typescript
const router = createRouter({ ... })
router.beforeEach((to, from) => {
  // 取消当前的导航
  return false
  // 调用下一个守卫
  return true || undefined
  // 路由地址(字符串、对象），表示中断当前导航，进行一个新的导航
  return { path: 'xxx' }
})
```

**全局解析守卫beforeResolve**：

作用：获取数据或执行其他任何操作（进入所有的页面后都执行的操作）的理想位置，用法与beforeEach类似

执行位置：在导航被确认之前，所有组件内守卫和异步路由组件被解析之后被调用

```typescript
router.beforeResolve(async to => {
  if (to.meta.requirsCamera) {
    try {
      await askForCameraPermission()
    } catch (err) {
      if (err instanceof NotAllowedError) {
        // ...处理错误，然后取消导航
        return false
      } else {
        throw err
      }
    }
  }
})
```

**全局后置钩子afterEach**：

作用：用于访问分析，更改页面标题，声明页面等

```typescript
router.afterEach((to, from, failure) => {
  if (!failure) sendToAnalytics(to.fullPath)
})
```

**路由独享的守卫beforeEnter**：

定义：在路由配置中，path同级位置定义beforeEnter字段，接受`(to, from)`两个参数，语法和beforeEach类似

作用：
- 只在进入路由时触发，在params、query、hash改变时不会触发
- 接受带`(to, from)`的函数，以及该类型函数组成的数组

```typescript
{
  const routes = [
    {
      path: '/users/:id',
      component: UserDetails,
      // 只在进入到/users/xxx的时候触发，xxx改变触发（因为是query、params、hash）
      beforeEnter: [(to, from) => {
        return false
      }]
    }
  ]
}
```

**组件内的守卫**：组合式api使用on访问
- beforeRouteEnter：不能访问this，此时组件未创建，但可通过第三个参数next访问
- beforeRouteUpdate：当前路由改变（params、query、hash的改变），但是该组件被复用时触发
- beforeRouteLeave：用于预防用户在未保存修改前突然离开

```typescript
import { ref } from 'vue'
import {onBeforeRouteLeave, onBeforeRouteUpdate, onBeforeRouteEnter } from 'vue-router'

const useData = ref()

onBeforeRouteEnter((to, from, next) {
  next(vm => {
    // 通过vm访问组件实例
  })
})

onBeforeRouteUpdate((to, from) => {
  if (to.params.id !== from.params.id) {
    userData.value = await fetchUser(to.params.id)
  }
})

onBeforeRouteLeave((to, from) => {
  const answer = window.confirm('?')
  if (!answer) return false
})
```

### 滚动行为

```typescript
const router = createRouter({
  history: createWebHashHistory(),
  routes: [],
  // 第三个参数只有当这是一个popstate导航（点击浏览器的后退、前进按钮，调用router.go()）时才有用
  // 如果返回一个falsy或者空对象，则不会发生滚动，同时可在返回的ScrollToOptions位置对象添加`behavior: 'smooth'`让滚动更顺畅
  // 1. 滚动到固定位置
  scrollBehavior (to, from, savedPosition) {
    // 返回一个ScrollToOptions位置对象
    return {
      top: 0
    }
  }

  // 2. 滚动到元素位置
  scrollBehavior (to, from, savedPosition) {
    return {
      el: '#main',
      // 或者是el: document.getElementById('main')
      // 始终在元素main上方滚动10px
      top: -10
    }
  }

  // 3. 滚动到锚点位置
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash
      }
    }
  }

  // 4. 滚动到之前的位置
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }

  // 5. 延迟滚动
  scrollBehavior (to, from, savedPosition) {
    return new Promose((resolve, reject) => {
      setTimeout(() => {
        resolve({ left: 0, top :0 })
      }, 500);
    })
  }
})
```