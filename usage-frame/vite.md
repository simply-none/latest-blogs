# vite

## 为什么选择Vite

**现实问题**：构建很多模块的大型应用时，工具（将源码转成浏览器能支持的文件）需要处理的js代码量呈指数级增长，基于JavaScript开发的工具遭遇了性能瓶颈，导致严重影响开发者体验和开发效率，比如：
- 需要很长的时间启动开发服务器（npm run dev的过程）
- 文件（代码）修改后的效果需要几秒钟才能在浏览器中反映出来，即使使用了模块热替换（HMR）

**vite的目标**：利用生态系统的新进展解决上述问题，比如：
- 浏览器开始原生支持ES模块
- 越来越多JavaScript工具使用编译型语言编写，而非JavaScript

**vite的解决方案**：
- 将应用中的模块分为依赖和源码，以此改进开发服务器启动的时间
  - 依赖指的是在开发时不会变动的纯JavaScript（比如组件库），依赖通常存在多种模块化格式（比如ESM、CommonJS）。vite将使用**esbuild**（使用go编写，比JavaScript编写的打包器预构建依赖快10-100倍）预构建依赖
  - 源码指的是一些并非直接是JavaScript后缀的文件，且可能需要转换和被修改编辑（比如JSX、CSS、Vue、Svelte），同时并不是所有的源码都需要同时被加载（比如基于路由拆分的代码模块）。vite以**原生ESM**方式提供源码，让浏览器接管打包程序的部分工作，只需要在浏览器请求源码时才进行转换并按需提供源码；根据情景动态导入代码（只在当前屏幕上实际使用时才会被处理）
- 文件更新修改的处理：
  - 某些打包器的开发服务器将构建内容存入内存，这样只需要在文件更改时使模块图的一部分失活，但仍然需要整个重新构建和重置页面（消除应用当前状态），这样的代价较高，后续出现的动态模块热替换(HMR)允许模块热替换自己，而不影响页面其余内容。然后即使如此，热更新的速度会随应用规模增长而下降
  - vite中HMR是在原生ESM上执行的，vite只需要精确的使已编辑的模块与其最近的HMR边界之间的链失活，使得无论应用大小如何，HMR始终能保持快速更新；同时vite利用http头加速整个页面的重加载，源码模块的请求根据`304 not modified`进行协商缓存，依赖模块请求通过`cache-control: max-age=31536000;immutable`进行强缓存，一旦被缓存他们将不需再次请求

**vite的定义和组成**：
- 定义：是一种新型前端构建工具，能显著提升前端开发体验
- 由下列两部分组成：
  - 一个开发服务器：基于原生ES模块，提供了丰富的内建功能（比如HMR）
  - 一套构建指令：它使用Rollup打包代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源

**vite的构建目标**：
- 支持原生ESM语法的script标签、原生ESM动态导入和`import.meta`的浏览器
- 传统浏览器可通过插件`@vitejs/plugin-legacy`支持

[**vite命令**](https://cn.vitejs.dev/guide/cli.html)：
- `vite`：启动开发服务器，别名有：`vite dev`、`vite serve`
- `vite build`：生产环境构建产物
- `vite preview`：本地预览生产环境构建产物
- 额外的命令行选项，可使用`npx vite --help`获取，有：
  - `--port`
  - `--https`

```bash
# vite 命令行
vite [root] [options]
# options:
--host [host]
--port <port>
--https boolean
--open boolean | string<浏览器地址>
# 启用跨域
-- cors boolean
-m, --mode string
```

**为什么生产环境仍然需要打包**：
- 虽然原生ESM得到了广泛支持，但由于模块的嵌套导入会导致额外的网络往返，在生产环境中发布未打包的ESM效率仍然低下（即使在HTTP/2中）
- 为了在生产环境中获得最佳加载性能，最好将代码进行tree-shaking、懒加载、chunk分割（获得更好的缓存）
- vite附带了一套开箱即用的构建优化的构建命令，以确保开发服务器和生产环境构建之间的最优输出和行为一致

**为什么不用esbuild打包**：
- 虽然esbuild快的惊人，且在构建库方面比较出色，但一些针对构建应用的重要功能仍然在开发（比如代码分割、css处理）
- 同时Rollup在应用打包方面更加成熟灵活

## 创建vite项目

> 在线IDE试用网址：https://stackblitz.com/edit/vitejs-vite-xjxsv8?file=index.html&terminal=dev

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

# 使用预置模板: [模板种类](https://github.com/vitejs/vite/tree/main/packages/create-vite)
# npm 6.x
npm create vite@latest project-name --template vue
# npm 7+
npm create vite@latest project-name -- --template vue
# yarn or pnpm
yarn/pnpm create vite project-name --template vue

# 根据对应的社区模板生成项目
npx degit user/project#branch project-name
# example: Admin starter template based on Vite + Vue3 + TypeScript + Vue-Router4 + Pinia + Unocss + Ant-design-vue + Auto imports.
degit developer-plus/vue-hbs-admin project-name
# Background management template based on Vue3, Ant-Design-Vue, TypeScript.
degit anncwb/vue-vben-admin project-name

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

**注意**：
- `index.html`：在项目的最外层而非public文件夹，这是有意为之的，在开发期间vite是一个服务器，而`index.html`是项目的入口文件
  - vite将`index.html`视为源码和模块图的一部分，解析`<script type='module' src='...'></script>`(这个标签指向js源码)，甚至内联的`<script type='module'></script>`、`<link href>`也能利用vite的特性被解析
  - `index.html`的url将被自动转换，因此不需要`%PUBLIC_URL%`占位符了
  - vite支持多个`.html`作为入口点的多页面应用模式
- vite的根目录（服务文件的位置）以`<root>`代称，源码中的绝对url将以项目的根作为基础来解析，因此可以像普通的静态文件服务器一样编写代码
- vite能处理依赖关系，解析处于根目录外的文件位置，使得它即使在基于monorepo的方案中也十分有用
- vite以当前工作目录作为根目录启动开发服务器，可通过`vite serve path`指定根目录

## vite的功能

> https://cn.vitejs.dev/guide/features.html

**npm依赖解析和预构建**：原生的ES导入不支持形如`import { someMethod } from 'my-dep'`的裸模块导入，而vite将会检测到此类导入，并执行：
- 预构建：提供页面加载速度，将commonjs、umd转换为esm格式，这一步由esbuild执行，使得冷启动时间比基于JavaScript的打包器快
- 重写导入，使其成为合法的url：比如将my-dep重写为`/node_modules/.vite/deps/my-dep.js?v=f3sf2ebd`

**模块热替换**：
- vite提供了一套原生ESM的HMR API，具有HMR功能的框架可以利用该API提供即时、准确的更新，而无需重加载页面或清除应用程序状态
- vite内置了HMR到vue单文件组件SFC和react fast refresh中，在使用[create-vite](https://cn.vitejs.dev/guide/)创建应用程序时，已经预先进行了这些配置

**typescript支持**：
- vite天然支持引入ts文件
- vite仅执行ts文件的转译工作，不执行任何类型检查，它假定类型检查已经在IDE中或构建过程中处理完了
- vite不把类型检查作为转换过程的一部分，是因为类型检查需要了解整个模块图，把类型检查塞进vite的转换管道，将损害vite的速度优势
- vite的工作是尽可能将源码转换为可在浏览器运行的形式，建议将静态分析检查（比如eslint）与vite的转换管道分开
  - 在构建生产版本是，可以在vite的构建命令之外运行`tsc --noEmit`
  - 在开发时，若需更多的IDE提示，建议在一个单独的进程中运行`tsc --noEmit --watch`，或者使用vite-plugin-checker插件
- vite使用esbuild将ts转译为js，约是tsc速度的20-30倍，同时HMR更新反映到浏览器的时间小于50ms
- 使用*仅含类型的导入和导出*形式的语法可以避免潜在的*仅含类型的导入被不正确打包*的问题，比如`import type { T } from '../types'; export type { T };`

**typescript编译器选项**，tsconfig.json中的compilerOptions的配置项需要注意：
- `isolatedModules`：应该设为true，因为esbuild只执行没有类型信息的转译，并不支持比如`const enum`和隐式类型导入。然而一些库（比如vue）不能很好的和该选项共同工作，可以暂时使用`skipLibCheck: true`缓解
- `useDefineForClassFields`：在target是ESNext或ES2022及更新版本中默认为true

**客户端类型**：
- vite默认的类型定义是写给nodejs api的，要将其补充到一个vite应用的客户端代码环境中，需添加一个`d.ts`声明文件，内容为`/// <reference types="vite/client" />`，也可将`vite/client`添加到tsconfig的`compilerOptions.types`中，内容为`'types': ['vite/client']`，这将会提供以下类型定义补充：
  - 资源导入，比如导入一个svg文件
  - `import.meta.env`上vite注入的环境变量的类型定义
  - `import.meta.hot`上的HMR API类型定义
- 若要覆盖默认的类型定义，需要在三斜线注释之前引入你自定义的类型定义声明文件

**其他功能**：
- Vue
- jsx
- css
- 静态资源
- json
- glob
- 动态导入
- webassembly
- web workers
- 构建优化：
  - css代码分割
  - 预加载指令生成
  - 异步chunk加载优化

## 使用插件

前置信息：
- vite可以使用插件进行扩展，得益于rollup的插件接口设计和一部分vite独有的额外选项，意味着vite用户可以利用rollup插件的强大生态，根据需要扩展开发服务器和ssr

**添加插件**：
- 使用一个插件，需要将其添加到项目的`devDependencies`字段下
- 在配置文件vite.config.js的plugins字段数组中引入该插件

**强制插件顺序**：为了与某些rollup插件兼容，可能需要强制修改插件的执行顺序（使用enforce），或者只在某种模式下使用（使用apply）

**按需应用**：默认情况下插件会在开发和生产模式下都调用，若想仅在某种模式下调用，可声明apply字段

```js
// vite.config.js
import image from '@rollup/plugin-image'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...image(),
      // 插件执行顺序，值有：
      // pre：在核心插件之前调用
      // 默认：在核心插件之后调用（即不声明该字段）
      // post：在构建插件之后调用
      enforce: 'pre'
      // 按需调用：build、serve
      apply: 'build'
    }
  ]
})
```

