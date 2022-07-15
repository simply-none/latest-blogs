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

## 组合式API

使用场景：
- 将零散分布的逻辑组合在一起来维护，还可以将单独的功能逻辑拆分成单独的文件
- 将同一个功能所属逻辑抽离到函数组件当中（使用`export default function xxx () {}`的形式），在需要的时候进行导入即可

### 响应性

#### 响应性基础

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

### setup组件选项

定义：setup选项在组件被创建之前执行，一旦props被解析完成，它就将被作为组合式api的入口

使用：
- setup选项可以和data、methods等选项并列使用，它是一个函数，可接收props和context参数
- 可以将setup返回的内容（返回一个对象），暴露给组件的其余部分以及组件模板使用

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



注意：
- setup中避免使用this，他不会找到组件实现（因为在创建之前执行的）
- setup的调用发生在data、computed、methods被解析之前，所以他们都无法在setup中被获取

### script setup