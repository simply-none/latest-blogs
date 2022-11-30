# Hooks

Hook基本概念：
- hook可以在不编写class的情况下使用state以及其他react特性
- hook为已知的react概念提供了更直接的api：props、state、context、refs、生命周期
- 使用hook从组件中提取状态逻辑，使得这些逻辑可以单独测试并复用

定义：
- hook是一些可以让你在函数组件里钩入react state及生命周期等特性的函数
- hook函数必须以use开头，函数内部可以调用其他引入的自定义hook

使用规则：hook就是js函数，他有以下规则：
- 只能在函数最外层调用hook，不能在循环内、条件判断中、子函数中调用hook
- 只能在react的函数组件和自定义的hook中调用hook，不能在其他js函数中调用
- 可以安装`npm install -D eslint-plugin-react-hooks`插件强制执行上面两条规则

```js
// eslint配置
{
  "plugins": [
    "react-hooks"
  ],
  "rules": {
    // 检查hook规则
    "react-hooks/rules-of-hooks": "errors",
    // 检查effect依赖
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

注意事项：
- hook不能在class组件中使用

## state hook

声明state变量：`const [age, setAge] = useState(initVal)`
- 其中
- 返回当前state以及更新state（如age）的函数setState（如setAge）
- 可以一次性声明多个state变量，重复使用多次useState即可

```js
import React, {useState} from 'react'

function Example () {
  // 声明state变量：使用数组解构
  const [count, setCount] = useState(0)

  // 使用多个state：更新state的变量名是state前加set
  const [age, setAge] = useState(0)
  const [todos, setTodos] = useState([{text: 'study'}])

  return (
    <div>
      <p>点击次数：{count}</p>
      // 更新count：直接用count+1 替换count
      <button onClick={() => setCount(count + 1)}>点击</button>
    </div>
  )
}
```

## effect hook

定义：
-effect hook就是useEffect函数，他给函数组件增加了操作副作用的能力（即渲染后需要执行的内容，会在每次渲染、挂载更新、卸载后执行）
- useEffect跟class组件中的componentDidMount（dom加载时）、componentDidUpdate（dom数据更新时）、componentWillUnmount（dom组件树卸载时）具有相同的用途，只不过被合并成了一个api（即这三个生命周期发生的操作都放在这一个函数中执行）

使用：
- useEffect参数是一个可选的返回函数的一个箭头函数，通过返回一个函数指定如何清除副作用，这个函数即class组件中componentWillUnmount中的内容
- 可以一次性声明多个useEffect函数
- 每次渲染时，useEffect的箭头函数都是不相同的，这保证了每次获取的都是最新的值

```js
// 使用多个effect，按逻辑（用途）将不同的功能分离到不同的effect中
function FriendStatusWithCounter (props) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    // 这段代码会在初始渲染和和每次dom更新时执行
    document.title = '点击的次数: ' + count
  })

  // 特性，类似componentDidUpdate的功能，仅在某某条件下更新（性能优化）
  useEffect(() => {
    // 这段代码会在初始渲染和和每次dom更新时执行
    document.title = '点击的次数: ' + count
    // 第二个参数，表示仅在count更改时才会执行这个effect（包括下面的返回函数）
  }, [count])

  useEffect(() => {
    function handleStatusChange (status) {
      setIsOnline(status.isOnline)
    }

    ChatApi.subscribeToFriendStatus(props.friend.id, handleStatusChange)
    
    // 这段代码会在dom卸载时执行
    return () => {
      ChatApi.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange)
    }
    // 也可以是一个具有名字的函数
    // return function unsubscribe () {
    //   ChatApi.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange)
    // }
  })

  // ui结构
  return (
    <div>...</div>
  )
}
```

## 自定义hook

组件逻辑重用的方案：
- HOC
- render props
- 自定义hook

定义：
- 自定义hook就是一段可以供其他hook函数使用的公用的逻辑函数
- 不同的hook使用自定义hook，他们的state是不会共享的

注意：
- 避免过早的增加抽象逻辑，即在项目的一定阶段，将公有的函数抽象成自定义的hook

```js
// 定义一个自定义hook
import {useState, useEffect} from 'react'

function useFriendStatus (friendId) {
  const [isOnline, setIsOnline] = useState(null)

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline)
    }

    ChatApi.subscribeToFriendStatus(friendId, handleStatusChange)
    return () => {
      ChatApi.unsubscribeFromFriendStatus(friendId, handleStatusChange)
    }
  })

  return isOnline
}

// 使用自定义hook
const friendList = [
  {id: 1, name: 'phpebe'},
  {id: 2: name: 'ross'}
]

function ChatRecipientPicker() {
  const [recipientId, setRecipientId] = useState(1)
  // 使用自定义hook
  const isRecipientOnline = useFriendStatus(recipientId)

  return (
    <>
      <Circle color={isRecipientOnline ? 'green' : 'red' }/>
      <select value={recipientId} onChange={e => setRecipientId(Number(e.target.value))}>
        {
          friendList.map(friend => (
            <option key={friend.id} value={friend.id}>{friend.name}</option>
          ))
        }
      </select>
    </>
  )
}
```

## 其他hook

> 使用频率较低的hook

### useRef

定义：`const ref = useRef(initialValue)`
- 返回一个可变的ref对象，该对象在组件的整个生命周期内持续存在
- ref的current属性的初始值为initialValue

注意：
- ref对象内容发生变化时，useRef并不会通知，改变其current属性不会引发组件的重新渲染
- 若想在react绑定/解绑dom节点的ref时运行某些代码，应使用[回调ref](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node)

### useContext

用法：`const context = useContext(MyContext)`
- 接收一个context对象（即React.createContext`的返回值），并返回该context的当前值（由上层组件中距离当前组件最近的`<Mycontext.Provider>`的value决定
- 上层组件的context更新，会触发该hook，即使祖先使用React.memo或shouldComponentUpdate，也会在组件本身使用useContext时重新渲染

```js
const themes = {
  light: {
    background: '#000000',
    foreground: '#eeeeee'
  },
  dark: {
    background: '#ffffff',
    foreground: '#222222'
  }
}

const ThemeContext = React.createContext(themes.light)

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar/>
    </ThemeContext.Provider>
  )
}

function Toobar (props) {
  return (
    <div><ThemedButton/></div>
  )
}

function ThemedButton () {
  // 这行相当于class组件的：static contextType = Mycontext或<MyContext.Consumer></MyContext.Consumer>
  const theme = useContext(ThemeContext)
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>切换主题</button>
  )
}
```

### useReducer

> 推荐：https://zhuanlan.zhihu.com/p/69428082

定义：useReducer是useState的替代方案，主要用于以下场景：
- 逻辑复杂的state，比如state是一个对象形式
- 下一个state依赖于之前state的值时

定义方式：
- `const [state, dispatch] = useReducer(reducer, initialState)`， reducer是一个更新state的函数， initialState是state的初始值
- `const [state, dispatch] = useReducer(reducer, initArg, init)`，init是一个获取state初始值的函数，initArg是init的参数

使用方式：
- state：获取state的值
- dispatch：更新state的函数，参数是一个含type，payload（数据，名字可以是其他名字）的对象

注意事项：
- 若reducer的返回值和state的值一致，则会跳过子组件的渲染和对应的执行操作
- 若在渲染期间执行了高开销的操作，可以使用useMemo优化

```js
import { useReducer } from "react"
const initialState = { count: 1 }

// useReducer是userState的替代方案
// 适用场景：state逻辑较复杂，且包含多个子元素时，或者下一个state依赖于之前的state
function reducer (state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      throw new Error()
  }
}

function Counter () {
  // 可以向子组件传递dispatch，比如结合context一起
  // 因为dispatch函数是稳定的，不会随着渲染变化而变化
  // useReducer的使用方式：
  // 1. const [state, dispatch] = useReducer(reducer: reducer函数, initialState: 初始的state对象/值)
  // 2. 惰性初始化： const [state, dispatch] = useReducer(reducer, initialArg: 初始state的函数的参数, init: 初始state的函数)
  const [count, dispatch] = useReducer(reducer, initialState)
  console.log(count, dispatch)

  return (
    <div>
      当前数量：{count.count}
      <hr />
      <button onClick={() => dispatch({ type: 'decrement' })} style={{ 'margin-right': '20px' }}>
        -
      </button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </div>
  )
}

export default Counter
```

### useCallback

定义：返回一个带有记忆功能的回调函数，该回调函数仅在某个依赖项改变时才会更新，当把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染的子组件是，将非常有用

使用：`useCallback(fn, depsArr)` === `useMemo(() => fn, depsArr)`
- depsArr：依赖项数组，所有回调函数fn中引用的值都应该出现在depsArr中

注意：
- 推荐启用`eslint-plugin-react-hooks`的exhaustive-deps规则，它会在添加错误依赖时发出警告

### useMemo

定义：返回一个记忆的值，把创建函数和依赖项数组作为参数传入useMemo，它仅会在某个依赖项改变时才重新计算记忆的值，有助于避免每次渲染都进行高开销的计算

使用：`const memoizedValue = useMemo(() => fn(a, b)：创建函数, [a, b]：依赖项数组)`

注意：
- 不要在创建函数内执行不应该在渲染期间执行的操作，应该将其放在useEffect中
- 若未传入依赖项数组，则useMemo在每次渲染时都会计算新的值

### 其他的hook

- useImperativeHandle
- useLayoutEffect
- useDebugValue
- useDeferrerdvalue
- useTransition：
- useId：生成一个稳定且唯一的id