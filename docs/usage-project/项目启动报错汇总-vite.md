# vite 项目启动报错汇总

## 报错1：error when starting dev server: Error: The following dependencies are imported but could not be resolved:

原因：拉取的代码，缺少某个导入的依赖，工具函数

解决方法：看报错所在文件的依赖包是否在package.json中、或者是否安装；或者引入路径是否出错

## 报错2：typescript项目代码提示无法显示，以及某些快捷键无法使用

解决方法：全部禁用安装的vscode插件，然后在逐个启用，找出影响的插件，然后把他工作区禁用掉

## 报错3：vite项目若代码报错，浏览器会出现一个报错独有的弹窗

解决方案：安装弹框的提示进行关闭，在vite.config.js的一级配置中，设置`server.hmr.overlay`以禁用服务器错误遮罩层，报错只会在浏览器控制台出现了，而非直接出现并覆盖在页面上

附录：
- webpack构建的项目，在对应的config.js中配置`devServer.overlay`为false即可关闭遮罩层错误
- 不管是啥构建工具，都是使用该配置字段overlay

## 报错4：'NODE_OPTIONS' 不是内部或外部命令，也不是可运行的程序或批处理文件

问题：在使用npm run命令启动项目时，出现该错误，npm run命令参数是`"dev": "NODE_OPTIONS=--max-old-space-size=4096 vite"`

解决方案：
- 安装npm包cross-env，然后将其添加到命令前面：`"dev": "cross-env NODE_OPTIONS=--max-old-space-size=4096 vite"`

## 报错5：运行vite build等命令时出现FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory的错误

出现原因：大多数情况下，当您遇到此错误时，可能是因为内存泄漏、库的添加/版本升级或 Node.js 在不同版本之间管理内存的方式不同

解决方案：
- 通常只是增加分配给 Node.js 的内存会让你的程序运行，但可能并不能真正解决真正的问题，节点进程使用的内存仍然可能超过你分配的新内存（加大max-old-space-size的值）
- 在Node.js 进程开始运行或更新到 Node.js > 10 时分析内存使用情况（升级nodejs版本）

```json
//  增加内存 in package.json： NODE_OPTIONS=--max-old-space-size=8192
// max-old-space-size: 2048 | 4096 | 8192 | 16384等， 1024的倍数
{
  "scripts": {
    "build": "cross-env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=8192 vite build && esno ./build/script/postBuild.ts",
  }
}
```

## 报错6：子应用接入qiankun出现Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.和Uncaught (in promise) TypeError: Failed to fetch dynamically imported module:xxx的错误

出现原因：网上的答案基本上大都不相同，后解决的根本还是按照qiankun官网进行严格的配置。

解决方案：严格按照官网文档进行配置，比如主应用子应用挂载节点必须一致，不然有可能出现上述问题。在进行了严格相同的配置之后，若出现问题，再去寻找解决之道。

## 报错7：Could not resolve "@vue/reactivity", You can mark the path "@vue/reactivity" as external to exclude it from the bundle, which will remove this error.

出现场景：在vitepress中使用element-plus出现的错误

解决：安装该包即可，`npm i @vue/reactivity`
