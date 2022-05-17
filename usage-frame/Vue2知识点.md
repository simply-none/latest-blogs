# Vue2 知识点

## 数据传递

1. provide、inject

语法：
```vue
provide: Object | () => Object
inject: Array<string> | { [key: string]: string | Symbol | Object }
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