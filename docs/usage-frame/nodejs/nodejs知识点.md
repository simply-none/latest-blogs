# Node.js知识点

## 文件的增删改查操作

- 读取：`fs.readFile(path, cb(err, data) {})`, `data = fs.readFileSync(path)`，sync为同步方法，下面的都具备
- 改动：appendFile、writeFile
- 删除：`fs.unlink(path, cb(err){})`
- 创建/写入：`fs.appendFile(path, data, cb(err) {})`, `fs.open(path, data, cb(err, data) {})`, `fs.writeFile(path, data, cb(err) {})`
- 重命名：`fs.rename(oldpath, newpath, cb(err) {})`

## require.resolve用法

> 参考来源：    
> https://lellansin.wordpress.com/2017/04/22/node-js-%E7%9A%84-require-resolve-%E7%AE%80%E4%BB%8B/
> https://juejin.cn/post/6844904055806885895

定义：获取路径（相对路径、绝对路径、模块路径）

使用：当需要拼接一个路径的时候，有时会使用`path.join(__dirname, 'xxx')`进行拼接，也可以使用`require.resolve('xxx')`获取文件路径。它能够检查该路径是否存在，不存在则会抛出`cannot find xxx`的异常

三种方式：

```javascript
// 绝对路径 -> /Users/enhanced-resolve/lib/node.js
require.resolve('/Users/enhanced-resolve/')
// 相对路径 -> /Users/enhanced-resolve/index.js
require.resolve('./index')
// 模块路径 -> /Users/enhanced-resolve/node_modules/diff/diff.js
require.resolve('diff')
```

例子：

```javascript
// 读取文件
// 使用path.join
fs.readFileSync(path.join(__dirname, './assets/some-file.txt'));

// 使用require.resolve
fs.readFileSync(require.resolve('./assets/some-file.txt'));
```

## 命令行`node`传参给脚本

使用node命令行执行脚本时，可以通过`process.argv`获取到传入的普通参数，通过`process.env['npm_config_xxx']`获取到传入的键值对参数

```javascript
// 执行node test.js 123
console.log(process.argv); // ['node', '/Users/xxx/test.js', '123']

// 执行node test.js --name=test
console.log(process.env); // { npm_config_name: 'test' }
```
