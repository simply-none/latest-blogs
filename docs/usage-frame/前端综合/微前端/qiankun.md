# qiankun

## 基础概念

定义：
- qiankun是基于single-spa的微前端实现库

微前端定义：
- 是一种*多个团队*通过*独立发布功能*的方式来*共同构建*现代化web应用的技术手段和方法策略

**微前端架构核心价值**：
- 与技术栈无关，不限制应用的技术栈，微应用具有完全自主权
- 各个应用独立开发，独立部署，部署完成后主应用同步更新
- 增量升级，即渐进式重构开发
- 每个微应用之间状态隔离，运行时状态不共享

**qiankun核心设计理念**：
- 简单，只需要调用几个qiankun api即可完成应用的微前端改造；同时由于qiankun的html entry及沙箱的设计，微应用接入就和iframe一样简单
- 解耦（与技术栈无关），其目标是将巨大的应用拆解成若干自治松耦合微应用，确保具备真正的独立开发和运行的能力

**qiankun特性**：
- 基于single-spa
- 技术栈无关
- html entry接入方式，让微应用接入和iframe使用这么简单
- 样式隔离，确保微应用之间样式互不干扰
- js沙箱，确保微应用之间全局变量和事件不冲突
- 资源预加载，在浏览器空闲时间预加载未打开的微应用资源，加速微应用打开速度
- umi插件，提供umi应用一键切换成微前端应用

## 上手实践

**生命周期钩子触发顺序**：
- 主应用`beforeLoad` -> 微应用`bootstrap` -> 主应用`beforeMount` -> 微应用`mount` 

**示例**：
::: code-group
```bash [主应用]
# 安装qiankun
npm install qiankun -S
# yarn add qiankun
```
```javascript
// main.js
import {
  registerMicroApps,
  setDefaultMountApp,
  start
} from 'qiankun'

// 针对hash模式，匹配不到子应用路由调用：
const getActiveRule = hash => location => location.pathname.startsWith(hash)
// app默认为null
let app = null

const render = ({ appContent, loading }) => {
  // 首次调用，挂载节点
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  } else {
    // 内容替换？？？😥😥😥
    store.commit('microApp/changeCenter', appContent)
    store.commit('microApp/changeLoading', loading)
  }
}
// 主应用初始化
render({})

// 定义微应用节点
let apps = [
  {
    name: 'child1',
    entry: '//localhost:215',
    // 当微应用注册完之后，若浏览器url发生变化，会自动触发qiankun的匹配逻辑
    // 所有的activeRule规则匹配上的微应用就会被插入到指定的container中
    // 同时依次调用微应用暴露出的生命周期钩子
    container: '#subView',
    // 此处的 /child 必须和微应用中 new VueRouter中的base 一一对应，不然会白屏且无任何报错
    // 此处activeRule可以使用上面的函数getActiveRule（location.pathname）区分微应用
    // activeRule: getActiveRule('/child1')
    // 当微应用是history模式时，直接设置路由的base就行
    // 当微应用是hash模式时，必须使用getActiveRule函数，由于vue-router在hash模式下不支持设置路由base，此时需新建一个路由，将所有路由放在该路由的children下
    activeRule: '/child1',
    props: {
      name: 'child',
      msg: '这是主应用'
    }
  }
]

// 子应用注册
// 当子应用信息注册完之后，一旦浏览器的url发生变化，便会自动触发qiankun的匹配逻辑
// 所有的activeRule规则匹配上的微应用就会被插入到指定的container中，同时依次调用微应用暴露出来的生命周期钩子
registerMicroApps(apps, {
  beforeLoad: [
    app => {
      console.log('这是主应用 beforeLoad: ', app.name)
    }
  ],
  beforeMount: [
    app => {
      console.log('这是主应用 beforeMount: ', app.name)
    } 
  ],
  afterUnmount: [
    app => {
      console.log('这是主应用 afterUnmount: ', app.name)
    } 
  ]
})

// 设置默认挂载的子应用节点
setDefaultMountApp('/child/path1')
// 启动qiankun
start({
  sandbox: {
    strictStyleIsolation: true
  }
})
```
```bash [基于webpack的微应用配置]
# 新增public-path.js文件，用于修改运行时的publicPath，注意运行时和构建时的publicPath是不同的
# 微应用建议使用history模式路由，设置路由base，值和它的activeRule一致
# 在入口最顶部引入public-path.js，修改并导出必填的三个生命周期函数
# 修改webpack打包配置，运行开发环境跨域和umd打包
```
```javascript [ public-path.js]
// src/public-path.js
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}
```
```javascript [微应用入口配置main.js]
// 微应用中不需要额外安装关于qiankun的依赖
// main.js
import './public-path.js'
import VueRouter from 'vue-router'
// routes仅仅是路由数组，路由初始化在这里进行
import routes from './router'

let router = null
let instance = null

const render = (props = {}) => {
  const { container } = props
  router = new VueRouter({
    // 此处的 /child 必须和主应用中 registerMicroApps的 activeRule 一一对应，不然会白屏且无任何报错
    base: window.__POWERED_BY_QIANKUN__ ? '/child' : '/',
    mode: 'history',
    routes
  })

  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app')
}

if (!window.__POWERED_BY_QIANKUN__) {
  // 子应用初始化
  render()
}

/* 导出生命周期钩子：start */
// 微应用需要在入口js（webpack配置的entry）中必须要导出bootstrap、mount、unmount三个钩子，以供主应用在适当时机调用
export async function bootstrap () {
  console.log('微应用 bootstrap')
}

export async function mount (props) {
  console.log('微应用挂载，并获取主应用信息：', props)
  render(props)
}

export async function unmount () {
  instance.$destroy()
  instance = null
  router = null
}

/* 导出生命周期钩子：end */
```
```javascript [微应用的webpack配置]
// vue.config.js
const packageName = require('./package.json').name

module.exports = {
  devServer: {
    // 跨域
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    configureWebpack: {
      output: {
        // 异同点，微应用的包名与主应用中注册的微应用名称一致
        // library: 'same-in-main-app-register-name',
        library: `${packageName}-[name]`,
        // 将library暴露为所有的模块定义下都可运行的方式
        libraryTarget: 'umd',
        // 按需加载相关
        jsonpFunction: `webpackJsonp_${packageName}`
      }
    }
  }
}
```
:::



## API

### 基于路由配置

> 适用于`route-based`的场景，通过将微应用关联到一些URL规则的方式，实现当浏览器url发生变化的时候自动加载相应的微应用功能

#### registerMicroApps

- 用法
  - 注册微应用的基础配置信息，当浏览器url发生变化时，会自动检查每一个微应用注册的activeRule规则，符合规则的应用将会被自动激活
- 参数分别为：`(apps: Array<RegisterableApp>, lifeCycles?: LifeCycles)`
- 参数信息：
  - apps：必选，表示微应用的注册信息
  - lifeCycles：可选，表示全局的微应用生命周期钩子
- 类型：
  - RegisterableApp：一个对象形式，对象属性有
    - name：
      - 类型为string
      - 必选
      - 表示微应用的名称，微应用之间必须保证其唯一性
    - entry：
      - 类型为`string | { scripts?: stirng[]; styles?: string[]; html?: string; }`
      - 必选
      - 表示微应用的入口
      - 当值为字符串时，表示微应用的访问地址
      - 当值为对象时，html的值是微应用的html内容字符串，而不是微应用的访问地址，且微应用的publicPath将会被设置为`/`
    - container：
      - 类型为`string | HTMLElement`
      - 必选
      - 表示微应用的容器节点的选择器或者Element实例
      - `container: #root`, `container: document.querySelector('#root')`
    - activeRule：
      - 类型为`string | (location: Location) => boolean | Array<string | (location: Location) => boolean>`
      - 必选
      - 表示微应用的激活规则
      - 当配置为字符串时例如`activeRule: '/app1'`，**会直接跟url中的路径部分做前缀匹配**，任意一个值匹配成功表明当前应用会被激活
        - `'/app1'`，将会匹配`xxx/app1`, `xxx/app1/xxx`等，其中xxx表示entry配置的数据
        - `'/user/:userId/profile'`，将会匹配`xxx/user/123/profile`, `xxx/user/123/profile/xxx`等等
        - `'/pathname/#/hash'`，将会匹配`xxx/pathname/#/hash'`, `xxx/pathname/#/hash/xxx`
        - `['/app1', '/pathname/#/hash']`，将会匹配两者的并集
      - 也可以配置成一个函数或一组函数，传入当前的location作为参数，返回true表示当前微应用会被激活，例如`location => location.pathname.startsWith('/app1')`
    - loader：
      - 类型为`(loading: boolean) => void`
      - 可选
      - loading状态发生变化时调用的方法
    - props：
      - 类型为`object`
      - 可选
      - 主应用需要传递给微应用的数据
  - LifeCycles
    - 生命周期钩子类型表示：`type LifeCycle = (app: RegisterableApp) => Promise<any>`
    - 形式为对象形式，生命周期钩子属性有：
      - beforeLoad
        - 类型为`LifeCycle | Array<LifeCycle>`
        - 例如`beforeLoad: app => console.log(app)`
      - beforeMount
      - afterMount
      - beforeUnmount
      - afterUnmount

```javascript
import { registerMicroApps } from 'qiankun'

registerMicroApps([
  {
    name: '/app1',
    entry: '//localhost:2131',
    container: '#app1',
    activeRule: '/app1',
    props: { data: sendMicroData }
  }
], {
  beforeLoad: app => {
    console.log('basic app in beforeload: ', app.name)
  },
  beforeMount: [
    app => {
      console.log('basic app in beforeMount: ', app.name)
    }
  ]
})
```

#### start(options?)

- 用法：启动qiankun
- 参数为`options: Options`，可选
- 类型：
  - Options: 对象形式，其属性有：
    - prefetch
      - 类型为`boolean | 'all' | string[] | (( apps: RegisterableApp[] ) => { criticalAppNames: string[]; minorAppsName: string[] } )`
      - 可选
      - 表示是否预加载，默认为true
      - 值为true时，会在第一个微应用mount完成后开始预加载其他微应用的静态资源
      - 值为all时，主应用start后即开始预加载所有微应用静态资源
      - 值为string[]，会在第一个微应用mounted后开始加载数组内的微应用资源
      - 值为function，可以自定义应用的加载时机（首屏应用等）
    - sandbox
      - 类型为`boolean | { strictStyleIsolation?: boolean, experimenalStyleIsolation?: boolan }`
      - 可选
      - 表示是否开启沙箱，默认为true
      - 默认情况下沙箱可以确保单实例场景子应用之间的样式隔离，但无法确保主应用与子应用、多实例场景子应用样式隔离
      - 当配置为`{ strictStyleIsolation: true }`时表示开启严格的样式隔离模式，该模式下会为每个微应用容器包裹一个shadow dom节点，确保微应用样式不会影响全局
      - 当配置为`{ experimenalStyleIsolation: true}`时会改写子应用所添加的样式，为所有样式规则添加一个特殊的选择器规则来限定其影响范围，样式开启hash模式类似
    - singular:
      - 类型`boolean | ((app: RegisterableApp<any>) => Promise<boolean>)`
      - 可选
      - 表示是否是单实例（指同一时间指挥渲染一个微应用）场景，默认为true
    - fetch:
      - 类型为`Function`
      - 可选
      - 表示自定义的fetch方法
    - getPublicPath：
      - 类型为`(entry: Entry) => string`
      - 可选
      - 参数entry是微应用的entry的值
    - getTemplate
      - 类型为`(tpl: string) => string`
      - 可选
    - excludeAssetFilter：
      - 类型为`(assetUrl: string) => boolan`
      - 可选
      - 表示指定部分特殊的动态加载的微应用资源不被qiankun劫持处理

```javascript
import { start } from 'qiankun'

start()
```

#### setDefaultMountApp(appLink)

- 用法：设置主应用启动后默认进入的微应用
- 参数为`applink: string`，必选

```javascript
import { srtDefaultMountApp } from 'qiankun'

setDefaultMountApp('/homeApp')
```

#### runAfterFirstMounted(effect)

- 用法：
  - 第一个微应用mount后需要调用的方法，比如开启监控或埋点
- 参数：`effect: () => void`，必选

```javascript
import { runAfterFirstMounted } from 'qiankun'

runAfterFirstMounted(() => startMonitor())
```

### 手动加载微应用

使用场景：
- 需要手动加载/卸载一个微应用的时候
- 通常（指通常不是一定）这种场景下微应用是一个不带路由的可独立运行的业务组件
- 微应用拆分标准，看这个微应用与其他微应用是否有频繁的通信需求，若无，则可以拆分

#### loadMicroApp(app, configuration?)

- 用法：
  - 手动加载一个微应用
  - 若要支持主应用手动update微应用，在微应用中需要导出一个update钩子
  - 若一个页面同时展示多个微应用，需使用手动加载的方式，且若微应用直接都有路由跳转的需求，想让路由之间相互不受干扰，应该使用`momery`路由，即vue-router应该使用`abstract`模式
- 参数：
  - app
    - 类型为`LoadableApp`，对象形式
    - 必选
    - 表示微应用的基础信息
    - 属性：和`registerMicroApps`方法中的第一个参数一致，只是少了activeRule属性
  - configuration
    - 类型为`Configuration`
    - 可选
    - 表示微应用的配置信息，是一个对象形式，其属性和`start`方法中的参数一致，只是少了一个prefetch属性
- 返回值
  - 类型为`MicroApp`
  - 表示一个微应用实例
  - 其属性有：
    - mount(): `Promise<null>`
    - unmount(): `Promise<null>`
    - update(customProps: object): `Promise<any>`
    - getStatus(): | "NOT_LOADED" | "LOADING_SOURCE_CODE" | "NOT_BOOTSTRAPPED" | "BOOTSTRAPPING" | "NOT_MOUNTED" | "MOUNTING" | "MOUNTED" | "UPDATING" | "UNMOUNTING" | "UNLOADING" | "SKIP_BECAUSE_BROKEN" | "LOAD_ERROR";
    - loadPromise: `Promise<null>`
    - bootstrapPromise: `Promise<null>`
    - mountPromise: `Promise<null>`
    - unmountPromise: `Promise<null>`

```javascript
// 微应用中：微应用的入口，一般是main.js
export async function update (props) {
  renderPatch(props)
}

export async function mount (props) {
  renderApp(props)
}

// 主应用中：加载微应用，其他文件中
import { loadMicroApp } from 'qiankun'

this.microApp = loadMicroApp({
  name: 'app1',
  entry: '//localhost:2131',
  container: '#root',
  props: { xxx }
})

// 更新状态数据
this.microApp.update({ xxx })
```

#### prefetchApps(apps, importEntryOpts?)

- 用法：
  - 手动预加载指定的微应用静态资源
  - 仅手动加载微应用场景需要这个，基于路由自动激活的场景直接配置prefetch属性即可
- 参数：
  - apps：
    - 类型为`AppMetadata[]`
    - 必选
    - 表示预加载的应用列表
  - importEntryOpts：
    - 可选
    - 表示加载的配置
- 类型：
  - AppMetadata：对象形式，属性有：
    - name 
      - 类型为string 
      - 必选
      - 表示应用名称
    - entry 
      - 类型为`string | { scripts?: string[]; styles?: string[]; html?: string }`
      - 必选
      - 表示微应用的entry地址

```javascript
import { prefetchApps } from 'qiankun'

prefetchApps([
  {
    name: 'app1',
    entry: '//localhost:2131'
  }
])
```

### 其他的api

#### addErrorHandler和removeErrorHandler

#### addGlobalUncaughtErrorHandler(handler)

- 用法：添加全局的未捕获的异常处理器
- 参数：`handler: (...args: any[]) => void)`，必选

```javascript
import { addGlobalUncaughtErrorHandler } from 'qiankun'

addGlobalUncaughtErrorHandler(event => console.log(event))
```

#### removeGlobalUncaughtErrorHandler(handler)

- 用法：移除全局的未捕获的异常处理器
- 参数：`handler: (...args: any[]) => void`，必选

```javascript
import { removeGlobalUncaughtErrorHandler } from 'qiankun'

removeGlobalUncaughtErrorHandler(event => console.log(event))
```

#### initGlobalState(state)

- 用法：
  - 定义全局状态，并返回通信方法
  - 建议在主应用使用，微应用通过props获取通信方法
- 返回值为MicroAppStateActions，其属性有：
  - onGlobalStateChange
    - 类型为`(callback: OnGlobalStateChangeCallback, fireImmediately?: boolean) => void`
    - 表示在当前应用监听全局状态，有变更就触发callback，当fireImmediately为true时，立即触发callback
  - setGlobalState：
    - 类型为`(state: Record<string, any>) => boolean`
    - 表示按一级属性设置全局状态，微应用中只能修改已存在的以及属性
  - offGlobalStateChange：
    - 类型为`() => boolean`
    - 表示移除当前应用的状态监听，微应用unmount时会默认调用

```javascript
// 主应用
import { initGlobalState, MicroAppStateActions } from 'qiankun'

// 初始化state
const actions = initGlobalState(state)

actions.onGlobalStateChange((state, prev) => {
  // state：变更后的状态，prev变更前的状态
  console.log(state, prev)
})
actions.setGlobalState(state)
action.offGlobalStateChange()

// 微应用 
// 从生命周期mount中获取通信方法
export function mount(props) {
  pros.onGlobalStateChange((state, prev) => {
    console.log(state, prev)
  })

  props.setGlobalState(state)
}
```

## 应用部署

### 场景1：主微应用部署到同一个服务器（同一个IP和端口）

### 场景2：主微应用部署在不同的服务器，使用nginx代理访问

解释：
- 该场景主要是不允许主应用跨域访问微应用，此时需要将主应用服务器上一个特殊路径的请求全部转发到微应用的服务器上，通过代理实现微应用部署在主应用服务器上的效果
- 例如主应用在A服务器，微应用在B服务器（/app1），A服务器上所有的`/app1`开头的请求都转发到B服务器上
- 主应用注册微应用时，entry可以是相对路径，但不能和activeRule一样，否则刷新之后主应用会变成微应用


::: code-group
```bash [主应用Nginx代理配置]
# 主应用Nginx代理配置：
/app/ {
  proxy_pass http://www.b.com/app1;
  proxy_set_header Host $host:$server_port;
}
```
```javascript [主应用注册微应用]
registerMicroApps([
  {
    name: 'app1',
    // 使用相对路径，会自动转向（nginx代理）
    entry: '/app1',
    container: '#container',
    activeRule: '/child-app1'
  }
])
```
```javascript [vue.config.js配置]
module.exports = {
  output: {
    // 此处必须和entry一致，否则微应用的资源路径(js, css)不会带上/app1/
    // 同时微应用必须部署在/app1/目录，否则无法独立访问
    publicPath: `/app1/`
  }
}
```
:::

