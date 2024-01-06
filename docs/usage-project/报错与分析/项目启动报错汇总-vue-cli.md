# vue-cli项目启动报错汇总

## 报错1：invalid host header

问题：在远程环境中启动代码，本地通过远程地址访问该项目，打开页面报错invalid host header

原因：新版的webpack-dev-server出于安全考虑，默认检查hostname，如果hostname不是配置内的，将中断访问。

解决方案：
```javascript
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

## 报错12：terser-webpack-plugin drop_console未生效

问题：按照文档进行相关配置之后，重启项目，控制台依然会存在console.log日志，查找网上教程，依然出问题

原因：未进行`devtool: source-map`的配置，因为该插件是通过`eval(string)`函数进行处理项目代码的，而minimizer不会处理字符串

解决方法:

::: code-group

```javascript [terser-webpack-plugin配置]
// 方法一：
// vue.config.js
import TerserPlugin from 'terser-webpack-plugin'
module.exports = {
  configureWebpack: config => {
    if (!isProd) {
      // 必须配置该选项，值可以是：source-map，inline-source-map，hidden-source-map 和 nosources-source-map
      config.devtool = 'source-map'
      config.optimization = {
        minimize: true,
        minimizer: [new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              warnings: true,
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log']
            }
          }
        })]
      }
    }
  }
}
```

```javascript [babel-plugin-transform-remove-console配置]
// 安装
npm install babel-plugin-transform-remove-console --save-dev

// babel.config.js
// 项目发布阶段需要用到的babel插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 非生产环境，直接使用：
    // 'transform-remove-console',
    // 发布产品时候的插件数组
    ...prodPlugins
  ]
}
```
:::

## 报错13：Error: PostCSS plugin autoprefixer requires PostCSS 8.

问题：一个之前运行过的项目，再次运行时报Error: PostCSS plugin autoprefixer requires PostCSS 8.

排错思路：
- 查看错误看错误发生的位置，错误标红提示是否涉及到某些关键词，本次排查时发现跟sass相关的loader有关系，在降低或固定版本后，发现错误仍然发生
- 查看package-lock.json中搜索postcss这个插件，查看哪些依赖使用了这个插件，然后进行该依赖版本的降级或固定
- 查看package.json，一个个排查项目中使用的依赖，看看哪个依赖和其关联性更大，然后进行该依赖版本的降级或固定

解决：
- 在固定vue和vue-template-compilier的版本后，同时删除node_modules、package-lock.json之后，再次安装运行，错误消失
- 在取消上述两个的版本固定后，同时删除node_modules、package-lock.json之后，再次安装运行，错误消失（莫名奇妙哦，错误就没了，hhhh）

## 报错14：刷新页面出现404 Not Found，The requested URL 'xxx' was not found on this server.

问题：在配置了vue.config.js的代理之后，部分命中了该代理的页面出现了上述报错

排错思路：有可能是vue.config.js缓存有关，有可能是和其他内容有关，比如本例中安装了mockjs。

解决：删除vue.config.js修改的相关内容后，电脑关机，重启运行项目，错误消失。
