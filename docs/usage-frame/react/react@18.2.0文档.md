# react@18.2.0 doc

## 工具

- html2jsx: <https://transform.tools/html-to-jsx>

## 安装

使用由react驱动的框架：

- Next.js: `npx create-next-app@latest`
- Remix: `npx create-remix`
- Gatsby: `npx create-gatsby`
- Expo: `npx create-expo-app`

::: details 安装

1. 安装步骤

```bash
Need to install the following packages:
create-next-app@14.1.0
Ok to proceed? (y) y
√ Would you like to use TypeScript? ... No / Yes
√ Would you like to use ESLint? ... No / Yes
√ Would you like to use Tailwind CSS? ... No / Yes
√ Would you like to use `src/` directory? ... No / Yes
# 是选择app router还是pages router
√ Would you like to use App Router? (recommended) ... No / Yes    
√ Would you like to customize the default import alias (@/*)? ... 
No / Yes
√ What import alias would you like configured? ... @/*
```

2. pages router目录结构

pages router会自动根据pages下的目录结构自动生成对应的路由，比如`pages/index`是映射为根路由`/`，`pages/home/index`映射为`/home`的路由形式

```bash
├── public
    │   ├── favicon.ico     # Favicon
    │   ├── next.svg
    │   └── vercel.svg
    ├── src
    │   ├── pages               # Page Router
    │   │   ├── api
    │   │   │   └── hello.js
    │   │   ├── _app.js
    │   │   ├── _document.js
    │   │   └── index.js        # home Page
    │   │
    │   └── styles
    │       ├── globals.css
    │       └── Home.module.css
    │
    ├── jsconfig.json           # JavaScript 配置文件
    ├── next.config.js          # Next.js 配置文件
    ├── package-lock.json       # 项目依赖和脚本（锁定），运行 npm install 后自动生成
    ├── package.json            # 项目依赖和脚本
    └── README.md
```

:::

## 基础

react框架：nextjs（全栈框架）、remix（嵌套路由全栈框架）、Gatsby（支持cms）、expo（支持原生）

**使用**：

- react组件必须以大写字母开头，html标签必须是小写字母
- react组件只支持单根节点，多节点可用Fragment组件包裹
- react组件接收props对象作为其唯一参数
- 不要在一个组件内部定义其他组件，原因是每次组件因响应式变更导致重渲染时，内部的非响应式变量/函数都将重置/初始化
- 组件返回值可以全写在一行上，多行内容需用`()`包裹，否则return下一行之后的代码都将被忽略
- 条件渲染同js，比如if，&&，三元运算符
- 不想渲染任何内容，可返回null
- 可将jsx赋值给变量
- 对于列表，使用filter进行组件筛选，使用map进行组件转换，列表项需要使用key属性进行唯一标识
- 若列表项返回多个节点，必须使用Fragment，而非其简写形式

**jsx语法**：让你在js文件中书写类似html的标签

- 只能返回一个根元素
- 标签必须闭合
- 大部分属性用驼峰式语法命名，不能包含`-`以及保留字。
- 历史原因，`aria-*`, `data-*`以html格式书写的
- 变量和js表达式使用`{}`括起来，比如属性`className={classObj}`, `{arr.map(i => <li/>)}`

注意：

- react和jsx是互相独立的
- 将未经处理的对象作为文本内容使用会报错
- 使用&&运算符时，左侧若是0，将返回0

**props**：react使用props进行父子组件通信

- props可进行解构`function App({name, age}) {}`
- prop属性可指定默认值`function App({name = 'jade'}){}`
- 组件内部接收props，可使用展开语法`...props`，避免一长串的代码
- 使用组件时，嵌套的内容将作为children prop传入到组件内部

**纯粹的组件**：

- react假使编写的所有组件都是纯函数，即输入相同，返回的jsx也相同
- 组件的渲染过程始终是纯粹的，不会改变在组件渲染之前就已经存在的任何对象/变量，这将变得不纯粹；但可更改在渲染时刚创建的变量

**事件**：

- 事件处理程序命名通常为`handleXxx`
- 内联事件，直接在标签属性上用大括号包裹起来写普通/箭头函数定义
- 将逻辑提取到外部，使用`onClick={handleClick}`或`onClick={() => handleClick()}`，不能用`onClick={handleClick()}`，这会立即执行，而非点击执行，因为jsx大括号内的代码都会立即执行
- 通常会在父组件定义子组件的事件处理程序，这时可将它作为props传递到子组件中，按照惯例，事件处理程序prop用on开头
- 确保为事件处理程序使用恰当的html标签，比如点击使用button而非div
- 阻止事件传播（e.stopPropagation），捕获阶段事件（onClickCapture），阻止默认行为（e.preventDefault）都是使用js语法
- 对于事件传播，可将绑定于父组件的事件作为props传给子组件，让子组件显示调用它
- 事件处理程序不需要是纯函数

**state**：

- 局部变量，即组件内部使用的普通变量，在组件每次重渲染时，都是代码中定义好的值，无法随用户操作而变更值，同时也不会触发渲染
- useState用于保存渲染期间的数据，更新时会触发渲染
- 设置state时，只会在下一次渲染变更state的值，即当前时间节点上还是目前的值

**state构建原则**：

- 合并关联的state
- 避免互相矛盾的state
- 避免冗余的state：对于某些可通过其他state创建的变量，不应该设置为state，而是通过赋值state的形式让其成为一个常量，这样在每次state重渲染的时候，也会重新计算该常量。例如`const fullName = firstName + ' ' + lastName`，其中fullName依赖于后面两个state
- 避免重复的state：如果两个state具有相同的对象，应该优化它
- 避免深度嵌套的state

**不能作为state的值**：

- 随着时间推移保持不变的
- 通过props从父组件传递的
- 基于已存在是state/props进行计算的

**state状态保留与重置**：

> [注：](https://zh-hans.react.dev/learn/preserving-and-resetting-state#challenges)，最后的挑战有意思，可以多学习

- 当组件在UI链树中的位置保持不变时，该组件的state会被保留下来。否则将会被重置。
- 可以使用key（辨别同级节点的顺序），改变key来重置state，保持key不变来保留state（即组件的顺序改变，只有key不变，状态依然保留）
- 保留不可见组件的状态
  1. 展示所有组件，用css进行控制显隐（海量数据的树形结构可能会降低性能）
  2. 使用状态提升，将状态保存在公有父组件中
  3. 使用缓存，比如local storage等

解释：

- UI树中的位置（非代码位置），即当用户交互（比如根据条件展示不同的信息）对组件产生了影响时，若交互前后，组件的位置不一致，或组件名称不相同，都会造成组件的state被重置。
- 同名组件在同一位置，state会被保留下来。注意，在条件切换导致该语句块条件为false（比如值为false或null）时，该处位置为`false, comp`和`comp, false`时，这种情况下也是处于非同一位置的。只是false会自动被忽略罢了🟩🟨🟩
- UI链树位置相同，指的是从上到下，组件/元素名称、位置都一致，比如`div > div> comp`和`div > p > comp`，这里的comp就是会被重置的，因为树结构不一致

```jsx
// 🟩🟨🟩
function App () {
  return (
    <div>
      {isA && <Item name={'A'}></Item>}
      {!isA && <Item name={'notA'}></Item>}
    </div>
  )
}

// 此处渲染的结构如下两种情况
// 1. <Item></Item> , false
// 2. false, <Item></Item>
// 故而两种虽然视觉上是同一个ui链结构，但实际上还有一个被忽略的false

// 而这种情况是不会导致组件状态变更的
// 1. <i></i>, <Item></Item>
// 2. false/null, <Item></Item>
```

**组件共享状态**：

- 将state移到公共父级上（状态提升）
- 不一定必须定义一个state，如果一个变量，依赖于其他变量的变更而变更，完全可将其定义成一个常量，例如`const full = setFull(first, last)`，其中full是常量，而first、last是state变量，在每次first/last变更时，会引发重渲染，从而重新计算full的值

useState vs. useReducer：

- 代码体积：
- 可读性
- 可调试性
- 可测试性
- 个人偏好

**context深层传递参数**：

- 使用场景：主题、当前账户、路由、状态管理
- 可将reducer函数传递给context

**context的替代方案**：

- 逐级传递props：清晰的数据流
- 组件嵌套：将组件作为chilren，然后在需要使用数据的地方传递props

重点阅读：

- <https://zh-hans.react.dev/learn/sharing-state-between-components>
- <https://zh-hans.react.dev/learn/preserving-and-resetting-state>

**渲染和提交**：

- 请求和提供ui的过程：（触发渲染-> 渲染组件-> 提交到dom） -> 浏览器绘制
- 触发渲染的原因：初次渲染、组件或其祖先组件的状态（比如state）发生变更
- 渲染组件：初次渲染时，调用根组件，后续渲染，调用内部状态更新触发渲染的函数组件，这个过程是递归的
- 渲染始终是一次纯计算：输入相同则输出也相同，只做渲染的事情，不去更改已存在的变量
- 提交到dom：初次渲染，使用appendChild将创建的所有dom放在屏幕上，重渲染时仅更改有差异的地方的dom节点

**react哲学**：

- 大型项目自下而上构建更简单，简单项目自上而下构建更简单

## 附录

### 纯函数

定义：

1. 只负责自己的任务，不会修改在函数调用前存在的变量和对象
2. 输入相同内容，输出总是一致的

### 副作用

定义：函数式编程大都依赖于纯函数，但某些事物在特定情况下不得不发生改变（比如更新屏幕、启动动画、更改数据等），这些统称为副作用。通俗来说，它们是额外发生的事情，与渲染过程无关

react中，副作用通常属于事件处理程序，仅在执行操作时运行（而非渲染期间），故而无需是纯函数

如果无法为副作用寻找到合适的事件处理程序，可调用useEffect将其附加到返回的jsx中，这会让react在渲染结束时执行它

### 脱围机制

定义：走出react，连接到外部系统

### 受控组件

定义：组件重要信息由传入的props（父组件）进行驱动的，具有最大的灵活性

非受控组件：不受父组件控制的组件，而是由组件自身状态进行驱动

两者的界限不是十分清晰的，可以定义哪些状态受父组件控制，哪些由自身控制
