# 短笔记

> 当 ref 作为响应式对象的 property 被访问或更改时，为使其行为类似于普通 property，它会自动解包内部值：

自动解包内部值：上面这句话代表，ref变量xxx作为响应式对象reactive变量obj属性的时候，不需要使用xxx.value形式访问，而是直接obj.xxx形式访问


> h()函数的作用：

h()函数其实是返回了（`createNodeDescription`，即创建了一个节点描述，也称虚拟节点VNode），它包含的信息会告诉vue在页面上需要渲染什么样的节点，及其子节点的信息