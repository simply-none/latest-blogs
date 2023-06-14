# Pinia

## 回顾

pinia的特性：
- 所见即所得：和组件类似的Store
- 类型安全：自动推断类型，提供自动补全
- 开发工具支持：支持vue devtools钩子，能够追踪actions、mutations的时间线、在组件中展示它们所用到的Store、让调试更容易的time travel(vue3不支持)
- 可扩展：通过插件（比如事务、同步本地存储等方式）扩展pinia，以响应store的变更
- 模块化设计：可构建多个Store，允许打包工具自动拆分它们
- 极致轻量化：大小只有1kb左右
- 热更新：步重载页面即可修改Store、开发时可保持当前的Store
- 支持服务端渲染

pinia的目的：设计成一个拥有组合式API的vue状态管理库

**Store**：

定义：
- 它是一个保存状态和业务逻辑的实体，不与组件树绑定，承载全局状态。
- 像永远存在的组件，每个组件都可以读取、写入它
- 三个概念：state（data）、getter（computed）、action（methods）

使用场景：
- 存放包含可以在整个应用中/许多地方访问的数据，比如用户信息、通过页面保存的数据、多步骤表单等
- 避免在store中引入可以放在组件中保存的数据，比如某组件中元素的显隐

**pinia vs vuex（vuex3->vue2、vuex4->vue3）**：
- 相比于vuex
  - pinia提供了更简单的API、更符合组合式API风格的API，能够搭配ts提供类型推断支持
  - 弃用了冗余的mutation
  - 不需要创建自定义的复杂包装器来支持ts，现在一切都可标注类型，忽视类型使用any或添加`@ts-ignore`注释
  - 没有太多的魔法字符串注入，只要导入函数调用它们，就能享受自动补全
  - 不需动态添加store，默认就是动态的
  - 没有嵌套结构的模块，可以通过导入和使用另一个store来隐含地嵌套stores空间。能够在store之间交叉组合，甚至store间循环依赖
  - 没有可命名的模块，store的命名取决于定义的时候

## 准备工作

> 注意：若项目报错，先查看插件版本兼容性，以及插件是否需要其他插件

**安装pinia**：
- npm install pinia
- yarn add pinia
- vue2.7以下版本需要: @vue/composition-api

**创建pinia（根store）**：

<!-- tabs:start -->
<!-- tab:vue3 -->
```typescript
import { createPinia, setMapStoreSuffix } from 'pinia'
import { createApp } from 'vue'

// 默认情况下，pinia会在每个store的id后面加上Store的后缀，可以自定义后缀
// 先完全删除后缀
setMapStoreSuffix('')
// 再设置后缀
setMapStoreSuffix('_store')
// 之后在引入mapStores的时候，就可以通过this.id_store来访问每一个store了

const app = createApp()
app.use(createPinia()).mount('#app')

// 设置修改后缀时，还需要添加类型，可以放在全局的global.d.ts文件中，也可以放在当前位置
import 'pinia' // 在全局.d.ts文件中需要导入
declare module 'pinia' {
  export interface MapStoresCustomization {
    suffix: '_store'
  }
}

```

<!-- tab:vue2 -->
```typescript
import { createPinia, PiniaVuePlugin } from 'pinia'
import Vue from 'vue'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
  el: '#app',
  pinia
})
```

<!-- tabs:end -->

## 基础用法实例

<!-- tabs:start -->
<!-- tab:对象形式创建pinia -->
```typescript
// 对象形式创建pinia
// /src/stores/counter.js
import { defineStore } from 'pinia'
// 导入其他组件
import { useCounterStore2 } from './useCounterStore2'

/**
 * defineStore
 * 
 * 第一个参数name：表示store id，保持唯一性，必须传入；
 *    pinia用它来连接store和devtools
 *    建议name的值和defineStore的返回值useNameStore直接使用相同的名字
 * 
 * 第二个参数：setup函数（组合式语法，需要返回一个对象），或options对象（选项式语法）
 *    在ssr中使用时，setup函数会让其变得更复杂
 */
interface State {
  userList: UserInfo[]
  user: UserInfo | null
}

interface UserInfo {
  name: string
  age: number
}

export const useCounterStore = defineStore('counter', {
  state: () => {
    return {
      count: 0,
      // pinia会自动推断state的类型，有些情况需要使用as
      // 将userList断言成UserInfo[]类型
      userList: [] as UserInfo[],
      // 对于尚未加载的数据
      user: null as UserInfo | null
    }
  },
  // 单独定义一个接口State
  state: (): State => {
    return {
      userList: [],
      user: null
    }
  },
  // 在vue2中使用时，规则和vue的data一样，新增不存在的属性，需要使用Vue.set()
  // state简化
  state: () => ({
    count: 0,
    todos: [],
    nextId: 0
  }),
  getters: {
    // getter接收一个参数state，鼓励使用箭头函数，自动推断类型
    double: (state) => state.count * 2,
    // 自动推导类型
    finishedTodos (state) {
      return state.todos.filter(todo => todo.isFinished)
    },
    // 定义一个常规函数时，可以通过this访问整个store实例，ts中还需要（在使用this的普通函数的getter）定义返回类型，避免ts的已知缺陷，手动设置类型（在js中需要使用JSdoc）
    doublePlus (): number {
      return this.count * 2 + 9
    },
    // 返回一个函数，让其可以接收参数
    // 使用的时候类似函数调用语法doublePlusSet.value(2)，而若返回值，直接doublePlusSet就行
    // 这种形式，getter将不再被缓存，不过可以在return语句之前缓存一些内容，性能更好一些
    doublePlusSet () {
      // 缓存内容
      // xxx
      return plus => this.count * plus
    },
    // 可以访问本Store中其他的getters
    doublePlusCopy () {
      return this.doublePlus
    },
    // 访问其他Store中的getters
    getOthersGetter (state) {
      // 先获取整个store对象
      const useCounterStore2F = useCounterStore2()
      return this.count + useCounterStore2F.count
    }
  },
  /**
   * actions相当于method（可以和方法一样被调用），是定义业务逻辑的完美选择
   * 可通过this访问整个store实例，支持完整的类型标注和自动补全
   * actions可以是异步的，可以在里面await调用任何api和其他的action
   */
  actions: {
    // 接收任何数量的参数，返回一个promise或不返回
    increment () {
      this.count++
    },
    addTodo (text) {
      this.todos.push({
        text,
        id: this.nextId++,
        isFinished: false
      })
    },
    // 可以访问其他组件的actions
    async getOtherActions (data) {
      // 先获取整个store对象
      const useCounterStore2F = useCounterStore2()
      if (useCounterStore2F.isAuth) {
        this.todos = await axios('url')
      } else {
        throw new Error('auth is not')
      }
    }
  },
  // 其他的选项options，比如自定义一个debounce
  debounce: {
    search: 300
  }
})

```
<!-- tab:函数形式创建pinia -->
```typescript
// 函数形式（类似组件的setup）创建pinia
// stores/counter.js
import { defineStore } from 'pinia'

// 保持第一个参数的唯一性
export const useCounterStore = defineStore('counter', () => {
  // 类似state
  const count = ref(0)
  // 类似actions
  function increment () {
    count.value++
  }
  
  return {
    count,
    increment
  }
}, {
  // options自定义选项
  debounce: {
    search: 300
  }
})

```
<!-- tab:组合式API使用pinia -->
```typescript
<template>
  <p>count is: {{ useCounterStoreF.count }}</p>
  <p>double is: {{ useCounterStoreF.double }}</p>
  <p>count 10倍数：{{ doublePlusSet(10) }}
</template>

<script>
// setup（composition-api）方式使用
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

export default {
  setup () {
    // 作用：创建store实例。在调用这句之前，store是不会创建的
    // 可以（在不同文件中）定义任意多的store，然后使用类似的下面语法调用它
    const useCounterStoreF = useCounterStore()

    // 注意：对于响应式状态（state、getter），不能直接对useCounterStoreF进行解构，因为他是一个用reactive包装的对象，否则会失去响应性
    // 这是错误的：const { count } = useCounterStoreF
    
    // 若想保持响应性，需使用 storeToRefs()函数，该函数会跳过所有的action和非响应式（非ref、rective等）的属性
    const { count, double } = storeToRefs(useCounterStoreF)

    // 对于action，直接解构
    const { increment } = useCounterStoreF

    // 修改state，直接操作，不解构的情况
    function countPlus () {
      useCounterStoreF.count++
    }

    // 修改state，使用$patch，参数为对象形式，一次更新多个属性
    // 对象形式语法允许将多个变更归入devtools的同一个条目中（和下面函数的区别），可以进行time travel（vue2）
    // 这种语法，对于有些变更（数组的添加、移除、splice都需要创建一个新的集合）很难实现或很耗时
    function countPlus2 () {
      useCounterStoreF.$patch({
        count: useCounterStoreF.count + 1,
        nextId: 23
      })
    }

    // 修改state，使用$patch，参数为函数形式，一次更新多个属性
    // 推荐
    function countPlus3 () {
      useCounterStoreF.$patch(state => {
        state.count ++
        state.nextId = 23
        state.todos.push({
          // xxx
        })
      })
    }

    // 重置state，将其置为初始值状态：$reset
    function resetState () {
      useCounterStoreF.$reset()
    }

    // 替换整个state：$state
    function replaceState () {
      // 这会用下面整个对象替换之前定义时的state，这时会破坏响应性
      useCounterStoreF.$state = {
        name: 'jade',
        age: 27
      }
      // 推荐
      useCounterStoreF.$patch = {
        name: 'jade',
        age: 27
      }
    }

    import { MutationType } from 'pinia'
    // 侦听state的状态变更：$subscribe（类似vuex的subscribe方法）
    // 和普通的watch()的区别在于，$subscribe在（函数参数的）patch之后只触发一次监听
    function subscribeState () {
      useCounterStoreF.$subscribe((mutation, state) => {
        // 值：'direct' | 'patch object' | 'patch  function'
        console.log(mutation.type)
        // mutation.storeId === useCounterStoreF.$id -> true
        console.log(mutation.storeId)
        // 传递给useCounterStoreF.$patch()的补丁对象，只有mutation.type === 'patch object'时可用
        console.log(mutation.payload)

        // 在状态变化时，将整个state存到本地storage
        localStorage.setItem('xxx', JSON.stringify(state))
      }, {
        // 默认情况下，state subscription会被绑定到当前组件中。当组件卸载后，这些监听会被删除
        // 若想保留，则需设置detached属性，将subscription从当前组件分离
        detached: true
      })
    }

    // 对于state的监听，还可以使用watch
    // 监听整个state
    watch(useCounterStoreF.$state, (newVal, oldVal) => {
      // 操作
    },
    {
      deep: true
    })

    // 监听一个state
    watch(() => useCounterStoreF.count, (newVal, oldVal) => {
      // 操作
    })

    // 使用action
    function increment () {
      useCounterStoreF.increment()
    }

    /**
     * store.$onAction：监听actions及其结果，回调函数会在action本身之前执行
     * 
     * 执行unsubscribe()可以手动删除监听器
     */
    const unsubscribe = useCounterStoreF.$onAction((
      // action的名称
      name,
      // store实例
      store,
      // 传给action的参数
      args,
      // 允许在action成功并完全运行后执行的回调函数，等待这任何返回的promise
      after,
      // action抛出错误或reject的时候执行（追踪运行时错误）
      onError
    ) => {
      // 下面这2行会在action执行之前运行
      const startTime = Date.now()
      console.log((startTime, args))

      // 执行成功或resolve的时候执行
      after(result => {
        console.log('success')
      })

      // 失败的时候执行
      onError(err => {
        console.log(err)
      })
    },
    // 默认情况下，组件卸载后，这些监听会被删除，若想保留，则需
    true
    )

    return {
      // 之后就能够在template、methods、computed等地方使用:
      // state: useCounterStoreF.count
      // getter: useCounterStoreF.double
      // action: useCounterStoreF.increment()
      useCounterStoreF,

      // 可以一次导出需要使用的state
      myCount: useCounterStoreF.count,

      // 使用参数的getters
      doublePlusSet: useCounterStoreF.doublePlusSet,

      // action订阅，执行使用unsubscribe()
      unsubscribe
    }
  },
  computed: {
    // 从setup导出的store可在组件其他位置使用，因为setup选项早于其他选项
    tripleCounter () {
      return this.useCounterStoreF.count * 1000
    }
  }
}
</script>
```
<!-- tab:选项式API使用pinia -->
```typescript
// 选项式API方式使用

// 若向访问store的大部分内容，又不想映射store的每个属性，可以使用mapStores
// 通过mapState会映射为只读属性，对于数组的更新方法（push等），还是能修改的，因为是一个引用
// 通过mapWritableState映射为可读写属性，其参数和mapState类似
// mapState可以映射state和getter，写法一致
import { mapStores, mapState, mapWritableState, mapActions } from 'pinia'

import { useCounterStore } from '@/stores/counter'
import { useCounterStore2 } from '@/stores/counter2'

export default {
  computed: {
    // 传递一个接一个的store，通过id（第一个参数）+Store的形式访问store
    // 在其他地方，需要通过this.counterStore.xxxstate访问
    ...mapStores(useCounterStore, useCounterStore2),
    // 通过this.useCounterStore.count和this.useCounterStore2.count形式访问
    ...mapState(useCounterStore, useCounterStore2),
    // 通过this.count访问useCounterStore.count
    ...mapState(useCounterStore, ['count', 'double']),
    // 自定义配置
    ...mapState(useCounterStore, {
      // 可以通过this.myCount访问useCounterStore.count
      myCount: 'count',
      // 对useCounterStore中进行求值，注意mapWritableState不能使用这个（即传递一个函数），同时可以使用this
      // mapWritableState和mapState的区别就在这，其他写法都一样
      myDouble: store => store.count * 2  + this.count
    })
    
  },
  methods: {
    // 通过this.increment()访问useCounterStore上的action `increment`
    ...mapActions(useCounterStore, ['increment'])
  }
}
```
<!-- tabs:end -->


## 插件

pinia支持扩展的内容，不限于下面这些：
- 给store添加新属性、新方法
- 定义store时增加新选项
- 包装现有的方法
- 改变或取消action
- 实现副作用，比如本地存储
- 仅在特定store中应用插件

语法：通过`pinia.use()`添加到pinia实例上

说明：
- 

场景：
- 添加全局对象，比如路由器、modal、toast管理器

举例：返回一个对象将一个静态属性添加到所有store

<!-- tabs:start -->

<!-- tab:vue3中使用 -->

```typescript
// main.ts
import { createPinia } from 'pinia'
import type { PiniaPluginContext } from 'pinia'

/**
 * pinia插件是一个函数，可以选择性 【返回要添加到store的属性】，
 * 
 * 接收一个可选参数context
 *    context的属性：
 *      pinia：用createPinia创建的pinia实例
 *      app：用createApp创建的当前应用实例（vue3）
 *      store：该插件想扩展的store
 *      options：定义传给defineStore()的store的(和state、getters、actions同级的）可选对象
 * 
 * 创建每个store时都会添加一个叫secret的属性
 * 安装此插件后，插件可以保存在不同文件中
 * 
 * 注意：
 *    插件上的state变更、添加（包括调用$patch）都是发生在store激活之前（useXXX()），这不会触发任何订阅函数
 */
function SecretPiniaPlugin (context: PiniaPluginContext) {
  return {
    secret: 'hhhh'
  }
}

// 直接在store上设置该属性，如果可以，请使用返回对象的方法（上面的例子（能够被devtools追踪），或者添加一些增强代码
function SecretPiniaPlugin ({ store, options }) {
  /* 第一种： */
  // 每个store都被reactive包装过，所以可以自动解包任何它包含的refs（ref、computed等），不需要使用.value
  store.hello = ref('hello')
  // 增强代码，确保能被devtools追踪
  if (process.env.NODE_ENV === 'development') {
    store._customProperties.add('hello')
  }

  /* 第二种： */
  // 确保没重写store中的secret
  if (!Object.prototype.hasOwnProperty(store.$state, 'secret')) {
    const secret = ref('hhh')
    // 在$state上设置该属性，可以在devtools中使用它，在ssr时被正确序列化
    store.$state.secret = secret
  }
  // 将ref从state转移到store上
  // 这样store.hasError、store.$state.hasError都可以正确访问，并且都是访问的同一个变量
  // 这时，不要返回，不然会显示2次
  store.hasError = toRef(store.$state, 'secret')

  // 添加一个外部属性，比如router对象
  // 这时需要使用markRaw包装一下，再传给pinia store
  // import { markRaw } from 'vue'
  store.router = markRaw(router)

  // 在插件中调用$subscribe和$onAction
  store.$subscribe(() => {
    // xxx
  })
  store.$onAction(() => {
    // xxx
  })

  // 添加一个防抖选项，实现防抖效果
  // import debounce from 'loadsh/debounce'
  // 假设已经定义了options: debounce: { search: 300 }
  if (options.debounce) {
    return Object.keys(options.debounce).reduce((debouncedActions, action) => {
      debouncedActions[action] = debounce(
        store[action],
        options.debounce[action]
      )
      // 给每个action都加上防抖
      return debouncedActions
    }, {})
  }


}

const pinia = createPinia()

// 使用插件，将插件交给pinia
// 插件只会应用于 在pinia传递给应用后app.use(pinia)创建的store
pinia.use(SecretPiniaPlugin)

// 假设定义了一个useSecretStore的store文件
import { useSecretStore } from './xxx.ts'

const useSecretStoreF = useSecretStore()

// 这样是可以输出 hhh 的
console.log(useSecretStoreF.secret)
```

<!-- tab:vue2中使用 -->
```typescript
// main.ts
import { set, toRef } from '@vue/composition-api'
import { createPinia } from 'pinia'
import Vue from 'vue'

const pinia = createPinia()

pinia.use(({ store }) => {
  // vue < 2.7使用@vue/composition-api
  // vue = 2.7使用Vue.set()
  const secretRef = ref('secret')
  set(store.$state, 'secret', secretRef)
  set(store, 'secret', secretRef)
})

new Vue({
  el: '#app',
  pinia
})
```

<!-- tab:添加类型 -->
```typescript
// 为新的store属性添加类型，需要扩展PiniaCustomProperties接口
import 'pinia'
import type { Ref } from 'vue'
import type { Router } from 'vue-router'

declare module 'pinia' {
  // Id, S：State, G：Getters, A：Actions，SS：Setup Store/Store
  // 在泛型中扩展类型时，他们的名字必须和源代码中完全一样，Id不能命名为id或I，S不能命名为State
  export interface PiniaCustomProperties <Id, S, G, A> {
    /* ⛳标注store属性的类型 */

    // 使用一个setter，可以允许字符串和引用
    set hello (value: string | Ref<string>)
    get hello: string

    // 也可以直接定义
    hello: string

    // 添加路由
    router: Router

    /* ⛳标注options的类型 */
    $options: {
      id: Id
      state?: () => S
      getters?: G
      actions?: A
    }
  }

  /* ⛳标注state的类型:包括store、store.$state，与PiniaCustomProperties不同的是，只接受State泛型S */
  export interface PiniaCustomStateProperties<S> {
    hello: string
  }

  /* ⛳标注options内部的类型: 只暴露了State和Store */
  export interface DefineStoreOptionsBase<S, Store> {
    debounce?: Partial<Record<keyof StoreActions<Store>, number>>
  }
}
```
<!-- tabs:end -->

## 在组件外使用store

说明：
- pinia store依靠pinia实例在所有调用中共享同一个store实例
- 使用store时，直接调用相关的useXxxStore()即可，若在组件之外（比如ts中）调用useXxxStore()函数，必须在app.use(pinia)之后才能调用成功，因为先挂载pinia之后才能使用pinia

<!-- tabs:start -->

<!-- tab:单页面应用 -->
```typescript
// main.ts
import { useUserStore } from './store/user'
import { createApp } from 'vue'
import App from './App.vue'

// 此处调用失败，因为是在use pinia之前
const userStore = useUserStore()

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// 此处调用成功，因为在use之后
const userStore = useUserStore()

// router.ts
import { createRouter } form 'vue-router'

const router = createRouter({
  // xxx
})

// 失败，因为不知道router对象是在use pinia之前还是之后引入的
const store = useStore()

router.beforeEach((to) => {
  // 成功，因为路由器是在安装之后才开始导航，此时pinia已经被挂载
  const store = useUserStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) {
    return '/login'
  }
})
```

<!-- tab:服务端渲染 -->
```typescript
/**
 * 必须把pinia实例传递给useStore()，这样可以防止pinia在不同的应用实例之间共享全局状态
 */
```

<!-- tabs:end -->

## 其他

### 热更新

目前，构建工具中只有vite被支持，不过任何实现import.meta.hot规范的构建工具都应该能正常工作。

webpack可能使用的是import.meta.webpackHot而非import.meta.hot

例子：

```typescript
// store/auth.ts
import { defineStore, acceptHMRUpdate } from 'pinia'

const useAuth = defineStore('auth', {
  // 配置
})

// 确保传递正确的store声明，比如上面的useAuth
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
```

### 组合式store

组合式store是可以互相调用的，但遵循：
- 如果两个或更多的store相互调用，不可以通过getters或actions创建一个无限循环
- 如果两个或更多的store相互调用，不可以同时在他们的setup函数中直接互相读取对方的state

```typescript
const useX = defineStore('x', () => {
  // 此处是sutup函数内部

  // 在setup函数中调用y，同时y的setup函数中调用x，这是不允许的
  y.name

  function doSomething () {
    // 这是可以的,函数作用域
    const yname = y.name
  }

  return {
    name: ref('x')
  }
})

const useY = defineStore('y', () => {
  // 此处是sutup函数内部

  // 在setup函数中调用x，同时x的setup函数中调用y，这是不允许的
  x.name

  function doSomething () {
    // 这是可以的,函数作用域
    const xname = x.name
  }

  return {
    name: ref('y')
  }
})
```

嵌套的store，如果一个store使用了另一个store，可以直接导入，并在actions和getters中调用useXXX函数

<!-- tabs:start -->

<!-- tab:函数参数用法 -->

```typescript
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', () => {
  // 在store函数顶部引入store
  const user = useUserStore()

  const list = ref([])

  // 直接使用store函数顶部的store
  const summary = computed(() => {
    return user.name
  })

  function purchase () {
    return apiPureChase(user.id, this.list)
  }

  return {
    summary,
    purchase
  }
})
```

<!-- tab:对象参数用法 -->
```typescript
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const userCartStore = defineStore('cart', {
  getters: {
    summary (state) {
      const user = useUserStore()
      return user.name
    }
  },
  actions: {
    async orderCart () {
      const user = useUserStore()
      try {
        await apiOrderCart(user.token, this.items)
      } catch (err) {
        displayError(err)
      }
    }
  }
})
```

<!-- tabs:end -->

### 处理组合式函数

在option stores（即参数是对象形式）的store中，可以在state属性上调用组合式函数，但只能调用返回可写的状态（比如ref）的组合式函数

在setup stores（即函数形式的参数）的store中，可以是在任意位置使用任何组合式函数

```typescript
export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 调用useLocalStorage
    user: useLocalStorage('pinia/auth/login', 'bob')
  })
})
```