# vite 项目启动报错汇总

## 报错1：error when starting dev server: Error: The following dependencies are imported but could not be resolved:

原因：拉取的代码，缺少某个导入的依赖，工具函数

解决方法：看报错所在文件的依赖包是否在package.json中、或者是否安装；或者引入路径是否出错

## 报错2：typescript项目代码提示无法显示，以及某些快捷键无法使用

解决方法：全部禁用安装的vscode插件，然后在逐个启用，找出影响的插件，然后把他工作区禁用掉