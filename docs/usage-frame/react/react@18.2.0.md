# react@18.2.0

## hook

### useEffect

定义：`useEffect(setup, dependencies?)`

参数：

1. setup: 处理 effect 的函数，选择性返回一个清理函数 cleanup
   - 在组件被添加到 dom 时，将运行 setup
   - 在依赖项变更导致重渲染后，将用旧值运行 cleanup，后用新值运行 setup
   - 在组件从 dom 中移除后，将运行 cleanup
2. dependencies?: setup 内部引用的所有响应式值的列表（props、state、所有直接在组件内部声明的变量和函数）
   - 依赖项列表的元素数量必须固定
   - 使用 Object.is 比较依赖项和其先前的值
   - 省略参数，则在重渲染后，重新运行 effect（setup）

注意：

- 只能在组件顶层或自己的 hook 中调用，不能在循环/条件内部调用（可抽离新组件，在其内部调用）
- 若依赖项是组件内部定义的对象/函数，可能会导致 effect（setup）过多的重新运行。所以应该删除不必要的对象/函数依赖项，或者抽离状态更新和非响应式逻辑到 effect 外部
- 非交互（点击）引起的 effect 运行，会让浏览器在运行 effect 前绘制出更新后的屏幕
- 交互引起的 effect 运行，也可能会在运行 effect 前重绘屏幕。当要阻止屏幕重绘，应使用 useLayoutEffect 代替 useEffect
- 视觉相关的事情（如定位）且有明显的延迟，应使用 useLayoutEffect 代替 useEffect
- 仅在客户端（非 ssr）运行
- 在开发模式下，会在 setup 首次运行前，额外运行一次 setup 和 cleanup，这是一个压力测试，用于验证 effect 逻辑是否正确实现。若此时出现问题，则表明 cleanup 函数缺少一些逻辑

用法：

1. 连接到外部系统（网络、浏览器 API、第三方库）
   - 需要在组件顶层调用 useEffect

::: code-group

:::

## 附录

### 专有名词

**外部系统**：不受 react 控制的代码，比如网络、某些浏览器 API（interval 定时器、eventListener 侦听器）、第三方库
