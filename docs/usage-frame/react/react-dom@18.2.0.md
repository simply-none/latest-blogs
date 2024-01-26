# react-dom@18.2.0

> 包含一些仅支持在浏览器dom环境下运行的方法，不支持在react native中使用

## API

### createPortal

作用：创建portal，将该children传入到目标节点，而非当前代码所在位置（改变dom节点所处的位置）

定义：`<div>{ createPortal(children, targetDomNode, key?) }</div>`

定义说明：

1. 参数children：react可以渲染的任意内容，如JSX片段、Fragment、字符串、数字，以及它们构成的数组
2. 参数targetDomNode：某个已经存在的dom节点
3. 可选参数key：
4. 返回值：返回一个react节点

注意：

- 只改变节点的渲染位置，其他方面和普通的react节点一样，可以读取当前代码位置的任意内容，以及进行事件传递

### flushSync

作用：强制react在提供的回调函数callback内同步任何更新，以确保dom立即更新

定义：`flushSync(callback)`

注意：

- 使用它有可能损伤应用程序性能
- 通常用于第三方代码集成（比如浏览器API），只使用react api，没必要使用该api

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

作用：允许在先前由react-dom/server生成的浏览器dom节点中接管该节点，并展示传入的react组件

定义：`const root = hydrateRoot(domNode, reactNode, options?)`

定义说明：

1. 参数domNode：一个在服务器渲染时呈现为根元素的dom元素
2. 参数reactNode：用于渲染已存在html的react节点
3. options同上，返回值同上

注意：

- 如果应用程序的html是使用react-dom/server生成的，则需要使用该api
- 可在服务器和客户端呈现不同内容
