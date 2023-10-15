# vue3保点

> 参考文档：      
> vuejs官方迁移文档（旧）       
> https://vue3.chengpeiquan.com/component.html#%E7%94%A8%E6%B3%95%E4%B8%8A%E7%9A%84%E5%8F%98%E5%8C%96

## 准备

> 若项目出现问题，时刻注意依赖间版本兼容的问题
>
> 未读内容：进阶主题-深入响应式系统后面的

## 全局注意

注意事项：
- vue的某些api，只能在顶层作用域调用，不然可能会出现异常

## 安装

安装方式：
- 通过vite：`npm init vite project-name -- --template vue`或者`yarn create vite project-name --template vue`
- 通过vue-cli：`npm install -g @vue/cli`或`yarn global add @vue/cli`，然后`vue create project-name`

**vue2和vue3共存**：需要非全局下载vue-cli(Vue2)和@vue/cli(vue3)，然后分别在对应目录下找到例如`D:\vue-version-cache\node_modules\.bin\vue`的文件
- 然后使用该文件绝对路径进行创建即可
- 或者将vue文件对应的.bin目录存放到全局环境变量path中，然后对vue文件和vuecmd文件改成vue2或vue3即可。后面就能够直接在命令行中使用vue2和vue3进行项目创建

注意：
- 防止代码出现警告：从vue2迁移到vue3后，需要安装valor插件，同时工作区需要禁用vetur插件

**Typescript环境支持**：

配置tsconfig.json：
- `compilerOptions.isolatedModules`应为true，因为vite使用esbuild来转译ts并受限于单文件转译的限制
- 若使用选项式API，需要将`compilerOptions.strict`或`compilerOptions.noImplicitThis`设为true，才能获得对组件选项中this的类型检查，否则this类型为any
- 若配置了路径解析别名resolve.alias，需要在`compilerOptions.paths`选项重新配置一遍

vscode插件：
- typescript vue plugin
- volar

注意：
- 为了让vue单文件组件和ts一起工作，同时普通的ts由vscode内置的ts语言服务处理，应该开启Volar的Takeover模式，即在当前的工作空间禁用typescript and JavaScript language features，然后重新启动vscode

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

```typescript
// 使用InstanceType定义组件的类型
import Child from './child.vue'
import {ElImage} from 'element-plus'

type ElImageCtx = InstanceType<typeof ElImage>;
type ChildCtx = InstanceType<typeof Child>;

let childRef = ref<ElImageCtx | null>(null)
```

在组件中使用：
- `<input ref="input"/>`结合`const input = ref(null)`一起使用
- `<input :ref="el => {// 组件每次更新都会被调用，用于元素赋值}"/>`
- ref也可直接作用在组件上，用于调用子组件expose（即`defineExpose({})`导出的）暴露的方法（只在使用了script setup时）

定义：
- 创建一个响应式的引用，然后可以在任何地方起作用（通过value属性访问）
- 它接收一个参数并将其包裹在一个带有value属性的对象中，使用时需要从vue中导入
- 在任何值（不管是值还是引用，未使用类似ref的函数，则不是响应式变量）周围都有一个封装对象，这样就可以在整个应用中安全传递，不用担心在某地方失去它的响应性
- 将值封装在对象中，是为了保持JavaScript不同数据类型（值类型、引用类型）的行为统一

ref解包（即不需要使用.value进行访问）：
- 定义：当ref变量直接作为setup函数返回对象（注：非setup环境，而在setup环境中，作为一个顶级变量时）的第一级属性时，在模板template中访问会自动浅层次解包它内部的值，即可不带.value直接访问到；
- 
- 在访问非第一级ref属性时需要加上.value，若不想访问实际的对象实例（即通过.value的形式访问，可以将这个ref属性变量用reactive包裹起来，后续就能够直接访问（不需加.value）了；或者是直接解构该对象，得到一个顶层的响应式对象；仅包含一个文本插值（用`{{}}`表示）而无相关运算时（比如`pureObj.refValue`）也会被自动解包，相当于`pureObj.refValue.value`
- 若ref变量作为响应式对象reactive的属性，当他被访问或被修改后，会自动解包他的内部值（即不需要通过.value的形式访问）。同时ref变量和响应式对象reactive的属性是互相影响的（引用地址相同），当属性重新赋值之后，他们就互不相关了（修改不会影响对方）。只有当嵌套在深层响应式对象内才会进行解包，在浅层响应式对象shallowXxx中不会。
- ref解包仅发生在响应式对象reactive（类型为普通Object对象）嵌套（ref作为属性）的时候，当ref变量作为其他原生集合类型Map或Array的属性或元素时，不会进行解包，这时仍然要通过.value进行访问

注意：
- ref被传递给函数或从一般对象上（作为其属性）被解构时，不会丢失响应性

::: code-group

```vue [typescript用法]
<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'

// 若未声明类型，会根据初始化的值自动推导
// Ref<number>
const year = ref(2023)

// 指定类型：使用Ref
const year2: Ref<string | number> = ref('2023')

// 指定类型：使用泛型参数
const year3 = ref<string | number>('2023')

// 若指定了泛型参数未指定初始值：则最终类型将是一个包含undefined的联合类型: Ref<number | undefined>
const year4 = ref<number>()
</script>
```

:::

**reactive**：

定义：
- 语法：`const xxx = reactive(obj)`
- 该api返回一个响应式的对象状态，这个响应式转换是深度转换成代理对象的，会影响传递对象的所有嵌套的属性。即能够检测到深层次的对象或数组的（新增，修改，删除，替换值）改动
- 为保证访问代理的一致性，对同一个原始对象调用reactive总是会返回同一个代理对象，而对已存在的代理对象调用reactive则返回该代理对象本身
- 其中data选项返回一个对象时，在内部是交由reactive函数使其转为响应式对象（选项式语法）

注意：
- reactive仅对对象（对象、数组、map、set等）类型有效，对原始类型（string、number等）无效
- 对响应式对象重新赋值后，将丢失初始引用的响应性连接。也意味着将响应式对象的**属性**赋值给其他变量、进行属性解构、将属性传入一个函数时，将会失去响应性，即修改这三个条件对应的内容时，响应式对象不会同步变更

::: code-group

```vue [基础用法]
<script setup lang="ts">
import { reactive } from 'vue'

// 自动推导：{ title: string }
const book = reactive({ title: 'vue3' })

// 显式标注：使用接口的形式
// 注意：和ref不同的是，不推荐使用泛型参数的形式，因为在处理了深层次ref解包的返回值和泛型参数的类型不同
interface Book {
  title: string
  year?: number
}

const book2: Book = reactive({ title: 'vue3' })
</script>
```

```typescript [失去响应性的三种方式]
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

:::

响应式状态解构：
- 当想使用一个响应式对象的多个属性的时候，可通过对象解构获取内部的一些属性，若想使得解构后的属性变量与原响应式对象相关联（变化同步发生），必须对这个响应式对象用toRefs函数包裹后解构，否则引用关联会失效（改变一个，另一个不发生变化）

只读的响应式对象：
- 通过readonly函数包裹该响应式对象后，修改该对象将报错

**readonly**:

定义：
- 语法：`const xxx = readonly(obj)`
- 接受一个对象（响应式/普通的），或者一个ref，返回一个原值的只读代理（深层只读代理，所有属性（包括嵌套属性）都不可修改）
- 其返回值可以解包（和reactive类似），但是解包后的值是一个只读的

**toRef**：

定义：
- 基于响应式对象的一个属性，创建一个对应的ref，这个ref会和源属性保持同步，两个互相影响同步更改。
- 将值、refs（包括reactive等）、getters规范化为refs（3.3+）

语法：

```typescript
/* 对象属性签名 */
const person = reactive({
  name: 'jade',
  age: 27
})

// 双向ref，会与源属性同步
const nameRef = toRef(person, 'name')

// 若第二个参数，不存在于对象属性中，则会传教一个属性，值为undefined，这个也是双向的
const unexistRef = toRef(person, 'sex')

/* 规范化签名(3.3+) */

// 按原样返回现有的ref
const name = ref('jade')
const nameAlias = toRef(name)

// 注意，reactive也是ref，故同上
const personAlias = toRef(person)

// 创建一个只读的ref，当访问.value时会调用此getter函数
const foo = toRef(() => props.foo)

// 从非函数的值中创建普通的ref，等同于ref(1)
const ref1 = toRef(1)
```


**toRefs**：

定义：
- 将一个响应式对象转换为一个普通对象，普通对象的每个属性都是指向源对象相应的**ref**。每个单独的ref都是使用toRef创建的
- 用途是解构/展开返回的对象时不会失去响应性

```typescript
const person = reactive({
  name: 'jade',
  age: 27
})

// 调用属性需要加上.value：personRefs.name.value
const personRefs = toRefs(person)
// 直接解构，直接调用：name
const { name } = toRefs(person)
```

**toValue**:

定义：将值、refs、getters转为非响应性值，若参数是一个getter，它将会被调用并返回它的返回值

```typescript
import type { MaybeRefOrGetter } from 'vue'

function useFeature(id: MaybeRefOrGetter<number>)  {
  watch(() => toValue(id), id => {
    // 处理id变更
  })
}

useFeature(1)
useFeature(ref(1))
useFeature(() => 1)
```

**isRef**:

定义：检查参数是否是一个ref值，返回一个类型判定（即返回值可用作类型守卫，可收窄为具体某一类型，比如放在if中）

**isProxy**:

定义：检查对象是否是由reactive、readonly、shallowReactive、shallowReadonly创建的代理，返回boolean

**isReactive**：

定义：检查对象是否是由reactive、shallowReactive创建的代理，返回boolean

**isReadonly**:

定义：检查对象是否是由readonly、shallowReadonly创建的代理，返回boolean

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
- shallowRef的深层属性变更后，调用该api，会强制触发相应的watch/watchEffect监听器（即调用该方法后，会让视图层同步更新），注：正常未调用情况下，视图是不会同步刷新的

**customRef**：**自定义Ref**

定义：创建一个自定义ref，显式声明 对其依赖追踪 和 更新触发 的 控制方式

使用：
- 接收一个工厂函数作为参数，该函数接受track、trigger两个函数作为参数，返回一个带有get、set的对象
- 一般来说，track函数应该在get中被调用，trigger应该在set中调用。事实上何时调用、是否调用你都有控制权

::: code-group

```typescript [防抖ref]
// 创建一个防抖ref，只在最近一次set调用后的一段固定时间间隔后再调用
import { customRef } from 'vue'

export function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get () {
        // 必须，track方法放在get中，用于提示这个数据是需要追踪变化的
        track()
        return value
      },
      set (newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          // 在设置值之后，必须调用该方法触发事件，告诉vue触发页面更新
          trigger()
        }, delay)
      }
    }
  })
}
```

```vue [防抖ref]
<!-- 使用useDebouncedRef -->
<script setup>
import { useDebouncedRef } from './debouncedRef'

const text = useDebouncedRef('hello')
</script>

<template>
  <!-- 当在输入框改变text的值时，会触发customRef回调函数的set方法 -->
  <input v-model="text"/>
  <p>
    展示：{{ text }}
  </p>
</template>
```

```typescript [异步请求Ref]
import { customRef } from 'vue'

export default function fetchRef (value) {
  return customRef((track, trigger) => {
    let ans
    // 存储获取的数据
    function getAns () {
      fetch(value).then(res => {
        return res.json()
      }).then(data => {
        console.log(data)
        // 存储数据
        ans = data
        // 触发视图层变更
        trigger()
      }).catch(err => {
        console.log(err)
      })
    }

    // 初始化调用
    getAns()

    return {
      get () {
        track()
        return ans
      },
      set (newVal) {
        // 当值变化时，调用getAns进行刷新
        value = newValue
        // 点击调用
        getAns()
      }
    }
  })
}
```

```vue [异步请求Ref]
<script setup>
import fetchRef from './fetchRef'

const obj = fetchRef('./data1.json')

function getNewObj () {
  // 改变自定义ref的值，就和ref一样的用法
  obj.value = './data2.json'
}
</script>

<template>
  <ul>
    <li v-for="item in obj" :key="item.id">
      {{ item.id }} - {{ item.name }}
    </li>
    <button @click="getNewObj">重新获取数据</button>
  </ul>
</template>
```

:::

**toRaw**

定义：
- 语法：`toRaw(proxy)`
- 返回响应式对象（reactive、readonly、shallowReactive、shallowReadonly）的原对象，返回值再用对应的api包裹，又会返回响应式对象
- 是一个可用于临时读取而不引起代理访问/跟踪开销，或写入不触发更改的特殊方式，不建议持久引用

**markRaw**

定义：
- 语法：`markRaw(obj)`
- 将对象标记为不可转为代理（proxy），然后返回该对象本身，这一句仅是常规对象和proxy的区别（即isReactive返回值区别）

用途：
- 值不应该是响应式的，比如第三方类实例或vue组件对象
- 带有不可变数据源的大型数据时，跳过代理转换可以提高性能

注意：
- 该方法和浅层式api（shallowXxx）可以选择性避开默认的深度响应和只读转换，并在状态关系谱中嵌入原始的非代理的对象。
- markRaw作用的仅是对象的第一层级，然后通过reactive/ref等转为响应式对象后，获取到的是普通对象形式（而非代理形式）。若将markRaw左右的对象作为reactive对象的属性，则reactive对象始终是proxy，reactive对象对应的markRaw属性是普通对象形式。

```typescript
// 嵌套层级的代理对象
const foo = markRaw({
  nested: {
    a: 1
  }
})

// bar始终是proxy
const bar = reactive({
  // 注意，由于上面被markRaw包裹的对象属性nested并未进行markRaw包裹，所以他是可转为代理对象的
  // 故通过bar.nested访问的内容是一个proxy
  nested: foo.nested,
  // 转成普通对象的形式，通过bar.nestedPure访问的内容则是普通对象
  nestedPure: markRaw(foo.nested)
})

// 注意：bar的一级属性始终是可以修改的（因为bar是proxy），修改他们会同步视图刷新
bar.nested = markRaw({a: Date.now()})

// 注意：被markRaw包裹的属性内部的值是不可修改的，因为修改后不会同步刷新
bar.nested.a = Date.now()   // 视图不会变化

// 由上述可引申出：若对象是响应式数据(proxy)，则属性修改后视图同步刷新，若对象是普通对象，则属性修改后视图不刷新
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

```typescript
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

定义：
- 组合式API是一系列API的集合，从而可以使用函数而非声明式选项书写vue组件，它涵盖了下列api：响应式api、生命周期钩子、依赖注入
- 组合式api不是函数式编程（数据不可变），而是以vue中数据可变的、细粒度的响应性系统为基础的

场景：
- 更好的逻辑复用、更灵活的代码组织：将零散分布的逻辑组合在一起来维护，还可以将单独的功能逻辑拆分成单独的文件；将同一个功能所属逻辑抽离到函数组件当中（使用`export default function xxx () {}`的形式），在需要的时候进行导入即可
- 更好的类型推导：支持ts
- 更小的生产包体积

### 组合式函数

定义：
- 利用vue的组合式api和生命周期钩子封装复用有状态逻辑的函数
- 函数参数可接收ref，和非ref值（unref：将ref变为非ref）
- 组合式函数采用`usePascalCase`的形式命名
- 组合式函数不仅是为了复用，也能让代码组织更加清晰。能够基于逻辑问题将组件代码拆分成更小的功能函数

注意：
- 组合式函数在`script setup`/`setup()`中应始终被同步调用，在某些场景下也可以在onMounted这些生命周期钩子中调用，这是为了让vue能够确定当前正在被执行的到底是哪个实例，只有确定了当前组件实例，才能：将生命周期钩子等api注册在当前的组件上，将计算属性和监听器注册到当前组件上，以便在组件卸载时停止监听，避免内存泄露
- script setup是唯一在调用await之后仍可调用组合式函数的地方，编译器会在异步操作之后自动恢复当前组件实例
- 组合式函数可接收一般变量和响应式变量（例如ref，可对响应式变量进行监听追踪）作为参数。最好在处理参数时对两者进行兼容，即处理响应式变量时，使用unref函数获取变量的值（响应式变量返回.value，否则原样返回）；同时若操作会根据响应式变量变化而变化，应该使用watch监听响应式变量，或者在watchEffect中调用unref解构响应式变量追踪其变化
- 推荐在组合式函数中始终返回一个包含多个ref的普通非响应式对象（即组合式函数返回`{ a: ref(xx), b: ref(xx) }`），这样在对象被解构时，对象属性仍能保持响应性，因为返回一个响应式对象在对象解构时会丢失和组合式函数内状态的响应性连接。若希望以对象属性的方式使用组合式函数中返回的状态，可以在调用组合式函数的时候使用reactive进行包裹（例如`reactive(useFn())`）
- 在组合式函数中执行相关操作时，应当在正确的生命周期中访问（比如访问dom，应该在挂载之后，即onMounted钩子中）；同时确保在onUnmounted中清除带来的某些操作（比如事件监听器）。
- 每一个调用组合式函数的组件实例会创建其独有的状态拷贝，组件实例之间不会互相影响。若想在组件中共享状态，可使用状态管理相关的知识点。
- 组合式函数可随意封装

::: code-group

```typescript [普通的组合函数]
// useEventListener()
import { onMounted, onBeforeUnmount } from 'vue'

export function useEventListener (target, event, callback) {
  onMounted(() => target.addEventListener(event, callback))
  onBeforeUnmount(() => target.removeEventListener(event, callback))
}
```

```typescript [普通的组合函数]
// useMouse()
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse () {
  const x = ref(0)
  const y = ref(0)

  // 组合式函数中使用其他组合式函数
  useEventListener(window, 'mousemove', event => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```

```vue [普通的组合函数]
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>
  鼠标坐标：{{ x }}: {{ y }}
</template>
```

```typescript [异步状态的组合函数]
import { ref, isRef, unref, watchEffect } from 'vue'

export function useFetch (url) {
  const data = ref(null)
  const error = ref(null)

  async function doFetch () {
    // 请求前重置状态
    data.value = null
    error.value = null

    const urlValue = unref(url)

    try {
      // 人为模拟状态失败与否
      await timeout()

      const res = await fetch(urlValue)
      data.value = await res.json()
    } catch (e) {
      error.value = e
    }
  }

  // 判断是否是响应式变量，是的话监听它的变化
  if (isRef(url)) {
    watchEffect(doFetch)
  } else {
    doFetch()
  }

  // 返回属性是ref的普通对象
  return { data, error, retry: doFetch }
}

function timeout () {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        res()
      } else {
        rej(new Error('错误'))
      }
    }, 300)
  })
}
```

```vue [异步状态的组合函数]
<script setup>
import { ref, computed } from 'vue'
import { useFetch } from './useFetch'

const baseUrl = 'https://xxx.xxx.com/'
const id = ref('1')
const url = computed(() => baseUrl + id.value)

const { data, error, entry } = useFetch(url)
</script>

<template>
  <button v-for="i in 5" @click="id = i">{{ i }}</button>
  <div v-if="error">
    <p>错误信息：{{error.message}}</p>
    <button @click="entry">重试</button>
  </div>
  <div v-else-if="data">当前数据：{{data}}</div>
  <div v-else>加载中...</div>
</template>
```

```vue [在选项式中使用组合式函数]
<script>
import { useMouse } from './mouse'
import { useFetch } from './fetch'

export default {
  setup () {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    // 必须在return中返回，否则通过this读取不到
    return { x, y, data, error }
  },
  mounted () {
    console.log(this.x)
  }
}
</script>
```

```typescript [组合式按时抽离]
// 调用多个组合式函数
import { useA } from './useA'
import { useB } from './useB'
import { useC } from './useC'

const { foo, bar } = useA()
const { baz } = useB(foo)
const { qux } = useC(baz)
```

:::

**组合式函数 vs 其他模式**：
- mixin的短板：不清晰的数据来源、命名空间冲突、隐式跨mixin交流
- 无渲染组件：会有额外的组件嵌套的性能开销。推荐纯逻辑复用用组合式函数，复用逻辑和视图布局时用无渲染组件（插槽组件）
- react hooks：会在组件每次更新时重新调用，带来以下问题：
  - hooks有严格的调用顺序，不可写在条件分支上
  - react组件定义的变量会被钩子函数闭包捕获，若传递了错误的依赖数组，将会变得过期
  - 昂贵的计算需要使用useMemo
  - 很难推理出钩子代码运行时机，不好处理需要在多次渲染间保持引用（通过useRef）的可变状态
- 组合式api：
  - 仅调用setup一次，不需担心闭包问题，不限制调用顺序，可进行条件调用
  - 响应性系统运行时会自动收集computed和watch的依赖（无需手动）
  - 无需手动缓存回调函数来避免不必要的组件更新

### 🛑setup组件选项

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

::: code-group
```typescript [setup第一个参数props]
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
```typescript [setup第二个参数context]
setup(props, { attrs, slots, emit, expose }) {
  // attribute, 非响应式对象，等同于$attrs
  console.log(attrs)
  // 插槽，非响应式对象，等同于$slots
  console.log(slots)
  // 触发事件，方法，等同于$emit
  console.log(emit)
  // 暴露公共的函数
  console.log(expose)
  expose({
    // 暴露的属性
  })
}
```
:::

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


::: code-group

```typescript [基础用法]
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

```vue [typescript类型定义]
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)

// 自动推导：ComputedRef<number>
const double = computed(() => count.value * 2)

// 泛型参数：
const double = computed<number>(() => count.value * 2)
</script>
```
:::

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

**onBeforeMount**

定义：注册一个回调函数，在组件挂载前调用的

使用：
- 该钩子被调用时，组件已经完成了其响应式状态的设置，但还未创建dom节点。它即将首次执行dom渲染过程

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
const root2 = ref<HTMLDivElement | null>(null)

onMounted(() => {
  console.log(root.val, '获取div节点')
})
</script>
```

**onBeforeUpdated**

作用：注册一个函数，在组件即将因为响应式变更而更新dom之前被调用的

使用：
- 用来在更新dom之前访问dom状态，可用于更改状态

**onUpdated**

定义：
- 注册一个回调函数，在组件因为响应式状态变更而更新其DOM树后进行调用的

使用：
- 父组件的onUpdated将在其子组件的onUpdated之后调用
- 该钩子会在组件的任意DOM更新后调用，若想在某个特定状态更改后访问更新后的dom，也可使用nextTick
- 不要在该钩子中更改组件状态，可能会导致无限更新循环

**onBeforeUnmount**

定义：注册一个回调，在组件实例卸载前调用，调用时组件实例保留着全部功能

**onUnmounted**

定义：
- 注册一个回调函数，在组件实例卸载之后调用的

使用：
- 组件已卸载情形：所有子组件都已经被卸载；所有相关的响应式作用（computed、watch等）都已经停止
- 该钩子用于清理一些副作用（计时器、监听器、服务器连接）

**onErrorCaptured**

定义：注册一个回调，在捕获了后代组件传递的错误时调用

使用：
- 错误源有：组件渲染、事件处理器、生命周期钩子、setup函数、侦听器、自定义指令钩子、过渡钩子
- 回调函数参数：错误对象err、触发错误的组件实例instance、错误来源说明info

**onActivated**

定义：注册一个回调，若组件实例 是keepalive缓存树的一部分，当组件被插入到dom中时被调用

**onDeactivated**

定义：注册一个回调，若组件实例 是keepalive缓存树的一部分，当组件从dom中被移除时调用

**onServerPrefetch**

定义：注册一个回调，组件实例在服务器上被渲染之前调用（ssr only）

使用：
- 若回调返回要给promise，则服务器渲染会在渲染该组件前等待promise完成
- 用于执行仅存在于服务器的一些操作（比如数据抓取过程）

**onRenderTracked**

定义：注册一个回调，**开发环境下**，在**组件渲染过程中**追踪到响应式依赖时调用

使用：`onRenderTracked(({effect, target, type, key}) => {/* 处理 */})`

**onRenderTriggered**

定义：注册一个回调，**开发环境下**，在**响应式依赖变更**触发组件渲染时调用

使用：`onRenderTriggered(({effect,target, type, key, newValue, oldValue,oldTarget}) => {})`

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
- 当import导入的组件用在动态组件component中时，其is属性的值就是这个导入的组件的名字`:is="comName"`
- 单文件组件可以通过它的文件名被自己引用，这种方式相比于import导入的组件优先级更低
- 若有命名的import导入和组件的推断名冲突，可以使用import别名导入`import { FooBar as AliasBar } from './components'`
- 若导入一个属性是组件的对象（即.form内导出很多个组件时）`import * as Form from './form'`，可以直接使用类似`<Form.Label>`来引用
- 对于在`<script setup>`里创建的自定义指令，必须以`vMyDirective`的形式命名，这样它才能够在template中以`<h1 v-my-directive>title</h1>`的形式使用；而对于导入的指令，也应当符合`vMyDirective`的命名形式（即通过`import { myDirective as vMyDirective} from xxx`语法重新命名导入的指令名）
- 对于props和emit的声明，必须使用`defineProps`和`defineEmits`（仅在`<script setup>`内有效，且不需要导入能直接使用）函数来声明，其接收的参数和选项式语法相同
- 由于传入到defineProps和defineEmits的选项会从setup中提升到模块的范围，所以他们不能引用在setup内部定义的变量，否则会引起编译错误。但是他们可以引用import导入的内容（这也是模块的范围）
- defineProps和defineEmits要么使用运行时声明，要么使用类型声明，同时使用两种声明方式会导致编译报错，运行时声明即普通用法`defineProps({xxx})`，类型声明即ts用法`defineProps<{xxx}>()`。3.2以下版本中，defineProps的泛型类型参数只能使用类型字面量或者本地接口的引用，但在3.3版本中得到解决，支持在类型参数的位置引用导入的和有限的复杂类型，但是由于类型到运行时的转换是基于AST的，不支持使用需要 实际类型分析的 复杂类型，比如可以在单个prop上使用条件类型，但不能对整个props对象使用条件类型
- 对于类型声明的defineProps没有可以给props提供默认值的方式，但可以通过withDefaults编译器宏实现，`props = withDefaults(defineProps<{}>(), {默认值对象})`，第二个参数就是一个提供prop属性默认值的对象。对于提供了默认值的prop，会进行类型检查，若prop是可选的，但是提供了默认值，则会自动删除该prop的可选标志变成必填
- 若想在父组件中使用`<script setup>`中的变量/方法，和setup选项式类似，这里需要使用defineExpose编译器宏（不需要导入，语法和选项式相同）函数将变量/方法暴露出去，例如`defineExpose({暴露的对象})`
- defineOptions编译器宏可以声明组件选项，比如inheritAttrs，即使用script setup时不需要再定义一个script设置组件选项了（仅支持3.3+版本），定义的选项将被提升到模块作用域中，无法访问script setup中非字面常数的局部变量
- defineSlots宏可以用于为IDE提供插槽名称和props类型检查的类型提示，只接受类型参数，无运行时参数，类型参数是一个类型字面量，属性名是插槽名，值是插槽函数类型，函数的第一个canasta是插槽期望接收的props，返回类型目前被忽略，可以是any。该宏返回一个slots对象，等同于setup上下文中暴露或由useSlots()返回的slots对象（仅支持3.3+版本）
- 对于slots和attrs的使用，和vue2一样，可以直接在模板中以`$slots`, `$attrs`使用，若想在`<script setup>`内部使用，需要用`useSlots()`和`useAttrs()`函数访问他们，两函数是真实的运行时函数，返回的内容与setup函数的第二个参数context的属性slots、attrs等价
- 被包裹的代码，可以使用顶层的await，而不需要带有async，因为其结果会被编译为`async setup()`的形式，这种形式需要结合Suspense（实验性特性）一起使用
- 可以使用script标签上的generic属性声明泛型类型参数，属性值和typescript中位于`<...>`之间的参数列表完全相同，可以使用多个参数，extends约束，默认类型和引用导入的类型，用法见下，更深层的含义见[1](https://github.com/vuejs/rfcs/discussions/436)
- 因为模块执行语义的差异，`<script setup>`依赖单文件组件的上下文，当将其移动到外部的js或ts文件时，会产生混乱，所以不能和src attribute一起使用，即这样的语法是不允许的`script setup src="xxx"`


**`<script setup>`会在下列情况下和普通的`<script>`一起使用**：
- 无法在`<script setup>`中声明的选项，例如`inheritAttrs`（最新版本可使用defineOptions声明）或通过插件启用的自定义选项时。对于可以在script setup声明的选项，则不应该在script中去声明
- 声明模块的具名导出（named exports），即类似使用`export const xxx`的形式
- 运行一些特定的内容（比如只需要在模块作用域执行一次的操作，或是创建单例对象时）
- 这种场景下，script不支持使用render函数，应该使用script结合setup选项式的形式
- 若处于一种不被支持的场景中时，可以考虑切换到一个显示的setup函数中，即使用选项式的语法



**在typescript独有的功能**：
- https://v3.cn.vuejs.org/api/sfc-script-setup.html#%E4%BB%85%E9%99%90-typescript-%E7%9A%84%E5%8A%9F%E8%83%BD

::: code-group

```vue [defineExpose用法]
<!-- 子组件 -->
<script setup>
import { ref, reactive } from 'vue'
const a = ref(1)
const b = reactive({
  name: 'b'
})

defineExpose({
  // 暴露一个包含响应式变量的普通对象，解构时能保持响应性
  a,
  b
})
</script>

<!-- 父组件 -->
<template>
  <!-- 必须定义ref，才能够访问到暴露的属性  -->
  <Child ref="childRef"/>
</template>
<script setup>
import { onMounted, ref, shallowRef } from 'vue'
import Child from './Child.vue'

// 第一种方式
const childRef = ref()
// 使用typescript：注意，必须赋予初始值null，因为未挂载之前值都是null
// child实例的类型
// 若只想获取所有组件共享的属性，而非组件独有的，则可将InstanceType<typeof Child>换成ComponentPublicInstance
const childRef2 = ref<InstanceType<typeof Child> | null>(null)

// 第二种方式
const childRef = shallowRef()

// 访问暴露的属性，需要在挂在后才能获取到
onMounted(() => {
  console.log(childRef.value?.a, childRef.value?.b)
})
</script>
```

```vue [defineSlots用法]
<script setup lang="ts">
const slots = defineSlots<{
  // 默认插槽名称是default，默认插槽接收到的props是msg
  default(props: { msg: string }): any
}>()
</script>
```

<!-- 在script中使用泛型 -->
```vue
<!-- 简单用法：这样貌似是无意义的，更多有意义的是通过extends的方式 -->
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  selected: T
}>()
</script>


<!-- 可以使用多个参数，extends约束，默认类型和引用导入的类型 -->
<script
  setup
  lang="ts"
  generic="T extends string | number, U extends Item"
>
  import type { Item } from './types'
  defineProps<{
    id: T,
    list: U[]
  }>()
</script>
```

:::

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

::: code-group

```vue [Inject基本用法]
<script setup>
import { inject } from 'vue'
import { fooSymbol } from './injectionSymbols'

// 获取值1
const foo = inject('foo')

// 获取值2
const foo2 = inject(fooSymbol)

// 设置默认值
const foo3 = inject('foo', 'default')

// 设置默认值，使用工厂函数
const foo4 = inject('foo', () => 'default')

// 表明注入的默认值是函数，使用第三个参数
const foo5 = inject('foo', () => {}, false)
</script>
```


```typescript [应用层provide]
import { createApp } from 'vue'

const app = createApp({})

// 应用层提供的数据可以在所有组件中注入
app.provide('注入名', value)
```

```typescript [祖孙组件传递选项式]
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

```typescript [祖孙组件传递typescript]
// 基本用法
// provide-const.ts
import type { InjectionKey } from 'vue'

const todoLength = Symbol() as InjectionKey<number>
const todoLengthByComputed = Symbol() as InjectionKey<number>
  
export {
  todoLength,
  todoLengthByComputed
}

// 父组件
import Comp from './Comp.vue'
import { ref, computed, provide, inject } from 'vue'
import { todoLength, todoLengthByComputed } from './provide-const.ts'

const todos = ref<string[]>(['看书', '写字', '找对象'])

provide(todoLength, todos.value.length)
provide(todoLengthByComputed, computed(() => todos.value.length))
provide(pureTodoLength, todos.value.length)

// 子孙组件
import { inject } from 'vue'
import type { InjectionKey } from 'vue'
import { todoLength, todoLengthByComputed } from './provide-const.ts'

// 第一种语法：使用 泛型显式声明 字符串类型，第二个参数是默认参数，未提供默认参数时类型是number | undefined
const pureTodoLength1 = inject<number>('pureTodoLength', 0)

// 可以强制类型转换
const pureTodoLength2 = inject('pureTodoLength') as number

// 第二种语法：和上述一样，引入上面定义的symbol变量
const todoLength1 = inject(todoLength)
const todoLengthByComputed1 = inject(todoLengthByComputed)

console.log(todoLength1, todoLengthByComputed1, '获取provide')
```
:::

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
- watch能够懒执行(immediate选项)、知道哪个状态触发的变更、可以访问状态变更前的值
- watchEffect会在回调函数内部的响应式依赖变更时就执行监听、在同步执行过程中自动追踪所有能访问到的响应式依赖

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

::: code-group
```typescript [基础用法]
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
```typescript [JSX中的用法]
import { h } from 'vue'
export default {
  setup () {
    const divRef = ref(null)
    // return () => {
    //   // 渲染函数用法
    //   // h函数用法参数依次为：元素标签名，元素属性与值对象，元素内部包裹的内容
    //   h('div', { ref: divRef })
    // }

    // JSX中的用法
    return () => <div ref={divRef} />
  }
}
```
```typescript [结合v-for的用法]
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
:::

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

**dom模板解析注意事项**：仅在dom中直接写vue模板生效（例如html类型的文件，引入vue文件后进行使用），在vue单文件组件、内联模板字符串template选项、`<script type="text/x-template>`不需注意，有如下限制：
- 在dom中，使用小写形式
- 在dom中，使用闭合标签，即`</div>`
- 特定元素仅在特定元素内部，比如tr在table内部，若想使用自定义组件替换tr，应使用`<tr is="vue:自定义组件名"></tr>`，在原生元素上is必须加前缀vue才会解析为一个vue组件。

### 动态组件

语法：`<component :is="xxx">`，其中xxx可以是：
- 组件名称
- 被导入的组件对象，含有template的对象

元素位置限制：特定的元素只能在特殊位置显式，比如li只能在ul等、tr只能在table内、option只能在select内，所以在使用动态组件时，应该使用`<table><tr is="vue:compName"></tr></table>`

```vue
<script setup>
import { Transition } from 'vue'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

const view = Math.random() > 0.5 ? Foo : Bar
</script>
<template>
  <!-- 渲染组件：可以是自定义组件，也可以是内置组件(需要导入) -->
  <component :is="view"></component>
  <!-- 绑定v-model时，将会变成：modelValue Prop和update:modelValue event，这只能用于组件，不能用于原生元素（比如input） -->
  <component :is="Transition" v-model="username"/>

  <!-- 渲染html元素 -->
  <component :is="Math.random() > 0.5 ? 'a' : 'span'"/>
</template>
```

### 异步组件

defineAsyncComponent：创建一个只有在需要时才会加载的异步组件，
- 可接收一个参数，其类型是返回promise的函数，或一个对象

::: code-group
```typescript [基本用法]
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
```typescript [对象格式参数]
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

:::


注意：
- 对于在vue route中的异步组件，使用[懒加载](https://next.router.vuejs.org/guide/advanced/lazy-loading.html)加载路由组件，而不是上面这种方式


## 插件

定义：
- 插件是一种为vue添加全局功能的工具代码
- 插件可以是一个拥有install方法的对象，也可以是一个安装函数本身，安装函数会接收到安装它的应用实例app和传递给app.use的额外选项作为参数

场景：
- 通过app.component和app.directive注册一到多个全局组件/指令
- 通过app.provide让一个资源注入到整个应用
- 给app.config.globalProperties添加全局实例属性/方法
- 包含上述三种功能的，比如vue-router

::: code-group

```typescript [插件的两种格式]
// 第一种：导出一个函数，vue会直接调用这个函数
// app：createApp函数生成的实例
// options：插件初始化时的选项，是通过app.use的第二个参数传过来的
export default function (app, options) {
  // 逻辑代码
}

// 第二种：导出一个包含install的对象，vue通过调用install来启用插件
export default {
  install: (app, options) => {
    // 逻辑代码
    // 1. 注册全局属性/方法
    app.config.globalProperties.$globalFn = () => {
      console.log('这是全局方法')
    }
    // 2. 注册全局组件
    app.components('global-com', GlobalCom)
    // 3. 设置注入的全局数据
    app.provide('global-data', globalData)
  }
}

// 使用插件
import myPlugin from './myPlugin'

createApp(App).use(myPlugin, {
  foo: 1,
  bar: 2
}).mounted('#app')
```

:::

附录：
- 导入所有组件作为插件：https://juejin.cn/post/7137879039796051999

下面是使用install方法进行单组件导入的用法：

::: code-group

```vue [定义组件]
<template>
  {{ date }}
</template>

<script setup>
import { ref } from 'vue'

const date = ref(Date.now())
</script>
```

```typescript [定义导出组件]
import DateComp from './DateComp.vue'

DateComp.install = (app, options) => {
  app.component(DateComp.name, DateComp)
}

export {
  DateComp
}
```

```vue [使用]
<template>
  <DateComp/>
</template>

<script setup>
import { DateComp } from './DateComp.ts'
</script>
```

:::


## teleport

定义：
- teleport提供了一种干净的方法，允许我们自己决定在哪个DOM节点下面渲染被teleport包裹的内容，而不必求助于全局状态或将其拆分为两个组件
- 通俗意义即代码写在这里，而其实际的渲染则在其他的位置
- 同时teleport能够接收父组件注入的属性
- 多个teleport组件可以将内容挂载到同一个目标元素，出现顺序是先来先占位，按顺序依次追加到to目标元素下

语法：
teleport元素具备以下属性：
- `to`：指定将包裹的内容移动到目标元素内部，值为字符串，且必须要有。其值是有效的查询选择器（例如id选择器、类选择器、属性选择器）或HTMLElement元素（DOM对象）
- `disabled`：属性可选，可用于禁用teleport功能，意味着内部内容不会移动到任何位置，和正常元素一样。使用场景比如可以根据不同的设备决定是否进行移动到to目标元素下

使用：
- Teleport可以和Transition组合使用创建带动画模态框

注意：
- Teleport挂载时，传送的to目标必须已经存在于DOM中，所以需要确保Teleport挂载之前to目标元素就已经被挂载
- Teleport只是改变了渲染的DOM结构，但不会影响组件间的逻辑关系（使用Teleport的地方的父子关系不会改变，子组件将会在vue devtools中嵌套在父组件下面，而非to目标下面），即传入的props、触发的事件、父组件的注入都会按预期工作

::: code-group

```vue [基本用法]
<template>
  <teleport to='#root'>
    <div>A</div>
  </teleport>
  <teleport to="#root">
    <div>B</div>
  </teleport>

  <!-- 结果将是： -->
  <div id="root">
    <div>A</div>
    <div>B</div>
  </div>
</template>
```

```vue [Teleport和Transition一起使用创建动态模态框]
<!-- 使用modal.vue -->
<script setup>
import Modal from './modal.vue'
import { ref } from 'vue'

const showModal = ref(false)
</script>

<template>
  <button id="show-modal" @click="showModal = true">展示弹窗</button>
  <Teleport to="body">
    <Modal :show="showModal" @close="showModal = false">
      <template #header>
        <h3>自定义header</h3>
      </template>
    </Modal>
  </Teleport>
</template>

<!-- modal.vue -->
<script setup>
const props = defineProps({
  show: Boolean
})
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header">default header</slot>
        </div>
        <div class="modal-body">
          <slot name="body">default body</slot>
        </div>
        <div class="madal-footer">
          <slot name="footer">
            default footer
            <button class="modal-default-button" @click="$emit('close')">ok</button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity .3s ease;
}

.modal-container {
  width: 300px;
  margin: auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/* transition过渡 */
.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(1.1);
}

</style>
```

:::

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

::: code-group
```typescript [基本语法]
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
```typescript [唯一的VNode]
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
:::

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

::: code-group
```typescript [resolveDynamicComponent]
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
:::

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

::: code-group
```typescript [在render中使用v-model]
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
```typescript [在render中使用v-on]
// 省略其他代码，直接展示render内部内容
// 相比模板语法，click事件，必须加前缀on，且是驼峰式写法
render () {
  return h('div', {
    onClick: $event => console.log('clicked', $event.target)
  })
}
```
```typescript [在render中使用事件修饰符]
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
:::

### 在渲染函数中使用插槽

场景：
- 可以通过`this.$slots`访问静态插槽的内容，每个插槽都是一个VNode数组
- 若想在渲染函数的插槽中使用resolveComponent函数，必须在h()函数之外（之前）进行调用，不能在插槽内部直接使用该函数（可以使用该函数的返回结果）

::: code-group
```typescript [基本用法]
render () {
  // 渲染成：<div><slot></slot></div>
  return h('div', {}, this.$slots.default())
}
```
```typescript [定义插槽变量text]
render () {
  // 渲染成：<div><slot :text="message"></slot></div>
  return h('div', {}， this.$slots.default({
    text: this.message
  }))
}
```
```typescript [在父组件使用插槽定义的变量text]
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
```typescript [插槽自定义]
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
:::

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
- capture、once、passive三个修饰符与addEventListener函数的第三个参数选项对象对应

```typescript
eventTarget.addEventListener(type, listener, options/useCapture)
options = {
  // 在事件的捕获阶段触发listener，useCapture就是该选项的值
  capture: true,
  // 只调用一次
  once: true,
  // 永远不会调用preventDefault()，即使listener内部调用了也不生效
  passive: true,
}
```

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

::: code-group
```vue [基础用法]
// emit代指将事件从组件（子）抛出去，让引用它的那个组件（父）接收
<template>
  <!-- 第二步：触发并抛出事件到父组件 -->
  <div @click="$emit('inFocus', '事件参数')"></div>
  <div @click="clickHandle"></div>
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

<script setup lang="ts">
// 第一步：事件声明，定义需要抛出的事件列表
// 注意defineEmits不能在子函数内使用，必须放在顶层作用域下
const emit = defintEmits(['inFocus', 'submit'])

// 第一步：事件声明，ts语法形式, 3.3以下版本
const emit = defineEmits<{
  (e: 'inFocus', arg1: number): void
  (e: 'submit', arg1: string): void
}>()

// 第一步：事件声明，ts语法形式，3.3+版本
const emit = defineEmits<{
  // 具名元组语法
  inFocus: [arg1: number, arg2: string]
  update: [arg1: string]
}>()

// 第二步：触发事件可以用函数，ts语法
// 在访问event上的属性时，可能需要使用类型断言，因为某些类型没有这个属性
function clickHandle (event: Event) {
  console.log((event.target as HTMLInputElement).value)
  emit('inFocus', '事件参数')
}
</script>

<template>
  <!-- 第三步：接收子组件触发的事件并处理 -->
  <SubCom @get-click="('接收事件参数') => { '处理' }"/>
</template>
```
```typescript [事件验证]
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

```vue [事件触发次数]
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
:::

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
- 未传递的boolean类型的props默认值为false，其他类型则是undefined，默认值可通过default属性进行修改

::: code-group

```typescript [props定义]
// 方式1：字符串数组（运行时声明，即传递给defineProps的参数会作为运行时的props选项使用）
const props = defineProps(['title'])

// 方式2：对象形式（运行时声明，即传递给defineProps的参数会作为运行时的props选项使用）
const props = defineProps({ title: String })
const props = defineProps({
  title: {
    type: String,
    default (props) {},
    validator(v) {}
  }
})

// 方式1、2的升级用法，运行时声明使用PropType给prop标注一个更复杂的类型定义
import type { PropType } from 'vue'

interface Article {
  title: string
  content: string
}

const props = defineProps({
  // 相当于在原有的Object类型上断言成一个更具体的类型
  article: Object as PropType<Article>
})

// 选项式api用法
export default defineComponent({
  props: {
    article: Object as PropType<Article>
  }
})

// 方式3：结合ts 泛型参数使用类型标注，在script setup中（类型声明）
defineProps<{
  title?: string
  likes?: number
}>()

// 方式3抽离：
interface Props {
  title?: string
  likes?: number
}

defineProps<Props>()

// props声明默认值，使用withDefaults（需导入），这时上面的可选标志将去除变为必填
withDefaults(defineProps<Props>(), {
  title: 'props用法',
  likes: () => Date.now()
})


```
```typescript [获取props]
const props = defineProps(['title'])

const newProp = ref(props.title)
const newProps = computed(() => props.title)
```

:::

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

::: code-group

```vue [透传属性基本用法]
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

```vue [使用inheritAttrs]
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
:::

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

## 单文件组件（SFC）

定义：
- vue的单文件组件（即.vue文件，single-file component），能够将一个vue组件的模板template、逻辑script、样式style封装在单个文件中
- 使用单文件组件必须使用构建工具，比如vue-cli、vite等
- SFC在特殊的场景下根据文件名自动推导组件名，比如：开发警告信息中需要格式化组件名时、devtools中观察组件时、递归组件自引用时（通过文件名引用自己。这在同名时比明确注册/导入的组件优先级低）

组成：
- template：每个vue文件最多包含一个顶层的template元素块，包裹的内容将被提取传递给@vue/compiler-dom预编译为js渲染函数，并附在导出组件的render选项上
- script：每个文件最多包含一个script块（script setup除外），默认导出一个vue的组件选项对象，可以是对象字面量形式（{}），也可是defineComponent函数的返回值
- script setup：最多包含一个，将被预处理为一个组件的setup函数
- style：可包含多个该元素，可使用scoped和module attribute来封装当前组件的样式
- 其他自定义的元素块：需要依赖工具链去处理
- 不同块的注释遵循各自的语法，顶层注释遵循html注释语法

使用：
- 附着的预处理器熟悉lang attribute：比如`script lang="ts"`, `template lang="pug"`, `style lang="scss"`，这个需要工具链支持
- 附着的scr attribute：若喜欢将vue组件分散到多个文件中，可为一个元素块使用src属性来导入一个外部文件，比如`template src="./xxx.html"`等。src导入规则和js模块导入规则一样，比如使用相对路径，从npm包中导入资源`style src="todomvc-app-css/index.css`

单文件组件的优势：
- 使用熟悉的html、css、js语法编写模块化组件
- 让本来强相关的关注点自然内聚
- 预编译模板，避免运行时编译开销
- 组件作用域css
- 在使用组合式api时语法更简单
- 通过交叉分析模板和逻辑代码能进行更多编译时优化
- 有更好的IDE支持，提供自动补全和类型检查等
- 开箱即用的模块热更新HMR支持

关注点分离：
- 前端开发的关注点不是完全基于文件类型分离的
- 前端工程化的最终目的是为了能够更好的维护代码
- 关注点分离不是教条式的将其视为文件类型的区别和分离
- 在组件中，模板、逻辑、样式本身是有内在联系且耦合的，放在一起能够增强内聚性和可维护性

### 单文件组件样式特性

**`<style scoped>`**:
- 处理方式：通过postcss将样式转为带属性选择器的样式，即元素上添加了自定义属性data-xxx，样式上也添加了同样的属性选择器data-xxx
- 父组件的样式不会泄露到子组件当中，但是子组件根节点的样式会由子组件和父组件共同作用（和vue2一样，但通过v-html创建的内容不会被影响，不过也能通过deep伪类设置样式）
- 若想父组件影响子组件样式，可以使用`:deep(选择器)`函数伪类，比如`div :deep(.child) {}`
- 若想修改插槽内的样式（使用该组件时传过来的插槽内容，是由使用该组件的地方控制样式的，非该组件本身能控制），故而可以通过`:slotted(选择器)`伪类实现
- 若想将某样式应用到全局所有符合规则的条件，也可以使用`:global(选择器)`伪类实现
- 在这种条件下，应该尽量使用class或者id渲染样式，避免性能损失
- 小心递归组件中的后代选择器，对于一个使用了 .a .b 选择器的样式规则来说，如果匹配到 .a 的元素包含了一个递归的子组件，那么所有的在那个子组件中的 .b 都会匹配到这条样式规则。

::: code-group
```typescript [deep()函数]
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
```typescript [插槽选择器]
<style scoped>
// 插槽中div会变成红色
:slotted(div) {
  color: red;
}
</style>
```
```typescript [全局选择器]
<style scoped>
// 所有的div都将变成红色
:global(div) {
  color: red;
}
</style>
```
:::

**`<style module>`**：
- 仅作用于当前组件
- 该标签会被编译为css module，并将生成的css类作为$style对象的键暴露给组件，即可在其他地方（比如在template中）通过类似$style.red的方式访问样式
- 可以给module定义一个值`<style module="classes">`，这样就能将$style替换成这个值了`classes.red`
- 若想在setup选项或`<script setup>`中使用注入的类，需要使用函数`useCssModule()`或者是`useCssModule('classes')`
- 若样式模块想用到script内部导出的变量（data中的，或者setup导出的），可以使用`v-bind`函数绑定

```typescript
<template>
  <p :class="$style.red"></p>
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

## 工具链

在线环境：
- [vue sfc 演练场](https://play.vuejs.org/)
- [StackBlitz 中的 Vue + Vite](https://vite.new/vue)
- [VueUse Playground](https://play.vueuse.org/)
- [Vue + Vite on Repl.it](https://replit.com/@templates/VueJS-with-Vite)
- [Vue on CodeSandbox](https://codesandbox.io/s/vue-3)
- [Vue on Codepen](https://codepen.io/pen/editor/vue)
- [Vue on Components.studio](https://components.studio/create/vue3)
- [Vue on WebComponents.dev](https://webcomponents.dev/create/cevue)

项目脚手架：
- vite
- vue-cli
- [无构建方式使用vue](https://cn.vuejs.org/guide/scaling-up/tooling.html#note-on-in-browser-template-compilation)

IDE支持：
- vscode + volar插件（提供typescript支持，取代了vue2的vetur，两者会冲突）
- webstorm

开发者插件：vue devtools（支持web、electron）

**测试**：

> 该节只是选看，未看完，具体的测试应该到查看对应工具的文档

目的：
- 自动化测试能够预防无意引入的bug，并鼓励开发者将应用分解为可测试，可维护的函数、模块、类、组件。能够帮助更快速构建复杂的应用

测试时机：越早越好

测试类型：
- 单元测试：检查函数、类、组合式函数的输入是否符合预期，推荐vitest，其他的有peeky、jest
- 组件测试：检查组件是否正常挂载和渲染、是否能够进行互动、表现是否符合预期。目的是测试这个组件做了什么，而不是测试它是怎么做到的。分为视图测试、交互测试，推荐vitest、cypress组件测试、nightwatch
- 端到端测试：检测跨越多个页面的功能，对生产构建的应用进行实际的网络请求（涉及建立数据库和后端），推荐cypress，其他的有playwright、nightwatch v2

工具：
- cypress，推荐用于E2E测试，也可通过cypress组件测试运行期给SFC作单文件组件测试
- vitest：主要基于vite应用设计
- jest（vite-jest）

代码规范：
- eslint-plugin-vue（vite）：由vue维护，提供SFC相关规则的定义，和eslint配套使用，然后启用eslint ide插件，就可以在开发时进行规范检查，同时还可配用lint-staged这样的工具在git提交时执行规范检查
- webpack loader（vue-cli）

格式化：
- volar：对SFC文件
- prettier：对SFC文件

**路由**：

- 客户端路由：单页面应用中，客户端的js可以拦截页面的跳转请求，动态获取新的数据，然后在无需重新加载的情况下更新当前页面
- 服务端路由：指的是服务器根据用户访问的url路径返回不同的响应结果，当在传统的服务端渲染的web应用中点击一个链接时，浏览器会从服务端获得全新的html，然后重新加载整个页面

**状态管理**：
- Pinia
- Vuex
- 用响应式api做简单状态管理：单独定义一个状态文件，然后在使用/共享时导入状态，由于是响应式变更，所以在变化时会同步发生变化（单一数据源）

**错误处理**：
- 应用级错误处理：`app.config.errorHandler`，用于向追踪服务报告错误
- 其他工具：sentry、bugsnag

## 服务端渲染

> https://cn.vuejs.org/guide/scaling-up/ssr.html

定义：vue支持将组件在服务端渲染成html字符串，作为服务端响应返回给浏览器，最后在浏览器端将静态的html激活为能够交互的客户端应用

ssr相比spa的优势：
- 更快的首屏加载：无需等所有的js都下载执行后才显示；数据获取过程在首次访问时在服务端完成，可能有更快的数据库连接
- 统一的心智模型：不需要在后端模板系统和前端框架间来回切换
- 更好的SEO：方便收索引擎爬取

ssr缺陷：
- 开发中的限制：代码需要特殊处理，某些api（比如onMounted、自定义指令由于包含了dom的操作但可通过getSSRProps钩子解决、Teleport需要特殊处理）可能在服务端用不了
- 更多与构建配置和部署相关的要求：需要能让nodejs服务器运行的环境，而spa可以部署在任意的静态文件服务器上
- 更高的服务端负载：渲染资源更加占用cpu，需要合理分配服务器负载和缓存

ssr应用解决方案：
- Nuxt
- Quasar
- vite ssr

## 部署

### vite 部署

> https://cn.vitejs.dev/guide/build.html
> https://cn.vitejs.dev/guide/static-deploy.html

### vue-cli部署

> https://cli.vuejs.org/zh/guide/deployment.html

## 性能优化

影响web应用性能的两个主要方面：
- 页面加载性能：首屏内容展示与达到可交互状态的速度
- 更新性能：应用响应用户操作时的更新速度

页面加载优化：
- 根据场景选用正确的架构：SPA、SSR、SSG（静态站点生成）
- 包体积与Tree-shaking优化：压缩打包产物的体积（尽可能的使用构建工具，很多vue api可以在现代打包工具中被tree-shake，即未使用则不会打包到最终产物中）、引入新依赖时小心包体积膨胀（尽量选用提供ES模块格式的依赖，比如lodash-es；查看依赖体积评估其提供功能之间的性价比）
- 代码分割：构建可以按需/并行加载的文件，仅在需要时才加载，像路由懒加载中使用的异步组件`defineAsyncComponent(() => import('./Foo.vue'))`

更新优化：
- props的稳定性：仅在符合条件的选项才应该更新，而非更新所有，例如`:active="item.id === activeId"`
- 无需再次更新的内容，可使用v-once
- 有条件跳过大型子树或v-for列表的更新，可使用v-memo

通用优化：
- 大型虚拟列表：使用列表虚拟化提升列表渲染的速度和性能，仅渲染用户视口中能看到的部分。现有的库有：vue-virtual-scroller、vue-virtual-scroll-grid等
- 减少大型不可变数据的响应式开销：数据量大时，深度响应性会导致不小的性能负担，因为每个属性访问都将触发代理的依赖追踪，可以使用shallowRef、shallowReactive绕开深度响应，然后值改变时需要通过替换整个根状态触发更新
- 避免不必要的组件抽象：组件实例比普通DOM节点要昂贵得多，为了逻辑抽象创建太多组件实例将会导致性能损失。这在使用频率最高的组件中尤其要注意

性能分析工具：
- 生产部署时的负载性能分析：PageSpeed Insights、WebPageTest
- 开发时的性能分析：Chrome开发者工具性能面板（使用app.config.performance）、vue开发者工具

## typescript

### typescript与选项式api

**定义组件**

```vue
<!-- 当lang=ts存在时，所有模板内（即template块中的）表达式都将享受到更严格的类型检查 -->
<script lang="ts">
import { defineComponent } from 'vue'

exprot default defineComponent({
  props: {},
  setup(props, context) {
    return {
      a
    }
  }
  // xxx
})
</script>

<template>
<!-- 这里的a将会进行类型检查 -->
  {{ a }}
  <!-- 若不符合类型，可使用内联类型强制转换 -->
  {{ (a as number).toFixed(2) }}
</template>
```

### typescript工具类型

**`PropType<T>`**

定义：给运行时props（props分运行时声明、类型声明）标注复杂的类型

```typescript
import type { PropType } from 'vue'

interface Book {
  name: string
}

export default {
  props: {
    book: {
      type: Object as PropType<Book>
    }
  }
}

```

**`MaybeRef<T>`**

定义：
- `T | Ref<T>`的别名
- 用于标注组合式函数的参数（v3.3+）

**`MaybeRefOrGetter<T>`**

定义：
- `T | Ref<T> | (() => T)`的别名
- 用于标注组合式函数的参数（v3.3+）

**`ExtractPropTypes<T>`**

定义：
- 从运行时props选项对象提取props类型，提取的类型是面向内部的，即组件接收到的是解析后的props
- 提取面向外部的props，即父组件允许传递的props，应使用ExtraPublicPropTypes

```typescript
const propsOptions = {
  foo: String,
  bar: Boolean,
  qux: {
    type: Number,
    default: 1
  }
} as const

type Props = ExtractPropTypes<typeof propsOptions>
/**
 * 结果：{
 *    foo?: string,
 *    bar: boolean,
 *    qux: number
 * }
 */
```

**`ExtractPublicPropTypes<T>`**

定义：从运行时的props选项对象中提取面向外部的（父组件传递的）prop，用法同上

**ComponentCustomProperties**

定义：增强组件实例类型，以支持自定义全局属性

```typescript
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

**ComponentCustomOptions**

定义：扩展组件选项类型，以支持自定义选项

```typescript
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: any, from: any, next: () => void): void
  }
}
```

**CSSProperties**

定义：扩展在样式属性绑定的允许的值的类型

```typescript
declare module 'vue' {
  interface CSSProperties {
    [key: `--${string}`]: string
  }
}
```

```vue
<template>
  <div :style="{ '--bg-color': 'blue' }"></div>
</template>
```

## 使用vue的多种方式

vue的使用场景：
- 独立脚本，使用script引入的vue.js文件的（类似jQuery）
- 作为web component嵌入
- SPA
- SSR/全栈
- SSG/JAMStack（静态站点生成）
- 桌面应用：electron、tauri
- 移动端：Ionic vue
- 混合应用：Quasar
- 渲染器：比如 [WebGL](https://troisjs.github.io/) 甚至是[终端命令行](https://github.com/vue-terminal/vue-termui)

## api集锦

### 创建应用实例

使用到的api：
- createApp：创建应用实例app的方法
- app.mount：将app挂载到容器元素中
- app.component：注册全局组件
- app.use：安装一个插件
- app.directive：注册全局指令
- app.config.globalProperties：注册能够被应用内所有组件实例访问到的全局属性的对象
- app.unmount：卸载一个应用，将触发应用组件树所有组件的卸载生命周期钩子
- app.runWithContext(cb)：立即执行回调函数cb

```typescript
import { createApp, inject } from 'vue'
import App from './App.vue'
import MyComponent2 from './components/MyComponent2.vue'
import MyPlugin from './plugins/MyPlugin.ts'
import axios from 'axios'

// ✅创建实例：
// 第一种方式：使用内联根组件
const app = createApp({
  // 第一个参数：根组件选项
}, {
  // 第二个参数：传递给根组件的props，可选
})

// 第二种方式：使用导入的组件
const app2 = createApp(App)

// ✅将实例挂载到节点：对于每个应用实例，mount仅能调用一次
// 第一种方式：使用css选择器（匹配到的第一个元素）作为参数
// 此时，若app根组件App有内容，将会替换掉选择器#app内部的内容
/**
 * 举例：<div id="app"><span>原始内容</span></div>
 * 这里的<span>原始内容</span>将会换成App组件的模板内容/渲染函数的内容
 */
app.mount('#app')

// 第二种方式：使用dom元素作为参数
app2.mount(document.querySelector('#app'))

// ✅注册全局组件
// 方式1：注册一个全局组件，参数1：组件名，参数2：组件对象（可是导入的组件）
app.component('MyComponent', {
  // 组件对象
})
app.component('MyComponent2', MyComponent2)

// 方式2：获取一个已注册的组件/undefined：仅传入参数1
const MyComponentInstance = app.component('MyComponent')

// ✅注册一个全局指令
// 语法类全局组件
app.directive('my-directive', {
  // 自定义指令钩子
})
// 具有函数形式的（简洁语法）
app.directive('my-directive2', () => {
  // mounted和updated钩子内的内容
})

// 获取一个已注册的指令/undefined
const MyDirectiveInstance = app.directive('my-directive')

// ✅安装插件
// 参数1：插件对象，参数2：传给插件的选项对象
// 插件对象可以是一个带install方法的对象，也可以是一个将被用作install方法的函数
// 多次调用，插件只会安装一次
app.use(MyPlugin)

// ✅runWidthContext：立即执行回调
app.runWidthContext(() => {
  // 即使没有当前活动的组件实例，也能够获取app提供的provide
  const id = inject('id')
  connsole.log(id)
})

// ✅version：根据不同vue版本执行不同逻辑，在插件中很有用
console.log(app.version)

// ✅config：应用的配置设定，可以在 挂载应用前 更改
console.log(app.config)

/**
 * app.config.errorHandler：为应用内抛出的未捕获错误指定一个全局处理函数
 * 参数分别是：错误对象，触发改错误的组件实例，指出错误来源类型信息的字符串
 * 错误捕获源：
 *    组件渲染器，事件处理器，生命周期钩子，setup()函数
 *    侦听器，自定义指令钩子，过渡Transition时的钩子
 */
app.config.errorHandler = (err, instance, info) => {
  // 进行处理
}

/**
 * app.config.warnHandler：为vue运行时警告指定一个自定义处理函数
 * 参数分别是：警告信息，来源组件实例，组件追踪字符串
 * 
 * 作用：可以过滤筛选特定的警告，降低控制台输出的冗余；所有警告都需要在开发阶段解决（生产环境将忽略该配置），仅建议在调试期间选取特定警告，并在调试完后移除
 */
app.config.warnHandler = (msg, instance, trace) => {
  // 处理
}

// app.config.performance：为true时可以在浏览器开发工具的性能时间线中启用对组件初始化、编译、渲染、修补的性能追踪
// 仅在开发模式和支持performance.mark的浏览器工作
app.config.performance = true

/**
 * app.config.compilerOptions：配置运行时编译器的选项，将会在浏览器内进行模板编译时使用，会影响到所配置应用的所有组件
 * 该选项仅在vue完整构建版本(vue.js)中使用，构建工具默认使用的是非完整版vue.runtime.js，需要通过相关配置传递给@vue/compiler-dom（vue-loader通过compilerOptions loader的选项传递，vite通过@vitejs/plugin-vue的选项传递）
 */

// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module.rule('vue').use('vue-loader').tap(options => {
      // 修改选项
      return options
    })
  }
}

// vite.config.ts
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 修改选项
        }
      }
    })
  ]
}

/**
 * app.config.compilerOptions.isCustomElement：指定一个检查方法识别原生自定义元素
 * 若标签需要当作原生自定义元素，则应返回true，匹配的标签vue会视其为原生元素而非vue组件
 * 原生html和svg标签不需要在此函数中进行匹配，会自动识别
 */
app.config.compilerOptions.isCustomElement = (tag) => {
  // 将所有标签前缀icon-开头的视为自定义元素
  return tag.startsWith('icon-')
}

/**
 * app.config.compilerOptions.whitespace：调整模板中的空格处理行为
 * 值：condense（压缩）、preserve（保留）
 * vue移除/缩短了模板的空格以输出高效的模板，默认是condense，行为：
 *    1. 元素开头/结尾的空格字符缩短成一个空格
 *    2. 元素直接的空白字符（包括换行）将被删除
 *    3. 文本节点连续的空白字符将缩成一个空格
 * preserve的行为只有1
 */
app.config.compilerOptions.whitespace = 'preserve'

// app.config.compilerOptions.delimiters：调整模板内文本插值分隔符，避免和使用mustache语法的服务器框架冲突
// 将分隔符改为es6模板字符串
app.config.compilerOptions.delimiters = ['${', '}']

// app.config.compilerOptions.comments：是否移除html注释
// 默认情况下生产环境会移除所有注释，值为true将保留注释
app.config.compilerOptions.comments = true

// ✅注册全局属性
// 若全局属性和组件自身属性冲突，则自身属性优先级更高
// 第一步：声明类型
// global.ts
declare module 'vue' {
  // 另一种是不使用export {}，而是在下面使用：export interface
  interface ComponentCustomProperties {
    $axios: axios
  }
}

// 需要注明这个
export {}

// main.ts
app.config.globalProperties.$axios = axios

// template使用
<div v-bind:axios="$axios"></div>

// 选项式语法
this.$axios;

// script setup使用
import { getCurrentInstance } from 'vue'
const instance = getCurrnetInstance()
console.log(instance.proxy.$axios)
```

### 内置指令

指令列表：
- v-text：绑定元素，设置元素innerText的值
- v-html：绑定元素：设置元素innerHTML的值
- v-show：display：none
- v-if/v-else/v-else-if：是否有该元素
- v-for
- v-on
- v-bind
- v-model
- v-slot：使用插槽时用的，配合template
- v-pre：原样输出内容，跳过模板编译，`<span v-pre>{{a}}</span>`，其中直接输出`{{a}}`的大括号和a
- v-once：组件渲染一次，之后不更新
- v-memo：缓存的内容不改变时会跳过更新，而非重复渲染，`<div v-memo='[value1, value2]'></div>`
- v-cloak：在模板编译完成之前，隐藏代码内容，配合css一起使用`[v-cloak] {display: none;}`，`<div v-cloak>{{ a }}</div>`

### 通用api

```typescript
import { version, nextTick, defineComponent, defineAsyncComponent, defineCustomElement } from 'vue'

// ✅获取当前的vue版本
console.log(version)

// ✅nextTick：等待下一次dom刷新时调用，能够访问更新后的dom
// 可以传递一个回调函数做参数，或者return await promise
await nextTick()
// 下面就能够访问更新的dom了
console.log(doucment.getElementById('app')).innerText

// ✅定义组件
// 第一个参数是组件选项对象，返回该选项对象本身，该函数在运行时无任何操作，仅用于提供类型推导
// 第一种：传递选项对象
const Foo = defineComponent({
  setup () {},
  // xxx
})

// 提取组件实例类型
type FooInstance = InstanceType<typeof Foo>

// 第二种：传递函数：旨在与组合式api和渲染函数/jsx一起使用，结合ts泛型一起使用
const Bar = defineComponent(<T extends string | number>(props: { msg: T; list: T[] }) => {
  // setup()函数内的内容
  const count = ref(0)

  return () => {
    // 渲染函数或jsx
    return h('div', count.value)
  }
}, {
  // 其他选项：比如props，emits
  props: ['msg', 'list']
})

// 由于该函数是一个函数调用，为了让某些构建工具（比如webpack，而vite不需要）不产生副作用而能被tree-shake，可以添加注释
export default /*#__PURE__*/ defineComponent(/* ... */)
```

## 特殊attributes

**key**：

定义：主要作为虚拟dom算法提示，在比较新旧节点列表时用于识别vnode

值：number、string、symbol

使用：
- 没有key时，vue将使用一种最小化元素移动的算法，尽可能就地更新/复用相同类型的元素。在传入key后将根据key的变化顺序重新排列元素，始终移除/销毁key不存在的元素
- 同一父元素的子元素key必须唯一
- 可用于强制替换一个元素/组件（重新渲染），而非复用它

**ref**：

定义：用于注册模板引用，值为string、function（为函数时，函数参数是绑定的元素/组件）

使用：
- 选项式中，值存在this.$refs中
- 组合式中，值存在与名字匹配的ref()中
- 绑定普通dom，引用是元素本身，绑定组件，引用将是组件实例

## 选项式api

选项式api实例方法：$data, $props, $el, $options, $parent, $root, $slots, $refs, $attrs, $watch(),$emit(), $forceUpdted(), $nextTick()

选项式api组件实例：

```vue
<script>
export default {
  name: 'MyComponent',
  inheritAttrs: false,
  props: ['size', 'height'],
  props: {
    height: Number
    size: {
      type: Number,
      default: 0,
      required: true,
      validator: (value) => {
        return value >= 0
      }
    }
  },
  emits: ['change'],
  emits: {
    change: null,
    change (payload) {
      // 验证函数
    }
  },
  computed: {
    mSize () {
      return this.size * 100
    },
    mHeight: {
      get () {
        return this.height + 1
      },
      set (val) {
        this.height = val - 1
      }
    }
  },
  watch: {
    size (val, old) {},
    height: {
      handler (val, old) {},
      deep: true,
      immediate: true
    },
    'height.h': function (val, old) {},
    arr: [
      size,
      function handle (val, old) {},
      {
        handler (val, old) {},
        deep: true
      }
    ]
  },
  data () {
    return {
      width: 100
    }
  },
  expose: ['size', 'getSize'],
  directives: {
    focus: {
      // 自定义选项
    }
  },
  created () {},
  components: {
    // xxx
  },
  methods: {
    getSize () {
      return this.size
    }
  }
}
</script>
```

## ✅vue3新增的内容

### emits选项

改动：
- 若想在组件中抛出父组件传入的事件，必须在`emits`选项（与setup函数同级）中定义该事件。因为移除了native修饰符，不在`emits`选项中声明的事件，都会算入到组件的`$attrs`属性中，默认绑定到组件的根节点

### 片段

即多根组件，此时需要明确传入的内容（比如`$attrs`）定义在哪个节点上

## 过渡和动画

定义：使用Transition和TransitionGroup制作基于状态变化的过渡和动画，除此之外还可通过切换class去实现

### 基于css的过渡效果

**过渡的class**：
- v-enter-from：进入动画的起始状态，在元素插入前添加，在元素插入完成后下一帧移除
- v-enter-active：进入动画的生效状态，应用于整个进入动画阶段，在元素插入前添加，在过渡动画完成之后移除。可定义动画持续时间、延迟、速度曲线
- v-enter-to：进入动画的结束状态，在元素插入完成后的下一帧被添加（即v-enter-from被移除的同时），在过渡动画完成之后移除
- v-leave-from：离开动画起始状态，在离开过渡效果被触发（参考下面的进入离开触发条件）时立即添加，在一帧后移除
- v-leave-active：离开动画的生效状态，应用于整个离开动画阶段，在离开过渡效果出发时立即添加，在过渡完成后移除。可定义动画持续时间、延迟、速度曲线
- v-leave-to：离开动画的结束状态，在离开动画触发后的下一帧添加（v-leave-from被移除的同时），在过渡动画完成后移除

**自定义过渡效果的前缀**：
- 自定义过渡效果的前缀：给Transition组件传入一个name prop声明过渡效果名，与此同时应该在样式文件种将上述的前缀v改成name属性的值
- 自定义每个过渡效果的class：给Transition传递上面的v-后面的名字prop，比如`<Transition leave-to-class="jade-leave-to">`，这在集成第三方动画库时很有用

性能考量：
- 制作动画时，尽量使用不会触发css布局变动的css属性（比如transform和opacity），因为这些属性在动画过程中不影响dom结构，不会触发布局的重绘重排，同时现代浏览器在执行transform属性的动画时会利用gpu进行硬件加速。
- 可在[css triggers](https://csstriggers.com/)查询css属性是否触发布局变动

**注意**：
- 定义过渡效果时，必须设置起始或结束时的效果，否则动画没任何效果
- 当你想同时在同一个元素上使用过渡transition和动画animation时（比如vue触发了一个动画，鼠标悬停触发另一个css过渡），此时你需要显式传入type prop给Transition组件，告诉vue是哪种类型，值可以是animation或transition
- 虽然过渡class只能应用在直接子元素上，但可以使用深层级的选择器触发深层元素的过渡效果，例如使用`.v-enter-avtive .inner {}`语法，将过渡效果用在组件内的inner元素上。同时也能在深层元素上添加过渡延迟transition-delay以创建一个带渐进延迟动画序列，在嵌套过渡中，判断过渡结束的时间是所有内部元素的过渡完成的时间（默认情况下是监听第一个transitionend或animationend事件），这种情况下可以传入duration prop给Transition组件显式指定过渡持续时间（延迟+内部元素的过渡持续时间）。或者传入一个对象形式`{enter: 500, leave: 800}`分开指定进入和离开的过渡持续时间。

::: code-group

```vue [css结合过渡]
<template>
  <Transition name="slide-fade">
    <p v-if="show">hello</p>
  </Transition>
</template>

<style lang="scss">
.slide-fade {
  &-enter-active {
    transition: all .3s ease-out;
  }
  &-leave-active {
    transition: all .8s cubic-bezier(1, 0.5, 0.8, 1);
  }

  // 定义开始动画前，结束动画后
  &-enter-from,
  &-leave-to {
    // 过渡多个属性: transform和opacity
    transform: translateX(20px);
    opacity: 0;
  }
}
</style>
```

```vue [css结合动画]
<template>
  <Transition name="bounce">
    <p v-if="show" :style="'text-align: center;'">
      红红火火恍恍惚惚
    </p>
  </Transition>
</template>

<style lang="scss">
.bounce {
  &-enter-active {
    animation: bounce-in .5s;
  }
  &-leave-active {
    animation: bounce-in .5s reverse;
  }
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
```

```vue [深层过渡]
<template>
  <!-- 指定过渡的持续时间(ms) = 延迟 + 内部元素的过渡持续时间 -->
  <!-- 
    <Transition name="nested" :duration="{
      enter: 550,
      leave: 550
    }">
   -->
  <Transition name="nested" :duration="550">
    <div v-if="show" class="outer">
      <div class="inner">
        hello
      </div>
    </div>
  </Transition>
</template>

<style lang="scss">
.nested {
  &-enter-active,
  &-leave-active {
    .inner {
      transition: all .3s ease-in-out;
      transition-delay: .25s;
    }
  }
  &-enter-from,
  &-leave-to {
    .inner {
      transform: translateX(30ppx);
      opacity: 0;
    }
  }
}
</style>
```

:::

### 使用js钩子去设置相应的过渡和动画

定义：除了使用css特定的class外，还可以通过监听Transition组件事件的方式设置。

对应的组件事件：
- before-enter
- enter
- after-enter
- before-leave
- leave
- after-leave
- enter-cancelled
- leave-cancelled：仅在v-show过渡中可用

注意：
- js钩子可以和css过渡和动画一起使用
- 在仅用js钩子执行动画时，最好添加一个`:css="false"`的prop显式表明跳过对css过渡的自动探测，加强性能，防止css规则干扰过渡效果。这时就是使用js钩子全权负责过渡了，这种情况下，enter和leave钩子的回调函数done是必须的，不然会被同步调用，过渡将立即完成

```vue
<template>
  <button @click="show = !show">切换</button>
  <!-- css：false，跳过对css过渡检查 -->
  <Transition
    :css="false"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @enter-cancelled="onEnterCancelled"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
    @leave-cancelled="onLeaveCancelled">
    <!-- 内容 -->
    <div class="gsap-box" v-if="show"></div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
// 导入动画库gsap
import gsap from 'gsap'

const show = ref(true)

// 在元素插入到dom前调用
function onBeforeEnter (el) {
  // 这里是不是和上面的在style中设置的类似🧡
  gsap.set(el, {
    scaleX: 0.25,
    scaleY: 0.25,
    opacity: 1
  })
}

// 在元素插入到dom后的下一帧调用
function onEnter (el, done) {
  // 调用回调函数done，表示过渡结束
  // 若js钩子和css过渡/动画一起使用，可忽略
  gsap.to(el, {
    duration: 1,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    ease: 'elastic.inOut(2.5, 1)',
    // 这里调用done，表结束
    onComplete: done
  })
  // done()
}

// 过渡完成时调用
function onAfterEnter (el) {}
function onEnterCancelled (el) {}

// 在leave钩子之前调用
function onBeforeLeave (el) {}

// 在离开过渡开始时调用
function onLeave (el, done) {
  // 同onEnter
  gsap.to(el, {
    duration: 0.7,
    scaleX: 1,
    scaleY: 1,
    x: 300,
    ease: 'elastic.inOut(2.5, 1)'
  })
  gsap.to(el, {
    duration: 0.2,
    delay: 0.5,
    opacity: 0,
    onComplete: done
  })
}

// 在离开过渡完成且元素移除出dom时调用
function onAfterLeave (el) {}

// 仅在v-show过渡中可用
function onLeaveCancelled (el) {}
</script>

<style>
.gsap-box {
  background: #42b883;
  margin-top: 20px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
```

### 复用过渡效果（组件封装）

```vue
<script>
// 钩子逻辑
</script>
<style>
  /* 必要的css，注意不要使用scoped，不然不会用在插槽内容上 */
</style>
<template>
  <Transition
    name="my-transition"
    @enter="onEnter"
    @leave="onLeave"
  >
    <!-- 传递插槽 -->
    <slot></slot>
  </Transition>
</template>

<!-- 使用 -->
<MyTransition>
  <div v-if="show">hello</div>
</MyTransition>
```

### Transition

定义：
- 无需注册，可在所有的组件上使用
- 可以将进入和离开动画 应用到 通过默认插槽 传递 给它的元素/组件上
- 当Transition组件元素被插入移除时：vue会自动检测目标元素是否应用了css过渡/动画，若是则这些过渡的css将在适当时机加减；若有作为监听器的js钩子，则这些钩子函数会在适当时机调用；若未检测到css过渡/动画，也未提供js钩子，则dom的增删操作将在浏览器下一个动画帧后执行
  
进入/离开的触发条件：
- v-if，v-else-if，v-else触发的切换
- v-show触发的切换
- 用`<component>`动态切换组件
- 改变属性key

注意：
- Transition仅支持单个元素或具有单根节点的组件作为其插槽内容
- 只在初始渲染时应用过渡，可以添加appear prop到Transition组件上
- 如果想要想执行离开动画，然后在完成之后在执行元素的进入动画（两个阶段逐步进行：离开后再进入），可以添加mode prop实现这种行为，属性值有out-in（常用）、in-out
- Transition上的props可以是动态设置的，这样可以根据状态变化动态应用不同类型的过渡，使用v-bind，好处是提前定义好多组css class然后在它们直接动态切换

::: code-group

```vue [基本用法]
<template>
  <button @onclick="show =!show">切换</button>
  <Transition>
    <p v-if="show">hello</p>
  </Transition>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
```

:::

### TransitionGroup

定义：
- 用于对v-for列表中的元素或组件的插入、移除、顺序改变添加动画效果

和Transition的区别：
- 默认情况下，不会渲染一个容器元素，但可以通过传入tag prop指定一个元素作为容器元素来渲染
- 过渡模式mode prop在这里不可用，因为不是互斥场景切换
- 列表元素必须有独一无二的key属性
- css过渡的class会应用到列表元素上，而非容器元素上
- 通过在js钩子中读取元素的data attribute，可以实现带渐进延迟的列表动画，看下例

::: code-group

```vue [基础用法]
<template>
  <TransitionGroup
    name='list'
    :css="false"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @leave="onLeave"
    tag='ul'
  >
    <!-- 下面的data-index会通过el.dataset.index传给事件 -->
    <li
      v-for="(item, index) in items" 
      :key="item.msg"
      :data-index="index"
    >
      {{ item.msg }}
    </li>
  </TransitionGroup>
</template>

<script setup>
import { reactive } from 'vue'
import gsap from 'gsap'

const items = reactive([
  {
    msg: 'aaa'
  },
  {
    msg: 'bbb'
  }
])

function onEnter (el, done) {
  gsap.to(el, {
    opacity: 1,
    height: '1.6em',
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}
</script>

<style lang='scss'>
.list {
  // move: 对移动中的元素应用过渡
  // 解决周围元素立即发生跳跃而非平稳移动的问题
  &-move,
  &-enter-active,
  &-leave-active {
    transition: all .5s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
}
</style>
```

:::

## KeepAlive

定义：在多个组件间动态切换时缓存被移除的组件实例

使用：
- KeepAlive默认会缓存内部的所有组件实例
- 可以通过include、exclude prop定制是否需要进行缓存，会根据组件的name选项进行匹配（在3.2.34版本+，使用script setup会自动根据文件名生成对应的name选项；在它以下版本，需要显式声明一个name选项）。prop的值可以是字符串、正则表达式（v-bind）、数组（v-bind）
- 可以通过max prop（number类型）设置可被缓存的最大组件实例数，在指定了max后类似一个LRU缓存：缓存实例数量即将超过指定的那个最大数量时，则最久没被访问的缓存实例将被销毁，以便为新的实例腾出空间
- 当一个组件实例从DOM上移除但由于被KeepAlive缓存而仍作为组件树的一部分时，它将变为不活跃状态而非被卸载；而当它作为缓存树的一部分插入到DOM中时，它将重新被激活。一个持续存在的组件可通过onActivated（首次挂载时、重新插入时）和onDeactivated（从DOM中移除时、卸载时）注册相应的两个状态的生命周期钩子。这两个钩子不仅可在缓存的根组件中定义，也可在缓存树中的后代组件中定义

::: code-group

```vue [基本语法]
<template>
  <!-- 默认形式：非活跃组件会被缓存 -->
  <KeepAlive>
    <component :is="activeComponent"/>
  </KeepAlive>

  <!-- 包含的组件a,b会被缓存，字符串形式 -->
  <KeepAlive include="a, b">
    <component :is="activeComponent"/>
  </KeepAlive>

  <!-- 包含的组件a,b会被缓存，正则和数组形式 -->
  <KeepAlive :include="/a|b/">
    <component :is="activeComponent"/>
  </KeepAlive>
  <KeepAlive :include="['a', 'b']">
    <component :is="activeComponent"/>
  </KeepAlive>
  
</template>
```

```vue [在KeepAlive内缓存的组件中使用钩子]
<!-- 
  比如下面的钩子函数是a或b组件，也可是a组件下的某个后代组件中定义的
 -->
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // 调用时机：
  // 1. 首次挂载时
  // 2. 每次从缓存中被重新插入时
})

onDeactivated(() => {
  // 调用时机：
  // 1. 从DOM上移除进入缓存时
  // 2. 组件卸载时
})
</script>
```

:::

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
- 在`<script>`中的directives钩子选项中定义属性x，属性值是指令对象，然后可在template中（用v-）使用
- 对于通过import导入的指令，也应当符合`vMyDirective`的命名形式（可通过重命名搞定）
- 全局注册指令，使用`app.directive('name', {'指令对象'})`
- 在组件上使用自定义指令时，会始终作用于组件的单根节点。对于多根节点则会被忽略同时抛出警告。

解释：
- 当只需要在mounted和updated执行相同的行为时，可使用简化形式，即自定义钩子对象换成`(el, binding) => {}`函数形式即可

改动：
- 修改了一些属性表述，其声明周期钩子和组件的保持类似（更容易记住）；
- 使用`binding.instance`访问组件实例
- 当作用域多根组件（片段）时，自定义组件会被忽略并抛出警告

::: code-group

```typescript [自定义钩子对象]
// 自定义钩子对象
const MyDirective = {
  // 新增
  // el: 绑定的元素，可读参数，其余参数均是只读参数
  // binding：一个对象，具有value、oldValue、arg、modifiers、instance、dir属性
  // value：传给指令的值
  // oldValue：之前的值，仅在beforeUpdate和updated可用
  // arg：指令参数，可以是动态参数
  // modifiers：指令修饰符对象
  // instance：指令组件实例
  // dir：指令的定义对象
  // vnode：绑定元素的底层VNODE
  // prevNode：之前渲染中指令绑定的元素vnode，仅在beforeUpdate和updated可用
  // 在绑定元素的attribute前或事件监听器应用前调用
  created (el, binding, vnode, preVnode) {}
  // 元素插入到dom前调用
  beforeMount () {},
  // 在绑定元素的父组件，及元素的所有子节点都挂载完成后调用
  mounted () {},
  // 新增，绑定元素的父组件更新前调用
  beforeUpdate () {},
  // 绑定元素的父组件及元素的所有子节点更新后调用
  updated () {},
  // 新增，绑定元素父组件卸载前调用
  beforeUnmount () {},
  // 绑定元素的父组件卸载后调用
  unMounted () {}
}
```

```typescript [简化形式]
// 相当于只有了mounted和updated钩子，且两个钩子实现的细节相同
const vName = (el, binding) => {
  console.log(el, '获取el')
}
```

```vue [使用自定义钩子]
<template>
  <!-- v-指令名：指令参数.修饰符1....修饰符n="值" -->
  <div v-name:arg.modifiers1.modifiers2="value">
</template>
```

:::

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

::: code-group

```typescript [插槽用法]
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

```vue [插槽类型]
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
:::

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

::: code-group
```typescript [v-model简写]
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

```vue [基本用法]
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
<script>
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
</script>
```

```vue [带修饰符的v-model]
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
:::

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
```typescript
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
