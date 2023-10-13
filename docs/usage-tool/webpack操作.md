# webpack 操作

## 核心概念

> 参考：
> https://webpack.docschina.org/concepts/why-webpack/   
> https://juejin.cn/post/6844904031240863758   

***webpack是什么***：
- webpack是一个用于现代JavaScript应用程序的静态模块打包工具
- 当webpack处理应用时，它会在内部从一个/多个入口点构建一个dependency graph（依赖图），然后将项目中所需的每一个模块组合成一个或多个bundles，用于展示界面内容

***入口地址(entry)***:

定义：是webpack构建内部dependency graph的开始，进入entry point后，webpack会找出entry point（直接和间接）依赖的模块和库

***输出(output)***:

定义：告诉webpack在何处输出它所创建的bundle，以及如何命名这些bundle文件

***loader***:

前置知识：
- webpack只能理解识别js、json这些文件

出现场景：
- 通过loader能够使webpack处理其他类型的文件，*并将他们转换为有效模块*，供程序使用，同时loader还会将相关的依赖引入到bundles中

使用场景：
- 转换某些文件类型的模块
- 使你在 import 或 "load(加载)" 模块时预处理文件

loader的属性：
- test：告诉webpack，当碰到`require()`或`import`语句时，如果该文件符合test的正则表达式，则在打包之前，会使用use属性的loader进行转换
- use：对应符合文件需使用的loader

::: code-group
```javascript [常规]
module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: 'raw-loader'
      }
    ]
  }
}
```
```javascript [plugin和loader一起使用]
// webpack.config.js
// 第一种方式
module.exports = {
  //...省略其他配置
  module:{
    rules:[{
      test:/\.less$/,
      use:['style-loader','css-loader',{
        loader:'postcss-loader',
        options:{
          plugins:[require('autoprefixer')]
        }
      },'less-loader'] // 从右向左解析原则
    }]
  }
}

// 第二种方式,plugin写在loader的外部
module.exports = {
  plugins: [require('autoprefixer')]  // 引用该插件即可了
}
```
:::

***插件(plugin)***:

使用场景：
- 用于执行范围更改的任务
  - 打包优化
  - 资源管理
  - 注入环境变量
- 插件(plugin)可以为 loader 带来更多特性

使用：
- 通过`require(plugin-name)`引入一个插件

***webpack模块(modules | chunk)***:

modules的定义：
- 模块化编程中，开发者将程序分解为功能离散的chunk，这就是模块

webpack模块的定义：
- webpack模块能够用各种方式表达ecmascript2015模块（mjs）、CommonJS模块（cjs）、AMD模块、资源（assets，比如html和css中引入的图片等）、webassembly模块的依赖关系

***模块热替换(HMR, hot module replacement)***:

定义：可以在应用程序运行过程中替换、添加、删除模块，而不用重新加载整个页面，以此来加快开发速度

方式：
- 保留在完全重新加载页面期间丢失的应用程序状态。
- 只更新变更内容，以节省宝贵的开发时间。
- 在源代码中 CSS/JS 产生修改时，会立刻在浏览器中进行更新，这几乎相当于在浏览器 devtools 直接更改样式。

## 待做项

- webpack打包优化