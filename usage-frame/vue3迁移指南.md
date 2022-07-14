# vue3迁移指南

## 准备工作

防止代码出现警告：从vue2迁移到vue3后，需要安装valor插件，同时工作区需要禁用vetur插件

## 安装

安装方式：
- 通过vite：`npm init vite project-name -- --template vue`或者`yarn create vite project-name --template vue`
- 通过vue-cli：`npm install -g @vue/cli`或`yarn global add @vue/cli`，然后`vue create project-name`

**vue2和vue3共存**：需要非全局下载vue-cli(Vue2)和@vue/cli(vue3)，然后分别在对应目录下找到例如`D:\vue-version-cache\node_modules\.bin\vue`的文件
- 然后使用该文件绝对路径进行创建即可
- 或者将vue文件对应的.bin目录存放到全局环境变量path中，然后对vue文件和vuecmd文件改成vue2或vue3即可。后面就能够直接在命令行中使用vue2和vue3进行项目创建

## 组合式API

### setup组件选项

定义：setup选项在组件被创建之前执行，一旦props被解析完成，它就将被作为组合式api的入口

使用：
- setup选项可以和data、methods等选项并列使用，它是一个函数，可接收props和context参数
- 可以将setup返回的内容（返回一个对象），暴露给组件的其余部分以及组件模板使用

注意：
- setup中避免使用this，他不会找到组件实现（因为在创建之前执行的）
- setup的调用发生在data、computed、methods被解析之前，所以他们都无法在setup中被获取

### <script setup>