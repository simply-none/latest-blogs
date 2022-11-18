# react 基础知识

## JSX

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
