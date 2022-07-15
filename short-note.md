# 短笔记

> 当 ref 作为响应式对象的 property 被访问或更改时，为使其行为类似于普通 property，它会自动解包内部值：

自动解包内部值：上面这句话代表，ref变量xxx作为响应式对象reactive变量obj属性的时候，不需要使用xxx.value形式访问，而是直接obj.xxx形式访问
