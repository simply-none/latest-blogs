# vue3保点

> 参考文档：      
> vuejs官方迁移文档（旧）       
> https://vue3.chengpeiquan.com/component.html#%E7%94%A8%E6%B3%95%E4%B8%8A%E7%9A%84%E5%8F%98%E5%8C%96

## 准备工作

防止代码出现警告：从vue2迁移到vue3后，需要安装valor插件，同时工作区需要禁用vetur插件

## 安装

安装方式：
- 通过vite：`npm init vite project-name -- --template vue`或者`yarn create vite project-name --template vue`
- 通过vue-cli：`npm install -g @vue/cli`或`yarn global add @vue/cli`，然后`vue create project-name`

**vue2和vue3共存**：需要非全局下载vue-cli(Vue2)和@vue/cli(vue3)，然后分别在对应目录下找到例如`D:\vue-version-cache\node_modules\.bin\vue`的文件
- 然后使用该文件绝对路径进行创建即可
- 或者将vue文件对应的.bin目录存放到全局环境变量path中，然后对vue文件和vuecmd文件改成vue2或vue3即可。后面就能够直接在命令行中使用vue2和vue3进行项目创建

## 模板语法

注意：
- 大括号内部可以是任意的单一JavaScript表达式（能放在return后面的表达式）
- v-html替换的内容包含它所作在的元素本身
- 模板中的表达式将被沙盒化，仅能访问到有限的全局对象列表（比如Math,Date），未显式包含在列表中的对象将不能在模板中访问。但是你可以在`app.config.globalProperties`中添加以显式包含在列表中

## 响应性

### 响应性基本原理

**深层响应性**

vue中的状态是默认深层响应式的，会检测到响应性变量的深层次属性修改；同时，也可在某些特定场景中使用shallowXxx api创建浅层响应式对象，仅在顶层具有响应性。

**响应式代理 vs 原始对象**

原始对象：不会触发视图更新
响应式对象（代理对象）：会触发视图更新



### 响应式api

声明响应式状态的方式：
- 对象类型：reactive，ref
- 值类型：ref

**ref**：

typescript用法：
- 类型定义，在ref后面加一个尖括号定义类型，或者在等式左侧定义类型
- 例如，`const msg = ref<string | number>('hello, Jade!')`
- 例如，定义ref节点，`const formRef = ref<HTMLElement | null>(null)`
- 例如，定义组件，`const child = ref<Child | null>(null)`

在组件中使用：
- `<input ref="input"/>`结合`const input = ref(null)`一起使用
- `<input :ref="el => {// 组件每次更新都会被调用，用于元素赋值}"/>`
- ref也可直接作用在组件上，用于调用子组件expose（即`defineExpose({})`导出的方法（只在使用了script setup时）

定义：
- 创建一个响应式的引用，然后可以在任何地方起作用（通过value属性访问）
- 它接收一个参数并将其包裹在一个带有value属性的对象中，使用时需要从vue中导入
- 在任何值（不管是值还是引用，未使用类似ref的函数，则不是响应式变量）周围都有一个封装对象，这样就可以在整个应用中安全传递，不用担心在某地方失去它的响应性
- 将值封装在对象中，是为了保持JavaScript不同数据类型（值类型、引用类型）的行为统一

ref解包（即不需要使用.value进行访问）：
- 定义：当ref变量直接作为setup函数返回对象（注：非setup环境，而在setup环境中，作为一个顶级变量时）的第一级属性时，在模板template中访问会自动浅层次解包它内部的值，即可不带.value直接访问到；
- 
- 在访问非第一级ref属性时需要加上.value，若不想访问实际的对象实例（即通过.value的形式访问，可以将这个ref属性变量用reactive包裹起来，后续就能够直接访问（不需加.value）了；或者是直接解构该对象，得到一个顶层的响应式对象；仅包含一个文本插值而无相关运算时（比如`{{ pureObj.refValue }}`）也会被自动解包，相当于`{{ pureObj.refValue.value }}`
- 若ref变量作为响应式对象reactive的属性，当他被访问或被修改后，会自动解包他的内部值（即不需要通过.value的形式访问）。同时ref变量和响应式对象reactive的属性是互相影响的（引用地址相同），当属性重新赋值之后，他们就互不相关了（修改不会影响对方）。只有当嵌套在深层响应式对象内才会进行解包，在浅层响应式对象shallowXxx中不会。
- ref解包仅发生在响应式对象reactive（类型为普通Object对象）嵌套（ref作为属性）的时候，当ref变量作为其他原生集合类型Map或Array的属性或元素时，不会进行解包，这时仍然要通过.value进行访问

注意：
- ref被传递给函数或从一般对象上（作为其属性）被解构时，不会丢失响应性

**reactive**：

定义：
- 语法：`const xxx = reactive(obj)`
- 该api返回一个响应式的对象状态，这个响应式转换是深度转换成代理对象的，会影响传递对象的所有嵌套的属性。即能够检测到深层次的对象或数组的（新增，修改，删除，替换值）改动
- 为保证访问代理的一致性，对同一个原始对象调用reactive总是会返回同一个代理对象，而对已存在的代理对象调用reactive则返回该代理对象本身
- 其中data选项返回一个对象时，在内部是交由reactive函数使其转为响应式对象（选项式语法）

注意：
- reactive仅对对象（对象、数组、map、set等）类型有效，对原始类型（string、number等）无效
- 对响应式对象重新赋值后，将丢失初始引用的响应性连接。也意味着将响应式对象的**属性**赋值给其他变量、进行属性解构、将属性传入一个函数时，将会失去响应性，即修改这三个条件对应的内容时，响应式对象不会同步变更

```typescript
// 失去响应性的三种方式
const state = reactive({ count: 0 })

// 1
let n = state.count
n++

// 2
let {count} = state
count++

// 3
fn(state.count)
```

响应式状态解构：
- 当想使用一个响应式对象的多个属性的时候，可通过对象解构获取内部的一些属性，若想使得解构后的属性变量与原响应式对象相关联（变化同步发生），必须对这个响应式对象用toRefs函数包裹后解构，否则引用关联会失效（改变一个，另一个不发生变化）

只读的响应式对象：
- 通过readonly函数包裹该响应式对象后，修改该对象将报错

**readonly**:

定义：
- 语法：`const xxx = readonly(obj)`
- 接受一个对象（响应式/普通的），或者一个ref，返回一个原值的只读代理（深层只读代理，所有属性（包括嵌套属性）都不可修改）
- 其返回值可以解包（和reactive类似），但是解包后的值是一个只读的

**customRef**：**自定义Ref**

**toRef和toRefs**：

| API | 语法 | 作用 | 解释|
| --- | --- | --- | --- |
| toRef | `toRef(obj, key)` | 创建一个新的ref变量，转换 reactive 对象的某个字段为ref变量；若对应的key不存在，值为undefined；若对不存在的key进行赋值，原ref变量也会同步增加这个变量 |只转换一个字段
| toRefs | `toRefs(obj)` | 创建一个新的对象，它的每个字段都是 reactive 对象各个字段的ref变量 |转换所有字段

**isRef**:

定义：检查参数是否是一个ref值，返回一个类型判定（即返回值可用作类型守卫，可收窄为具体某一类型，比如放在if中）

**unref**:

定义：如果参数是一个ref值，则返回其.value的值，否则返回参数本身

**shallowRef**

定义：
- 语法：`const xxx = shallowRef(xx)`
- 相当于ref的第一层级变化（ref的第一层级就是ref本身，而非其内部的属性第一层级）会响应式变更，不会引发深层次数据的变更（会修改值，但视图不刷新）。常用于对大型数据结构的性能优化（毕竟大量数据时深层次属性变更性能耗费大，所以使用该api，在每一次变更时均对其.value重新赋值）

注意：上述的不引发视图更新，仅仅是指单独操作该属性时。如果混合着操作其他对象/属性，则有可能会引发变更

**shallowReactive**

定义：
- 语法：`const xxx = shallowReactive(obj)`
- 相当于reactive的第一层级变化（reactive的第一层级就是字面意思）会响应式变更，深层次数据变更不会引发视图刷新（会修改值，但视图不刷新）

注意：
- 上述的不引发视图更新，仅仅是指单独操作该属性时。如果混合着操作其他对象/属性，则有可能会引发变更
- 值为ref的属性不会被自动解包（解包：可以不需要调用.value即可访问该值）

```vue
// shallowRef、shallowReactive会引发变更的情形：
<script setup>
import { shallowRef, shallowReactive } from 'vue'

const person = shallowRef({
  name: 'jade',
  hobbies: ['唱', '跳', 'rap'],
  frames: {
    vue: '3',
    react: '18'
  }
})

const state = shallowReactive({
  name: 'jade',
  hobbies: ['唱', '跳', 'rap'],
  frames: {
    vue: '3',
    react: '18'
  }
})

function changeStates () {
  // 单独仅改变非一级状态，视图层不会发生任何修改
  person.value.frames.vue+=1
  state.hobbies.push(34)

  // 加上下面的任何一条一级状态的内容修改后，上述的非一级状态则会同时进行修改
  person.value = Date.now()
  state.frames = Date.now()
}
</script>

<template>
  <div>{{ person }}</div>
  <div>{{ state }}</div>
  <button @click="changeStates">状态变更</button>
</template>
```

**shallowReadonly**

定义：
- 语法：`const xxx = shallowReadonly(obj)`
- readonly的浅层作用形式，只有根层级（第一级属性）变为了只读，嵌套的属性则是可读写的

注意：
- 值为ref的属性不会被自动解包（解包：可以不需要调用.value即可访问该值）

**triggerRef**

定义：
- 调用语法：`triggerRef(shallowRefInstance)`
- shallowRef的深层属性变更后，调用该api，会强制触发相应的watch/watchEffect监听器（即调用该方法后，会让视图层同步更新）

**toRaw**

定义：
- 语法：`toRaw(proxy)`
- 返回响应式对象（reactive、readonly、shallowReactive、shallowReadonly）的原对象，返回值再用对应的api包裹，又会返回响应式对象
- 是一个可用于临时读取而不引起代理访问/跟踪开销，或写入不触发更改的特殊方式，不建议持久引用

**markRaw**

定义：
- 语法：`markRaw(obj)`
- 将对象标记为不可转为代理（proxy），然后返回该对象本身，这一句仅是常规对象和proxy的区别（即isReactive返回值区别），但将值用reactive等包裹后，该对象也是响应性的。

用途：
- 值不应该是响应式的，比如第三方类实例或vue组件对象
- 带有不可变数据源的大型数据时，跳过代理转换可以提高性能

注意：
- 该方法和浅层式api（shallowXxx）可以选择性避开默认的深度响应和只读转换，并在状态关系谱中嵌入原始的非代理的对象。
- markRaw作用的仅是对象的第一层级，然后通过reactive/ref等转为响应式对象后，获取到的是普通对象形式（而非代理形式）。若将markRaw左右的对象作为reactive对象的属性，则reactive对象始终是proxy，reactive对象对应的markRaw属性是普通对象形式。

```typescript
// 嵌套层级的代理对象
const foo = markRaw({
  nested: {}
})

// bar始终是proxy
const bar = reactive({
  // 注意，由于上面被markRaw包裹的对象属性nested并未进行markRaw包裹，所以他是可转为代理对象的
  // 故通过bar.nested访问的内容是一个proxy
  nested: foo.nested,
  // 转成普通对象的形式，通过bar.nestedPure访问的内容则是普通对象
  nestedPure: markRaw(foo.nested)
})
```

**effectScope**

定义：创建一个effect作用域，在该作用域内部可以捕获其中创建的响应式副作用（计算属性和侦听器）

```typescript
// 定义
const scope = effectScope()
// run
scope.run(() => {
  const double = computed(() => counter.value * 2)
  watch(double, () => console.log(double.value))
  watchEffect(() => console.log(double.value))
})

// 处理当前作用域内的所有effect
scope.stop()
```

**getCurrentScope**：获取当前活跃的effect作用域

**onScopeDispose(cb)**：
- 在当前活跃的effect作用域上注册一个处理回调，当相关的effect作用域停止时，则会调用这个回调函数
- 该方法可作为可复用的组合式函数中onUnmounted的替代品，他不与组件耦合，因为每一个setup函数也是在一个effect作用域中调用的

### nextTick用法

更改响应式状态对象后，DOM不会立即更新，而是等到更新周期的下个时机时，将所有状态的更改一次进行更新。

若要访问更新后的状态，可以调用nextTick函数后进行获取。

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



## 组合式API

使用场景：
- 将零散分布的逻辑组合在一起来维护，还可以将单独的功能逻辑拆分成单独的文件
- 将同一个功能所属逻辑抽离到函数组件当中（使用`export default function xxx () {}`的形式），在需要的时候进行导入即可

### 组合式函数

定义：
- 利用vue的组合式api和生命周期钩子封装复用有状态逻辑的函数
- 函数参数可接收ref，和非ref值（unref：将ref变为非ref）
- 通常以`useFn`开头

注意：
- 组合式函数在script setup中需要同步调用，这是为了将生命周期钩子等api注册在当前的组件上
- 组合式函数可随意封装

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

定义：
- 用于描述依赖响应式状态的复杂逻辑
- 会自动追踪响应式依赖，只有它依赖的响应式数据变化时，才会同时更新；反之依赖的响应式数据不变时，或者依赖的是非响应式数据，它永不更新。而方法调用总是会在重渲染时再次执行该方法，当逻辑太过于复杂时，可能会有性能损耗

使用：
- 接收一个getter函数（和选项式computed一致）作为参数，根据函数的返回值返回一个只读的响应式ref，该ref会自动解包，加不加.value都不紧要
- 接收一个具有set和get函数的对象（和选项式computed类似）作为参数，用于创建一个可读写的ref
- 在使用时，修改或获取computed值，和ref变量类似，都是xxx.value的形式
- 在computed中使用props的变量，也需要使用xxx.value形式引用，不然要报错

注意：
- getter函数不应该有副作用：计算属性声明中描述的是如何根据其他值派生一个值，即getter函数内部只做计算和返回计算后的内容。不要在getter中做异步请求或更改dom，这些操作应使用watch
- 避免直接修改计算属性的值：应该视为只读的，即只更新它所依赖的原状态触发计算属性的更新。故而谨慎使用set/get的对象作为参数。


```typescript
import { computed, reactive } from 'vue'

const books = reactive(['科幻', '计算机', '文学'])

// 只读的getter函数作为参数（推荐）
const getValByBooksLength = computed(() => {
  return books.length > 3 ? '展示复杂分类' : '展示简单分类'
})

// 一个含set/get的对象作为参数
const setAndGetValByBooksLength = computed({
  get () {
    return books.length > 3 ? '展示复杂分类' : '展示简单分类'
  },
  set (newVal) {
    if (newVal.includes('复杂')) {
      // 此处不能这样写，视图不刷新，同时报错不能分配给常量，因为books是const
      books = [1, 2, 3]
      // 改为
      // 第一种方式：reactive变量改成ref，然后使用.value的形式修改
      // 第二种方式：reactive变量使用对象的形式，然后用obj.xxx的形式修改
      // 第三种方式：使用不改变原来引用的方式，比如数组的push等
      books.splice(0, books.length, ...[1, 2, 3])
    } else {
      books.splice(0, books.length, ...[1])
    }
  }
})


```

**setup中的生命周期钩子**：这些hooks接受一个回调函数，当钩子被组件调用时，回调函数将被执行
- vue3中，在setup内使用生命周期钩子，需要先进行导入才能够使用

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

![生命周期](https://cn.vuejs.org/assets/lifecycle.16e4c08e.png)

**onMounted**：

定义：
- 注册一个回调函数`onMounted(cb)`，在组件挂载完成后执行
- 在该阶段，vue会自动将回调函数注册到当前正在被初始化的组件实例上，意味着它应当在组件初始化时被 **同步**注册，而非异步的，所以不能在异步函数中调用该钩子

使用：
- 用于需要拿到dom树的时候，比如拿到某个节点信息

**组件已挂载的情况**：
- 所有的同步子组件已被挂载（不包含异步组件和Suspense内的组件）
- 自身dom树已创建完成并插入了父容器中

```vue
<template>
  <div ref="root"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const root = ref(null)

onMounted(() => {
  console.log(root.val, '获取div节点')
})
</script>
```

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

#### defineComponent

定义：
- 用于typescript的类型推导，简化很多编写过程中的类型定义（vue中固有的类型，自定义的类型除外），这样就可以专注于具体业务，而不用书写繁琐的类型定义了

```typescript
// 例如在script标签内，不使用defineComponent
import { Slots } from 'vue'
interface Data {
  [key: string]: unknown;
}
interface ContextType {
  attrs: Data,
  slots: Slots,
  emit: (event: string, ...args: unknown[]) => void
}
export default {
  setup (props: PropsType, context: ContextType): Data {
    return {
      // xxx
    }
  }
}

// 使用defineComponent
import { defineComponent } from 'vue'
export default defineComponent {
  setup (props, context) {
    return {
      // xxx
    }
  }
}

```

### provide和inject

#### 基础用法

定义：
- 无论组件结构层次有多深，父组件都可以作为其所有子孙组件的依赖提供者。此时需要父组件有一个provide选项提供数据，子孙组件使用一个inject选项来接收这些数据
- 要访问组件实例属性，需要定义provide为一个返回对象的函数（和data选项用法一致）
- 要想使provide和inject保持响应性（即provide的变化影响inject值的变化），需要传递一个响应式变量（ref或reactive）或computed给provide的属性，同时响应式变量的变更也应该放在provide中，在使用inject的组件中调用变更函数进行provide的变更

**inject**

- 语法：`const foo = inject('key', default)`
- 若默认值是一个函数，需要添加第三个参数为false

<!-- tabs:start -->

<!-- tab:应用层provide -->
```typescript
import { createApp } from 'vue'

const app = createApp({})

// 应用层提供的数据可以在所有组件中注入
app.provide('注入名', value)
```

<!-- tab:祖孙组件传递 -->

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

<!-- tabs:end -->

#### 在setup中使用

定义：
- 在setup中使用provide和inject时，需要从vue中显式导入provide和inject
- provide方法参数依次为：`name`(string、symbol类型：避免命名冲突)、`value`（任意类型，包括响应式变量：可以和后代组件建立响应式联系）
- inject方法参数依次为：`name`、`默认值`。默认值会在未声明对应的provide时生效，声明之后就展示provide提供的值
- 若provide和inject要保持响应性以同步变更，则需要对provide的值value使用ref或reactive包裹
- 修改provide，应该在提供provide的父组件中去修改，即通过在provide提供一个修改provide变量的方法，然后在子孙组件调用该方法修改。这样能够确保提供状态的声明和变更操作都内聚在同一个组件中，易于维护。
- 若想保持provide的值是可读（即在inject中修改不了），需要用readonly包裹provide的值

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
    // 非setup script中应该在setup函数中调用provide
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
    // 非setup script中应该在setup函数中调用inject
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

### 数据监听

#### watch

语法`watch(source, cb: (value, oldValue, onCleanup) => void, options)`或`watch(source[], cb: (value, oldValue, onCleanup)[] => void, options)`，其中source的值可以是：
- ref变量
- getters，即箭头函数、对象的属性值，返回值应当是`.value`的形式
- 响应式对象，比如reactive
- 前三者的对象组合形式

停止监听：直接调用watch的返回值（是一个函数）就行


```typescript
import { watch } from 'vue'

const watchVal = watch(
  // 要监听的数据源
  source,
  // 监听到变化后要执行的回调函数
  async (newV, oldV,onCleanup) => {
    const { response, cancel } = doAsyncWork(newV)
    // 当source变化时，取消该回调函数之前未完成的内容
    // 然后调用cancel函数
    onCleanup(cancel)

  },
  // 监听选项，比如deep
  options
)

// 停止监听
watchVal()

// 批量监听
watch(
  // 数据源变成了数组
  [source1, source2],
  // 回调函数参数也变成了数组，且对应顺序和数据源一致
  ([newSource1, newSource2], [oldSource1, oldSource2]) => {
    // xxx
  }
)
```

监听选项options：

| 选项 | 类型 | 默认值 | 可选值 | 作用 |
| --- | --- | --- | --- | --- |
| deep | boolean | false | true | false | 是否进行深度监听 |
| immediate | boolean | false | true | false | 是否立即执行监听回调，即是否初始化，首次不需监听值发生变化就执行 |
| flush | string | 'pre' | 'pre' | 'post' | 'sync' | 控制监听回调的调用时机，其中post可以访问更新后的dom，或使用`watchPostEffect`函数 |
| onTrack | (e) => void |  |  | 在数据源被追踪时调用（开发模式有效） |
| onTrigger | (e) => void |  |  | 在监听回调被触发时调用（开发模式有效） |

#### watchEffect


解释：
- 参数直接是一个回调函数，当回调函数内使用到的响应式变量变化时，会直接执行回调函数
- 它仅在同步执行期间才会追踪响应式变量，在异步回调中，只有在第一个await正常工作前访问到的响应式变量才会被追踪

注意：
- 同步的watchEffect会自动停止侦听，而在异步函数内的watchEffect则不会，此时需要调用它的返回值来停止

```typescript
import { watchEffect, watchPostEffect, watchSyncEffect } from 'vue'

// 语法
const unEffect = watchEffect((onCleanup: (cleanupFn: () => void)) => {
  // 停止之前未完成的内容,调用fn
  onCleanup(fn)
}, {
  flush?: 'pre' | 'post' | 'sync',
  onTrack,
  onTrigger
})
// 停止
unEffect()

// 同watchEffect加sync options
watchSyncEffect(() => {
  // xxx
})

// 访问到更新后的dom，同watchEffect加post options
watchPostEffect(() => {
  // xxx
})
```

**watch vs watchEffect**:
- watch能够懒执行，immediate的功劳
- watch更加明确哪个状态触发的变更
- watch可以访问状态变更前的值
- watchEffect会在回调函数内部的响应式依赖变更时，就执行监听
- watchEffect在同步执行过程中，自动追踪所有能访问到的响应式依赖

### template中的ref引用



前景：
- 当需要访问DOM元素/组件时，应当使用ref attribute。该属性允许在一个特定的dom元素/组件实例挂载后，获得对它的直接引用
- 类似vue2中的在script中使用template中定义的ref，例如`<div ref="divRef">`，使用如`this.$refs.divRef`


使用：
- 可以使用`watchEffect`函数侦听ref引用的更新，但是由于ref定义在setup中，此时watchEffect中不能够获取到ref对象，除非在watchEffect第二个参数上定义一个对象`{ flush: 'post' }`

场景：
- 在组件挂载时设置焦点
- 在元素上初始化一个第三方库

注意：
- 在组件上使用ref会造成父子组件更加紧密耦合，如无必要请使用props/emit的方式进行父子组件的交互，只要绝对需要时才使用组件引用
- 使用了script setup的组件默认是私有的，父组件无法访问使用了它的子组件的任何东西，除非子组件通过expose（defineExpose）显式暴露某些内容。

警告:warning:：
- 当ref只是一个静态属性时（即无v-bind），绑定的必须是一个变量，这样才能获取到值
- 当ref是一个动态的属性时（即v-bind:ref），绑定的必须是一个函数，函数参数是绑定的当前元素el，可将el赋值给某变量

与vue2的不同：
- vue3中ref的本质是，将绑定元素赋值给一个变量保存起来，后面需要使用该元素的时候，则通过变量对应的索引或其他可识别的方式进行获取

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

    // 只有在挂载后才能获取到值
    onMounted(() => {
      console.log(divRef.value, 'onMounted')
    })

    // 侦听ref的变更
    watchEffect(() => {
      console.log(divRef.value, 'watchEffect')
      // 侦听时，判断是否挂载，挂载了就会有值
      if (divRef.value) {
        // 做相应的动作
      } else {
        // 此处则未挂载，或元素已被卸载（通过v-if控制的挂载卸载）
      }
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
  // ref和v-for一起使用时，ref包含的值是一个数组，但该数组不与源数组保持相同的顺序
  <ul>
    <li v-for="item in list" ref="itemRefs">{{ item }}</li>
  </ul>
  // ref和v-for一起使用时，ref内容应当是一个函数，然后通过参数将元素的内容赋值到对应的变量中（根据对应规则设置）
  // 其中divs不一定是数组，也可以是一个对象，其ref通过迭代的key或索引被设置（如下面的i）
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
      const itemRefs = ref([])
      // 确保在每次更新之前重置ref
      onBeforeUpdate(() => {
        divs.value = []
      })
      
      return {
        list,
        divs,
        itemRefs
      }
    }
  }
</script>
```
<!-- tabs:end -->

## 组件

组件名格式：（非dom模板中）推荐使用PascalCase的格式，因为：
- 它是合法标识符，在js中导入和注册都很容易，同时有较好的IDE自动补全
- 它在模板中更明显表明它是一个vue组件而非原生元素

全局注册组件：
- `app.component('name', { /* 组件对象或组件实例 */})`
- 上述内容返回app，可链式调用

注意：
- 全局注册的组件若未使用，在生产打包时无法自动移除（tree-shaking），仍然会出现在打包后的js中
- 全局组件在大型项目中会让项目依赖关系不那么明确，和过多的全局变量一样，可能会影响应用长期的可维护性

```typescript
import MyComponent from './MyComponent.vue'

app.component('MyComponent', MyCompopnent)
```

**局部注册组件**：
- 仅在使用时进行导入，script setup导入后直接使用，无需注册（像vue2中的components选项）。非setup script和vue2一样

```vue
<template>
  <ComponentA/>
</template>

<script setup>
import ComponentA from './ComponentA.vue'
</script>
```

**dom模板解析注意事项**：仅在dom中直接写vue模板生效（例如html，引入vue文件后进行使用），在vue单文件组件、内联模板字符串template选项、`<script type="text/x-template>`不需注意，有如下限制：
- 在dom中，使用小写形式
- 在dom中，使用闭合标签，即`</div>`
- 特定元素仅在特定元素内部，比如tr在table内部，若想使用自定义组件替换tr，应使用`<tr is="vue:自定义组件名"></tr>`，在原生元素上is必须加前缀vue才会解析为一个vue组件。

### 动态组件

语法：`<component :is="xxx">`，其中xxx可以是：
- 组件名称
- 被导入的组件对象，含有template的对象

元素位置限制：特定的元素只能在特殊位置显式，比如li只能在ul等、tr只能在table内、option只能在select内，所以在使用动态组件时，应该使用`<table><tr is="vue:compName"></tr></table>`

### 异步组件

defineAsyncComponent：创建一个只有在需要时才会加载的异步组件，
- 可接收一个参数，其类型是返回promise的函数，或一个对象

<!-- tabs:start -->
<!-- tab:基本用法 -->
```typescript
import { defineAsyncComponent } from 'vue'

// 第一种
const AsyncComp = defineAsyncComponent(() => import('./AsyncComponent.vue'))
// 第二种
const AsyncComp =defineAsyncComponent(() => {
  return new Promise((res, rej) => {
    // resolve参数是组件对象
    resolve({})
  })
})

app.component('async-component', AsyncComp)
```
<!-- tab:对象格式参数 -->
```typescript
import { defineAsyncComponent } from 'vue'
import ErrorComponent from './err.vue'
import LoadingComponent from './loading.vue'

// 不带选项的异步组件
const asyncModal = defineAsyncComponent(() => import('./modal.vue'))

// 带选项的异步组件
const asyncModalWithOptions = defineAsyncComponent({
  // 工厂函数
  loader: () => import('./modal.vue'),
  // 加载loadingComponent组件之前的延迟
  delay: 200,
  // 超时时间，超时后加载错误组件
  timeout: 3000,
  // 组件是否可挂起
  suspensible: true,
  // 加载失败时使用的组件
  errorComponent: ErrorComponent,
  // 加载异步组件时要使用的组件
  loadingComponent: LoadingComponent,
  /**
   * error: 错误信息对象
   * retry：函数，指示当promise加载器reject时，加载器是否要重试
   * fail：函数，指示加载程序结束退出
   * attempts：允许最大的重试次数
   */
   onError (error, retry, fail, attempts) {
     if (error.message.match(/fetch/) && attempts <= 3) {
      // 请求错误时重试，最多可重试三次
      retry()
     } else {
      //  retry、fail像promise的resolve、reject一样，必须调用其中一个才能继续错误处理
      fail()
     }
   }
})
```

<!-- tabs:end -->


注意：
- 对于在vue route中的异步组件，使用[懒加载](https://next.router.vuejs.org/guide/advanced/lazy-loading.html)加载路由组件，而不是上面这种方式


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

## 实例property

### $attrs

定义：
- 包含了父作用域中不作为组件props、自定义事件的属性绑定、事件
- 当组件无声明任何prop时，他会包含所有父作用域的绑定，通过`v-bind="$attrs"`传入内部组件
- vue3中的$attrs包含了所有传递给组件的attribute，其中包括class和style

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

## 事件

语法：`v-on:eventName.modifiers="eventHandler"`，其中`v-on:`可简化成`@`

处理器种类分辨：通过检查值是否是合法的js标识符或属性访问路径，若是则是方法，否则是内联
- `foo`, `foo.bar`, `foo['bar']`会被视为方法事件处理器
- `foo()`, `count++`是内联事件处理器

使用：
- 在内联事件处理器中若想访问dom事件对象，可以传入一个特殊的变量`$event`, 或使用内联箭头函数`(event) => xxx`获取event

### 原生事件

**事件修饰符**：
- stop: 阻止事件传播
- prevent: 阻止事件默认行为
- self: 事件目标是元素本身才会触发
- capture: 事件先捕获，在冒泡
- once: 只触发一次
- passive: 事件默认行为将立即执行，一般用于触摸事件改善移动端滚屏性能

注意：
- 可以同时使用多个修饰符
- 使用修饰符时，需要注意调用顺序，修饰符的作用顺序是从左往右的，顺序不一样，效果不一样
- 不要同时使用prevent和passive

**浏览器事件的默认行为**：

定义：没添加该事件，而是在一定条件下浏览器自身触发的事件的行为

默认行为有：
- 点击链接，跳转
- 点击表单提交按钮，触发向服务器提交内容
- 按下鼠标按钮并移动，会选择该段文本
- ......

**按键修饰符**

语法：
- 使用kebab-case形式的[键盘事件暴露的按键名称](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/key/Key_Values)作为修饰符，例如`@keyup.page-down`，仅在按下pagedown这个键时才会触发事件

注意：
- 系统按键修饰符(alt、ctrl、shift、meta)和普通按键修饰符一起使用时，必须处于按下的状态。
- exact修饰符仅能触发当前按键组合触发的事件，多一个组合外的事件都不会触发，比如`@click.exact`无任何按键才触发，`@click.enter.exact`仅在按下enter键才触发

```vue
<template>
  <!-- 内联事件处理器 -->
  <button @click="count++">add 1</button>
  <!-- 方法事件处理器 -->
  <button @click="addOne">add 1</button>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

function addOne () {
  count+=1
}
</script>
```

### 自定义事件

**事件名**：
- 具备自动大小写转换（大小写无关），驼峰与短横线可自动转换
- 在DOM模板中（用template包裹的与script同级的内容），建议使用kebab-case（短横线事件名）
- 自定义事件也支持once修饰符
- 事件名称会自动进行格式转换，比如触发了camelCase形式的事件，可以用kekab-case的形式进行监听


**事件自定义方式**：
- 若emits中事件和原生事件重名，则该事件会代替原生事件
- emits选项支持对象形式语法，可以对触发的事件进行验证（和props类型校验类似），这时emits是一个对象，key是事件名，value是一个函数，函数参数是事件抛出时传递的值，函数返回值代表事件是否合法有效，为false时会抛出一个控制台警告`Invalid event arguments: event validation failed for event "eventname".`
- 可以在template组件模板中（像vue2一样）使用`$emit('eventname', xxx)`直接触发事件

注意：
- 组件触发的事件没有冒泡机制，对于非子组件事件，需使用事件总线或[全局状态管理方案](https://cn.vuejs.org/guide/scaling-up/state-management.html)
- 虽然事件声明使用emits选项或defineEmits定义是可选的，但还是应该完整声明所有要触发的事件，以此作为文档记录组件的用法。同时也能够和透传attributes区分开
- 若原生事件的名字（如click）被定义在emits选项中，则监听器只会监听组件触发的click，而不响应原生的click，否则会监听两次（即组件触发的和原生触发的）

<!-- tabs:start -->
<!-- tab:基础用法 -->
```vue
// emit代指将事件从组件（子）抛出去，让引用它的那个组件（父）接收
<template>
  <!-- 第二步：触发并抛出事件到父组件 -->
  <div @click="$emit('inFocus', '事件参数')"></div>
</template>
<script>
export default {
  // 第一步：事件声明，定义需要抛出的事件列表
  emits: ['inFocus', 'submit'],
  setup (props, { emit }) {
    // 第二步：触发事件可以用函数：
    function clickHandle () {
      emit('inFocus')
    }
  }
}
</script>

<script setup>
// 第一步：事件声明，定义需要抛出的事件列表
// 注意defineEmits不能在子函数内使用，必须放在顶层作用域下
const emit = defintEmits(['inFocus', 'submit'])
// 第二步：触发事件可以用函数：
function clickHandle () {
  emit('inFocus', '事件参数')
}
</script>

<template>
  <!-- 第三步：接收子组件触发的事件并处理 -->
  <SubCom @get-click="('接收事件参数') => { '处理' }"/>
</template>
```
<!-- tab:事件验证 -->
```typescript
export default {
  emits: {
    // 无验证
    click: null,
    // 验证submit事件，其中email是emit第二个参数传递的值
    submit: ({ email }) => {
      if (email) {
        return true
      }
      // 为false会抛出控制台警告，但不影响事件传给父组件
      return false
    }
  }
}
```

<!-- tab:事件触发次数 -->
```vue
<!-- 子组件 -->
<template>
  <button @click="$emit('click', 'sub-val')">触发事件</button>
</template>
<script setup>
// 若定义下面这句，注释掉，则click会触发两次，否则只触发一次
// defineEmits(['click'])
</script>

<!-- 父组件 -->
<template>
  <SubCom @click="handleClick"/>
</template>

<script setup>
function handleClick (arg) {
  // 如果上面的emit定义注释了，则这里会输出两次arg
  // 第一次：'sub-val'（子组件触发的）
  // 第二次：PointerEvent（组件上原生的click）
  
  // 如果上面的emit定义未注释，则只会输出子组件触发的：sub-val
  console.log(arg)

}
</script>
```
<!-- tabs:end -->

### props

定义：
- 使用defineProps定义，参数和vue2类似，这样才知道外部传入的哪些是props，哪些是透传attributes

使用：
- 绑定多个props，使用`v-bind="props"`的形式。，比如`<div v-bind="{id: 'jou', class: 'jade'}"></div>`，和`<div id="jou" class="jade"></div>`寓意相同
- 获取props，可直接使用defineProps结合ref、computed的形式获取
- 在定义时即defineProps内，使用camelCase形式的名字，在使用时即template下的组件上，使用kebab-case形式的名字
- props的类型可以是String、Number、Boolean、Array、Object、Date、Function、Symbol，以及自定义的类或构造函数

注意：
- 所有的props都遵循 **单向绑定**原则，props因父组件的更新而变化，自然的将新状态向下传给子组件，而不会逆向传递，这避免了子组件意外修改父组件状态的情况导致的数据混乱难以理解
- 若想更改props，应该根据该props重新定义一个响应式变量（ref、reactive、computed）去修改
- 子组件能够修改对象或数组的props内的元素，因为这两个是引用传递，不建议这样做，会有很大性能损耗。修改props的最佳方式是子组件用emit抛出一个事件去通知父组件修改
- defineProps中的参数不可访问script setup中的其他变量，因为在编译时整个表达式会被移到外部函数中
- 未传递的boolean类型的props默认值为false，其他类型则是undefined，默认值可通过default进行修改

<!-- tabs:start -->

<!-- tab:props定义 -->
```typescript
// 方式1：字符串数组
const props = defineProps(['title'])

// 方式2：对象形式
const props = defineProps({ title: String })
const props = defineProps({
  title: {
    type: String,
    default (props) {},
    validator(v) {}
  }
})

// 方式3：结合ts使用类型标注，在script setup中
defineProps<{
  title?: string
  likes?: number
}>()

```
<!-- tab:获取props -->
```typescript
const props = defineProps(['title'])

const newProp = ref(props.title)
const newProps = computed(() => props.title)
```

<!-- tabs:end -->

**props校验**：

```vue
<script setup>
import { defineProps } from 'vue'

defineProps({
  // 基础校验，值为undefined和null会跳过校验
  propA: Number,
  // 多种类型可能
  propB: [String, Number],
  // 包含条件的
  propC: {
    type: String,
    required: true,
    default: ''
  },
  propD: {
    type: Object,
    // 对象或数组的默认值，必须从一个工厂函数返回
    // 该函数接收组件所接收到的原始prop作为参数
    default (rawProps) {
      return { msg: 'jade' }
    }
  },
  // 自定义类型校验
  porpE: {
    validator (value) {
      return ['success', 'warning'].includes(value)
    }
  },
  // 函数类型默认值
  propF: {
    type: Function,
    // 和对象/数组不一样，这仅是用来作为默认值的函数
    default () {
      return 'default'
    }
  }

})

</script>
```

### 属性透传

透传属性`$attrs`：即没有在子组件props中声明的属性（v-bind），以及尚未被定义在emits/defineEmits上的监听事件（v-on）

解释：
- 在单根节点中，会自动传递给组件内部的根元素（未直接指明props的情况下），若是class或style，则会自动进行合并；若不想自动继承到单根节点，而是想传递给其他元素，需设置`inheritAttrs:false`（setup script中需要重写一个同级别的script去存它），然后在需要的元素或组件上使用`v-bind="$attrs"`，或者选用部分属性`$attrs.xxx`
  - 当在元素上绑定attrs时，监听器和属性都会作用在该元素上
  - 当在组件上绑定attrs时，监听器和属性会传递给组件内部使用，此时组件内部应该通过props和emit进行获取
- 在多根节点中，必须显式指明需要绑定attrs的元素，否则控制台会发出警告
- 在script中访问透传属性：使用`useAttrs()`内置函数

注意：
- 透传的attributes保留了原始attributes的大小写（即不会进行转换成小写形式），所以原来是怎么样的属性名，就得通过那样的形式去访问，而访问一个对象。但是事件名除外，事件名是onPascalCase的形式

<!-- tabs:start -->

<!-- tab:透传属性基本用法 -->
```vue
<!-- 子组件 -->
<template>
  <!-- 注意，此处是直接通过attrs获取id的，故而在useAttrs中仍然能够访问到id -->
  <button :id="$attrs.id"></button>

  <!-- 此处就不会在访问到id了，如果在props中声明了id -->
  <button :id="props.id"></button>
  <!-- 或不带props -->
  <button :id="id"></button>
</template>

<!-- 选项式中，attrs是setup参数context暴露的一个属性 -->
<script>
export default {
  setup (props, { attrs }) {
    // 虽然这里的attrs对象是最新的透传属性，但不是响应式的内容，无法进行watch监听
    // 所以解决方法：
    // 1. 使用props
    // 2. 在onUpdated生命周期钩子中对attrs的变更去执行相应的操作
  }
}
</script>

<script setup>
import { defineProps, useAttrs } from 'vue'

// 注意，不管有没有将defineProps的返回值赋值给一个变量，都能够直接读取id这个props
const props = defineProps(['id'])

const attrs = useAttrs()
// 若没上面的defineProps，attrs中必定包含id
</script>

<!-- 父组件 -->
<SubCom id="Date.now()"></SubCom>
```

<!-- tab:使用inheritAttrs -->
```vue
<!-- 子组件 -->
<template>
  <div class="wrapper">
    <!-- 第二步：使用无参的v-bind，此时将父组件上所有的属性（包括attribute和事件）都附在了button上 -->
    <button class="btn" v-bind="$attrs">点击</button>
  </div>
</template>

<script>
// 第三步
export default {
  inheritAttrs: false
}
</script>

<!-- 父组件 -->
<template>
  <!-- 第一步：设置传给子组件的属性 -->
  <SubCom class="sub sub2" id="subid"></SubCom>
</template>
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

## ✅vue3新增的内容

### emits选项

改动：
- 若想在组件中抛出父组件传入的事件，必须在`$emits`选项（与setup函数同级）中定义该事件。因为移除了native修饰符，不在`$emits`选项中声明的事件，都会算入到组件的`$attrs`中，默认绑定到组件的根节点

### 片段

即多根组件，此时需要明确传入的内容（比如`$attrs`）定义在哪个节点上

## ⭕vue3与vue2不兼容的内容

> 为了便于管理，该节中将包含兼容的内容。

### v-for中ref的定义

### 异步组件的定义方式

### $attrs

定义：
- 包含了父作用域中不作为组件props、自定义事件的属性绑定、事件
- 当组件无声明任何prop时，他会包含所有父作用域的绑定，通过`v-bind="$attrs"`传入内部组件
- vue3中的$attrs包含了所有传递给组件的attribute，其中包括class和style

### 指令

定义：
- 指令是带有`v-`前缀的特殊的attribute
- 指令的任务是在其表达式的值变化时响应式地更新DOM
- 指令的构成：`v-指令名称:指令参数.指令修饰符1....指令修饰符n="指令值"`

使用：
- 指令可以带参数，参数是指令冒号后面的内容，比如`v-bind:href`中的href就是v-bind的参数
- 指令可以使用动态参数，形式是`v-bind:[dyncAttrbute]="value"`，其中dyncAttribute是一个js表达式，表达式的值应该是一个字符串或null（意为移除该绑定）。动态参数也能够进行对应的简写形式，比如`v-bind:`简写成`:`，`v-on:`简写成`@`，`v-slot:`简写成`#`
- 指令的动态参数表达式中并不支持所有的js表达式语法，比如空格和引号是不合法的，若想传入一个复杂的动态参数，应该使用计算属性替换它。同时，若动态参数是写在html文件（而非vue单文件组件）中时，避免在名称中使用大写字母，因为浏览器会强制转为小写

### 自定义指令

定义：
- 在setup script中，以v开头的变量，可当作自定义指令使用在template中（用v-）
- 在script中的directives钩子中定义属性x，然后可在template中（用v-）使用
- 全局注册，使用`app.directives('name', {})`

解释：
- 当只需要在mounted和updated执行相同的行为时，可使用简化形式，即自定义钩子对象换成`(el, binding) => {}`函数形式即可

改动：
- 修改了一些属性表述，其声明周期钩子和组件的保持类似（更容易记住）；
- 使用`binding.instance`访问组件实例
- 当作用域多根组件（片段）时，自定义组件会被忽略并抛出警告

<!-- tabs:start -->

<!-- tab:自定义钩子对象 -->
```typescript
// 自定义钩子对象
const MyDirective = {
  // 新增
  // el: 绑定的元素
  // binding：一个对象，具有value、oldValue、arg、modifiers、instance、dir属性
  // vnode：绑定元素的底层VNODE
  created (el, binding, vnode, preVnode) {}
  beforeMount () {},
  mounted () {},
  // 新增
  beforeUpdate () {},
  updated () {},
  // 新增
  beforeUnmount () {},
  unMounted () {}
}
```

<!-- tab:使用自定义钩子 -->
```vue
<template>
  <!-- v-指令名：指令参数.修饰符1....修饰符n="值" -->
  <div v-name:arg.modifiers1.modifiers2="value">
</template>
```

<!-- tabs:end -->

### 自定义元素

改动：
- 检测并确定哪些标签会被视为自定义元素，会在模板编译期间执行，它应当通过编译器选项进行配置（比如在`vue-loader`中配置`compilerOptions`选项
- 向内置元素中添加is属性，可以将自定义元素作为自定义内置元素；当将is用于某些元素时，他是将is属性的值传递给元素内部，而不是渲染is属性代表的内容（比如某组件）
- 若想将某些元素解析为is属性代表的vue组件时，需要对is属性值添加一个前缀`vue:`，比如`<tr is="vue:custom-button"></tr>`

``` typescript
// 配置自定义元素
rules: [
  {
    test: /\.vue$/,
    use: 'vue-loader',
    options: {
      compilerOptions: {
        isCustomElement: tag => tag === 'custom-button'
      }
    }
  }
]
```

### data选项

改动：
- data必须是一个返回对象的函数
- 合并来自mixin或extend的多个data返回值时，仅合并根级的属性，若该属性是一个对象时，会对整个对象进行覆盖（后面的覆盖前面的），而非对对象属性进行覆盖

### 函数式组件

改动：
- 函数式组件只能通过具备props和context（slots、attrs、emit）参数的函数创建

### 全局API

改动：
- 通过createApp创建vue实例，通过`createApp(Comp).mount('#app')`挂载app实例
- 移除了config.productionTip，因为大多数工具已经正确配置了生产环境
- config.ignoredElements替换成了config.isCustomElement
- Vue.prototype替换为config.globalProperties，比如创建全局属性api(`createApp().config.globalProperties.$api = () = {}`)
- 移除了Vue.extend，应该始终使用createApp这个全局API挂载组件

### 全局API Treeshaking

改动：
- 对于nextTick的使用，修复导致`undefined is not a function`的错误

```typescript
// 必须显式导入nextTick
import { nextTick } from 'vue'

nextTick(() => {
  // 一些和DOM有关的东西
})
```

### 挂载API模板的变化

改动：
- 当挂在一个具有template的应用时，被渲染的应用会作为目标元素的子元素插入（即替换目标元素的innerHTML，而非目标元素本身）

### 事件API

改动：
- `$on`, `$off`, `$once`都被移除
- 若想实现这些效果，对于根组件事件，可以通过props传递给createApp函数添加到根组件中；对于事件总线可以使用第三方库（比如mitt、tiny-emitter）实现

### 内联模板属性inline-template

改动：
- inline-template属性（目前未使用到，先不管了）是将其内部内容作为模板使用，vue3要使用，必须：
  - 使用script标签，然后将id属性标注(比如`id='my-inline-template'`)，然后在模板中使用：`template: '#my-inline-template'`
  - 使用默认插槽

### key属性

改动：
- 对于v-if、v-else、v-else-if的key不是必须的，会自动生成唯一的key；若向手动指定key，必须每个分支保持唯一
- template v-for上的key应该设置在template上，而非子节点

### 按键修饰符

改动：
- 不支持数字键码作为v-on的修饰符（比如`v-on:keyup.13`），应该使用短横线名称（比如`v-on:keyup.page-down`），这将导致某些字符无法匹配，可以在监听器内部使用event.key代替
- 同时全局配置的keyCodes也不再支持

### 在prop的默认函数default中访问this

改动：
- props的default函数接收原始的prop作为参数传给默认函数，inject可以在默认函数中使用

```typescript
import { inject } from 'vue'
export default {
  props: {
    theme: {
      default (props) {
        // props是传递给组件的，在任何类型默认强制转换之前的原始值
        // xxx

        // 或使用inject访问从上级组件注入的属性
        return inject('theme', 'default-theme')
      }
    }
  }
}
```

### 插槽

解释：
- `<slot>`元素是一个插槽出口，标示父组件提供的插槽内容将在哪里被渲染的地方
- 插槽的内容可以是任意合法的可以在template中展示的内容，比如文本、组件等
- 插槽能够让组件更加灵活和可复用
- 插槽内容能够访问父组件（当前组件）的数据，但无法访问子组件的数据（这时候就要用上作用域插槽了，即给v-slot加上参数和值）
- 作用域插槽的意义在于将子组件的插槽内容的控制权交给父组件

注意：
- 引用作用域插槽使用`this.$slots.header()`的形式，而非`this.$scopedSlots.header`

<!-- tabs:start -->

<!-- tab:插槽用法 -->

```typescript
// 插槽的语法
// 内部
<slot name="header"/>
// 使用
<template v-slot:header></template>
<template #header></template>

// 支持动态插槽，进行动态匹配
<template v-slot:[dyncName]></template>

// 内部
<slot :text="xxx"/>
// 使用
<template v-slot="{text}"></template>

// 内部
<slot name="title" :text="xxx"/>
// 使用
<template #title="{text}"></template>

```

<!-- tab:插槽类型 -->
```vue
<!-- 类型1： 默认插槽 -->
<!-- 定义组件 -->
<template>
  <buton type="submit">
    <slot>
      <!-- 这里是默认内容，当使用组件时，未提供插槽内容时会展示 -->
      submit
    </slot>
  </buton>
</template>

<!-- 使用组件 -->
<template>
  <SubCom/>
  <!-- 或替换默认内容 -->
  <SubCom>
    替换slot的默认内容
  </SubCom>
</template>

<!-- 类型2：具名插槽  -->
<!-- 定义组件 -->
<template>
  <div class="wrapper">
    <header>
      <!-- 带name属性的slot是具名插槽 -->
      <slot name="header"></slot>
    </header>
    <main>
      <!-- 不带的是默认插槽 -->
      <slot></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<!-- 使用组件 -->
<template>
  <SubCom>
    <!-- 使用template加带参数的v-slot属性的方式 -->
    <template v-slot:header>
      <!-- header slot渲染的内容 -->
    </template>
    <!-- 未使用template加带参数的v-slot属性的方式则是默认插槽渲染的内容 -->
    <!-- 默认插槽 -->
    <div>默认插槽</div>

    <template #header></template>

    <!-- 使用插槽时，也可以使用动态参数 -->
    <template #[dyncSlot]>
      <!-- 渲染的内容 -->
    </template>
  </SubCom>
</template>

<script setup>
import { ref } from 'vue'

let dyncSlot = Date.now() % 2 === 0 ? ref('header') : ref('footer')
</script>

<!-- 类型3：作用域插槽 -->
<!-- 定义组件 -->
<template>
  <div>
    <slot :text="greet" :count="1"></slot>
  </div>
  <div>
    <slot name="header" :headername="jade"></slot>
  </div>
</template>

<!-- 使用组件 -->
<template>
  <!-- 默认组件的v-slot可以直接放在组件名上 -->
  <SubCom v-slot="slotProps">
    <!-- 非template的默认就是默认插槽的内容 -->
    {{ slotProps.text }}: {{ slotProps.count }}

    <!-- header插槽：具名作用域插槽 -->
    <template #header="{ headername }">
      <!-- 注意此处不能访问slotProps的内容，因为处于不同的插槽当中 -->
      {{ headername }}
    </template>
  </SubCom>
</template>
```
<!-- tabs:end -->

#### 无渲染组件

定义：
- 一些组件只包括了逻辑，将视图输出（内容的渲染）全权交给了父组件控制，这种类型的组件就是无渲染组件

注意：
- 虽然无渲染组件有趣，但大部分能用无渲染组件实现的功能都能通过高效的组合式API实现，而且还不会产生组件嵌套带来的额外开销

### 过渡的类名修改

改动：使其更加清晰易读
- v-enter改为v-enter-from
- v-leave改为v-leave-from

### v-on:native

v-on:native原用于对原生组件实行监听，现在vue3全面兼容，只需要保证事件写入emits

### v-model

改动：
- v-model的prop和事件名从value和input改为modelValue和update:modelValue
- 可以对v-model增加参数，`v-modle:title="pageTitle"`等同于`:title="pageTitle" @update:title="pageTitle = $event" />`
- 可以传入多个v-model
- v-model支持自定义修饰符

定义：默认情况下，包含input的封装组件中的v-model在简化前使用modelValue作为prop和update:modelValue作为事件。这里的v-model具名参数和vue2中的v-bind和emit类似，只不过这里在父组件中不需要重新写一个函数接收它的值，因为使用v-model进行简化了。

使用：
- 可以通过向v-model传递参数，用于替代默认参数modelValue，即`v-model:title='bookTitle'`中的title，修改title的值bookTitle
- 可以同时传递多个v-model给子组件，不同的v-model将同步到不同的prop
- v-model的内置修饰符有`.trim`, `.number`, `.lazy`，同时还可以给v-model添加自定义修饰符。自定义修饰符（比如`.custom`）在组件的created钩子触发时，`modelModifiers`prop会包含它，且它的值为true，可以通过`this.modelModifiers.custom`访问。**使用自定义修饰符**，就是在触发事件的时候，用`this.modelModifiers.custom`进行相应的操作
- 对于有参数的修饰符（比如`v-model:title.custom`，对应的prop就要改成参数名+'Modifiers'，即上面的modelModifiers改成titleModifiers

<!-- tabs:start -->
<!-- tab:v-model简写 -->
```typescript
// 1. 基础用法1
<My-Input v-model="value"/>
<!-- 等同于下面 -->
<My-Input :modelValue="value" @update:modelValue="val => value = val"></My-Input>

<!-- 子组件 -->
<input :value="modelValue" @input="e => $emit('update:modelValue', e.target.value)"/>

const emit = defineEmits(['update:modelValue'])
// 使用：emit('update:modelValue', modelValue)

const porps = defineProps({
  modelValue: {
    type: String
  },
  // modelValue对应的修饰符对象
  modelValueModifiers: {
    default: () => {}
  }
})

// 1. 基础用法2：使用一个具有getter和setter的computed属性
// 父组件：
<My-Input v-model="modelValue"/>

// 子组件：
<input v-model="value"/>

import { computed } from 'vue'
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const value = computed({
  get () {
    return props.modelValue
  },
  set (val) {
    emit('update:modelValue', val)
  }
})

// 2. 自定义参数名称
<My-Input v-model:title="value">

<!-- 子组件 -->
<input :value="title" @input="e => $emit('update:title', e.target.value)"/>

defineEmits(['update:title'])

const porps = defineProps({
  title: {
    type: String
  },
  // title对应的修饰符对象
  titleModifiers: {
    default: () => {}
  }
})

// 3. 自定义修饰符
<My-Input v-model:title.toUpperCase="value"/>
```

<!-- tab:基本用法 -->
```vue
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
```vue
<template>
  <!-- 父组件将title传递给子组件，修饰符capitalize让title的值首字母大写 -->
  <Child v-model:title.capitalize="bookTitle" v-model:book-desc="bookDesc"></Child>
</template>

<script>
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
</script>
```
<!-- tabs:end -->

**v-model在原生html元素上的对应关系：**

- 文本类型的input和textarea会绑定**value**属性并监听input事件
- radio和checkbox类型的input会绑定**checked**属性并监听change事件
- select会绑定**value**属性并监听change事件

注意：
- 在表单元素上，**v-model**会忽略对应元素的初始值，比如value、checked、selected的某个值，而是将绑定的js状态作为数据的正确来源。
- 若想在拼写阶段也触发更新，则应该使用value+input，而非v-model
- 初始值和选项不匹配时，iOS上的select元素使用v-model时可能会导致选不了第一项的问题，建议提供一个禁用的默认选项。
- 在使用了v-model的textarea中不支持双大括号插值表达式，因为v-model就代表了它的值
- 在radio、checkbox、select元素中，v-model绑定的是静态字符串/布尔值，因为v-model绑定的是元素的value或者是checked。若想将值绑定动态数据（可以是非字符串类型），应使用v-bind:value实现

**作用在v-model上的修饰符**

`.lazy`：在change事件后更新v-model绑定的数据，默认情况是在input事件后更新。

`.number`：使用parseFloat函数处理v-model绑定的值，若返回非数字，则不进行任何处理。

`.trim`：自动去除v-model绑定的值首尾空格。

**去除字符串的空格**：

去除首尾空格：
- `string.trim()`
- `string.replace(/^\s+|\s+$/g, '')`

去除所有空格：
- `string.replace(/\s+/g, '')`

**change事件和input事件：**

change事件：在元素更改完成时（对于文本输入框，即在**失去焦点**时；对于其他元素：select、checkbox/radio input，即在选项更改时）触发。

input事件：只要值修改，就会触发，比如键盘输入，鼠标粘贴，语音输入等。无法使用event.preventDefault()阻止默认事件，太迟了。

**可编辑元素：contenteditable**：

contenteditable：content + edit + able

定义：
- 该属性是一个全局的枚举属性，表示元素是否可被用户编辑。
- 该属性可被元素继承

属性的值：
- true、''、无属性值：表示元素是可编辑的
- false：表示元素不是可编辑的

用途：
- 能够自适应内容的高度，而非像textarea那样出现一个滚动条。
- 能够插入图片，链接，视频，而非仅是文本内容
- 仅支持文本内容，可将值设置为`plaintext-only`


### v-once

语法：`<div v-once>...</div>`

作用：
- 仅渲染元素/组件一次，跳过之后的更新，即使内部引用的内容发生变更

### v-memo

语法：`<div v-memo="[xxx, xxx, ....]">`，当传入空数组时，作用与v-once一致，表示只渲染一次

作用：
- 用于缓存一个模板的子树，在原生标签或组件标签上均可使用
- 实现缓存的原理是，传入一个固定长度的依赖值数组，比较这个数组的项的值与最后一次渲染的值是否发生变化，若变化了则重新渲染该元素下的结构，否则跳过渲染，即使元素内部使用的变量已经发生变更（这时展示的还是之前的值）

### v-cloak

语法：
```javascript
// template
<div v-cloak>{{ message }}</div>
// style
[v-cloak] { display: none; }
```

作用：
- 用于隐藏尚未完成编译的DOM模板，即隐藏代码内容（比如还未编译时的内容`{{ message}}`，用户能看到该代码），当编译完成后，就展示编译后message的值

### v-for

- vue按照就地更新策略更新v-for渲染的元素列表，当元素顺序改变时，不会随之移动dom元素的顺序，仅仅是绑定的值发生变化。推荐使用key attribute跟踪每个节点，从而在元素改变时重用重排现有的元素
- 可以直接在组件上使用v-for，由于组件有独立的作用域，v-for的数据不会自动传递给组件，这时需要定义额外的props，将其传入组件内部当中

```vue
<template>
  <!-- 基本用法 -->
  <div v-for="(item, index) in items">
    {{ item.message }}, {{ index }}
  </div>

  <!-- 解构用法 -->
  <div v-for="({ message }, index) in items">
    {{ message }}, {{ index }}
  </div>

  <!-- 使用of替代in用法，更接近js迭代器语法 -->
  <div v-for="item of items">
    {{ item.message }}
  </div>

  <!-- 遍历对象 -->
  <div v-for="(value, key, index) in person">
    {{ key }}: {{ value }}: {{ index }}
  </div>

  <!-- 遍历范围：从1...n -->
  <div v-for="n in 10">{{ n }}</div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const items = ref([
  { message: 'foo' },
  { message: 'bar' }
])

const person = reactive({
  name: 'jade',
  age: 27,
  sex: 'man'
})
</script>
```

### v-if和v-for优先级问题

改动：
- 当两者作用于同一个元素时，v-if的优先级比v-for高

### v-bind

#### 基础知识

- class和style都是attribute，可以和其他普通attribute一样使用v-bind将它们和字符串进行绑定。在复杂的逻辑时，vue为它们提供了特殊的功能增强（对象和数组形式）
- 若某组件只有一个根元素，当使用该组件时携带了class，将会合并到组件内部的根元素上
- 当组件有多个根元素，携带的class不会自动添加到根元素上，应该在组件内部的需要传过来的class的根元素上通过`$attrs`(template)、`useAttrs()`(script)显式接收传过来的class，使用`:class="$attrs.class"`(注意：这里接收过来的是字符串形式)。
- 动态绑定多个值：通过不带参数的v-bind，可以将包含多个attribute的对象绑定到单个元素上，比如`<div v-bind="{id: 'jou', class: 'jade'}"></div>`，和`<div id="jou" class="jade"></div>`寓意相同
- v-bind合并行为： 若同时定义了`v-bind="{ id: red }" id="blue"`这两个相同的不同表示法，声明的顺序决定了最后渲染谁，上面的由于id在后，所以渲染为`id="blue"`，替换下顺序，就渲染成不同的内容

#### class类绑定

```vue
<template>
  <!-- 第一种：绑定对象 -->
  <!-- 根据isActive变量是否展示active，下同 -->
  <!-- 使用ref作为对象的属性，也可使用计算属性computed -->
  <div :class="{ 
    active: isActive,
    'text-danger': hasError,
    'active-no-error': activeNoError
  }"></div>
  <!-- 使用reactive一步到位 -->
  <div :class="classObject"></div>

  <!-- 第二种：绑定数组 -->
  <!-- 变量作为数组元素，同时对象形式的class也可作为数组元素，同时还可以是三元表达式 -->
  <div :class="[
    activeClass,
    errorClass,
    { 'other-active': isActive },
    isActive && !hasError ? 'active-no-error' : ''
  ]"></div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const isActive = ref(true)
const hasError = ref(false)

const activeClass = ref('active')
const errorClass = ref('text-danger')

const activeNoError = computed(() => {
  return isActive && !hasError
})

const classObject = reactive({
  active: true,
  hasError: false
})
</script>
```

#### style样式绑定

- 当在`:style`中使用了需要特殊浏览器前缀的css属性时，vue会自动添加前缀
- 可以对一个样式属性提供多个不同前缀的值，数组仅会渲染浏览器支持的最后一个值，比如`:style="{display: ['-webkit-box', '-ms-flexbox', 'flex']}"`，在支持不需要特殊前缀的浏览器中都会渲染成flex

```vue
<template>
  <!-- 第一种：使用对象形式 -->
  <!-- 使用ref、计算属性作为对象属性 -->
  <div :style="{
    color: activeColor,
    // 支持camelCase语法
    fontSize: fontSize + 'px'
    // 也支持kebab-cased语法
    'background-color': backgroundColor
  }">
  </div>
  <!-- 使用reactive一步到位 -->
  <div :style="styleObject"></div>

  <!-- 第二种：使用对象数组形式 -->
  <div :style="[styleObject]"></div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const activeColor = ref('red')
const fontSize = ref(18)
const backgroundColor = ref('#fff')

const styleObject = reactive({
  color: 'red',
  fontSize: '18px',
  backgroundColor: '#fff'
})
</script>
```

### VNode生命周期事件

通过事件监听组件生命周期，以前缀`vnode-`开头，并跟随相应的生命周期钩子的名字，比如`vnode-updated`

### 侦听数组

- vue能够侦听响应式数组的变更方法（push,pop,unshift,shift,splice,sort,reverse），在这些方法调用时会触发相关的更新

改变：
- 当使用watch选项侦听数组时，只有当数组被替换时才会触发回调
- 若想在数组元素改动就触发回调，需要指定deep选项

## ❌vue3中移除的内容

### $children

在vue3中，若想访问子组件的实例，建议使用$refs

### filters选项

对于filters选项，建议使用方法调用或者计算属性代替；对于全局注册的filters，可以通过全局属性（例如：`create(App).config.globalProperties.$filters`）代替

### $listeners

该属性已移除，事件监听器是$attrs的一部分

### propsData

该选项用于在创建vue实例的过程中传入prop，现在想在根组件传入prop，应该使用createApp的第二个参数（一个对象的属性）传入