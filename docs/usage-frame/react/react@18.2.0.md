# react@18.2.0

## hook

注意：所有的hook都只能够在组件顶层和自定义的hook中调用，且在开发严格模式下，调用两次组件方法

### useState

作用：给组件添加一个有状态的变量（即保持变量的响应性）

定义：`const [state, setState] = useState(initialState)`

定义说明：

1. initialState：即变量state的初始值
   - 可以是任意的值，包括函数
   - 对于函数，必须是无参数的纯函数，会将该函数的运行结果作为state的初始值
   - 初始化完成之后，该值就无作用了。后续如果props、state等变更到导致重渲染，该值也不会发挥任何作用。仅在首次渲染有作用
2. 返回值：该函数返回一个由两个值组成的数组
   - state：在首次渲染时，也就是initialState
   - set函数（setState）：更新state的函数，无返回值，在更新时同时触发组件重渲染
   - setState的参数：可以是一个值，也可以是一个纯函数`prev => cur`（根据之前的state计算出现在的state）

注意：

- hook只能在组件的顶层或自己的hook中调用，不能用于循环或条件语句中
- 🔴可以传递一个函数名`fn`作为初始化参数（仅在初始化期间调用），若传递一个函数的调用`fn()`作为参数，则每次重渲染都会进行调用（如果函数执行的时间过长，则容易阻塞页面渲染，造成性能浪费）
- 若state是一个函数，则在更新的时候，应该使用箭头函数的方式`setFn(() => newFn)`，因为默认的直接传函数名方式`setFn(newFn)`，会将其当作初始化函数。
- set函数参数若是依据之前状态计算的表达式`setCount(count + 1)`，若连续调用多次，则实际上就只调用了一次（批量状态更新策略的缘故）；若参数是函数`setCount(prev => prev + 1)`，连续调用多次，实际也是调用多次
- set函数仅更新下一次渲染的状态变量，即在调用该函数之后紧接着调用该状态变量，得到的值还是原来的值
- 如果提供的新值和上一个相同（指的是引用相同，即内存中的地址），将跳过组件重渲染
- 给组件传递一个key，key改变时，可以重置组件的状态（即重新进行初始化渲染）
- 当更新一个对象/数组时`setObj(newObj)`，请进行整个替换`setObj({...newObj})`（也就是引用也随之变更，可使用展开语法复制对象和数组、concat添加、filter删除、slice截取、map等改变数组），而非使用不改变对象引用的方式（比如数组的push等、直接设置属性等）改变对象，不然屏幕可能不会更新。对于复杂的对象或数组，可以使用[`immer`](https://zh-hans.react.dev/learn/updating-arrays-in-state#write-concise-update-logic-with-immer)进行修改，让修改操作更加简洁
- react执行的是批量状态更新策略，即调用set函数后不会立即执行更新，而是等待所有的事件处理函数（比如点击，换句话说，得等待set函数所处的块代码执行完毕）执行完毕后才会更新状态（也就是组件重渲染更新屏幕）。如果你想调用set函数后迫切的更新屏幕（访问dom），可以使用flushSync（影响性能，大多数时候都不用）
- 在调用set函数的代码块中包括异步操作，若异步操作内部也包括state变量，变量的值还是之前的，react执行的是批量状态更新策略，不影响已经运行的事件处理程序中的变量的值（即使是异步的）
- 🔴🍡若出现`Too many re-renders. React limits the number of renders to prevent an infinite loop.`的错误，表明此时组件进行循环`渲染->设置状态（重渲染）-> 渲染`的循环等，需要注意下列情形：
  - 错误指定事件处理函数引起的(即`onClick={handleClick()}`)，在渲染期间大括号的代码会立即执行（比如该函数包含dispatch，会导致一次重渲染（然后进行无限循环：dispatch、渲染、dispatch...）），正确的处理是`onClick={handleClick}`或`onClick={(e) => handleClick(e)}`。也可查看控制台的JavaScript调用堆栈
  - 当一个state的状态依赖于其他state状态的变更，应该注意，在组件顶层作用域中，应该在某种条件下修改state的变更
- 在开发且严格模式下，将两次调用初始化函数，用于找出意外的不纯性

```javascript
function Messsage({messageColor}) {
   // 将props作为初始值，仅在首次渲染时有效，在后续props变更时，不会发生重渲染
   // 若仅仅将其当作初始值，后面更新都跟其无关的话，那这样做是有用的
   const [color, setColor] = useState(messageColor)

   // 正确做法，想在每次props更新都更新
   const color = messageColor
}

// 🔴🍡
function CountLabel ({ count }) {
   const [prevCount, setPrevCount] = useState(count)
   const [trend, setTrend] = useState(null)

   // 注意，在顶层作用域中，必须根据条件修改，否则一直重渲染导致报错
   if (preCount !== count) {
      setPrevCount(count)
      setTrend(count > prevCount ? 'up' : 'down')
   }

   function getCount () {
      return count
   }

   return (<div onClick={getCount}>...</div>)
   return (<div onClick={() => getCount()}></div>)
   // warn: 这种用法也会导致重渲染多次
   return (<div onClick={getCount()})></div>
}

```

### useEffect

作用：将组件与外部系统（不受react控制的内容，比如web api、http、第三方库等）同步

定义：`useEffect(setup, dependencies?)`

定义说明：

1. setup: 处理 effect 的函数，选择性返回一个清理函数 cleanup
   - 在组件被添加到 dom 时，将运行 setup
   - 在依赖项变更导致重渲染后，将用旧值运行 cleanup，后用新值运行 setup
   - 在组件从 dom 中移除后，将运行 cleanup
2. dependencies?: setup 内部引用的所有响应式值的列表（props、state、所有直接在组件内部声明的变量和函数）
   - 依赖项列表的元素数量必须固定
   - 使用 Object.is 比较依赖项和其先前的值
   - 省略参数，则在重渲染后，重新运行 effect（setup）
   - 若effect内部代码不使用任意响应式值，则依赖项列表为空数组，此时组件的props、state变更时，该 effect 不会重新运行
3. setup 的返回值`cleanup`的作用：与 setup 逻辑对称，用于停止/撤销 setup 做的事情

注意：

- 只能在组件顶层或自己的 hook 中调用，不能在循环/条件内部调用（可抽离新组件，在其内部调用）
- 如果 setup 内的代码不使用任何响应式值，则其依赖项列表应为空数组，此时在组件的 props、state 变更时，该 setup 函数不会重新执行
- 当不传递依赖数组时（即该参数完全省略），setup 函数会在组件每次单独渲染/重新渲染（即所有的响应式值导致的组件重渲染）之后运行
- 无法选择 effect 的依赖项，在 setup 内部使用的每个响应式值都必须声明为依赖项。换言之，如果某个 setup 内部使用到的值不需要作为一个依赖项，则可以声明在组件（函数）外部，表示该值是非响应式的，在重渲染时不会发生变化
- 若依赖项是组件内部定义的对象/函数，可能会导致 effect（setup）过多的重新运行。所以应该删除不必要的对象/函数依赖项，或者抽离状态更新和非响应式逻辑到 effect 外部，或者将函数定义在 setup 内部
- 若需要跟踪一些不用于渲染的数据，可以使用 ref`useRef`调用，这不会触发重新渲染
- 若 setup 内部具有多个响应式变量，按理来说，必须添加所有变量到依赖数组中，这在你仅需要依赖一个响应式变量但又需要其他值的时候明显做不到，此时可以使用 Effect 事件`useEffectEvent hook`，将读取其他值的代码放入该 hook 中，然后在 setup 中调用该 hook 即可 📕📕(⛔ 实验性 api)
- 避免不必要的进行更新，大多数性能问题都是由effect创造的更新链（导致反复重新渲染）引起的
- 非交互（点击）引起的 effect 运行，会让浏览器在运行 effect 前绘制出更新后的屏幕
- 交互引起的 effect 运行，也可能会在运行 effect 前重绘屏幕。当要阻止屏幕重绘，应使用 useLayoutEffect 代替 useEffect
- 视觉相关的事情（如定位）且有明显的延迟，应使用 useLayoutEffect 代替 useEffect
- 仅在客户端（非 ssr）运行，所以可能通过这useEffect内修改变量标志，然后在后的代码中来分别运行客户端和服务端的内容
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

### useMemo

作用：缓存计算的结果m（通常缓存变量，虽然说可以缓存函数和JSX节点），在组件重渲染时，若依赖项没有发生变化，则直接返回缓存的m，不重新进行计算

定义：`const m = useMemo(calculateValue, dependencies)`

定义说明：

1. 参数calculateValue：只能是无参的纯函数，可以返回任意类型（包括jsx节点，react中组件返回的就是jsx），将在首次渲染时调用，后面仅在dependencies发生变化时进行调用（这样能够跳过一些昂贵的计算）
2. 参数dependencies：所有在calculateValue函数中使用的响应式变量（props、state、变量、函数）组成的数组，若不传，则每次都会重新计算
3. 返回值m：返回调用calculateValue的结果，依赖数组发生变化，重新返回调用calculateValue的结果

注意：

- 应该仅把useMemo作为性能优化的手段，而非缺了它就代码不能工作。默认情况下，react会在组件每次重渲染时重新运行整个组件，此时组件中的对象、函数都会重新执行，这加大了运行开销
- useMemo不会让渲染变得更快，只是跳过了跟他依赖无关的渲染（不执行），对于依赖相关的渲染，还是会重新执行的
- 开发环境且严格模式下，将调用calculateValue两次
- 使用useMemo的情况：useMemo中的计算很耗时、将计算结果作为props传递给包裹在memo中的组件时、传递的值用作某些hook的依赖项时
- 跳过由于父组件重渲染导致组件渲染的问题，可使用memo函数包裹组件，此时memo（缓存JSX节点）包裹的组件在父组件重渲染时，不会重新渲染，除非传入给组件的props发生了变更

```jsx
import { memo } from 'react'

const List = memo(function List({ items }) {
   const [name, setName] = useState('')

   const itemName = useMemo(() => {
      // 此处，仅当name、itmes发生变化时，才会重新计算
      // ...
   }, [name, items])
})

function App(){
   return (
      // 由于被memo包裹，因此非props：items 的变化，其他父组件的重渲染 不会导致List组件重新渲染
      <List items={[]} />
   )
}

```

### useCallback

作用：在多次渲染中缓存函数，只应作用于性能优化（即只有影响了渲染/运行效果的时候才使用，通常可不使用）

定义：

- `const cachedFn = useCallback(fn, dependencies)`
- 等同于`const cachedFn = useMemo(() => fn, dependencies)`

定义说明：

1. 参数fn：想要缓存的函数，将在初次渲染时（非调用时）返回该函数，后续仅在依赖变更时返回最新的函数
2. 参数dependencies：是否要更新fn的所有响应式的列表，当省略时，每次都将重新计算，当为空数组时，仅在初次渲染时缓存fn
3. 返回值cachedFn：初次渲染和依赖变更时，返回传入的fn，否则返回上一次的

使用场景：

- 作为props传递给包裹在memo中的组件
- 传递的函数可能作为某些hook（比如useEffect的第二个参数）的依赖项（dependence）
- 自定义hook中，返回的任何函数建议都使用useCallback包裹

useMemo vs. useCallback：

- 两者在优化子组件时，通常和memo一同出现，一个缓存函数调用的结果，一个缓存函数本身
- useMemo返回函数调用的结果：`useMemo(() => fn, dep)`
- useCallback返回函数本身：`useCallback(fn, dep)`

注意：同useMemo

```jsx
function ReportList({ items }) {
   return (
      <article>
         { items.map(item => {
            {/* 不能在循环中调用useCallback，仅能在顶层调用 */}
            const handleClick = useCallback(() => {
               sendReport(item)
            }, [item]);

            return (
               <figure key={item.id}>
                  <Chart onClick={handleClick} />
               </figure>
            );
         })}
      </article>
   )
}

// 正确用法1：
function ReportList({ items }) {
   return (
      <article>
         {items.map(item => 
            <Report key={item.id} item={item} />
         )}
      </article>
   )
}
function Report({ item }) {
   // 使用useCallback包裹，仅在item变更时，才会重新渲染Report
   const handleClick = useCallback(() => {
      sendReport(item)
   }, [item]);

   return (
      <figure>
         <Chart onClick={handleClick} />
      </figure>
   )
}

// 正确用法2：使用memo包裹，仅在item变更时，才会重新渲染Report
const Report = memo(function Report({ item }) {
   function handleClick(){
      sendReport(item)
   }

   return (
      <figure>
         <Chart onClick={handleClick} />
      </figure>
   )
}
```

### useContext

作用：读取和订阅组件中的context

定义：

- `const SomeContext = createContext(defalutValue)`
- `const c = useContext(SomeContext)`
- `<SomeContext.Provider value={value}></SomeContext.Provider>`

定义说明：

1. 参数defaultValue：该值从不改变，更新context一般是provider的value和state一起使用
2. 参数SomeContext：该值是用createContext创建的context
3. 返回值c：返回的值总是最新的（根据context的变化而变化），该值是最近组件树上的SomeContext.Provider的value的值，若无，则值是createContext的defaultValue的值
4. provider的value属性value：可以是任意的值，包括对象和函数，当省略时，值为undefined

注意：

- 组件是的useContext的调用仅仅受包裹了对应的SomeContext.Provider的上级组件的影响，而非调用了SomeContext的上级组件的
- 🔴在provider接收到不同的value开始，会重渲染使用了该特定context的所有子级，可使用memo（包裹子组件）或使用useCallback/useMemo包裹value以跳过重渲染（但是context的值还是传过去了，只是不会导致组件重新渲染）
- 当组件重新渲染时，如果provider的value属性值是对象和函数（引用对象，渲染后和之前不是同一个内存地址），则还会重新渲染所有调用对应的useContext的组件，此时可以使用useCallback包裹函数，使用useMemo包裹对象，以此来进行性能优化，至此当组件重渲染时，调用对应的useContext的组件不会发生重渲染，除非包裹的对象和函数依赖的值发生变化了
- 可以将provider封装成组件使用
- 可以嵌套使用多个相同或不同的provider，在嵌套时，下层provider的value值若依赖context，该context是基于上一层provider的value计算来的。举例，共嵌套了三层`<SomeContext.Provider></SomeContext.Provider>`，其value属性值都是`someContext + 1`，若初始值是1，此时，各层下面的子组件读取到的useContext的值分别是`2， 3， 4`
- 可以将变量值和修改变量的函数一同传递给provider的value属性，这样，在使用useContext的子组件中，就可以直接修改变量了

::: code-group

```jsx [context和reducer一起使用]
// 抽离provider为组件，其他代码省略，只列出重要代码
const TasksContext = createContext(null)
const TasksDispatchConext = createContext(null)

function TasksProvider({ children }) {
   const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)

   return (
      <TasksContext.Provider value={tasks}>
         <TasksDispatchConext.Provider value={dispatch}>
            {children}
         </TasksDispatchConext.Provider>
      </TasksContext.Provider>
   )
}

// 使用组件
function TaskApp(){
   return (
      <TasksProvider>
         {/* 该组件内部可以使用dispatch修改tasks */}
         <AddTask />
         <TasksList />
      </TasksProvider>
   )
}
```

```jsx [多个context嵌套]
const LevelContext = createContext(0)

function Section({children}) {
   const level = useContext(LevelContext)
   return (
      <section className="section">
         {/* 每嵌套一层，读取到的level的值都是上一层的值+1 */}
         <LeveContext.Provider value={level + 1}>
            {children}
         </LeveContext.Provider>
      </section>
   )
}

// 使用
function Heading({children}) {
   // 通过嵌套层级，展示具体的标题级别
   const level = useContext(LevelContext)
   switch(level) {
      case 0:
         throw new Error('Heading must be inside Section')
      case 1:
         return <h1>{children}</h1>
      case 2:
         return <h2>{children}</h2>
         // ......
   }
}

function Page() {
   return (
      <Section>
         <Heading>Title</Heading>
         <Section>
            <Heading>Subtitle</Heading>
         </Section>
      </Section>
   )
}
```

```jsx [context和useMemo一起使用]
function MyApp(){
   const [currentUser, setCurrentUser] = useState(null)

   const login = useCallback(response => {
      storeCredentials(response.credentials)
      setCurrentUser(response.user)
   }, [])

   const contextValue = useMemo(() => ({
      currentUser,
      login
   }), [currentUser, login])

   return (
      <AuthContext.Provider value={contextValue}>
         <Page/>
      </AuthContext.Provider>
   )
}
```

:::

### useReducer

作用：给组件添加一个reducer（包括所有组件状态更新逻辑的外部函数）

定义：`const [state, dispatch] = useReducer(reducer, initialArg, init?)`

定义说明：

1. 参数reducer：用于更新变量state的纯函数，参数为当前的state和action（任意值），返回更新后的state
2. 参数initialArg：变量state的初始值
3. 参数init函数：可选，用于计算初始值函数，存在则使用init(initialArg)的执行结果作为初始值，否则使用initialArg作为初始值
4. 返回值state
5. 返回值dispatch函数：接受action作为参数，调用它时，react会调用reducer函数用于更新state；用于更新state，并触发组件的重新渲染
6. action：通常是一个对象（例如`{type: 'add', payload: data}`），reducer会将action的内容（例如`type`）作为条件，根据不同条件（通过if或switch）返回不同操作的state

注意：

- 第二个参数若是一个函数的调用，则在每次重渲染时都会被执行（影响性能），正确做法是将该函数传递给第三个参数作为初始化函数
- dispatch函数是为下一次渲染而更新state，调用它之后的代码的state还是原来的值，如果想立马获取更新后的state，则后面可以手动调用`reducer`函数获取最新的结果
- 当state和上一个state相同时，会跳过组件的重渲染
- reducer函数中不要修改state（引用地址不变），而是替换state（引用地址会变）返回新的对象
- react执行的是批量更新state的策略，会在所有事件函数执行完毕并且已经调用他的set函数后进行更新，防止在一个事件中多次进行重渲染，若想提前更新可以使用flushSync
- useReducer和useState非常相似，但是useReducer可以将状态更新逻辑移到组件外部
- reducer函数内部，习惯用switch语句，且每个case语句块使用`{}`包裹，这样不会引起变量冲突
- 一个好的reducer，通常是一个纯函数、且每个action都仅描述了一个单一的用户交互，即仅根据当前的state和action改变当前的state，而不应该参杂其他的操作，比如改变其他变量的值
- 可以使用immer等第三方库减少重复的样板代码，更专注于逻辑
- `useReducer(reducer, name, createInitialFn)`相比于`useReducer(reducer, createInitialFn(name))`，前者仅会在初始渲染时执行，而后者（只传初始值）每次重渲染都会执行，可能更耗费性能

::: code-group

```jsx [基本用法]
const initialTasks = [
   { id: 1, title: 'Learn React', done: true },
   { id: 2, title: 'Learn Redux', done: false },
   { id: 3, title: 'Learn React Hooks', done: false },
]
function tasksReducer(tasks, action) {
   // 根据type进行不同的操作
   swith(action.type) {
      case 'add':
         return [...tasks, { id: action.id, title: action.title, done: false }]
      case 'changed':
         return tasks.map(task => {
            if (task.id === action.task.id) {
               return action.task
            } else {
               return task
            }
         })
      case 'deleted':
         return tasks.filter(task => task.id !== action.id)
      default:
         trow new Error('Unknown action type')
   }
}

function TaskApp() {
   const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)

   funciton addTask(text) {
      dispatch({
         type: 'add',
         id: Date.now(),
         text: text
      })
   }

   funciton changeTask(task) {
      dispatch({
         type: 'changed',
         task: task
      })
   }

   fucntion deleteTask(id) {
      dispatch({
         type: 'deleted',
         id: id
      })
   }

   return (
      <>
         <AddTask add={addTask}/>
         <TaskList tasks={tasks} onChange={changeTask} onDelete={deleteTask}/>
      </>
   )
}
```

:::

### useRef

作用：可以引用一个不需要渲染的值

定义：`const ref = useRef(initialValue)`

定义说明：

1. 参数initialValue：ref对象的current属性的初始值，可以是任意值，首次渲染后被忽略
2. 返回值ref：该值仅包含一个属性current，初始渲染时值为initialValue，后续渲染时都返回同一个对象，可将ref作为jsx节点ref属性的值

使用ref的优势：

- 存储信息而不被重置（普通对象在每次渲染时都会重置）
- 修改值不会触发重渲染（状态变量会触发重渲染），所以若该值想显示在屏幕上，则必须包含导致重渲染的操作，否则在屏幕上不会更新该值，或者用state代替该值
- 存储的信息仅作用于使用的组件内部

使用场景：

- 存储timeout ID
- 存储和操作DOM元素
- 存储不需要被用来计算JSX的其他对象

注意：

- 改变ref.current时，不会触发重渲染，该值只是一个普通js对象
- 用途有：在多次渲染时存储信息而不被重置、操作dom
- 将ref对象作为jsx dom节点的ref属性，在创建dom节点并渲染到屏幕时，会把节点设置为ref对象的current属性，然后可以调用相关的方法
- 若将ref用在自定义组件上，需要将该自定义组件用forwardRef包裹起来，因为默认情况下，自定义组件不会暴露内部dom节点的ref
- 不要在渲染期间读写（例如`<h1>{ref.current}</h1>`, `ref.current = xxx`）ref（即return的jsx、组件函数代码块），因为组件主体应该表现的像纯函数，而写入、读取ref会破坏这些行为。相应的可以在事件处理程序或useEffect中读写。否则就用state代替

::: code-group

```jsx [基本用法]
function Video (){ 
   // 避免创建重复的ref，后续发生重渲染时，该ref不会被重置
   const playerRef = useRef(null)
   // 统计条件判断是否渲染，避免有可能的重渲染导致性能浪费
   // 在条件模式下，是可以进行ref的读写的（因为这种情况可预测），非条件模式下别这样做
   if (playerRef.current === null) {
      playerRef.current = new VideoPlayer()
   }

   // 在事件处理程序中，抽离函数，检测null
   function getPlayer (){
      if (playerRef.current !== null) {
         return playerRef.current
      }
      const player = new VideoPlayer()
      palyerRef.current = player
      return player
   }
}
```

```jsx [向组件暴露ref]
// 通过forwardRef包裹组件，以暴露内部dom节点的ref
// 1. ref参数不可省略，用于将外部传入的ref变量作用于组件/元素中，以让外部能够访问该组件内的dom节点/组件
const MyInput = fowardRef((props, ref) => {
   // 2. 传入的ref必须设置到对应的元素/组件上，否则读到的ref值为null
   return <input ref={ref}  {...props} />
})

function Form(){
   const inputRef = useRef(null)
   function  handleClick (){
      inputRef.current.focus()
   }

   return (
      <>
         {/* 3. 传入ref */}
         <MyInput ref={inputRef} />
         <button onClick={handleClick}>Focus the input</button>
      </>
   )
}
```

```jsx [管理多个ref]
// 将函数传递给ref属性（ref回调）
function CatFriends(){
   const itemsRef = useRef(null)

   function getMap(){
      if(!itemsRef.current) {
         itemsRef.current = new Map()
      }
      return itemsRef.current
   }

   function getCurrentNode (id){
      const map = getMap()
      console.log(map.get(id))
   }

   return (
      <>
         <ul>
            {catList.map(cat => (
               <li key={cat.id}
                  ref={node => {
                     const map = getMap()
                     if (node) {
                        map.set(cat.id, node)
                     } else {
                        map.delete(cat.id)
                     }
                  }}
                  onClick={() => getCurrentNode(cat.id)}
               >
                  {cat.name}
               </li>

            ))}
         </ul>
      </>
   )
}
```

:::

### useId

作用：生成一个唯一ID

定义：`useId()`

定义说明：

1. 返回一个唯一的字符串 ID

注意：

- 只能在组件顶层/hook 中调用，不能用在循环或条件判断中
- useId不应该用在列表的key中，列表key应由数据生成
- 使用服务端渲染时，useId需要在服务器和客户端上有相同的组件树，若在两者之间渲染的树不完全匹配，则生成的id也是不匹配的

用法：

- 该hook能够保证生成的id是整个应用全局唯一的，避免了id之间的冲突
- 能够和服务端渲染一起工作，且生成内容的顺序和预期是一致的，在这一点上递增计数器（+1）在渲染之后输出的顺序可能不一致（在服务器渲染期间，组件会生成并输出成html，然后在客户端上，`hydration`会将事件处理程序附加到html上。），useId能够确保hydration正常工作，且服务器和客户端的输出是匹配的
- 若一组相关的元素需要生成id，可使用useId生成一个字符串前缀，然后再在对于的元素上加上独特的后缀标识即可
- 若单个页面上渲染了多个独立的react程序，需要先在`createRoot`或`hydrateRoot`调用中将identifierPrefix作为选项传递（用于指定前缀），然后正常调用useId，这样能够确保各个应用之间使用useId生成的id不冲突

## 组件

### Fragment

作用：在不添加额外节点的情况下将子元素组合

定义：`<Fragment></Fragment>`、`<></>`

注意：

- 若想给组件传递key，则不能使用简写

### StrictMode

作用：在开发过程中启用组件树内部额外的开发行为和警告

定义：`<StrictMode></StrictMode>`

定义说明：无参

注意：

- 严格模式下启用的行为：组件将重渲染一次（检查非纯渲染错误，包括组件函数体顶层逻辑，传递给useState、useMemo、useReducer、set的参数，constructor、render、shouldComponentUpdate等部分类组件方法）、将重运行Effect一次（检查是否缺少effect清理，检查是否符合预期）、检查是否使用废弃的API
- 在该组件包裹的树中，无法退出严格模式
- 可包裹任意组件
- 仅在开发环境运行

### Profiler

作用：测量组件树的渲染性能

定义：`<Profiler id="CompName" onRender={onRenderFn}><CompName></CompName></Profiler>`

定义说明：

1. 使用该组件包裹需要进行性能测量的组件树，id为组件名词
2. 可嵌套使用，也就是需要监测哪里就包裹哪里
3. onRender：性能测量的回调函数，能够获取渲染内容和所花费的时间
4. 默认在生产环境下被禁用，[在生产环境下启用](https://fb.me/react-profiling)

### Suspense

作用：在子组件完成加载前展示后备内容

定义：`<Suspense fallback={<Loading/>}><SomeComponent/></Suspense>`

注意：

- 只有启用了Suspense的数据源才会激活Suspense组件，包括：支持它的框架如Relay/Nextjs、使用lazy懒加载组件代码、使用use读取Promise的值
- Suspense无法检测在Effect和事件处理程序中获取数据的情况
- Suspense内部整个组件树都被视为一个单元，即使整个组件树只有其中一个组件被挂起，也都将被替换为fallback
- 可以嵌套使用Suspense，分别为需要的组件设置后备组件，这样就不用整个组件树都被替换了

## API

### createContext

**createContext**: 创建一个组件能够提供/读取的context

**SomeContext.Provider**: 用context provider包裹组件，用value为整个组件树（层级不限）指定一个context的值

用法：

1. 将所有的context单独创建一个文件导出，因为不止一个组件需要读取同一个上下文

### forwardRef

作用：在组件上使用ref时，允许将dom节点暴露给父组件

定义：`const SomeComponent = forwardRef(render)`

定义说明：

1. 参数render：组件的渲染函数（接收props、ref属性），当为函数组件时，就是组件本身
2. 返回值SomeComponent：返回能够接收props、ref属性的组件

:::code-group

```javascript [暴露整个节点]
function Form () {
   // 步骤3：定义ref
   const ref = useRef(null)

   function handleClick () {
      // 步骤5：这里拿到的就是input节点
      ref.current.focus()
   }

   return (
      <form>
         {/* 步骤4：在组件上使用ref */}
         <MyInput label='Enter you name:' ref={ref}/>
         <button type="button" onClick={handleClick}>编辑</button>
      </form>
   )
}

// 步骤1：在需要使用ref的组件上用forwardRef包裹
const MyInput = forwardRef(function MyInput(props, ref) {
   const { label, ...otherProps} = props
   return (
      <label>
         {label}
         {/* 步骤2：将ref传递给想暴露的节点上 */}
         <input {...otherProps} ref={ref}/>
      </label>
   )
})
```

```javascript [暴露节点的有限功能]
// 核心是修改MyInput
import { forwardRef, useRef, useImperativeHandle } from 'react'

const MyInput = forwardRef(function MyInput(props, ref)  {
   // 改动1：定义一个ref，作用在要暴露给父组件的节点上
   const inputRef = useRef(null)

   // 改动2：使用useImperativeHandle指定要暴露给父组件的对象（ref.current读取到的）
   useImperativeHandle(ref, () => {
      return {
         // 这里仅暴露两个方法
         focus () {
            inputRef.current.focus()
         },
         scrollIntoView() {
            inputRef.current.scrollIntoView()
         }
      }
   }, [])

   return <input {...props} ref={inputRef}/>
})
```

:::

注意：

- ref可嵌套传递，即沿着组件树将ref传递给目标节点上，此时传递链上的组件都需要用forwardRef包裹
- 不要滥用ref，能用props就不应该用ref

### lazy

作用：在组件初次渲染前延迟加载组件代码，通常和Suspense一起使用实现懒加载

定义：`const SomeComponent = lazy(load)`

定义说明：

1. 参数load函数：无参，返回一个Promise或thenable的函数

```javascript
const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')))

function MarkdownEditor () {
   return (
      <Suspense fallback={<Loading/>}>
         <MarkdownPreview markdown='markdown'/>
      </Suspense>
   )
}

// 添加一个固定的延迟时间，以便你可以看到加载状态
function delayForDemo (promise) {
   return new Promise(res => {
      setTimeout(res, 2000)
   }).then(() => promise)
}
```

注意：

- 只能在组件外部（模块的顶层作用域）使用lazy函数。不能在组件内部使用lazy函数，否则将导致在重渲染时重置所有状态

### memo

作用：当父组件重新渲染时，通常子组件也会重渲染，memo的作用就是在传入的props未改变时跳过子组件的重渲染（通常是这样的，某些时候即使用了memo也会进行重渲染）

定义：`const MemoizedComponent = memo(SomeComponent, arePropsEqual?)`

定义说明：

1. 参数SomeComponent：要进行记忆化的组件
2. 可选参数arePropsEqual函数：该函数接收2个参数，组件的上一个props和新的props，若两者相同应返回true。通常情况下，不用指定该函数（默认用Object.is），极端情况下，可以自定义重渲染的规则
3. 返回值：返回一个新的记忆化组件（函数组件、forwardRef组件），功能和SomeComponent相同

注意：

- 如果传递给组件的props一直不同（比如普通对象和函数），则memo是无效的，所以通过和useMemo、useCallback一起使用
- 🔴只有传入的props不改变时不触发重渲染，当组件自身的状态（state、使用的context）改变时，会触发重渲染
- 只应该将其作为性能优化方案，若离开他无法运行，则应该修复潜在问题
- 如果props是一个对象，为了避免父组件每次都重新创建该对象导致memo效果打折，可以将该对象用useMemo包裹，或者拆分将该对象拆分成多个单独的props
- 如果props是一个函数（引用地址），为了避免每次都是不同的引用，可以将该函数放在组件外部，或者用useCallback包裹

## 和vue对比的写法

### 具名插槽

将组件当作props传进去即可

### 类似vue的作用域插槽写法

> 参考：<https://zhuanlan.zhihu.com/p/427114998?utm_id=0>

```jsx
function Container(props) {
  return (
    <>
      {/* 接收到的值在该处渲染 */}
      {props.children({ a: 1, b: 2, c: 3 })}
      {props.children({ e: 1, b: 2, c: 3 })}
      <input></input>
      <input></input>
      {props.children({ d: 1, b: 2, c: 3 })}
      <input></input>
    </>
  );
}

function C2ontainer(props) {
  return (
    <>
      <div>
        <input />
        <input />
        <input />
        <input />
      </div>
    </>
  );
}

export default function App() {
  return (
    <>
      <Container>
        {/* 
        通过传递函数实现作用域插槽：
        将下面的内容替换成conteiner内部的props.children位置上的内容，可以返回任意内容 
        其中，每个v都代表一个props.children
        */}
        {(v) =>
          Object.keys(v).map((item) => {
            return (
              <li key={item}>
                {v[item]}: {item}
                <C2ontainer />
              </li>
            );
          })
        }
      </Container>
    </>
  );
}

```

## 心得

传入组件的props变更、组件的key属性变更、组件内的state变更、组件内由自定义hooks创建的变量的变更、组件内使用的context值变更、组件的父组件重渲染，都会触发组件的重渲染

在触发组件重渲染时，组件顶层作用域内的**语句**都会重新执行 => 当一个变量是对象时，该变量的地址，以及其他顶层函数的地址会发生变更 => 若该变量/函数也是useEffect的依赖项，则会触发useEffect的执行，这将导致一些异常的情况（比如本应该不执行的却执行了）发生。所以应该避免对象（变量、函数）作为useEffect的依赖项

## 附录

### 专有名词

**外部系统**：不受 react 控制的代码，比如网络、某些浏览器 API（interval 定时器、eventListener 侦听器）、第三方库

```

```
