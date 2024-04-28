# react-dom@18.2.0

> 包含一些仅支持在浏览器dom环境下运行的方法，不支持在react native中使用

## API

### createPortal（传送门）

作用：将children的内容渲染到targetDomNode节点上（视觉效果：即改变位置，但认可读取到代码位置上的数据）

定义：`const portal = createPortal(children, targetDomNode, key?)`

定义说明：

1. 参数children：要渲染的内容，可以是JSX、Fragment、字符串、数字，以及它们构成的数组
2. 参数targetDomNode：要渲染到的节点（已经存在的）
3. 参数key：可选，用于区分多个portal
4. 返回值portal：React节点

::: code-group

```jsx [基本用法]
// 部分代码省略
function PortalExample(){
   const [showModal, setShowModal] = useState(false)

   const [popupContainer, setPopupContainer] = useState(null)

   useEffect(() => {
      if (mapRef.current === null) {
         const map = createMapWidget(containerRef.current)
         mapRef.current = map
         const popupDiv = addPopupToMapWidget(map)
         setPopupContainer(popupDiv)
      }
   }, []);

   return (
      <>
         <button onClick={() => setShowModal(true)}>打开模态框</button>
         {showModal && createPortal(
            {/* 1：children */}
            <ModalContent onClose={() => setShowModal(false)}/>,
            {/* 2：targetDom，只要页面上能够读取到的dom都可以，不管是不是react应用上的 */}
            document.getElementById('other-app-container')
         )}

         {poupContainer && createPortal(
            {/* 1：children */}
            <ModalContent onClose={() => setShowModal(false)}/>,
            {/* 2：也可以是react上的某个组件的节点，通ref.current读取到的 */}
            popContainer
         )}
      </>
   )
}
```

:::

注意：

- 只改变节点的渲染位置，其他方面和普通的react节点一样，可以读取当前代码位置的任意内容，以及进行事件传递

### flushSync

作用：强制react在提供的回调函数中同步刷新任何更新，确保DOM立即更新，频繁调用会严重影响性能，仅对第三方代码集成有帮助（比如浏览器的打印api等）

定义：`flushSync(callback)`

::: code-group

```jsx [和打印api结合使用]
function PrintApp(){
   const [isPrinting, setIsPrinting] = useState(false)

   useEffect(() => {
      function handleBeforePrint(){
         flushSync(() => {
            // 该操作将立马更新，不会等待react的渲染
            setIsPrinting(true)
         })

         // 若是不使用flushSync，则该操作不会渲染在页面上，被挂起
         setIsPrinting(true)
      }

      function handleAfterPrint(){
         sethIsPrinting(false)
      }

      window.addEventListener('beforeprint', handleBeforePrint)
      window.addEventListener('afterprint', handleAfterPrint)

      return () => {
         window.removeEventListener('beforeprint', handleBeforePrint)
         window.removeEventListener('afterprint', handleAfterPrint)
      }
   }, []);

   return (
      <>
         <h1>是否打印：{isPrinting ? '是' : '否'}</h1>
         <button onClick={() => window.print()}>打印</button>
      </>
   )
}
```

```jsx [和ref一起使用]
let nextId = 0

function TodoList(){
  const listRef = useRef(null)
  const [text, setText] = useState('')
  const [todos, setTodos] = useState([])

  function handleAdd(){
    const newTodo = {
      id: nextId++, text: text
    }
    // 立马更新dom
    flushSync(() => {
      setText('')
      setTodos([...todos, newTodo])
    })
    // 使用flushSync后，滚动到最底部才能看到更新的节点，不然看到的内容是空白的
    listRef.current.lastChild.scrollIntoView({
      behavoir: 'smooth',
      block: 'end'
    })
  }

  return (
    <>
      <button onClick={handleAdd}>添加</button>
      <input value={text} onChange={e => setText(e.target.value)}/>
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  )
}
```

:::

## 客户端API

### createRoot

作用：创建React根节点，仅在客户端渲染使用

定义：

1. `const root = createRoot(domNode, options?)`
2. `root.render(reactNode)`
3. `root.unmount()`

定义说明：

1. 参数domNode：一个dom元素
2. 可选参数options：配置根节点的对象，有可选参数onRecoverableError函数（在react从异常中恢复时自动调用）、可选参数identifierPrefix（配合useId生成id的字符串前缀，避免多根节点产生的id冲突）
3. 返回值root：返回一个带有render、unmount的对象
4. root.render方法：将jsx在根节点中渲染为dom节点
5. 参数reactNode：react节点，比如jsx、createElement创建的react元素、字符串、数字、null、undefined
6. root.unmount方法：销毁根节点的渲染树，通常情况下不会调用它

```javascript
// 该api通常用于应用入口
import { createRoot } from 'react-dom/client'
import App from './App.js'
import './styles.css'

const root = createRoot(document.getElementById('root'))
root.render(<App/>)
```

### hydrateRoot

作用：接管先前由react-dom/server（服务端渲染）生成的浏览器dom节点（domNode），并替换节点内容为reactNode

定义：`const root = hydrateRoot(domNode, reactNode, options?)`

定义说明：

1. 参数domNode：一个在服务器渲染时呈现为根元素的dom元素
2. 参数reactNode：用于渲染已存在html的react节点
3. 返回值root：返回一个带有render、unmount的对象

注意：

- 如果应用程序的html是使用react-dom/server生成的，则需要使用该api
- 传递给hydrateRoot的react树必须与服务器渲染的react树完全匹配，否则将导致hydrate错误，同时也会造成不好的用户体验（即内容不一致）
- 通常只需要在启动时执行一次，若使用框架（比如nextjs），则可能自动在幕后执行此操作
- 处理客户端和服务端不同的内容，在useEffect中使用某标志判断是否是客户端环境然后再条件渲染，这种方法会导致hydrate变慢，因为需要渲染两次

hydrate错误的原因：

- 根节点React生成的html周围存在额外的空白符（比如换行符）
- 在渲染逻辑中使用typeof window !== 'undefined'这样的判断
- 在渲染逻辑中使用仅限于浏览器端的api，例如window.matchMedia
- 中服务端和客户端渲染不同的内容

::: code-group

```jsx [基础用法]
import { hydrateRoot } from 'react-dom/client'
import App from './App.js'

// 用APP组件替换节点root的内容
const root = hydrateRoot(document.getElementById('root'), <App counter={0}/>)

// 更新hydrate组件: root.render
let i = 0
setInterval(() => {
  root.render(<App counter={i}/>)
  i++
}, 1000)
```

```jsx [hydrate整个文档]
function App(){
  return (
    <html>
      {/* 和html结构类似...... */}
    </html>
  )
}

hydrateRoot(document, <App/>)
```

```jsx [消除hydrate错误]
function App() {
  return (
    // 使用suppresHydrationWarning={true}消除错误
    <h1 suppresHydrationWarning={true}>Hello World</h1>
  )
}

hydrateRoot(document.getElementById('root'), <App/>)
```

:::

