# react项目启动报错汇总

## 报错1：You are running `create-react-app` 4.0.3, which is behind the latest release (5.0.1).

场景：运行命令`npx create-react-app my-app`创建react应用时出现该错误

解决方法：根据命令行提示删除全局包`npm uninstall -g create-react-app`无效，[网上查找内容](https://blog.csdn.net/tuzi007a/article/details/123333059)，找到了解决思路，即重新安装该包，然后再运行命令创建react应用