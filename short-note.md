# 短笔记

> 当 ref 作为响应式对象的 property 被访问或更改时，为使其行为类似于普通 property，它会自动解包内部值：

自动解包内部值：上面这句话代表，ref变量xxx作为响应式对象reactive变量obj属性的时候，不需要使用xxx.value形式访问，而是直接obj.xxx形式访问


> h()函数的作用：

h()函数其实是返回了（`createNodeDescription`，即创建了一个节点描述，也称虚拟节点VNode），它包含的信息会告诉vue在页面上需要渲染什么样的节点，及其子节点的信息

> 组件树中的所有VNode必须是唯一的
 
h()函数中，定义一次VNode，则只能使用一次，不能使用多次；若要使用多次，可以使用工厂函数（即通过遍历、循环）创建多个h函数（VNode）

> 访问默认插槽：this.$slots.default()

```typescript
// 若想给插槽slot传递一些参数，给default()函数传递一个属性的对象
// 例如
render () {
  `<div><slot :text="message"></slot></div>`
  // 上面这个模板等同于
  return h('div', {}, this.$slots.default({
    text: this.message
  }))
}

// 若想将插槽的值传递给子组件，然后子组件内部就能够使用插槽的内容，这里的v-slot，其实等同于v-slot:default
return () {
  `<div><child v-slot="props"><span>{{ props.text }}</span></child></div>`
  // 等同于
  return h('div', [
    h(
      resolveComponent('child'),
      {},
      {
        default: (props) => h('span', props.text)
      }
    )
  ])
}
```

> 相反，对 resolveComponent 的调用应该在插槽函数之外进行，否则它们会相对于错误的组件进行解析

若想在h()的第三个参数中，使用插槽，且该插槽需要返回组件时，该组件名的解析，需要在h()函数之外（前面）进行解析

> <component :is="name"></component>的实现使用resolveDynamicComponent

其中is支持组件名称、HTML元素名称、组件选项对象

对于组件名称，可以使用resolveComponent+h()；
对于HTML元素，可以直接使用h()；
对于组件选项对象，直接使用h()；

> 我们使用的是一个简单函数，而不是一个选项对象，来创建函数式组件

这里的选项对象，应该是通过defineComponent定义的

> 当使用 <script setup> 的时候，任何在 <script setup> 声明的顶层的绑定 (包括变量，函数声明，以及 import 引入的内容) 都能在模板中直接使用

这里相当于自动导出了这些变量和函数