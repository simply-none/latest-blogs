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
