# 速记

## vue、ts、vite相关

1. 写代码的思路：默认导出所有对象、导出一个返回对象的函数
2. ts添加类型：谁使用了该类型的值，该类型就属于使用者所在的库里面，比如`createApp()`的类型是`App<Element>`，故而类型`App`需要通过`import type { App } from 'vue'`从vue中导入进来