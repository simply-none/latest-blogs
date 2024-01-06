# JavaScript知识点

## 运算符

逗号运算符：对他的每一个操作数从左往右求值，然后返回最后一个操作数的值

## 方法

arr.reduce语法如下：
```javascript
// 返回数组所有元素计算后的结果
const result = arr.reduce((previousValue, currentValue) => {
  // 这里的返回值是下一次计算的previousValue
  return xxx
}, initialValue)
```

## web api

### Resize Observer api

定义：该api提供了一种*高性能*的机制，通过该机制，代码可以监视元素*盒模型尺寸*的大小更改，在每次更改时都会向观察者传递通知（另一种性能损耗严重的方案是使用resize event）

用法：和其他观察者类似，使用ResizeObserver()构造函数创建一个新的ResizeObserver，然后使用observe()方法使其寻找目标元素的大小更改，更改时构造函数设置的回调函数会被执行

```javascript [ResizeObserver用法]
// 第一步：创建一个resizeObserver对象
const resizeObserver = new ResizeObserver(callback)
// 第二步：挂载观察者对象到目标元素，可以有多个目标元素，参数（target：检测目标，options：可选对象）
resizeObserver.observe(document.querySelector('div'))
resizeObserver.observe(document.querySelector('p'), {
  // 设置observer监听的盒模型
  box: 'content-box' || 'border-box' || 'device-pixel-content-box'
})

// 取消观察者对象对所有元素的监视
resizeObserver.disconnect()

// 取消观察者对象对某个元素的监视
resizeObserver.unobserve(document.querySelector('div'))

function callback (entries) {
  console.log(entries)
  // 其他操作......
}
```

### MutationObserver

定义：能够监视DOM树的更改（节点的增删、节点属性的修改）

用法：创建一个构造函数，参数为监听目标对象DOM树变动时执行的内容

```javascript [MutationObserver用法]
const targetNode = document.getElementById('#app')

// 配置项描述了DOM的哪些变化应该报告给MutationObserver的callback，下面属性至少需要一个以上的属性为true，详情见：https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/observe
const config = {
  // 默认为true，观察所有监听的节点属性值的变化，比如id、class、style属性等
  attributes: true,
  // 监听目标节点中发生的节点的新增和删除，若配置了subtree，则对整个子树生效
  childList: true,
  // 监听以目标元素为根节点的整个子树及其属性
  subtree: true
}
const observer = new MutationObserver(callback)
// 对某元素进行监视
observer.observe(targetNode, config)

// 停止监视
observer.disconnect()

// 参数：mutationList：出发改动的mutationRecord对象数组，ovserver为调用该函数的MutationObserver对象
function callback (mutationList, observer) {
  for (let mutation of mutationList) {
    // type：表示触发dom改动的配置对象具体的属性类型
    if (mutation.type === 'childList') {
      // ......
    } else if (mutation.type === 'attributes') {
      // ......
    }
  }
}

```
