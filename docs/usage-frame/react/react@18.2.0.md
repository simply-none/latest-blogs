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
3. setup 的返回值`cleanup`的作用：与 setup 逻辑对称，用于停止/撤销 setup 做的事情

注意：

- 只能在组件顶层或自己的 hook 中调用，不能在循环/条件内部调用（可抽离新组件，在其内部调用）
- 如果 setup 内的代码不使用任何响应式值，则其依赖项列表应为空数组，此时在组件的 props、state 变更时，该 setup 函数不会重新执行
- 当不传递依赖数组时（即该参数完全省略），setup 函数会在组件每次单独渲染/重新渲染（即所有的响应式值导致的组件重渲染）之后运行
- 无法选择 effect 的依赖项，在 setup 内部使用的每个响应式值都必须声明为依赖项。换言之，如果某个 setup 内部使用到的值不需要作为一个依赖项，则可以声明在组件（函数）外部，表示该值是非响应式的，在重渲染时不会发生变化
- 若依赖项是组件内部定义的对象/函数，可能会导致 effect（setup）过多的重新运行。所以应该删除不必要的对象/函数依赖项，或者抽离状态更新和非响应式逻辑到 effect 外部，或者将函数定义在 setup 内部
- 若需要跟踪一些不用于渲染的数据，可以使用 ref`useRef`调用，这不会触发重新渲染
- 若 setup 内部具有多个响应式变量，按理来说，必须添加所有变量到依赖数组中，这在你仅需要依赖一个响应式变量但又需要其他值的时候明显做不到，此时可以使用 Effect 事件`useEffectEvent hook`，将读取其他值的代码放入该 hook 中，然后在 setup 中调用该 hook 即可 📕📕(⛔ 实验性 api)
- 非交互（点击）引起的 effect 运行，会让浏览器在运行 effect 前绘制出更新后的屏幕
- 交互引起的 effect 运行，也可能会在运行 effect 前重绘屏幕。当要阻止屏幕重绘，应使用 useLayoutEffect 代替 useEffect
- 视觉相关的事情（如定位）且有明显的延迟，应使用 useLayoutEffect 代替 useEffect
- 仅在客户端（非 ssr）运行
- 在开发模式下，会在 setup 首次运行前，额外运行一次 setup 和 cleanup，这是一个压力测试，用于验证 effect 逻辑是否正确实现。若此时出现问题，则表明 cleanup 函数缺少一些逻辑
- 在服务器和客户端中显示不同的内容，可通过 effect 实现，将某个标志性变量置为真值（因为 effect 在服务器是不可用的，所以此仅在客户端可用），之后将运行你编写的真值条件下的代码。若用户网络环境缓慢，将一直显示初始代码，可能造成不良影响。许多情况下，可通过 css 条件显示不同内容

用法：

1. 连接到外部系统（网络、浏览器 API、第三方库）
   - 需要在组件顶层调用 useEffect

::: code-group

```javascript [setup内部仅依赖一个值]
// setup内部仅依赖一个值，但又要读取其他值⛔实验性api
function Page({ url, shoppingCart }) {
  // 定义一个effect事件
  const onVisit = useEffectEvent((visitedUrl) => {
    // 此处处理相关代码，例如读取shoppingCart
    console.log(shoppingCart);
  });

  useEffect(() => {
    onVisit(url);
    // 此处仅仅需要将url添加到依赖数组中，而shoppingCart不需要
  }, [url]);
}
```

:::

### useId

定义：`useId()`

返回值：返回一个唯一的字符串 ID

注意：

- 只能在组件顶层/hook 中调用，不能用在循环或条件判断中
- useId不应该用在列表的key中，列表key应由数据生成
- 使用服务端渲染时，useId需要在服务器和客户端上有相同的组件树，若在两者之间渲染的树不完全匹配，则生成的id也是不匹配的

用法：

- 该hook能够保证生成的id是整个应用全局唯一的，避免了id之间的冲突
- 能够和服务端渲染一起工作，且生成内容的顺序和预期是一致的，在这一点上递增计数器（+1）在渲染之后输出的顺序可能不一致（在服务器渲染期间，组件会生成并输出成html，然后在客户端上，`hydration`会将事件处理程序附加到html上。），useId能够确保hydration正常工作，且服务器和客户端的输出是匹配的
- 若一组相关的元素需要生成id，可使用useId生成一个字符串前缀，然后再在对于的元素上加上独特的后缀标识即可
- 若单个页面上渲染了多个独立的react程序，需要先在`createRoot`或`hydrateRoot`调用中将identifierPrefix作为选项传递（用于指定前缀），然后正常调用useId，这样能够确保各个应用之间使用useId生成的id不冲突

## 附录

### 专有名词

**外部系统**：不受 react 控制的代码，比如网络、某些浏览器 API（interval 定时器、eventListener 侦听器）、第三方库

```

```
