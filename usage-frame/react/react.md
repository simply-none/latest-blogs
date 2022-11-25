# react 基础知识

## Fragments(template)

定义：
- 将元素分组，而无需引入新的元素来包裹他们，类似vue的template，但又比vue的更强大些
- 能够自动识别元素，并将代码补充完整，比如`<td></td>`将会补充其上级节点`table`, `tr`，让dom结构更完整

用法：
- `<React.Fragment> xxx </React.Fragment>`，仅支持key属性
- `<> xxx </>`，这种短语法不支持key

## JSX

定义：
- JSX是`React.createElement(component, props, ...children)`的语法糖

注意：
- 若定义一个函数组件，即使未使用到React相关的功能，但是还是需要尽量引入react
- 若组件在一个对象上，可以使用点语法引用组件，比如`<Date.DatePicker/>`这样的方式引入组件
- 若组件是一个不确定名称的，即类似动态组件，也应该先计算好动态组件的名称，然后再引入组件，比如`const DyncComp = xxx; <DyncComp/>`
- 自定义组件必须是大写字母开头，若确实是小写字母开头，也应该在引用前将其转为大写字母开头的；小写字母开头的代表html内置组件
- jsx中的属性值，可以是任何js表达式
- jsx中，若只有属性名，而无属性值，则属性值默认为true
- jsx中，可使用属性展开符，比如`<button {...props}>`
- jsx中的子元素，boolean、null、undefined将会被忽略不予展示

注意：
- JSX为了防止注入攻击（比如XSS），会在渲染内容之前对其进行转义成字符串形式

```js
// 基本语法
const element = <h1>hello react!</h1>

// 支持大括号语法，其内部可以嵌入任何JavaScript表达式
const name = 'react'
const element = <h1>hello {name}</h1>

// 拆成多行时，建议使用小括号将内容包裹起来，这样可以避免自动插入分号的陷阱 
const element = (
  <h1>
    hello react
  </h1>
)

// JSX也是一个表达式，所以可以对其进行赋值操作
function hello (name) {
  if (name) {
    return (<h1>hello {name}</h1>)
  }
  return (<h1>hello Jade</h1>)
}

// JSX中的dom元素可以带有属性，属性值可以是字符串（引号）或是变量（大括号）中的一个，同时dom标签必须是驼峰形式，class=>className，tabindex=>tabIndex
const element = <h1 className="page-title" id={pageId}>hello react</h1>

// JSX表示一个对象，Babel会将其转换成React.createElement()函数调用，上述内容与下面同义：
const element = React.createElement(
  'h1',
  {
    className: 'page-title',
    id: pageId
  },
  'hello react'
)
// 将被转成一个react元素对象，react通过读取该对象，用于构建dom以保持实时更新(简化形式，非完整)：
const element = {
  type: 'h1',
  props: {
    className: 'page-title',
    id: pageId,
    children: 'hello react'
  }
}
```

## 元素渲染

知识点：
- React元素
  - React元素是创建开销极小的普通对象
  - React元素可以是原生dom标签（小写字母开头）构成的组件，也可以是自定义组件（大写字母开头），比如`<Hello/>`，当为自定义组件时，它会将JSX中的属性（比如class等）和子元素（children）转换为单个对象（props）传递给这个组件（函数或类组件）
  - React元素是不可变对象，一旦被创建，就无法更新属性和其子元素，它代表了某个特定时刻的ui
  - 对于无状态的内容，更新ui的唯一方式是重新创建一个元素，并将其转入render函数中
  - react只会更新需要更新的部分：react dom会将元素和其子元素与之前的状态进行比较，然后更新实际改变了的内容
  - 实际情况中，大多数应用仅会调用一次render函数，所以对于变化的内容，需要将其封装在有状态的组件中
  - 组件是由元素组成的
- 根节点
  - 仅使用react构建的应用通常只有一个单一的根节点
  - 根节点内的所有内容都由react dom管理
  - 使用React.createRoot创建根节点，使用render函数渲染根节点内部的内容

```js
// 获取根节点
const root = React.createRoot(document.querySelector('#root'))

function hello () {
  const element = <h1>hello react, currentTime is: { Date.now() }</h1>
  root.render(element)
}
// 每隔一秒钟，重新渲染内容
setInterval(hello, 1000)
```

## 组件和props

知识点：
- 组件：
  - 概念上类似JavaScript函数，接受任意的参数props，返回一个用于展示内容的react元素
  - 组件分为函数组件和类组件
  - 在react中，组件是有状态还是无状态属于组件的实现细节，这可能会随着时间而改变，可以在有状态组件中使用无状态组件，反之亦可
- props:
  - props是只读的，不能在组件内部修改自身的props
- 受控组件：react的state是该组件的唯一数据来源（state绑定组件的值），同时react还控制着组件用户输入过程中的事件操作
  - 原生form表单元素会自己维护自身的state，但可以通过state绑定将其变成受控组件
  - 在受控组件设置数据（比如value）的默认值会阻止用户输入更改该值，除非后面又将数据的值更改为null或undefined，这时用户又能够修改内容了
  - 受控组件必须为数据变化的每种方式都编写数据处理函数，比如onChange事件
- 非受控组件（多指表单元素）：数据将存储在DOM节点中，而非由state管理，代码无法指定该元素的值。若想快速编码且不介意美观性，可使用非受控组件
  - 非受控组件无value属性，因为是由其内部管理的，但可指定默认初始值（defaultValue、defaultChecked）
  - 非受控组件的值，可由ref属性获取，这时需要将`this.state.cusFile = React.createRef()`中的cusFile赋值给ref属性，后面通过变量cusFile获取元素的值
- 状态提升：将多个组件需要共享的state上移到最近的父组件上，这样便可实现state共享，此时需要将state和处理数据的handle函数作为prop传给子组件即可

<!-- tabs:start -->
<!-- tab:组件的定义和使用 -->
```js
// 函数组件
function Hello (props) {
  return <h1>hello, {props.name}</h1>
}

// 类组件：
// 1. 函数组件函数体的内容全部转到render函数中
// 2. props使用this.props替代
class Hello extends React.Component {
  render () {
    return (
      <h1>
        hello, {this.props.name}
      </h1>
    )
  }
}

// 使用组件
const root = React.createRoot(document.getElementById('root'))
const name = 'react'
// 此处的className、id、name将一起作为props对象的属性传递给Hello组件
const element = <Hello className="page-title" id={pageId} name={name}/>
root.render(element)
```

<!-- tab:组件拆分和组合 -->
```js
// 定义一个评论组件：包含头像、用户名、评论内容、评论时间
// 其结构为
<div className="Comment">
  <div className="UserInfo">
    <img className="Avatar"
      src={props.author.avatarUrl}
      alt={props.author.name}
    />
    <div className="UserInfo-name">
      {props.author.name}
    </div>
  </div>
  <div className="Comment-text">
    {props.text}
  </div>
  <div className="Comment-date">
    {formatDate(props.date)}
  </div>
</div>

// 组件拆分
// 定义一个头像组件
function Avatar (props) {
  return (
    <img
      className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  )
}
// 定义一个包含用户名和头像的组件
function UserInfo (props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user}/>
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  )
}
// 组合成Comment组件
function Comment (props) {
  return (
    <div className="Comment">
      <UserInfo user={props.user}>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formateDate(props.date)}
      </div>
    </div>
  )
}
```

<!-- tab:状态提升 -->
```js
// 父组件
import { Link } from 'react-router-dom'
import React from 'react'
import Child from './shareDataChild'

export default class JqForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      temperature: '',
      scale: 'c',
    }
    this.onTemperatureChangeF = this.onTemperatureChangeF.bind(this)
    this.onTemperatureChangeC = this.onTemperatureChangeC.bind(this)
  }

  onTemperatureChangeF(val) {
    console.log(val)
    this.setState({
      scale: 'f',
      temperature: val,
    })
  }

  onTemperatureChangeC(val) {
    console.log(val)
    this.setState({
      scale: 'c',
      temperature: val,
    })
  }

  tryConvert(temperature, convertFn) {
    const input = parseFloat(temperature)
    if (Number.isNaN(input)) {
      return ''
    }
    const output = convertFn(input)
    const round = Math.round(output * 1000) / 1000
    return round.toString()
  }

  convertToF(temperature) {
    return (temperature * 9) / 5 + 32
  }

  convertToC(temperature) {
    return ((temperature - 32) * 5) / 9
  }

  render() {
    const scale = this.state.scale
    const temperature = this.state.temperature
    const cData = scale === 'c' ? temperature : this.tryConvert(temperature, this.convertToC)
    const fData = scale === 'f' ? temperature : this.tryConvert(temperature, this.convertToF)
    return (
      <>
        <Child scale={'c'} temperature={cData} onTemperatureChange={this.onTemperatureChangeC} />
        <Child scale={'f'} temperature={fData} onTemperatureChange={this.onTemperatureChangeF} />
        <Link to="/">跳转到Home</Link>
      </>
    )
  }
}

// 子组件
import React from 'react'
export default class JqForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scaleNames: {
        f: '℉',
        c: '℃'
      }
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    console.log(e)
    // 阻止表单默认行为
    e.preventDefault()
    this.props.onTemperatureChange(e.target.value)
  }

  render () {
    const { scale, temperature } = this.props
    return (
      <>
        <fieldset>
          <legend>输入温度{this.state.scaleNames[scale]}</legend>
          <input value={temperature} onChange={this.handleChange} />
        </fieldset>
      </>
    )
  }
}
```
<!-- tabs:end -->

## states和生命周期

知识点：
- state：
  - state是私有的，完全受控于当前的组件
  - state的更新可能是异步的：出于性能考虑，react会把多个setState函数合并成一个调用，由于state和props都有可能更新，所以state的更新不应该依赖于props，不然需要使用*回调函数参数*的形式对state进行更新
  - state的更新会合并，所以多次调用setState和一次性调用setState的效果是一样的
- react中的数据都是向下流动的，通常叫做自上而下（单向）的数据流

```js
// 获取时间组件优化
class Clock extends React.Component {
  // 1. 
  constructor (props) {
    // 将props传递到父类构造函数中，该参数始终是props
    super(props)
    // state初始化：唯一一处能够直接对state进行赋值操作的地方
    this.state = {
      date: new Date()
    }
  }

  // 3. 组件第一次渲染到dom中，执行：
  ComponentDidMount () {
    // 此处的timerId，即使未在构造函数中初始化，也能在其他地方使用
    this.timerId = setInterval(() => {
      this.tick()
    }, 1000)
  }

  // 4. dom中的该组件被删除时，执行：
  ComponentWillUnmount () {
    clearInterval(this.timerId)
  }

  tick () {
    // 修改state的状态，必须使用 setState 函数进行调用
    this.setState({
      date: new Date()
    })

    // 使用回调函数（箭头函数、普通函数）参数的形式更新state
    this.setState((state, props) => {
      return {
        counter: state.counter + props.increment
      }
    })

    // state
  }

  // 2.
  render () {
    return (
      <div>
        <h1>hello react</h1>
        <h2>当前时间是：{this.state.date.toLocalTimeString()}</h2>
      </div>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Clock/>)
```

## refs

定义：
- refs允许我们访问DOM节点或在render方法中创建的react元素

功能：
- refs可以在数据流之外（props）对子组件进行修改（操作子组件的属性或方法）

使用场景：
- 管理焦点，文本选择，媒体播放
- 触发强制动画
- 集成第三方DOM库

注意事项：
- 切勿过渡的使用refs，在可能的情况下应该优先正确合理的使用state
- 只能在class组件和dom元素上使用refs，不能在函数组件上（即以该函数组件名为标识符的元素上，比如`<FunctionComponent ref={xxx}`,这个是不允许的）使用ref属性，因为函数组件没有this实例

创建refs的方式：
- 使用`this.xxxRef = React.createRef()`, `ref={this.xxxRef}`
- 使用回调形式创建`ref={element => this.xxxRef = element}`

获取refs：直接使用ref属性值表示的变量（比如`ref={this.xxxRef}`中的`this.xxxRef.current`）即可访问当前ref所在的元素或react对象

**refs转发**：将ref自动的通过组件传递到子组件的技巧（父组件能够操作子组件），这一功能对于可重用的组件库是很有用的
- 使用forwardRef定义的组件的refs，可以转发给dom组件（原生元素），也能转发给class组件

<!-- tabs:start -->
<!-- tab:创建refs -->
```js
// 方式一：使用React.createRef的方式
Class MyComp extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
  }

  getRef = (e) => {
    console.log(e, this.myRef.current)
  }

  render () {
    return (
      <>
        <div ref={this.myRef}/>
        <button onClick={this.getRef}>获取ref</button>
      </>
    )
  }
}

// 方式二：使用回调的方式
Class MyComp extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = null
    // 将绑定节点存储到设置的react实例上的变量上
    this.setMyRef = element => this.myRef = element
  }

  getRef = (e) => {
    if (this.myRef) {
      console.log(e, this.myRef)
    }
  }

  render () {
    return (
      <>
        <div ref={this.setMyRef}/>
        <button onClick={this.getRef}>获取ref</button>
      </>
    )
  }
}
```

<!-- tab:refs转发 -->
```js
// 第一种方式：转发到dom组件上
// 使用forwardRef函数构建组件FancyButton，这时FancyButton组件内部可以得到调用`<FancyButton ref={ref}/>`中的ref变量，并将其赋值给元素或转为其他命名（非ref）的prop传递给子组件
const FancyButton = React.forwardRef((props, ref) => (
  // 这里接收的ref，不仅可以转发给dom元素（原生），也能给其他元素，这时ref就是该组件的实例（所以不能转发给函数组件，无实例）
  <button ref={ref} class="fancy-button">
    {props.children}
  </button>
))

// 调用FancyButton
const ref = React.createRef()
// 这里若想获取button元素的实例，直接调用ref.current即可
<FancyButton ref={ref}>click me</FancyButton>
```

<!-- tab:在高阶函数中使用refs转发（透传） -->
```js
// 若想将操作更深结构下的组件，可将ref透传
class FancyButton extends React.Component {
  constructor (props) {
    super(props)
    this.focus = this.focus.bind(this)
    this.inputRef = React.createRef()
  }

  focus (e) {
    this.inputRef.current.focus()
  }

  render () {
    return (
      <>
        <input ref={this.inputRef} />
        <button className="funcyButton" onClick={this.focus}>点击</button>
      </input>
    )
  }
}

// 这是一个高阶组件（HOC），参数是组件，返回值也是组件
function logProps (Component) {
  // 定义组件，后面使用forwardRef返回该组件实例
  class LogProps extends React.Componnent {
    render () {
      // 接收调用该组件实例的props
      const { forwardedRef, ...rest} = this.props
      // 将ref附加到组件Component上，之后ref就是Component实例。可调用Component内的属性和方法
      // 注意，这里的ref，必须是dom元素，或者是类组件
      return <Component ref={forwardedRef} {...rest} />
    }
  }

  // 返回LogProps，若使用匿名函数参数，则在开发者工具上dom树展示的组件名称为Anonymous
  return React.forwardedRef((props, ref) => {
    // 接收ref，然后将ref赋值给forwardedRef的prop
    // 若是此时将ref直接赋值给LogProps上的ref属性，这时ref代表的就是LogProps组件本身，无法传递给它的下级组件
    return <LogProps {...props} forwardedRef={ref} />
  })

  // 返回LogProps，在开发者工具上dom树展示的组件名称为'logProps.' + name
  const name = Component.displayName || Component.name
  ForwardRefFn.displayName = 'logProps.' + name
  function ForwardRefFn (props, ref) {
    return <LogProps {...props} forwardedRef={ref} />
  }
  }
  return React.forwardedRef(ForwardRefFn)
}

// 使用高阶组件
class UseHoc extends React.Component {
  constructor (props) {
    super(props)
    this.ref = React.createRef()
  }

  getRef = (e) => this.ref.current.focus()

  render () {
    const LogPropsU = logProps(FancyButton)
    return (
      <>
      // 这里可以在getRef函数中获取this.ref指向的实例（LogPropsU将ref透传给FancyButton的）FancyButton
      // 然后操作FancyButton内的方法，比如focus方法
        <button onClick={this.getRef}>获取ref</button>
        <LogPropsU name="jade" ref={this.ref}/>
    )
  }
}
```
<!-- tabs:end -->

## 高阶组件(HOC)

定义：
- 高阶组件是基于React**组合**特性形成的设计模式
- 高阶组件是参数（参数中的其中之一）为组件，返回值为新组件的函数（即将旧的组件转成新的组件，当然也可不转成新的）
- 高阶组件是参数化容器组件（参数之一是组件）

用途：
- 用于将某些组件中公共特性相同的内容抽离出来，根据不同组件特性返回不同内容

注意：
- 高阶组件不会修改传入的组件的内容，比如静态方法，实例方法等，而是将传入的组件包装在新的容器中组成新组件，他是一个纯函数。为此在书写高阶组件函数时，不应该修改传入组件的任何内容
- 高阶组件只是为组件添加特性（组件中不同的部分），自身不应该大幅改变，所以不应该传给它不需要的内容
- 高阶组件可以定义其返回组件的名称（开发者工具中展示的节点名称），使用displayName属性
- 不要在render函数内部引入高阶组件，不然每次渲染，都会重新创建一个新的高阶组件。应当在render外部引入高阶组件（比如在constructor中），然后在render中使用以大写字母开头的变量引入就可使用了
- 高阶组件中，若传入的组件具有静态方法，应该复制传入组件的静态方法，不然新组件不会有原组件的任何静态方法，可以:
  - 将传入组件的静态方法一个个复制到新组件上
  - 若使用组件导出的方式，除了默认导出组件本身外，还可一个个导出组件的静态方法，然后再一个个导入即可
  - 使用插件[`hoist-non-react-statics`](https://github.com/mridgway/hoist-non-react-statics)

例子：可见refs转发

## 事件处理

知识点：
- 事件名称是驼峰形式，事件属性值是一个变量/表达式（大括号括起来的函数）的形式
- 阻止组件（比如表单form的submit）的默认行为，必须显示调用preventDefault
- 事件函数中的this指向若想正确，可以：
  1. 在构造函数中使用bind进行this的绑定
  2. 启用public class field语法，然后使用赋值形式的箭头函数
  3. 直接在事件属性值中使用箭头函数的变量，不推荐，该形式可能会造成额外的重新渲染
- 给事件传递参数，可以：
  1. 属性值使用箭头函数，参数即为事件对象event，这种形式必须显式传入event
  2. 属性值使用bind绑定，第一个参数为this

```js
// 事件处理
function Form () {
  function handleSubmit (e) {
    e.preventDefault();
    // xxx
  }
  return (
    // 事件属性名称：小写形式，事件属性值：函数形式的变量或直接是函数表达式
    <form onSubmit={handleSubmit}>
      <button type="submit">提交</button>
    </form>
  )
}

// 事件处理2
class From extends React.Component {
  constructor (props) {
    super(props)

    // 在这里进行事件处理函数的this绑定
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  // 方式1：构造函数绑定this后，this就有正确指向了
  handleSubmit () {
    // 绑定this之后，这里就可以使用this.setState了
    this.setState((state, props) => {
      counter: state.counter + props.increment
    })
  }

  // 方式2：启用public class fields语法，使用
  handleSubmit = () => {
    this.setState((state, props) => {
      counter: state.counter + props.increment
    })
  }


  return (
    // 第一种使用方式：此处，若没有使用this.handleSubmit()，而是直接是函数名引用，必须对其进行this绑定（即上述构造函数中的绑定）
    <form onSubmit={this.handleSubmit}>
      <button type="submit">提交</button>
    </form>

    // 第二种使用方式：或者嵌套在箭头函数中，这是需要直接进行调用函数使用this.handleSubmit()
    // 不推荐，当将该回调函数作为props传入子组件时，该形式可能会造成额外的重新渲染，建议使用第一种使用方式搭配构造函数绑定this或启用class fields语法
    <form onSubmit={() => this.handleSubmit()}>
      <button type="submit">提交</button>
      
      // 参数传递
      // 第一种方式：使用箭头函数，此时需要显式传递事件对象e给deleteRow
      <button onClick={(e) => this.deleteRow(id, e)}></button>
      // 第二种方式：使用bind this，默认会隐式传递事件对象给deleterow
      <button onClick={this.deleteRow.bind(this, id)}></button>
      
    </form>
  )
}
```

## 条件渲染

知识点：
- 条件渲染组件可先：
  - 使用js计算好之后，然后将变量放在render函数的返回值组件里面
  - 直接在render函数的返回值内部大括号括起来使用js进行计算
- 条件渲染语法：
  - if表达式
  - A && B：此项若后者为空，则会输出A的内容，即使A是假值
  - 三元运算符
- 阻止组件渲染，可以在渲染函数中返回null，此时不会返回组件A内容，但当调用该组件A的组件B操作之后又展示该组件A，此时该组件A的componentDidUpdate会被执行（即组件更新钩子会被调用）

```js
// 在外部计算
function Greeting (props) {
  if (!props.isLogin) {
    return <GuestGreeting/>
    // 若是返回null，则该组件不进行任何渲染
    return null
  }
  return <UserGreeting/>
}

class Greeting extends React.Component {
  constructor (props) {
    super(props)
    this.state = { isLogin: false }
  }
  render () {
    let showComp
    if (!this.state.isLogin) {
      showComp = <GuestGreeting/>
    } else {
      showComp = <UserGreeting/>
    }
    return (
      <div>{showComp}</div>
    )
  }
}

// 直接在JSX内部使用
class Greeting extends React.Component {
  constructor (props) {
    super(props)
    this.state = { isLogin: false }
  }
  render () {
    return (
      <div>
        {
          !this.state.isLogin ? <GuestGreeting/> : <UserGreeting/>
        }
      </div>
    )
  }
}
```

## 列表

知识点：
- 列表的渲染，直接将带有react元素的数组放在render函数的返回值中即可
- 列表的key：
  - 列表的key必须是在map函数的子级中
  - 列表的key，不会传递给子组件，若需要使用key的值，需要用其他变量代替

```js
// 第一种形式，写在外面，然后渲染数组变量
const numbers = [1, 2, 3, 4, 5]
const sideBar = numbers.map(num => 
  // key的位置，必须是在map的子级
  <li key={num}>{num}</li>
)

const root = React.createRoot(document.querySelector('#root'))
root.render(
  <ul>
    {sideBar}
  </ul>
)

// 第二种形式，写在jsx内部
root.render(
  <ul>
    {
      numbers.map(num => 
        // key的位置，必须是在map的子级
        <li key={num}>{num}</li>
      )
    }
  </ul>
)
```

## 表单

知识点：
- 原生表单元素是非受控组件，但可将其转为受控组件
- 原生表单元素有：input（默认文本类型、checkbox等）、select、textarea
- 处理表单事件时，需要阻止默认行为`e.preventDefault`

```js
import { Link } from 'react-router-dom'
import React  from 'react'
class JqForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      desc: '',
      hobby: '',
      sex: false,
      age: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(data = 'name', e) {
    console.log(e, data)
    // 阻止表单默认行为
    e.preventDefault()
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    this.setState({
      [data]: value
    })
    console.log(e.target.checked, this.state.sex)
  }

  handleSubmit (e) {
    console.log(e)
    e.preventDefault()
  }

  render() {
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <label>
            姓名：
            <input name='name' value={this.state.name} onChange={(e) => this.handleChange(undefined, e)} />
          </label>
          <br />
          <label>
            在校生：
            <input name='sex' checked={this.state.sex} type="checkbox" onChange={(e) => this.handleChange('sex', e)} />
          </label>
          <br />
          <label>
            年龄：
            <input name='age' type='number' value={this.state.age} onChange={(e) => this.handleChange('age', e)}/>
          </label>
          {/* 事件对象e会隐式传递 */}
          <label>
            爱好：
            <select name='hobby' value={this.state.hobby} onChange={this.handleChange.bind(this, 'hobby')}>
              {['唱', '跳', 'rap'].map((hobby) => {
                return (
                  <option key={hobby} value={hobby}>
                    {hobby}
                  </option>
                )
              })}
            </select>
          </label>
          <br/>
          <label>
            介绍：
            <textarea name='desc' value={this.state.desc} onChange={(e) => this.handleChange('desc', e)} />
          </label>
          <br/>
          <label>
            <input type="submit" value="提交" />
          </label>
        </form>
        <Link to="/">跳转到Home</Link>
      </>
    )
  }
}

export default JqForm
```

## 组合和继承

知识点：
- 组合：
  - 包含关系（组件嵌套组件），`props.children`代表了传入进来的嵌套内容，也可以使用其他具名props来展示组件内部内容的显示
  - 特例关系（相当于继承：比如狗是动物的一个分支），是包含关系的特例，可以构造多种形式的子组件
- props可以传入任何值，比如基本数据类型，函数，react元素，组件等
- 功能的复用，建议抽象成一个js模块，通过import来使用他们

## react哲学

构建组件的步骤：
1. 对UI划分组件层级：将组件当成对象或函数来考虑，根据单一功能原则确定组件的范围
2. 创建一个静态版本（无交互）：用已有的数据模型渲染一个不包含交互功能的UI。策略是将渲染UI和添加交互分开，因为构造静态版本需编写大量代码，而不需考虑太多细节；添加交互需考虑大量细节，而不需编写大量编码
3. 构建最小集合的state变量：找出应用所需的最小的state集合（防止冗余），方法是通过判断数据是否属于state：
   1. 数据是否由父组件通过props传过来的，若是，则不应该是state
   2. 数据是否随时间改变而改变，若是，则不应该是state（可在render函数内部定义变量表示）
   3. 数据是否是根据其他的state和props计算得来的，若是，则不应该是state（可在render函数内部定义变量表示）
4. 将state放置在正确的组件上，方法是：
   1. 找到根据这个state渲染的所有组件
   2. 找出这些组件的父级组件，这个state就应该放置在父级组件或其父组件链上的组件上
   3. 若找不到该父级组件，就应该创建一个父级组件，存放这个state
5. 添加数据反向流（事件触发）：更新state


## 严格模式

使用场景：
- 用来突出显示程序中潜在的问题，为后代元素触发额外的检查和警告，比如：
  - 识别不安全的生命周期
  - 对使用过时废弃的内容发出警告，比如字符串形式的ref、findDOMNode()、过时的context api
  - 检测渲染（确定更改的内容）和提交（react应用发生变化时，即增删改）阶段发生的异常
  - 确保state可复用
- 仅在开发环境有效

## Profiler元素

定义：
- Profiler是测量一个React应用多久渲染一次以及渲染一次的时间，作用是识别出应用中渲染较慢的部分

注意：
- 仅在开发环境有效

使用：
- 在想测量的组件上嵌套一个Profiler元素即可

```html
<Profiler id="nav" onRender={callback}>
  <nav>xxx</nav>
</Profiler>

function callback(id, phase, duration) { xxx }
```