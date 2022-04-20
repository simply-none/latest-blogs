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

> 参考：`https://github.com/webpack/webpack-dev-server/issues/4142`，`https://developer.aliyun.com/article/636347`