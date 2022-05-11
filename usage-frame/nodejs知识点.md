# Node.js知识点

## require.resolve用法

> 参考来源：    
> https://lellansin.wordpress.com/2017/04/22/node-js-%E7%9A%84-require-resolve-%E7%AE%80%E4%BB%8B/
> https://juejin.cn/post/6844904055806885895

定义：获取路径（相对路径、绝对路径、模块路径）

使用：当需要拼接一个路径的时候，有时会使用`path.join(__dirname, 'xxx')`进行拼接，也可以使用`require.resolve('xxx')`获取文件路径。它能够检查该路径是否存在，不存在则会抛出`cannot find xxx`的异常

三种方式：
```js
// 绝对路径 -> /Users/enhanced-resolve/lib/node.js
require.resolve('/Users/enhanced-resolve/')
// 相对路径 -> /Users/enhanced-resolve/index.js
require.resolve('./index')
// 模块路径 -> /Users/enhanced-resolve/node_modules/diff/diff.js
require.resolve('diff')
```

例子：
```js
// 读取文件
// 使用path.join
fs.readFileSync(path.join(__dirname, './assets/some-file.txt'));

// 使用require.resolve
fs.readFileSync(require.resolve('./assets/some-file.txt'));
```