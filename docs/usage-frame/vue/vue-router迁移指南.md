# vue-router迁移指南

> 迁移指南：https://router.vuejs.org/zh/guide/migration

**创建路由**：
- 不支持base属性，通过路由模式函数的第一个参数替代
- 不支持fallback属性，可以直接使用[html5 history api](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)进行历史会话访问

::: code-group

```typescript [创建路由]
// 第1步：定义路由文件router/index.ts
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(baseUrl),
  routes: []
})

// 第2步：在main.ts中挂载路由
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

```vue [使用路由]
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
// 1. 使用useRoute
const route = useRoute()

// 2. 使用router,获取当前路由
const router = useRouter()
const route = router.currentRoute.value

// 路由跳转，路由对象属性有：path、query、hash、params、name，谨记params不能和path一起使用
function toogleRoute() {
  router.push({
    // 路由对象
  })
}
</script>
```

:::

**单页面应用基路径设置**：
- 基础路径作为路由模式函数的第一个参数传入，之后匹配的路由都会加上这个基础路径前缀
- 例如：`history: createWebHashHistory('/base-dir/')`

**路由元信息**：
- 使用场景：比如希望将任意信息（过度名称、是否由权限）附加到路由上时，可以将这些内容设置在路径对象的meta属性上（与path同级）
- 路由元信息可以通过$route.meta、导航守卫访问
- 使用ts时，需要定义meta字段

```typescript
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // meta对象内的属性及类型定义
    isAdmin?: boolean
    requireAuth: boolean
  }
}
```

**router-view**：该标签将显示与url对应的组件。

## 路由模式

**路由模式**：history选项的变更，它的值的切换需要从vue-router导入对应的函数，比如：
- `history`对应于`createWebHistory()`函数
- `hash`对应于`createWebHashHistory()`函数
- `abstract`对应于`createMemoryHistory()`函数

**hash模式**：它在内部传递的实际url之前使用了一个哈希字符#，由于这部分url从未被发送到服务器，所以它不需要在服务器层面上进行任何特殊处理。

**html5模式**：正常的url模式，配置该模式时需要在服务器上配置一个回退路由（不匹配的路由则使用这个），一般是index.html页面，同时页面中再定义一个404路由（更友好）

## 路由跳转(编程式导航)

注意：
- 路由跳转的方法是异步的

**路由跳转的方式**：
- 使用`<router-link :to="xxx">`，点击该链接，会在内部调用下面的路由对象方法。不使用a标签是因为该标签可以在不重新加载页面的情况下更改URL、处理URL的生成和编码
- 使用路由对象的方法，比如push、replace、go

**跳转的参数设置**：
- to和push等方法的参数可以是一个字符串（可以是带变量的反斜杠字符串）、一个描述地址的对象（路径对象）

```javascript
<router-link :to="'/user/123'" />
router.push('/user/123')
router.push(`/user/${id}`)
router.push({ path: '/user/123' })
router.push({ name: 'user', params: { id: '123' }})
// 加上查询符号?
router.push({ name: 'user', params: { id: '123' }, query: { age: 18 }})
// 加上hash值
router.push({ name: 'user', params: { id: '123' }, hash: '#jade' })

// 路由替换，替换当前位置，不会往history中添加新纪录
<router-link :to="'/user/123'" replace />
router.push({ path: '/user/123', replace: true})
router.replace({path: '/user/123'})

// 前进/后退多少步，类似浏览器的前进后退，当历史堆栈中无那么多记录，则静默失败
router.go(1)
router.go(-1)

router.go(-100)
```

注意：
- path和params不能同时存在，如果提供了path，params将会被忽略
- params的参数值必须是string和number类型，其他类型都会被自动字符串化，可选参数可传入空字符串

## 命名路由

**添加命名路由**：
- 给路径对象加上name属性即可

**命名路由的优势**：
- 没有硬编码的URL
- params自动编码/解码
- 防止url打字错误
- 绕过路径排序，直接命中name为该值的路由，而非查询所有路由去匹配路径（命名路由优先于path路由）

## (动态)路由匹配

**路径参数**：
- 场景：需要将给定匹配模式的路由映射到同一个组件
- 语法：用冒号`:`表示，比如`/:id`或`/user:id`，当有路径匹配该路由时，路径参数id可以通过路由参数`$route.params.id`获取
- 当定义类似路由`/:id`时，vue-router内部使用正则`[^/]+`从url中提取路径参数
- 一个路由中，可设置多个路径参数

**路径参数与自定义正则表达式结合使用**：
- 语法形式：以冒号开头的变量（通过params.xx获取的），和变量名后括号括起来的正则表达式，即`:variable(re)`，可以和路径中的其他内容结合
- [路径排名工具](https://paths.esm.dev/)：可以通过路径推算路由形式的path，也可以查看path是否符合路径参数
- `/:id(\\d+)`：表示路由参数id的值可以是正则表达式`\d+`所匹配的内容(即id的值可以是至少包含一个数字的数字字符串)，例如`/123`, `/234`，注意在该例中**需要对`\d`的斜杠`\`进行转义**
- `/:id+`：表示id可重复至少一次以上，这里的`+`的对象是id，与上述不同，上述`\\d+`表示的是id具体的内容可以是什么，这里表示的是id是可重复一次以上的，例如`/123/234/89`, `/123`，这时在给参数设值时需要提供一个数组形式
- `/:id*`：表示id可重复0次以上，即可以不包含id，或者id重复一次以上，例如`/`, `/123`, `/123/12`，这时在给参数设值时需要提供一个数组形式
- `/:id?`：表示id可重复0次或1次，例如`/`, `/23`, `/34`
- 当路由使用了自定义正则表达式时，使用api（例如push）进行路由跳转时，其路径参数可以是一个数组形式，数组为空则表示重复0次，数组的长度表示重复`array.length`次，数组每一项的值表示路径参数的值，比如`{ params: { id: [1, 2, 3] }}`可以匹配路由`/:id(\\d+)+`，path的形式则是`/1/2/3`
- 捕获所有路由，使用`path: '/:patchMatch(.*)*'`的语法形式，其中patchMatch可以是任意值，可通过params.patchMatch设值或查值，其他类似语法还有`path: '/user-patchMatch(.*)*'`
- 更宽泛的路由匹配需要放在更底部，因为路由匹配是从上往下匹配的，匹配成功即停止匹配。

**sensitive vs strict**：
- 两个属性都可用于整个全局路由（和history、routes同级）与和当前路由上（和path同级）
- sensitive：路由匹配是否区分大小写，默认为false，表示不区分大小写，比如默认情况下`/user:id`可以匹配`/user12`, `/USeR12`，为true时，则只能匹配`/user12`
- strict：路由匹配是否严格检查路由末尾是否有尾部斜线，默认为false，比如默认情况下`/user:id`可以匹配`/user12`, `/user12/`，为true时，则只能匹配`/user12`，此处的严格检查表示路由匹配加了尾部斜线，你就能够匹配有尾部斜线的路由，反之为true时，就匹配不了含尾部斜线的路由

::: code-group

```javascript [路由捕获示例1]
// 路径对象
const routes = [
  // 表示可重复patchmatch 0次以上，同时patchMatch的值可以是任意值，例如匹配/, /12ad, /23/fda/f等，可通过$route.params.patchMatch获取
  { path: '/:patchMatch(.*)*', name: 'NotFound', component: NotFound },
  // 表示afterUser的值可以是任意值，例如匹配/user-, /user-12, /user-89f等
  { path: '/user-:afterUser(.*)' , component: UserGeneric }
]

// 使用api进行路由跳转，值为：RouteLocation & { href: string; }，可以用作router.push的参数
const location = router.resolve({
  name: 'user',
  params: {
    // 可以匹配路由`/:id*`
    id: [],
    // 可以匹配路由`/:id(\\d+)+`
    id: [12, 34]
  }
})
router.push(location)
```
:::

注意：
- routes中，路径对象的顺序不重要
- 当路由参数变化时，即上述的id变化时，渲染的都是同一个组件，而相同的组件实例会被重复使用，所以此时组件的生命周期钩子将不会被再次调用，这时：
  - 1. 可通过监听`watch`路由对象参数`$route.params`去做id变化时要做的操作（比如根据id获取对应的信息等）
  - 2. 使用组件内的路由导航守卫`onBeforeRouteUpdate`对id变化进行相应的处理

## 嵌套路由

使用：
- 嵌套路由通过路径对象的children路径对象数组结合`router-view`一起使用
- 嵌套路由的功能和动态路由匹配类似，但是它不需要进行url的嵌套（即path的嵌套）
- 在children路径对象数组中，添加一个空的path路径，用于渲染上级路由

注意：
- 嵌套路由的跳转，可通过name属性进行跳转，也可通过path属性进行跳转
- 当通过name属性跳转到父路由（上级路由）时，重新刷新加载页面时将会显示嵌套的空子路由(`path: ''`)，而非父路由
- 在某种情况下，你只想访问父路由，而非嵌套的空子路由，此时你需要使用命名路由访问（即使用name的形式跳转）

```javascript
const routes = [
  {
    path: '/user/:id',
    name: 'user-parent',
    component: User,
    // children也是一个routes对象
    children: [
      {
        path: '',
        name: 'user-child',
        component: UserChild
      },
      {
        path: 'profile',
        name: 'user-profile',
        component: UserProfile
      }
    ]
  }
]
```

## 命名视图

解释：
- 想在同一个界面中同时显示多个视图，比如常规的布局（header、aside、main），不仅可以使用组件的方式，还可以使用嵌套视图的方式使用
- 命名视图通过`<router-view name>`结合components属性对象（和path同级）一起使用，对象的属性名即name的值，对象的属性值是一个组件

```javascript
// html
<div>
  <h1>user setting</h1>
  <NavBar/>
  // 默认视图
  <router-view/>
  // 命名视图
  <router-view name="helper" />
</div>

// javaScript
const routes = [
  path: '/settings',
  component: UserSetting,
  children: [
    {
      path: 'emails',
      // 这里匹配默认视图，无name的
      component: UserEmails
    },
    {
      path: 'profile',
      components: {
        // 这里匹配默认视图，无name的
        default: UserProfile,
        // 这里匹配命名视图helper
        helper: UserProfileHelper
      }
    }
  ]
]
```

## 重定向和别名

**重定向 vs 别名**：
- 重定向指用户访问/home时，url会被替换成/，然后匹配路径对象`path: '/'`，举例`{ path: '/home', component: Home, redirect: '/' }`
- 别名指用户访问/home时，url还是/home，但会匹配路径对象`path: '/'`，举例`{ path: '/', component: Root, alias: ['/home'] }`

**重定向**：
- 在routes下和path属性同级的地方通过配置redirect属性生效
- redirect属性的值可以是：字符串（带/）、字符串（不带斜杠，表明是一个相对路由）、路径对象、参数为目标路由to且返回值为路径对象的函数
- 在含有重定向属性的路由中，添加导航守卫（比如beforeEnter）是无效的，因为导航守卫仅应用在目标路由上
- 在函数重定向属性的路径对象中，可省略component属性，毕竟该路由从不会被访问，而是被重定向，除非该路由是一个含有children的父路由（因为子路由必然会访问到父路由内的内容）
- 若redirect的值是一个不带`/`的字符串或含path属性（不带`/`)的对象，则会重定向到以当前path为参照的相对位置上，比如当前位置是`/users/:id/posts`，redirect的值是`profile`或`{path: 'profile'}`，则会重定向到`/users/:id/profile`的位置上

**别名**：
- 在routes下和path属性同级的地方通过配置alias属性生效
- 路由配置别名之后，匹配别名的路由的url将不会变化，而匹配的路由组件将是component中定义的
- alias的值可以是：字符串（带/，路径path）、字符串（不带/，表相对路由）、字符串数组（提供多个别名）。别名中可以带路径参数（如果有的话）

```javascript
// 路由别名
const routes = [
  {
    path: '/users/:id',
    component: UserIdLayout,
    children: [
      // 当url是：/23, /users/23, /users/23/profile，将会展示UserProfile组件的内容
      { path: 'profile', component: UserProfile, alias: ['/:id', ''] }
    ]
  }
]
```

## 路由组件传参

场景解释：
- 用于路由和组件解耦，即不通过$route.params获取路由的参数，而是直接通过props获取

用法：
- 当路径对象中包含路由参数（以`:`开头的）时，在path属性的同级设置属性props为true之后，在组件中获取到的路由参数(`route.params`的属性)会当作组件的props传入组件，此时只需要在组件中定义好对应的props即可。之后可以直接通过对应的prop获取到相关路由参数的值
- 若路径对象有命名视图时（即包含components属性），需要在props属性中为每个命名视图（key）定义路由参数是否作为props传入组件（value：boolean），即`props: { default: true, sidebar: true }`
- 当props属性是一个对象形式（非命名视图中）时，该props内的属性将直接当作props传入到组件中，此时属性值是静态的，因为写路径对象时就固定了
- 当props是一个参数为route对象的函数时，其返回值作为props传入到组件中，此时属性值由函数返回值决定


```javascript
const routes = [
  // 动态的props，此时组件xxx中props包含id
  {
    path: '/user/:id',
    components: XXX,
    props: true
  },
  // 动态的props，此时组件xx、sidebar中props包含id
  {
    path: '/user/:id',
    components: {
      default: XX,
      sidebar: sidebar
    },
    props: {
      default: true,
      sidebar: true
    }
  }
  // 静态props，此时组件xx中props包含user，且值为{ name: 'jade', age: 27 }
  {
    path: '/user',
    component: XX,
    props: {
      user: { name: 'jade', age: 27 }
    }
  }
  // 动静结合（函数模式）,若当前url为/user?name=jade，则组件xx中props包含alias，值为jade
  {
    path: '/user',
    component: XX,
    // 给路由参数name设置别名为alias，之后通过alias读取
    props: route => ({ alias: route.query.name })
  }
]
```

## 导航守卫

**参数设置**：
- to：要导航到的路由对象
- from：从哪里来的路由对象
- next：验证导航的回调函数

**next的参数和导航守卫的返回值**，可以是：
- undefined、void、true：验证导航
- false：取消导航
- 路径对象：重定向到一个不同的位置
- 函数：`vm => { xxx }`，仅能用在beforeRouteEnter守卫中，表示导航完成后执行的回调，接收路由组件实例vm作为参数


**全局前置守卫beforeEach**：

作用：用于权限控制

```typescript
const router = createRouter({ ... })
// 可选的next参数，如果选择了，则可不使用return的形式，而是直接调用next(...)，next的参数是return的返回值
router.beforeEach((to, from, next?) => {
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
router.afterEach((to, from, failure?) => {
  if (!failure) sendToAnalytics(to.fullPath)
})
```

**路由独享的守卫beforeEnter**：

定义：在路由配置对象route中，path同级位置定义beforeEnter字段，接受`(to, from)`两个参数，语法和beforeEach类似

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
- beforeRouteUpdate：当前路由改变（params、query、hash的改变），该组件被复用、更新时触发
- beforeRouteLeave：用于预防用户在未保存修改前突然离开；在组件离开时触发；

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

**完整的导航解析流程**
1.  导航被触发。
2.  在失活的组件里调用 `beforeRouteLeave` 守卫。
3.  调用全局的 `beforeEach` 守卫。
4.  在重用的组件里调用 `beforeRouteUpdate` 守卫(2.2+)。
5.  在路由配置里调用 `beforeEnter`。
6.  解析异步路由组件。
7.  在被激活的组件里调用 `beforeRouteEnter`。
8.  调用全局的 `beforeResolve` 守卫(2.5+)。
9.  导航被确认。
10.  调用全局的 `afterEach` 钩子。
11.  触发 DOM 更新。
12.  调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。


## 数据获取

场景：
- 进入某个路由后，根据某些信息从服务器中获取数据

**数据获取的两种方式**：
- 在导航完成之后获取，即在created生命周期钩子中通过watch监听$route.params进行
- 在导航完成之前获取，即在beforeRouteEnter和beforeRouteUpdate中获取

```javascript
// 在导航完成之前获取
export default {
  data () {},
  // 第一次进入
  beforeRouteEnter (to, from, next) {
    getData(to.params.id, (err, data) => {
      // 这里的vm代表路由组件实例，可以调用其方法，比如setData
      next(vm => {
        vm.setData(err, data)
      })
    })
  },
  // 路由参数改变
  async beforeRouteUpdate (to, from) {
    this.post = await getData(to.params.id)
  }
}
```

## 路由过渡动效

解释：
- 若想在路径组件上使用转场动效，并对导航进行动画处理，需要使用v-slot api
- 为所有的路由启用相同的过渡，直接在transition组件上设置一个name即可，比如`fade`
- 单独设置路由的过渡，使用动态的name即可，比如该动态name通过route.meta内的属性决定，而meta的内容，亦可以通过导航守卫afterEach通过to.meta.xxx进行重新设置
- 相同的视图，若想强制进行过渡，可以在component组件中设置其key属性为route.path(通过key的不同重新渲染，进而会有重新过渡动画)

::: code-group

```javascript [动态过渡]
// 添加v-slot api，获取Component，route等内容
<router-view v-slot="{ Component, route }">
  // 设置过渡动画类型
  <transition :name="route.meta.transition || 'fade'">
    // 复用相同视图，设置key进行强制重新渲染
    <component :is="Component" :key="route.path"/>
  </transition>
</router-view>

// 拦截meta的内容，进行动态设置过渡动画
router.afterEach((to, from) => {
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  to.meta.transition = toDepth > fromDepth ? 'slide-right' : 'slide-left'
})
```

:::

## 滚动行为

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

## 路由懒加载

前置描述：
- 打包构建应用时，JavaScript包变得很大，影响页面加载
- 把不同路由对应的组件分割成不同代码块，当路由被访问时才加载对应组件，这样更高效
- vue-router支持开箱即用的动态导入

::: code-group

```javascript [动态导入]
// component属性接收一个返回Promise的函数，所以可以使用更复杂的函数，只要他们返回promise
// 1. 
const User = () => import('./views/user.vue')
// 2. 
const User = () => Promise.resolve({
  // 组件定义
})

const routes = [{
  path: '/user', component: User
}]
```

```javascript [webpack的动态导入]
const User = () => import(/* webpackChunkName: 'group-user' */ './views/user.vue')
```

```javascript [vite的动态导入]
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'group-user': {
            './views/user.vue'
          }
        }
      }
    }
  }
})
```

:::

## 导航故障

**未导航到目标页面的原因**：
- 已经位于正在尝试导航到的页面
- 一个导航守卫通过调用`return false`中断了这次导航
- 当前导航守卫还没有完成时，一个新的导航守卫出现了
- 一个导航守卫通过返回一个新的位置，重定向到了其他地方
- 一个导航守卫抛出了一个Error

**导航故障检测**：
- `router.push`返回的promise的解析值是Navigation Failure、false值（导航成功时），可以通过这个进行区分是否离开当前位置

**鉴别导航故障**：
- 通过vue-router中的方法`NavigationFailureType`, `isNavigationFailure`进行鉴定，例子`isNavigationFailure(failure, NavigationFailureType.aborted)`
- 导航故障的类型NavigationFailureType有以下属性：
  - `aborted`: 在导航守卫中返回false中断了本地导航
  - `cancelled`：当前导航未完成前又有了一个新的导航，多次调用push
  - `duplicated`：已在目标导航上，导航被阻止
  - redirected

::: code-group

```javascript [导航故障检测1]
const result = await router.push('/user')
if (result) {
  // 导航被阻止
} else {
  // 导航成功（包括重新导航）
}
```

```javascript [导航故障检测2]
import { NavigationFailureType, isNavigationFailure } from 'vue-router'

const result = await router.push('/user')
// 若不带第二个参数，则情况和上述一致，否则会区分阻止类型
if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
  // 导航被阻止
}
```
:::

**导航故障的属性**：
- 所有导航失败，都会暴露to、from属性，以反映导航的当前位置和目标位置

```javascript
/**
 * NavigationFailure 类型详解
 * 
 * 属性：
 *    cause：Error.cause
 *    name：Error.name
 *    stack: Error.stack
 *    message: Error.message
 *    type: 导航类型（NavigationFailureType）
 *    from：上一个路由位置
 *    to：要导航的下一个路由位置
 * 
 * NavigationFailureType 枚举类型详解
 * 
 * 定义：导航失败的原因
 * 枚举成员：
 *    aborted = 4：中断导航，导航守卫返回了false或调用了next(false)
 * 
 *    cancelled = 8：取消导航，另一个导航已经开始
 * 
 *    duplicated = 16：重复导航，已处于当前导航路径
 * 
 * 
 */
import type { NavigationFailure } from 'vue-router'
router.push('/user').then(failure: NavigationFailure => {
  if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
    failure.to.path
    failure.from.path
  }
})
```

**检测是否重定向**：
- 通过读取路由地址的redirectedFrom属性

```javascript
await router.push('/user')
// redirectedFrom类似to和from
if (router.currentRoute.value.redirectedFrom) {}
```

## 动态路由

前置描述：
- 动态路由主要用于在程序已经运行的时候添加、删除路由

**动态路由的实现**：
- 增加路由：const removeRoute = router.addRoute()
  - 添加admin路由：`router.addRoute({path: '/about', name: 'admin', component: About})`
  - 在admin路由上添加子路由：`router.addRoute('admin', { path: 'user', component: User })`
- 删除路由的方式：
  - 上面的进行removeRoute()
  - router.removeRoute(name的值)

**使用场景**：
- 在导航守卫中添加、删除路由

**其他路由api**：
- `router.hasRoute()`：检查路由是否存在
- `router.getRoutes()`：获取一个包含所有路由记录的数组

## 组合式api

解释：
- 在模板template中，仍然可以通过$router,$route获取路由对象（提供push等操作的）和路径对象（访问params等）
- 在script中，通过`useRouter()`, `useRoute()`获取路由对象和路径对象
- route是一个响应式对象，其任何属性都可被监听，为避免监听整个route对象，应该进行确切监听，比如`watch(() => route.params.id, (id, oldId) => {})`
- [`useLink()`获取router-link v-slot api暴露的内容，可自定义一个类似router-link的组件](http://events.jianshu.io/p/652edf91b902)
  - [router-link的扩展](https://router.vuejs.org/zh/guide/advanced/extending-router-link.html)

### 自定义router-link

定义：
- 常规的RouterLink组件提供了满足大多数程序的需求，若想自定义一个内容不包裹在a标签内的RouterLink，需要使用custom attribu + v-slot（插槽）的形式来满足这部分内容。

用法：

::: code-group

```vue [定义一个自定义的router-link]
<!-- custom-link -->
<template>
<!-- v-bind="$props":这里其实最重要的就是将里面的to传过去，哈哈哈，使用:to="xxx"效果也是一样的 -->
<!-- 
  第一种用法获取useLink的返回值：使用v-slot，
  第二种是直接使用useLink，然后解构，在需要的地方使用即可
-->
  <RouterLink
    v-bind="$props"
    custom
    v-slot="{ route, href, isActive, isExactActive, navigate }"
  >
    <div class="card" @click="navigate">
      <div class="left">
        {{ card.name }}
      </div>
      <div class="body">
        <slot/>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { useLink, RouterLink } from 'vue-router'

defineProps({
  // @ts-ignore，使用ts，需要加上这个，注意，下面的RouterLink.props放这里无效
  /**
   * 更加有效的方法是：上面router-link绑定v-bind=$props时，这里是需要定义props的
   * 而 传统的router-link需要传的attribute有：
   *    to（必须）
   *    replace?、
   *    custom?（自定义router-link必填，Boolean）、
   *    activeClass?（指向其本身，指向其child时）、
   *    exactActiveClass（只有精确指向其本身，而非指向其child时）?、
   *    ariaCurrentValue?（只有精确指向其本身，而非指向其child时，会将属性值传给该组件的aria-current属性）
   * 
   * 故而，这里的RouterLink.props可以说等同于
   *    type RouterLinkProps = {
   *      to: RouteLocationRaw,
   *      // 上面的其他属性（可选的）
   *    }
   */
  ...RouterLink.props,
  // 等同于：RouterLinkProps类型
  // ...other props
})
</script>
```

```vue [使用自定义的router-link]
<template>
  <CustomLink
    to="#"
    ></CustomLink>
</template>

<script setup>
import { useLink } from 'vue-router'
import CustomLink from './CustomLink.vue'

const to = {
  hash: '#'
}

// 一般router-link的属性都会传过来的，所以使用useLink(props)解析就可以，然后再将这些值（除去RouterLinkProps类型的属性值外，其他的不能通过useLink解析出来，这时需要使用prop）放在需要使用的地方，比如useLink内部插槽自定义的地方
const defaultPropsValue = useLink(to)

// 在自定义插槽时，必须在点击的地方调用navigate函数，不然不会跳转，使用@click="navigate"即可
// 
const { route, href, isActive, isExactActive, navigate } = defaultPropsValue
</script>
```

```typescript [router-link组件类型追溯]
/**
 * Component to render a link that triggers a navigation on click.
 */
export declare const RouterLink: _RouterLinkI;

/**
 * router-link组件的类型
 * Typed version of the `RouterLink` component. Its generic defaults to the typed router, so it can be inferred
 * automatically for JSX.
 *
 * @internal
 */
export declare interface _RouterLinkI {
    new (): {
        $props: AllowedComponentProps & ComponentCustomProps & VNodeProps & RouterLinkProps;
        // 插槽类型
        $slots: {
          // route属性:fullPath hash href matched meta name params path query redirectedFrom
          // 注意：default插槽的参数返回值：是useLink的返回值（这两个是一样的）
            default?: ({ route, href, isActive, isExactActive, navigate, }: UnwrapRef<ReturnType<typeof useLink>>) => VNode[];
        };
    };
    /**
     * Access to `useLink()` without depending on using vue-router
     *
     * @internal
     */
    useLink: typeof useLink;
}

export declare interface RouterLinkProps extends RouterLinkOptions {
    /**
     * Whether RouterLink should not wrap its content in an `a` tag. Useful when
     * using `v-slot` to create a custom RouterLink
     */
    custom?: boolean;
    /**
     * Class to apply when the link is active
     */
    activeClass?: string;
    /**
     * Class to apply when the link is exact active
     */
    exactActiveClass?: string;
    /**
     * Value passed to the attribute `aria-current` when the link is exact active.
     *
     * @defaultValue `'page'`
     */
    ariaCurrentValue?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
}

declare interface RouterLinkOptions {
    /**
     * Route Location the link should navigate to when clicked on.
     */
    to: RouteLocationRaw;
    /**
     * Calls `router.replace` instead of `router.push`.
     */
    replace?: boolean;
}

/**
 * User-level route location
 */
export declare type RouteLocationRaw = string | RouteLocationPathRaw | RouteLocationNamedRaw;

/**
 * Route Location that can infer the possible paths.
 *
 * @internal
 */
export declare interface RouteLocationPathRaw extends RouteQueryAndHash, MatcherLocationAsPath, RouteLocationOptions {
}

/**
 * Route Location that can infer the necessary params based on the name.
 *
 * @internal
 */
export declare interface RouteLocationNamedRaw extends RouteQueryAndHash, LocationAsRelativeRaw, RouteLocationOptions {
}

/**
 * @internal
 */
export declare interface RouteQueryAndHash {
    query?: LocationQueryRaw;
    hash?: string;
}

/**
 * @internal
 */
export declare interface MatcherLocationAsPath {
    path: string;
}

/**
 * @internal
 */
export declare interface LocationAsRelativeRaw {
    name?: RouteRecordName;
    params?: RouteParamsRaw;
}

/**
 * Common options for all navigation methods.
 */
export declare interface RouteLocationOptions {
    /**
     * Replace the entry in the history instead of pushing a new entry
     */
    replace?: boolean;
    /**
     * Triggers the navigation even if the location is the same as the current one.
     * Note this will also add a new entry to the history unless `replace: true`
     * is passed.
     */
    force?: boolean;
    /**
     * State to save using the History API. This cannot contain any reactive
     * values and some primitives like Symbols are forbidden. More info at
     * https://developer.mozilla.org/en-US/docs/Web/API/History/state
     */
    state?: HistoryState;
}
```
```typescript [useLink函数类型追溯]
export declare function useLink(props: UseLinkOptions): {
    route: ComputedRef<RouteLocation & {
        href: string;
    }>;
    href: ComputedRef<string>;
    isActive: ComputedRef<boolean>;
    isExactActive: ComputedRef<boolean>;
    navigate: (e?: MouseEvent) => Promise<void | NavigationFailure>;
};

// 参数
export declare type UseLinkOptions = VueUseOptions<RouterLinkOptions>;

/**
 * Type to transform a static object into one that allows passing Refs as
 * values.
 * @internal
 */
declare type VueUseOptions<T> = {
    [k in keyof T]: Ref<T[k]> | T[k];
};

// 返回值

/**
 * {@link RouteLocationRaw} resolved using the matcher
 */
export declare interface RouteLocation extends _RouteLocationBase {
    /**
     * Array of {@link RouteRecord} containing components as they were
     * passed when adding records. It can also contain redirect records. This
     * can't be used directly
     */
    matched: RouteRecord[];
}

/**
 * Base properties for a normalized route location.
 *
 * @internal
 */
export declare interface _RouteLocationBase extends Pick<MatcherLocation, 'name' | 'path' | 'params' | 'meta'> {
    /**
     * The whole location including the `search` and `hash`. This string is
     * percentage encoded.
     */
    fullPath: string;
    /**
     * Object representation of the `search` property of the current location.
     */
    query: LocationQuery;
    /**
     * Hash of the current location. If present, starts with a `#`.
     */
    hash: string;
    /**
     * Contains the location we were initially trying to access before ending up
     * on the current location.
     */
    redirectedFrom: RouteLocation | undefined;
}

/**
 * Normalized/resolved Route location that returned by the matcher.
 */
declare interface MatcherLocation {
    /**
     * Name of the matched record
     */
    name: RouteRecordName | null | undefined;
    /**
     * Percentage encoded pathname section of the URL.
     */
    path: string;
    /**
     * Object of decoded params extracted from the `path`.
     */
    params: RouteParams;
    /**
     * Merged `meta` properties from all the matched route records.
     */
    meta: RouteMeta;
    /**
     * Array of {@link RouteRecord} containing components as they were
     * passed when adding records. It can also contain redirect records. This
     * can't be used directly
     */
    matched: RouteRecord[];
}

/**
 * {@inheritDoc RouteRecordNormalized}
 */
export declare type RouteRecord = RouteRecordNormalized;


/**
 * Normalized version of a {@link RouteRecord | route record}.
 */
export declare interface RouteRecordNormalized {
    /**
     * {@inheritDoc _RouteRecordBase.path}
     */
    path: _RouteRecordBase['path'];
    /**
     * {@inheritDoc _RouteRecordBase.redirect}
     */
    redirect: _RouteRecordBase['redirect'] | undefined;
    /**
     * {@inheritDoc _RouteRecordBase.name}
     */
    name: _RouteRecordBase['name'];
    /**
     * {@inheritDoc RouteRecordMultipleViews.components}
     */
    components: RouteRecordMultipleViews['components'] | null | undefined;
    /**
     * Nested route records.
     */
    children: RouteRecordRaw[];
    /**
     * {@inheritDoc _RouteRecordBase.meta}
     */
    meta: Exclude<_RouteRecordBase['meta'], void>;
    /**
     * {@inheritDoc RouteRecordMultipleViews.props}
     */
    props: Record<string, _RouteRecordProps>;
    /**
     * Registered beforeEnter guards
     */
    beforeEnter: _RouteRecordBase['beforeEnter'];
    /**
     * Registered leave guards
     *
     * @internal
     */
    leaveGuards: Set<NavigationGuard>;
    /**
     * Registered update guards
     *
     * @internal
     */
    updateGuards: Set<NavigationGuard>;
    /**
     * Registered beforeRouteEnter callbacks passed to `next` or returned in guards
     *
     * @internal
     */
    enterCallbacks: Record<string, NavigationGuardNextCallback[]>;
    /**
     * Mounted route component instances
     * Having the instances on the record mean beforeRouteUpdate and
     * beforeRouteLeave guards can only be invoked with the latest mounted app
     * instance if there are multiple application instances rendering the same
     * view, basically duplicating the content on the page, which shouldn't happen
     * in practice. It will work if multiple apps are rendering different named
     * views.
     */
    instances: Record<string, ComponentPublicInstance | undefined | null>;
    /**
     * Defines if this record is the alias of another one. This property is
     * `undefined` if the record is the original one.
     */
    aliasOf: RouteRecordNormalized | undefined;
}


```
:::
