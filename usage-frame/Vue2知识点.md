# Vue2 知识点

## 数据传递

1. provide、inject

语法：
```js
provide: Object | () => Object
inject: Array<string> | { [key: string]: string | Symbol | Object }
```

## 响应式原理

为了监测数组的变化，须按照下面要求进行数据修改：
1. 数据删除/修改数组长度：`this.list.splice(length)`
2. 数据修改：
   - `this.$set(this.list, indexOfItem, newValue)`
   - `this.list.splice(indexOfItem, 1, newValue)`

为了监测对象的变化，须按照下面要求进行数据修改：
1. 修改一个属性：`this.$set(this.currentForm, formItem, newValue)`
2. 修改多个属性：`this.currentForm = Object.assign({}, this.currentForm, { xxx }`

当使用修改原数组的方法时，可以检测到数组的变化（响应式）：push、pop、unshift、shift、splice、sort、reserve

## computed操作

1. computed传入参数

解释：正常的computed变量，直接传入变量名称即可（就会return 一个返回值过来），若想要传入参数，则里面需要再嵌套一个函数

```vue
computed: {
  getCurrentPerson () {
    return (personId) => {
      return this.persons[personId]
    }
  }
}

<!-- html中使用 -->
<el-form v-model="getCurrentPerson(21)"></el-form>
```

## vuex基本操作

注意：
1. vuex的数据更新必须遵守vue的响应规则

操作流程如下：
<!-- tabs:start -->

<!-- tab:store.js -->
```vue
state: {
  count: 0
},
getters: {
  getCount: (state, payload) => {
    return state.count
  }
},
// 同步请求使用mutations
mutations: {
  SET_COUNT (state, payload) => {
    state.count += payload.count
  }
},
// 异步请求使用actions
actions: {
  asyncSetCount ({ commit, state }, payload) => {
    commit('SET_COUNT', payload)
  }
}
```

<!-- tab:组件中使用 -->
```vue
// 直接访问
this.$store.state.count
this.$store.getters.getCount
this.$store.commit('xxx', payload)
this.$store.dispatch('xxx', payload)


// 导入访问
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

computed: {
  ...mapGetters({
    // 和mapState类似
  })
  ...mapState({
    count: state => state.count,
    countAlias: 'count',
    // 使用this
    comCount (state) {
      return state.count + this.localCount
    }
  })
}

methods: {
  // mapActions和mapMutations类似
  // 此时：this.setCount等同于this.$store.commit('setCount')
  ...mapMutations([
    'setCount'
  ]),
  // 或者
  ...mapMutations({
    add: 'setCount'
  })
}

```

<!-- tabs:end -->