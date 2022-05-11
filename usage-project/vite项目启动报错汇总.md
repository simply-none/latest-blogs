# vite 项目启动报错汇总

## 报错1：error when starting dev server:Error: The following dependencies are imported but could not be resolved:

原因：拉取的代码，缺少某个导入的依赖，工具函数

解决方法：看报错所在文件的依赖包是否在package.json中、或者是否安装；或者引入路径是否出错
