# vue3迁移指南

## 准备工作

防止代码出现警告：从vue2迁移到vue3后，需要安装valor插件，同时工作区需要禁用vetur插件

## 安装

安装方式：
- 通过vite：`npm init vite project-name -- --template vue`或者`yarn create vite project-name --template vue`
- 通过vue-cli：`npm install -g @vue/cli`或`yarn global add @vue/cli`，然后`vue create project-name`

**vue2和vue3共存**：需要非全局下载vue-cli(Vue2)和@vue/cli(vue3)，然后分别在对应目录下找到例如`D:\vue-version-cache\node_modules\.bin\vue`的文件
- 然后使用该文件绝对路径进行创建即可
- 或者将vue文件对应的.bin目录存放到全局环境变量path中，然后对vue文件和vuecmd文件改成vue2或vue3即可。后面就能够直接在命令行中使用vue2和vue3进行项目创建

## 响应性

### 响应性基础

声明响应式状态的方式：
- 对象类型：reactive，ref
- 值类型：ref

**ref**：

定义：
- 创建一个响应式的引用，然后可以在任何地方起作用（通过value属性访问）
- 它接收一个参数并将其包裹在一个带有value属性的对象中，使用时需要从vue中导入
- 在任何值（不管是值还是引用，未使用类似ref的函数，则不是响应式变量）周围都有一个封装对象，这样就可以在整个应用中安全传递，不用担心在某地方失去它的响应性
- 将值封装在对象中，是为了保持JavaScript不同数据类型（值类型、引用类型）的行为统一

ref解包：
- 定义：当ref变量直接作为setup函数返回对象的第一级属性时，在模板template中访问会自动浅层次解包它内部的值；
- 在访问非第一级ref属性时需要加上.value，若不想访问实际的对象实例（即通过.value的形式访问，可以将这个ref属性变量用reactive包裹起来，后续就能够直接访问（不需加.value）了
- 若ref变量作为响应式对象reactive的属性，当他被访问或被修改后，会自动解包他的内部值（即不需要通过.value的形式访问）。同时ref变量和响应式对象reactive的属性是互相影响的（引用地址相同），当属性重新赋值之后，他们就互不相关了（修改不会影响对方）
- ref解包仅发生在响应式对象reactive（类型为普通Object对象）嵌套（ref作为属性）的时候，当ref变量作为其他原生集合类型Map或Array的属性或元素时，不会进行解包，这时仍然要通过.value进行访问

**reactive**：

定义：
- 该api返回一个响应式的对象状态，这个响应式转换是深度转换的，会影响传递对象的所有嵌套的属性
- 其中data选项返回一个对象时，在内部是交由reactive函数使其转为响应式对象

响应式状态解构：
- 当想使用一个响应式对象的多个属性的时候，可通过对象解构获取内部的一些属性，若想使得解构后的属性变量与原响应式对象相关联（变化同步发生），必须对这个响应式对象用toRefs函数包裹后解构，否则引用关联会失效（改变一个，另一个不发生变化）

只读的响应式对象：
- 通过readonly函数包裹该响应式对象后，修改该对象将报错


## 组合式API

使用场景：
- 将零散分布的逻辑组合在一起来维护，还可以将单独的功能逻辑拆分成单独的文件
- 将同一个功能所属逻辑抽离到函数组件当中（使用`export default function xxx () {}`的形式），在需要的时候进行导入即可

### setup组件选项

定义：setup选项在组件被创建之前执行，一旦props被解析完成，它就将被作为组合式api的入口

使用：
- setup选项可以和data、methods等选项并列使用，它是一个函数，可接收props和context参数
- 在setup函数中，可以访问的属性有props、attrs、slots、emit，无法访问的组件选项（即在与setup同级定义的选项）有data、computed、methods、refs
- 若setup返回一个对象，则该对象的属性以及props参数的属性都可以在模板中访问，此时这些内容是被自动浅解包的，直接使用，不需要带.value

注意：
- setup中this不是该活跃实例的引用，因为setup是在其他选项之前被调用的，所以内部的this行为和其他选项中的this不同
- setup中避免使用this，他不会找到组件实现（因为在创建之前执行的）
- setup的调用发生在data、computed、methods被解析之前，所以他们都无法在setup中被获取

#### setup函数参数

setup第一个参数props：
- 其中setup函数中的props参数是响应式的，更新props后，这里的参数也会同步更新
- 由于props是响应式的，所以不能够使用ES6进行解构，这会消除prop的响应性，此时需要使用`toRefs`函数将props包裹后进行解构，响应性才不会消失
- 若有可选的props，想将这个可选的prop进行解构，需要使用`toRef`函数，例如`const title = toRef(props, 'title')`，这会将title prop进行解构出来

setup第二个参数context：
- context是一个普通的JS对象，即不是响应式对象，意味着可以安全对其进行解构
- 它暴露了一些属性对象，包括attrs（attribute，非响应式对象，等同$attrs）、slots（插槽，非响应式对象，等同$slots）、emit（触发事件方法，等同$emit）、expose（暴露公共的函数）
- attrs和slots是有状态的对象，会随着组件更新而更新，所以应该避免对这两个属性对象进行解构，并始终用形如`attrs.xxx`的方式引用里面的属性
- 和props不同的是，attrs和slots是非响应式的，若想通过这两者的更改操作内容，应当在`onBeforeUpdate`生命周期钩子中执行这些操作

<!-- tabs:start -->
<!-- tab:setup第一个参数props -->
```typescript
import { toRefs, toRef } from 'vue'
setup (props) {
  // 解构必填的props title
  const { title } = toRefs(props)
  console.log(title.value)

  // 解构可选的props optionalTitle
  const optionalTitle = toRef(props, 'optionalTitle')
  console.log(optionalTitle.value)
}
```
<!-- tab:setup第二个参数context -->
```typescript
setup(props, { attrs, slots, emit, expose }) {
  // attribute, 非响应式对象，等同于$attrs
  console.log(attrs)
  // 插槽，非响应式对象，等同于$slots
  console.log(slots)
  // 触发事件，方法，等同于$emit
  console.log(emit)
  // 暴露公共的函数
  console.log(expose)
}
```
<!-- tabs:end -->

#### setup内生命周期钩子

setup内生命周期钩子的使用：该行为是保持选项式API和组合式API的完整性
- 组合式API的生命周期钩子是在选项式API的基础上加了前缀on（使用驼峰命名），例如`mounted` => `onMounted`
- 这些钩子接受一个回调函数参数，和选项式一样，当被组件调用时，回调函数参数将被执行

setup内其他钩子的使用：

**watch**：
定义：该函数和选项式APIwatch选项设置侦听器一样，使用时需要从vue中导入
使用：
- watch接收三个参数，依次是一个想要侦听的响应式引用或getter函数、一个回调（响应式引用变化时执行的函数）、一个可选的配置选项对象（例如deep等）

**computed**：
定义：和watch定义类似
使用：
- 接收一个函数（和选项式computed一致），根据函数的返回值返回一个不可改变的响应式ref对象
- 接收一个具有set和get函数的对象（和选项式computed类似），用于创建一个可读写的ref对象
- 在使用时，修改或获取computed值，和ref变量类似，都是xxx.value的形式
- 在computed中使用props的变量，也需要使用xxx.value形式引用，不然要报错

**setup中的生命周期钩子**：这些hooks接受一个回调函数，当钩子被组件调用时，回调函数将被执行

| 选项式 API | Hook inside `setup` |
| --- | --- |
| `beforeCreate` | 不需要，等同于写在setup中的代码 |
| `created` | 不需要，等同于写在setup中的代码 |
| `beforeMount` | `onBeforeMount` |
| `mounted` | `onMounted` |
| `beforeUpdate` | `onBeforeUpdate` |
| `updated` | `onUpdated` |
| `beforeUnmount` | `onBeforeUnmount` |
| `unmounted` | `onUnmounted` |
| `errorCaptured` | `onErrorCaptured` |
| `renderTracked` | `onRenderTracked` |
| `renderTriggered` | `onRenderTriggered` |
| `activated` | `onActivated` |
| `deactivated` | `onDeactivated` |

#### setup返回值

**setup返回一个渲染函数**：
- 只有setup选项可以返回渲染函数，`script setup`语法糖不能使用render
- 用法：返回一个`return () => h()`或返回多个`return () => [h(), h()]`
- 若返回渲染函数，则不能返回其他的属性对象，若想将这些属性暴露给外部（比如通过父组件的ref）访问，可以使用expose

```typescript
import { h, ref, reactive } from 'vue'
import Hello from './hello.vue'
export default {
  componentns: { Hello },
  setup (props, { expose }) {
    function changeCount () {
      count.value++
    }
    const count = ref(0)
    const list = reactive([
      { id: 1, text: 'hhh' },
      { id: 2, text: '特色菜' }
    ])

    // 若想在外部访问这个组件的其他属性，由于setup返回了渲染函数，此时这些属性必须通过expose暴露给外部
    expose({
      changeCount
    })

    return () => [
      // 设置div的class
      h('div', { className: 'count-wrapper count-wrapper-highlight' }, count.value),
      // 绑定事件
      h('button', { onClick: changeCount }, '按钮')
      // 循环渲染
      h('ul', list.map(item => {
        return h('li', item.text)
      })),
      // 渲染导入组件
      h(Hello)
    ]
  }
}
```

### script setup

### provide和inject

#### 基础用法

定义：
- 无论组件结构层次有多深，父组件都可以作为其所有子孙组件的依赖提供者。此时需要父组件有一个provide选项提供数据，子孙组件使用一个inject选项来接收这些数据
- 要访问组件实例属性，需要定义provide为一个返回对象的函数（和data选项用法一致）
- 要想使provide和inject保持响应性（即provide的变化影响inject值的变化），需要传递一个响应式变量（ref或reactive）或computed给provide的属性

```typescript
// 基本用法
// 父组件
export default {
  data() {
    return {
      todos: ['看书', '写字', '找对象']
    }
  },
  provide () {
    return {
      // 此处todos长度变化，inject是不会跟着改变的
      todoLength: this.todos.length
      // 选项式api则通过computed
      todoLengthByComputed: computed(() => this.todos.length)
    }
  }
}

// 子孙组件
export default {
  inject: ['todoLength'],
  created () {
    console.log(this.todoLength, '获取父组件的todo的长度')
  }
}
```

#### 在setup中使用

定义：
- 在setup中使用provide和inject时，需要从vue中显式导入provide和inject
- provide方法参数依次为：`name`(string类型)、`value`
- inject方法参数依次为：`name`、`默认值`(可选，未复现😢😢😢)
- 若provide和inject要保持响应性以同步变更，则需要对provide的值value使用ref或reactive包裹，（数组的长度不能监听变更😢😢😢）
- 修改provide，可直接在父组件中，或通过provide一个方法在子孙组件中修改
- 若想保持provide的值是可读（即在inject中修改不了），需要对provide的值value使用readonly包裹
- 使用readonly时，若仅修改对象的属性（而非修改对象的引用，给对象重新赋值），这时的readonly是无效的，（注：整个readonly未复现😢😢😢）

```typescript
// 父组件
import { ref, reactive, provide, readonly } from 'vue'
export default {
  setup (props, context) {
    let count = ref(0)
    const person = reactive({
      name: 'jade qiu',
      age: 27,
      handle: '找对象'
    })

    const changeCount = () => {
      count.value++
    }
    const addProperty = () => {
      person[Date.now()] = `当前日期${Date.now()}`
    }
    
    // 使用provide
    provide('count', count)
    provide('person', readonly(person))

    return {
      count,
      person,
      changeCount,
      addProperty
    }
  }
}

// 子孙组件
import { inject } from 'vue'
export default {
  setup () {
    const parentCount = inject('count', 0)
    const parentPerson = inject('person', {})
    return {
      parentCount,
      parentPerson
    }
  },
  methods: {
    getInjectVal () {
      console.log(this.parentCount, this.parentPerson)
    }
  }
}
```

### template中的ref引用

前景：类似vue2中的在script中使用template中定义的ref，例如`<div ref="divRef">`，使用如`this.$refs.divRef`

使用：
- 可以使用`watchEffect`函数侦听ref引用的更新，但是由于ref定义在setup中，此时watchEffect中不能够获取到ref对象，除非在watchEffect第二个参数上定义一个对象`{ flush: 'post' }`

<!-- tabs:start -->
<!-- tab:基础用法 -->
```typescript
<template>
  <div ref="divRef">test</div>
</template>

<script>
import { ref, onMounted, watchEffect } from 'vue'
export default {
  setup () {
    // 先定义一个响应式的变量，对应上面的divRef
    const divRef = ref(null)

    // 挂载后才能获取到值
    onMounted(() => {
      console.log(divRef.value, 'onMounted')
    })

    // 侦听ref的变更
    watchEffect(() => {
      console.log(divRef.value, 'watchEffect')
    }, {
      // 必须要使用这个参数
      flush: 'post'
    })

    return {
      divRef
    }
  }
}
</script>
```
<!-- tab:JSX中的用法 -->
```typescript
import { h } from 'vue'
export default {
  setup () {
    const divRef = ref(null)
    // return () => {
    //   // 渲染函数用法
    //   // h函数用法参数依次为：元素标签名，元素属性与值对象，元素内部包裹的内容
    //   h('div', { ref: root })
    // }

    // JSX中的用法
    return () => <div ref={root} />
  }
}
```
<!-- tab:结合v-for的用法 -->
```typescript
<template>
  <div v-for="(item, i) in list" :ref="el => { if (el) divs[i] = el }">
    {{ item }}
  </div>
</template>

<script>
  import { ref, reactive, onBeforeUpdate } from 'vue'
  export default {
    setup () {
      const list = reactive([1, 2, 3])
      const divs = ref([])
      // 确保在每次更新之前重置ref
      onBeforeUpdate(() => {
        divs.value = []
      })
      return {
        list,
        divs
      }
    }
  }
</script>
```
<!-- tabs:end -->


## teleport

定义：
- teleport提供了一种干净的方法，允许我们自己决定在哪个DOM节点下面渲染被teleport包裹的内容，而不必求助于全局状态或将其拆分为两个组件
- 通俗意义即代码写在这里，而其实际的渲染则在其他的位置
- 同时teleport能够接收父组件注入的属性
- 多个teleport组件可以将内容挂载到同一个目标元素，出现顺序是先来先占位

语法：
teleport元素具备以下属性：
- `to`：值为字符串，且必须要有。其值是有效的查询选择器（例如id选择器、类选择器、属性选择器）或HTMLElement元素，指定将包裹的内容移动到目标元素内部
- `disabled`：属性可选，可用于禁用teleport功能，意味着内部内容不会移动到任何位置


```typescript
<teleport to='#root'>
  <div>A</div>
</teleport>
<teleport to="#root">
  <div>B</div>
</teleport>

// 结果将是：
<div id="root">
  <div>A</div>
  <div>B</div>
</div>
```

## 片段

定义：即多根节点的组件，这要求显式定义attribute（传入的props）所处的位置

```typescript
<!-- Layout.vue -->
<template>
  <header>...</header>
  <main v-bind="$attrs">...</main>
  <footer>...</footer>
</template>
```

## 渲染函数

前置知识：
- `$slots`：访问通过插槽分发的内容，例如插槽`v-slot:foo`中的内容将在`this.$slots.foo()`中被找到，而未具名的插槽节点将统一在`this.$slots.default()`中被找到


