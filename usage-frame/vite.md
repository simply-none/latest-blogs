# vite


## 创建vite项目

简要：
- vite项目中，`index.html`文件处于项目根目录下，其作为vite项目的入口文件
- vite支持多个`.html`作为入口点的多页面应用模式
- 可以直接使用`vite`或`npx vite`命令运行项目，见npm srcipts脚本。同时可以指定额外的命令行选项，比如`--port`、`--https`，使用`npx vite --help`获取更多内容

<!-- tabs:start -->
<!-- tab:vite命令创建 -->
```bash
# 根据提示创建
npm create vite@latest
yarn/pnpm create vite

# 自带模板生成
npm create vite@latest my-vite-app -- --template vue
yarn/pnpm create vite my-vite-app --template vue
```
<!-- tab:社区模板创建 -->
```bash
# 使用digit工具
npm install -g degit

# 根据对应的社区模板生成项目
npx degit user/project#branch my-vite-app
# example: Admin starter template based on Vite + Vue3 + TypeScript + Vue-Router4 + Pinia + Unocss + Ant-design-vue + Auto imports.
degit developer-plus/vue-hbs-admin my-vite-app
# Background management template based on Vue3, Ant-Design-Vue, TypeScript.
degit anncwb/vue-vben-admin my-vite-app

# 若是安装错误： could not download https://github.com/simply-none/latest-blogs/archive/9d988374ad7495251f17133a934551956bccbfa2.tar.gz
# 先将.tar.gz改成.zip,然后将文件下载下来解压缩，然后就可以了，直接使用了
```
<!-- tab:package.json -->
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```
<!-- tabs:end -->
