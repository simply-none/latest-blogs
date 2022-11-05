# vue-cli项目启动报错汇总

## 报错1：invalid host header

问题：在远程环境中启动代码，本地通过远程地址访问该项目，打开页面报错invalid host header

原因：新版的webpack-dev-server出于安全考虑，默认检查hostname，如果hostname不是配置内的，将中断访问。

解决方案：
```js
// webpack v3
module.exports = {
  devServer: {
    disableHostCheck: true,
  },
};
// webpack v4+
module.exports = {
  devServer: {
    allowedHosts: "all",
  },
};
```

> 参考：  
> https://github.com/webpack/webpack-dev-server/issues/4142   
> https://developer.aliyun.com/article/636347

## 报错2：DefinePlugin Conflicting values for 'process.env.NODE_ENV'

解决方法：未解决，除了`npm run test`这个命令有警告外，其他无警告

## 报错3：webpack [DEP_WEBPACK_COMPILATION_ASSETS] DeprecationWarning: Compilation.assets will be frozen in future

原因：webpack升级之后，依赖于webpack的插件包版本未升级

解决方法：升级相关的依赖包；若该包没有最新版本时，只能弃用另选其他类似的依赖

## 报错4：error Unexpected mutation of "xxx" prop vue/no-mutating-props

原因：单向数据流，不允许在子组件中修改父组件传过来的props

解决：使用data或computed为props重新赋予变量，或者将该值传递回`this.$emit()`父组件修改

## 报错5：Error in nextTick: "NotFoundError: Failed to execute 'insertBefore' on 'Node

问题：出现错误，页面卡死

原因：组件中v-if切换改变了页面的结构

解决方法：在v-if语句中，使用`:key='xxx'`来解决

## 报错6：Conflict: Multiple assets emit different content to the same filename index.html; ERROR in Conflict: Multiple assets emit different content to the same filename index.html; webpack compiled with 1 error

问题：拷贝项目后，然后直接在项目下安装依赖并运行，并报该错误

解决历程：删掉node_modules, package-lock.json,清空缓存，删除全局依赖@vue/cli,webpack，均无效；最后将项目里面的文件，拷贝至另一个英文路径目录下，正常运行

## 报错7：TypeError: "StackFrame" is not a constructor

问题：git clone项目后，使用npm install和npm run dev就出现这个问题，并且网络上查询无对应解决方案，错误提示中有webpack字样

原因：未明

解决方法：删除node modules，删除package-lock.json，清空npm缓存`npm cache clear -f`，重新安装`vue-cli`全局组件，之后错误才消失

## 报错8：Unable to preventDefault inside passive event listener invocation.

问题：监听滚轮事件出现的

原因：装了插件default-passive-events，然后组件中使用了addEventListener监听事件的方法

解决方法：在addEventListener中第三个选项参数，添加一个对象，并给该对象添加一个属性passive为false

## 报错9：element-ui表格无法展示

原因：由于vue升级为2.7.x导致vue及vue-template-compiler版本对element-ui解析策略不一致造成的错误

解决方法，固定vue及vue-template-compiler的版本号为`~2.6.0`

## 报错10：Unexpected token '<'

问题：当刷新页面后，页面空白，出现该错误

原因：
1. 有可能是`vue.config.js`配置出现了问题，比如publicPath配置错误，当为生产环境时，应该为`./`，当为开发环境时，应为`/`

## 报错11：引入antv-g6，放大缩小画布报错: Unable to preventDefault inside passive event listener invocation.

原因：主函数main.js中引入的`default-passive-events`npm包导致的

解决方法：注释即可