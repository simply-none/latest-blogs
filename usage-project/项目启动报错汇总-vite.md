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