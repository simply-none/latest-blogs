# Pinia

## 准备工作

**安装pinia**：
- npm install pinia

**创建pinia（根store）**：

```typescript
import { createPinia } from 'pinia'
import { createApp } from 'vue'

const app = createApp()
app.use(createPinia()).mount('#app')
```

## 基础用法实例

<!-- tabs:start -->
<!-- tab:对象形式创建pinia -->
```typescript
// 对象形式创建pinia
// /src/stores/counter.js
import { defineStore } from 'pinia'
// 导入其他组件
import { useCounterStore2 } from './useCounterStore2'

// 保持第一个参数counter的唯一性
export const useCounterStore = defineStore('counter', {
  state: () => {
    return {
      count: 0
    }
  },
  // state简化
  state: () => ({
    count: 0,
    todos: [],
    nextId: 0
  }),
  getters: {
    // getter接收一个参数state，鼓励使用箭头函数
    double: (state) => state.count * 2,
    finishedTodos (state) {
      return state.todos.filter(todo => todo.isFinished)
    },
    // 定义一个常规函数时，可以通过this访问整个store实例，ts中还需要定义返回类型
    doublePlus () {
      return this.count * 2 + 9
    },
    // 返回一个函数，让其可以接收参数
    doublePlusSet () {
      return plus => this.count * plus
    },
    // 可以访问其他的getters
    doublePlusCopy () {
      return this.doublePlus
    },
    // 访问其他组件的getters
    getOthersGetter (state) {
      // 先获取整个store对象
      const useCounterStore2F = useCounterStore2()
      return this.count + useCounterStore2F.count
    }
  },
  actions: {
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
    const useCounterStoreF = useCounterStore()

    // 注意：不能对useCounterStoreF进行解构，因为他是一个用reactive包装的对象，否则会失去响应性
    // 这是错误的：const { count } = useCounterStoreF
    
    // 若想保持响应性，需使用 storeToRefs()函数
    const { count, double } = storeToRefs(useCounterStoreF)

    // 对state进行操作，直接操作
    function countPlus () {
      useCounterStoreF.count++
    }

    // 对state进行操作，使用$patch，参数为对象形式
    function countPlus2 () {
      useCounterStoreF.$patch({
        count: useCounterStoreF.count + 1,
        nextId: 23
      })
    }

    // 对state进行操作，使用$patch，参数为函数形式
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
      // 这会用下面整个对象替换之前定义时的state
      useCounterStoreF.$state = {
        name: 'jade',
        age: 27
      }
    }

    // 查看state的状态变更：$subscribe
    function subscribeState () {
      useCounterStoreF.$subscribe((mutation, state) => {
        // xxx
      }, {
        // 默认情况下，组件卸载后，这些监听会被删除，若想保留，则需
        detached: true
      })
    }

    // 使用action
    function increment () {
      useCounterStoreF.increment()
    }

    // 观察actions及其结果
    const unsubscribe = useCounterStoreF.$onAction((
      // action的名称
      name,
      // store实例
      store,
      // 传给action的参数
      args,
      // action返回或resolve的时候执行
      after,
      // action抛出错误或reject的时候执行
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
      // 之后就能够在模板中使用:
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
      return useCounterStoreF.count * 1000
    }
  }
}
</script>
```
<!-- tab:选项式API使用pinia -->
```typescript
// 选项式API方式使用

// 通过mapState会映射为只读属性
// 通过mapWritableState映射为可读写属性，其参数和mapState类似
// mapState可以映射state和getter，写法一致
import { mapState, mapWritableState, mapActions } from 'pinia'

import { useCounterStore } from '@/stores/counter'
import { useCounterStore2 } from '@/stores/counter2'

export default {
  computed: {
    // 通过this.useCounterStore.count和this.useCounterStore2.count形式访问
    ...mapState(useCounterStore, useCounterStore2),
    // 通过this.count访问useCounterStore.count
    ...mapState(useCounterStore, ['count', 'double']),
    // 自定义配置
    ...mapState(useCounterStore, {
      // 可以通过this.myCount访问useCounterStore.count
      myCount: 'count',
      // 对useCounterStore中进行求值，注意mapWritableState不能使用这个（即传递一个函数）
      myDouble: store => store.count * 2
    })
    
  },
  methods: {
    // 通过this.increment()访问useCounterStore上的action `increment`
    ...mapActions(useCounterStore, ['increment'])
  }
}
```
<!-- tabs:end -->
