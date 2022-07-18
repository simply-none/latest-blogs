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

定义：
- `<script setup>`是在单文件组件(SFC)中使用组合式API的编译时语法糖

相比于普通的script语法，其优势有：
- 更少的样板代码，更简洁的代码
- 能够使用纯typescript生命props和抛出事件
- 更好的运行时性能（其模板会被编译成与其同一作用域的渲染函数，无任何中间代理）
- 更好的IDE类型推断功能（减少语言服务器从代码中抽离类型的工作）

基本语法：
- 被`<script setup>`包裹的代码会被编译成组件中setup()函数的内容，意味着他会在每次组件实例被创建的时候执行（和created类似，每引用一次该组件，就执行一次），而普通的script只在组件首次引入时执行一次
- 里面声明的顶层的`变量`、`函数声明`，以及`import导入的内容`，都能在模板template中直接使用，不需通过methods暴露它（函数， import导入的函数），不需通过新建变量暴露（变量，import导入的变量），不需要在compoments引入（import导入的组件）
- 通过import导入的组件，为了保持一致性，建议在template中使用驼峰式命名，而不是短横线命名，这也有助于区分原生的自定义元素
- 当import导入的组件用在动态组件component中时，其is属性的值就是这个导入的名字`:is="comName"`
- 单文件组件可以通过它的文件名被自己引用，这种方式相比于import导入的组件优先级更低
- 若有命名的import导入和组件的推断名冲突，可以使用import别名导入`import { FooBar as AliasBar } from './components'`
- 若导入一个属性是组件的对象`import * as Form from './form'`，可以直接使用类似`<Form.Label>`来引用
- 对于在`<script setup>`里创建的自定义指令，必须以`vMyDirective`的形式命名，这样它才能够在template中以`<h1 v-my-directive>title</h1>`的形式使用；而对于导入的指令，也应当符合`vMyDirective`的命名形式（可通过重命名搞定）
- 对于props和emit的声明，必须使用`defineProps`和`defineEmits`（仅在`<script setup>`内有效，且不需要导入能直接用）函数来声明，其接收的参数和选项式语法相同
- 由于传入到defineProps和defineEmits的选项会从setup中提升到模块的范围，所以他们不能引用在setup内部定义的变量，否则会引起编译错误。但是他们可以引用import导入的内容（这也是模块的范围）
- 若想在父组件中使用`<script setup>`中的变量/方法，和setup选项式类似，这里需要使用defineExpose（不需要导入，语法和选项式相同）函数将变量/方法暴露出去
- 对于slots和attrs的使用，和vue2一样，可以直接在模板中以`$slots`, `$attrs`使用，若想在`<script setup>`内部使用，需要用`useSlots()`和`useAttrs()`函数访问他们
- 被包裹的代码，可以使用顶层的await，而不需要带有async，因为其结果会被编译为`async setup()`的形式，这种形式需要结合Suspense（实验性特性）一起使用
- 因为模块执行语义的差异，`<script setup>`依赖单文件组件的上下文，当将其移动到外部的js或ts文件时，会产生混乱，所以不能和src属性一起使用


**`<script setup>`会在下列情况下和普通的`<script>`一起使用**：
- 无法在`<script setup>`中声明的选项，例如`inheritAttrs`或通过插件启用的自定义选项时
- 声明命名导出
- 运行一些特定的内容（比如只需要执行一次的内容）
- 这种场景下，script不支持使用render函数，应该使用script结合setup选项式的形式

**在typescript独有的功能**：
- https://v3.cn.vuejs.org/api/sfc-script-setup.html#%E4%BB%85%E9%99%90-typescript-%E7%9A%84%E5%8A%9F%E8%83%BD
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

渲染函数定义：
- 拥有完全的JavaScript编程能力
- 比模板更接近编译器

虚拟DOM：
- vue通过建立一个虚拟DOM来追踪自己要如何改变真实的DOM

h()函数：
- 返回了（`createNodeDescription`，即创建了一个节点描述，也称虚拟节点VNode），
- VNode包含的信息会告诉vue在页面上需要渲染什么样的节点，及其子节点的信息
- h()函数的参数，若无属性对象，可直接省略这个参数，然后将第三个参数children放在第二个参数的位置；也可不省略，而是传入null占位
- h()函数中，定义一次VNode（通过h函数定义），则只能使用一次，不能使用多次；若要使用多次，可以使用工厂函数（即通过遍历、循环）创建多个h函数（VNode）
- 若要创建组件VNode，直接将组件名传递给h函数第一个参数

**h()函数的返回值**：
- 返回单根VNode
- 返回一个字符串（文本VNode）
- 返回一个VNode数组（片段，无根节点）
- 返回null（渲染成注释节点）

<!-- tabs:start -->
<!-- tab:基本语法 -->
```typescript
import { h } from 'vue'
export default {
  render () {
    return h(
      // 第一个参数是标签名，必须传入
      // 可以是：HTML标签、组件、异步组件、函数式组件
      // 类型：字符串、对象、函数
      'h' + this.level,
      // 第二个参数是属性对象，可选
      // 属性包括：attribute、prop、eventObject
      // 类型：object
      {
        title: '头部标签'
      },
      // 第三个参数是children，即第一个参数包裹的内容，可选
      // 可以是子VNodes，使用h()构建；或是字符串文本（文件VNode），或者是插槽对象
      // 类型：字符串、数组、对象
      // 默认情况下，所有的子节点都存储在下面这个对象中
      this.$slots.default()
    )
  }
}
```
<!-- tab:唯一的VNode -->
```typescript
import { h } from 'vue'
export default {
  render () {
    const paragh = h('p', 'hello jade')
    return h('div', null, [
      // err，不能重复使用两次，只能使用一次
      paragh,
      paragh
    ])

    // 正确用法
    return h('div', null, Array.from({ length: 2 }).map(() => {
      return h('p', 'hello jade')
    }))
  }
}
```
<!-- tabs:end -->

### resolveComponent和resolveDynamicComponent

**resolveComponent**：模板内部用来解析组件名称的函数，只能用于setup和render中
- 接收一个字符串类型参数，若能够找到与其同名的组件名，则返回已加载的组件，否则返回该字符串
- 通常用于全局注册的组件，对于局部注册的组件，可以直接将导入的组件传入h函数第一个参数
- 若想在h()的第三个参数中，使用插槽，且该插槽返回一个组件时，该组件名的解析，需要在h()函数之外（前面）进行解析，然后它的返回结果可以在插槽内部使用

**resolveDynamicComponent**：实现component is动态组件
- 接收一个参数，可以是组件名称、HTML元素名称、组件选项对象（通过defineComponent定义的），然而该函数都有替代方法，如下
  - 对于组件名称，可以使用resolveComponent+h()；
  - 对于HTML元素，可以直接使用h()；
  - 对于组件选项对象，直接使用h()；
- 与template标签一样，component标签仅在模板中作为占位符

**`<component :is="var">`**：
- var可以是一个字符串，表示组件的名称，或者直接是一个组件名（通过import导入的名字）

<!-- tabs:start -->
<!-- tab:resolveDynamicComponent -->
```typescript
// 基本用法
render () {
  // <component :is="name"></component>
  const MyCom = resolveDynamicComponent(this.name)
  return h(MyCom)
}

// 替代品
render () {
  // <component :is="bold ? 'strong' : 'em'"></component>
  return h(this.bold ? 'strong' : 'em')
}
```
<!-- tab:xxx -->
```xxx

```
<!-- tabs:end -->

### 在渲染函数中使用指令

**不需使用前缀on表示的修饰符**：

| 修饰符 | 处理函数中的等价操作 |
| --- | --- |
| `.stop` | `event.stopPropagation()` |
| `.prevent` | `event.preventDefault()` |
| `.self` | `if (event.target !== event.currentTarget) return` |
| 按键：  
`.enter`, `.13` | `if (event.keyCode !== 13) return` (对于别的按键修饰符来说，可将 13 改为[另一个按键码(opens new window)](http://keycode.info/) |
| 修饰键：  
`.ctrl`, `.alt`, `.shift`, `.meta` | `if (!event.ctrlKey) return` (将 `ctrlKey` 分别修改为 `altKey`, `shiftKey`, 或 `metaKey`) |

<!-- tabs:start -->
<!-- tab:在render中使用v-model -->
```typescript
import { h } from 'vue'
import MyComponent from './my-component.vue'
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  render () {
    return h(
      MyComponent,
      {
        // 第二个参数中，必须要有modelValue和onUpdate:modelValue
        modelValue: this.modelValue,
        'onUpdate:modelValue': value => this.$emit('update:modelValue', value)
      } 
    )
  }
}
```
<!-- tab:在render中使用v-on -->
```typescript
// 省略其他代码，直接展示render内部内容
// 相比模板语法，click事件，必须加前缀on，且是驼峰式写法
render () {
  return h('div', {
    onClick: $event => console.log('clicked', $event.target)
  })
}
```
<!-- tab:在render中使用事件修饰符 -->
```typescript
// 省略其他代码，直接展示render内部内容
// 相比模板语法，click事件，必须加前缀on，且是驼峰式写法
render () {
  return h('div', {
    // 对于`.passive`, `.capture`, `.once`修饰符，使用驼峰语法拼接在事件后面
    onClickCapture: $event => console.log('clicked', $event.target)，
    onKeyupOnce: $event => console.log('clicked', $event.target)，
    onMouseoverOnceCapture: $event => console.log('clicked', $event.target)
  })

  // 对于其他的修饰符，前缀on不是必须的，一般可以使用JavaScript常规语法
  return h('input', {
    onKeyUp: event => {
      // .self修饰符
      if (event.target !== event.currentTarget) { return }
      // .enter(.13)以及.shift修饰符
      if (!event.shiftKey || event.keyCode !== 13) { return }
      // .stop修饰符，停止事件传播
      event.stopPropagation()
      // .prevent修饰符，阻止默认事件
      event.preventDefault()
    }
  })
}
```
<!-- tabs:end -->

### 在渲染函数中使用插槽

场景：
- 可以通过`this.$slots`访问静态插槽的内容，每个插槽都是一个VNode数组
- 若想在渲染函数的插槽中使用resolveComponent函数，必须在h()函数之外（之前）进行调用，不能在插槽内部直接使用该函数（可以使用该函数的返回结果）

<!-- tabs:start -->
<!-- tab:基本用法 -->
```typescript
render () {
  // 渲染成：<div><slot></slot></div>
  return h('div', {}, this.$slots.default())
}
```
<!-- tab:定义插槽变量text -->
```typescript
render () {
  // 渲染成：<div><slot :text="message"></slot></div>
  return h('div', {}， this.$slots.default({
    text: this.message
  }))
}
```
<!-- tab:在父组件使用插槽定义的变量text -->
```typescript
render () {
  // 这里的v-slot等同于v-slot:default
  // <div><child v-slot="props"><span>{{ props.text }}</span></child></div>
  return h('div', [
    h(
      resolveComponent('child'),
      {},
      {
        // 定义插槽渲染出来的模板
        default: (props) => h('span', props.text)
      }
    )
  ])
}
```
<!-- tab:插槽自定义 -->
```typescript
// 不做修改，直接将模板中的内容，都传递给子组件，子组件根据它的内容进行适配
render () {
  return h(Panel, null, this.$slots)
}

// 也可以做修改，选择性把数据传递给子组件
render () {
  return h(
    Panel,
    null,
    {
      // 插槽header直接传入
      header: this.$slots.header,
      // 修改默认插槽，添加一个div元素
      default: props => {
        const children = this.$slots.default ? this.$slots.default() : []
        return children.concat(h('div', '额外的插槽内容'))
      }
    }
  )
}
```
<!-- tabs:end -->

### 在渲染函数中使用自定义指令

场景：
- 可以使用`withDirectives`将自定义指令应用于VNode
- resolveDirective是模板内部用来解析指令名称的同一个函数，只有当还没有直接访问指令的定义对象时才需要这样

**resolveDirective**：只能用在render和setup中
- 接收一个字符串类型参数，返回一个指令，若未找到，则返回undefined

**withDirectives**：只能用在render和setup中
- 允许将指令应用于VNode，返回一个包含应用指令的VNode
- 接收两个参数，分别为vnode（通过h函数创建的），directives（指令数组）
- 指令数组directives包含的指令本身是一个数组，其索引分别为[directive(指令对象本身), value, arg, modifiers]

```typescript
const { h, resolveDirective, withDirectives } = vue
export default {
  render () {
    // <div v-pin:top.animate="200"></div>
    const pin = resolveDirective('pin')
    return withDirectives(h('div', [
      [pin, 200, 'top', { animate: true }]
    ]))
  }
}
```

### 在渲染函数中使用内置组件

内置组件：keep-alive、transition、transition-group、teleport
- 这些内置组件默认未被全局注册，只能在用到的地方被引入，无法通过resolveComponent和resolveDynamicComponent访问
- 访问他们，需要自行导入

```typescript
const { h, Transition } = vue

export default {
  render () {
    return h(Transition, { mode: 'out-in' })
  }
}
```

### 使用JSX语法

场景：避免繁琐的代码，更接近模板语法，需使用[插件](https://github.com/vuejs/jsx-next)

```typescript
// 模板语法
<anchored-heading :level="1"> <span>Hello</span> world! </anchored-heading>

// 渲染函数
h(
  'anchored-heading',
  {
    level: 1
  },
  {
    default: () => [h('span', 'Hello'), ' world!']
  }
)

// JSX
render() {
  return (
    <AnchoredHeading level={1}>
      <span>Hello</span> world!
    </AnchoredHeading>
  )
}
```

### 函数式组件

定义:
- 自身没有任何状态的组件，在渲染过程中不会创建组件实例，并跳过常规组件生命周期
- 函数式组件本身就是该组件的render函数，内部无this引用
- 参数分别为props、context（attrs、emit、slots）

使用：
- 函数式组件可以像普通组件一样被注册和消费，可以传给h函数第一个参数

## 自定义事件

**事件名**：
- 具备自动大小写转换（大小写无关），驼峰与短横线可自动转换
- 在DOM模板中（用template包裹的与script同级的内容），建议使用kebab-case（短横线事件名）


**事件自定义方式**：
- 若emits中事件和原生事件重名，则该事件会代替原生事件
- 可以对抛出的事件进行验证，这时emits是一个对象，key是事件名，value是一个函数，函数参数是事件抛出时传递的值，函数返回值代表事件是否有效

<!-- tabs:start -->
<!-- tab:基础用法 -->
```typescript
// emit代指将事件从组件（子）抛出去，让引用它的那个组件（父）接收
export default {
  emits: ['inFocus', 'submit']
}
```
<!-- tab:事件验证 -->
```typescript
export default {
  emits: {
    // 无验证
    click: null,
    // 验证submit事件，其中email是emit传递的值
    submit: ({ email }) => {
      if (email) {
        return true
      }
      return false
    }
  }
}
```
<!-- tabs:end -->

### v-model用法

定义：
- 默认情况下，组件上的v-model使用modelValue作为prop和update:modelValue作为事件
- 这里的v-model具名参数和vue2中的v-bind和emit类似，只不过这里在父组件中不需要重新写一个函数接收它的值

使用：
- 可以通过向v-model传递参数，即`v-model:title='bookTitle'`中的title，修改title的值bookTitle
- 可以同时传递多个v-model给子组件，不同的v-model将同步到不同的prop
- v-model的内置修饰符有`.trim`, `.number`, `.lazy`，同时还可以给v-model添加自定义修饰符。自定义修饰符（比如`.custom`）在组件的created钩子触发时，`modelModifiers`prop会包含它，且它的值为true，可以通过`this.modelModifiers.custom`访问。使用自定义修饰符，就是在触发事件的时候，用`this.modelModifiers.custom`进行相应的操作
- 对于有参数的修饰符（比如`v-model:title.custom`，对应的prop就要改成参数名+'Modifiers'，即上面的modelModifiers改成titleModifiers

<!-- tabs:start -->
<!-- tab:基本用法 -->
```typescript
// 父组件Parent
<script>
import Child from './child.vue'
export default {
  components: { Child }
}
</script>
<template>
  // 父组件将title传递给子组件
  <Child v-model:title="bookTitle" v-model:book-desc="bookDesc"></Child>
</template>

// 子组件Child
export default {
  props: {
    title: String,
    bookDesc: String
  },
  // 若要父组件中的bookTitle同步更新，子组件必须将要emit的事件写明：此处是title
  emits: ['update:title', 'update:bookDesc'],
  template: `
    <input type="text" :value="title" @input="$emit('update:title', $event.target.value)">
    <input type="text" :value="bookDesc" @input="$emit('update:bookDesc', $event.target.value)">
  `
}
```
<!-- tab:带修饰符的v-model -->
```typescript
<template>
  // 父组件将title传递给子组件，修饰符capitalize让title的值首字母大写
  <Child v-model:title.capitalize="bookTitle" v-model:book-desc="bookDesc"></Child>
</template>

// 子组件Child
export default {
  props: {
    title: String,
    bookDesc: String,
    titleModifiers: Object
  },
  // 若要父组件中的bookTitle同步更新，子组件必须将要emit的事件写明：此处是title
  emits: ['update:title', 'update:bookDesc'],
  template: `
    <input type="text" :value="title" @input="emitTitleVal">
    <input type="text" :value="bookDesc" @input="$emit('update:bookDesc', $event.target.value)">
  `,
  methods: {
    emitTitleVal (e) {
      let val = e.target.value
      // 修饰符拦截
      if (this.titleModifiers.capitalize) {
        val = val.charAt(0).toUpperCase() + val.slice(1)
      }
      this.$emit('update:title', val)
    }
  }
}
```
<!-- tabs:end -->

## vue自定义渲染器

渲染器是围绕虚拟DOM存在的，为了能够将虚拟DOM渲染为真实的DOM，渲染器内部需要调用浏览器提供的DOM编程接口，如下所示：
- `document.createElement / createElementNS`：创建标签元素。
- `document.createTextNode`：创建文本元素。
- `el.nodeValue`：修改文本元素的内容。
- `el.removeChild`：移除 DOM 元素。
- `el.insertBefore`：插入 DOM 元素。
- `el.appendChild`：追加 DOM 元素。
- `el.parentNode`：获取父元素。
- `el.nextSibling`：获取下一个兄弟元素。
- `document.querySelector`：挂载 `Portal` 类型的 `VNode` 时，用它查找挂载点。

这些DOM接口完成了Web平台（浏览器）对DOM的增删改查操作。但若是渲染器不依赖任何一个平台下特有的接口，则应该提供一个抽象层，将其增删改查操作使用抽象接口实现，这就是自定义渲染器的本质。

## 单文件组件样式特性

**`<style scoped>`**:
- 父组件的样式不会泄露到子组件当作，但是子组件根节点的样式会由子组件和父组件共同作用（和vue2一样，但通过v-html创建的内容不会被影响）
- 若想父组件影响子组件样式，可以使用`:deep()`函数
- 若想修改插槽内的样式，可以使用`:slotted`伪类实现
- 若想将某样式应用到全局所有符合规则的条件，也可以使用`:global`伪类实现
- 在这种条件下，应该尽量使用class或者id渲染样式，避免性能损失
- 小心递归组件中的后代选择器😢😢😢，对于一个使用了 .a .b 选择器的样式规则来说，如果匹配到 .a 的元素包含了一个递归的子组件，那么所有的在那个子组件中的 .b 都会匹配到这条样式规则。

<!-- tabs:start -->
<!-- tab:deep()函数 -->
```typescript
<style scoped>
.a :deep(.b) {
  // xxx
}

// 将会编译为
.a[data-v-f2fdsadf] .b {
  // xxx
}
</style>
```
<!-- tab:插槽选择器 -->
```typescript
<style scoped>
// 插槽中div会变成红色
:slotted(div) {
  color: red;
}
</style>
```
<!-- tab:全局选择器 -->
```typescript
<style scoped>
// 所有的div都将变成红色
:global(div) {
  color: red;
}
</style>
```
<!-- tabs:end -->

**`<style module>`**：
- 该标签会被编译为css module，并将生成的css类作为$style对象的键暴露给组件，即可在其他地方通过类似$style.red的方式访问样式
- 可以给module定义一个值`<style module="classes">`，这样就能将$style替换成这个值了`classes.red`
- 若想在setup选项或`<script setup>`中使用注入的类，需要使用函数`useCssModule()`或者是`useCssModule('classes')`
- 若样式模块想用到script内部导出的变量（data中的，或者setup导出的），可以使用`v-bind`函数绑定

```typescript
<template>
  <p :class="$style.red">
</template>

<script>
export default {
  data () {
    return {
      bgColor: 'blue'
    }
  }
}
</script>

<script setup>
const border = {
  color: 'green'
}
</script>

<style module>
.red {
  color: red;
  // 使用动态变量
  background-color: v-bind(bgColor);
  // 对于JavaScript表达式，需要用引号包裹
  border-color: v-bind('border.color')
}
</style>
```

