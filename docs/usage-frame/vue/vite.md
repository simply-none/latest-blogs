# vite

> 参考：    
> https://cn.vitejs.dev/guide/why.html  

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

::: code-group
```bash [vite命令创建]
# 根据提示创建
npm create vite@latest
yarn/pnpm create vite

# 自带模板生成
npm create vite@latest my-vite-app -- --template vue
yarn/pnpm create vite my-vite-app --template vue
```
```bash [社区模板创建]
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
```json [package.json]
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```
:::

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
  - 在构建生产版本时，可以在vite的构建命令之外运行`tsc --noEmit`
  - 在开发时，若需更多的IDE提示，建议在一个单独的进程中运行`tsc --noEmit --watch`，或者使用vite-plugin-checker插件
- vite使用esbuild将ts转译为js，速度约是tsc的20-30倍，同时HMR更新反映到浏览器的时间小于50ms
- 使用*仅含类型的导入和导出*形式的语法可以避免潜在的*仅含类型的导入被不正确打包*的问题，比如`import type { T } from '../types'; export type { T };`

**typescript编译器选项**，tsconfig.json中的compilerOptions的配置项需要注意：
- `isolatedModules`：该选项应该设为true，因为esbuild只执行没有类型信息的转译，并不支持比如`const enum`和隐式类型导入。而一些库（比如vue）不能很好的和该选项共同工作，可以暂时使用`skipLibCheck: true`缓解
- `useDefineForClassFields`：在target是ESNext或ES2022及更新版本中默认为true
- 影响构建的其他字段：extends、importsNotUsedAsValues、preserveValueImports、jsxFactory、jsxFragmentFactory

**客户端类型**：
- vite默认的类型定义是写给nodejs api的，要将其补充到一个vite应用的客户端代码环境中，需添加一个`d.ts`声明文件，内容为`/// <reference types="vite/client" />`，也可将`vite/client`添加到tsconfig的`compilerOptions.types`中，内容为`'types': ['vite/client']`，这将会提供以下类型定义补充：
  - 资源导入，比如导入一个svg文件
  - `import.meta.env`上vite注入的环境变量的类型定义
  - `import.meta.hot`上的HMR API类型定义
- 若要覆盖默认的类型定义（比如svg文件的类型定义），需要在三斜线注释之前引入你自定义的类型定义的声明文件

**其他功能**：

- vite为vue提供了第一优先级的支持：
  - @vitejs/plugin-vue支持vue3单文件组件
  - @vitejs/plugin-vue-jsx支持vue3 jsx
  - 还有vue2 sfc、jsx支持
- vite支持jsx、tsx文件，jsx的转译是通过esbuild的（插件：@vitejs/plugin-vue-jsx）
- 对于css，导入css文件会把内容插到style标签中；支持HMR；能够以字符串形式检索处理后的作为其模板默认导入的css
  - css、less、sass支持@import导入和url()，能够使用vite别名（alias）
  - 项目中若包含postcss配置（postcss.config.js），将会自动应用到所有已导入的css中
  - css最小化压缩在postcss之后运行，会使用build.cssTarget选项
  - 任何以.module.css为后缀的css（或预处理器）文件是一个css module，以默认导入的方式导入它会返回一个相应的模块对象，比如`import classes from './xx.module.css'; console.log(classes.red)`，会读取到文件的red选择器；若css.modules.localsConvention设置开启了camelCase格式变量命名转换（localsConvention: 'camelCaseOnly'），还可以使用按名导入的方式
  - vite内置支持各个css预处理器，不需要安装特定的vite插件（比如loader），只需要安装预处理器本身即可
  - 可以使用`?inline`结尾的导入（vite v4）获取css模块对象，进而获取对应的值，比如`import classes from './xx.css?inline`，这个仅会获取css对象，而不会自动注入css样式到当前页面；对于之前的版本可以使用默认导入和按名导入的方式
- vite处理静态资源：
  - 导入一个静态资源会返回解析后的url：`import imgUrl from './img.png'`
  - 显式加载资源为url（目的是获取该文件的url）：`import imgUrl from './img.png?url'`
  - 以字符串形式加载资源（目的是获取该文件的原生字符串）：`import imgUrl from './img.png?raw'`
  - 加载为web worker（获取一个worker函数）：`import worker from './worker.js?worker'`
  - 构建web worker时，内联为base64字符串：`import inlineWorker from './worker.js?worker&inline'`
- vite导入多个模块：`import.meta.glob('./dir/*.js')`，这将会导入dir目录下的所有js文件，返回一个以文件名路径为key，模块对象为value的对象；
  - 匹配到的文件默认是懒加载的，通过动态导入实现，会在构建时分离为独立的chunk；
  - 若想直接导入所有模块，可以传入`{eager: true}`作为第二个参数；
  - glob的导入形式可以通过第二个参数选项as属性实现，比如获取文件的内容`{as: 'raw'}`，获取文件的url`{ as: 'url'}`
  - glob的第一个参数可以是一个glob数组（路径数组）
  - glob参数支持反向匹配（以!作为glob的前缀），反向匹配一般放在数组结尾，比如匹配当前目录所有文件，除了app.vue外`glob('[./*', '!./app.vue'])`
  - 导入模块部分内容（按名导入）：`glob('./*.js', { import : 'a'})`，只导入模块的a变量/函数，import和eager共存时可以对模块进行tree-shaking、import的值可以是default，即默认导入
  - 自定义查询：第二个参数属性可以是query属性，值是一个查询对象，和接口请求的get query查询类似
  - glob只是vite独有的功能，非web/es标准
  - glob第一个参数会当成导入标识符，必须是相对路径/绝对路径/别名路径
  - 所有的glob参数必须是字面量参数传入，不能使用变量或表达式，比如将第一个参数`'../*'`换成一个值为它的变量是不允许的，会报错
- vite支持带变量的动态导入：`await import('./dir/${file}.js\')`，其中file必须是非嵌套的文件名，即`foo`，而非`bar/foo`
- 预编译的wasm文件可以通过`?init`导入，默认导出一个初始化函数，函数返回值是导出wasm实例对象的promise
- web worker可以使`new Worker()`和`new SharedWorker()`导入，相比于worker后缀导入更接近语法标准，更推荐，例如`const worker = new Worker(new URL('./worker.js', import.meta.url))
  - worker构造函数接受第二个参数，用于创建worker模块的选项使用`{ type: 'module'}`
  - worker后缀形式的导入对象，也需要使用worker构造函数`new ImportWorkObj()`
  - 默认情况下，worker将在生产构建中编译成单独的chunk，若想内联成base64，需要添加inline参数`?worker&inline`，若想读取worker url，需要使用`?worker&url`
- 构建优化：
  - css代码分割：vite会自动将一个异步chunk模块中使用到的css代码抽取除了，并为其生成一个单独的文件。这个css文件将在该异步chunk加载完成时自动通过link标签载入，该异步chunk会保证只在css加载完成后执行，避免发生[FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content#:~:text=A%20flash%20of%20unstyled%20content,before%20all%20information%20is%20retrieved.)；若你想将所有css抽取到一个文件中，可以设置`build.cssCodeSplit: false`禁用css代码分割
  - vite会为入口chunk和他们在打包出的html中直接引入自动生成`link ref="modulepreload`标签指令
  - 异步chunk加载优化

### 依赖预构建

项目首次启动vite时，可能会打印如pre-building dependencies的信息，这就是vite执行时做的**依赖预构建，这个过程的目的**有下列两个：
- commonjs和umd模块兼容性：开发阶段vite将所有代码视为原生esm，故而需将commonjs和umd发布的依赖项转为esm，在转换时vite会进行智能导入分析使导入（具名导入和默认导入）符合预期效果
- 性能：vite将含有多个内部模块的esm依赖关系转为单个模块，以提高后续页面加载性能。一些包（比如loadash-es）将他们的es模块构建作为许多单独的文件互相导入，当执行导入（`import { xxx } from xxx`）时，浏览器会同时发出很多http请求，大量的请求会在浏览器端造成网络堵塞，拖慢页面加载速度，通过预构建使其成为一个模块，就只需要一个http请求

注意：
- 依赖预构建仅会在开发模式下应用，使用esbuild将依赖转为esm，生产构建中使用的是@rollup/plugin-commonjs

**自动依赖搜寻**：
- 若找不到相应的缓存，vite将抓取源码，自动寻找（比如从node_modules）引入的依赖项，并将这些依赖项作为预构建包的入口点
- 在服务器启动后，若遇到一个新的不在缓存中的依赖关系导入，vite将重新运行依赖构建进程并重加载页面

**monorepo和链接依赖**：
- 在monorepo启动中，该仓库的某个包可能会成为另一个包的依赖，vite会自动侦测没有从node_modules解析的依赖项，并将链接的依赖视为源码，他不会尝试打包被链接的依赖，而是会分析被链接依赖的依赖列表
- 这需要被链接的依赖被导出为esm，如果不是该格式，可以在配置里将依赖添加到`optimizeDeps.include`和`build.commonjsOptions.include`这两项中，当这个被链接的依赖发生变更后，重启开发服务器时在命令中带上`--force`让所有更改生效
- 由于对链接依赖的解析方式不同，传递性的依赖项可能会不正确的进行重复数据删除，而造成运行时的问题，出现这个问题可用npm pack修复

**自定义行为**：
- 如果想显式从列表中包含/排除依赖项，应使用`optimizeDeps`配置选项
- 当vite在源码中无法直接发现import的时候，可以使用`optimezeDeps.include`或`optimizeDeps.exclude`处理，若依赖项很大（包含很多内部模块）或是commonjs，应使用include；若依赖项很小且是有效的esm，应使用exclude，让浏览器去加载它

**文件系统缓存**：
- vite会将预构建的依赖缓存到node_modules/.vite里，它根据下面某项改变时去重新预构建：
  - 包管理器的lockfile（比如package-lock.json,yarn.lock,pnpm-lock.yaml）
  - 补丁文件夹的修改时间
  - 在vite.config.js某字段配置过的
  - NODE_ENV的值
- 若想强制vite重构建依赖，应使用`--force`命令行选项或手动删除`node_modules/.vite`

**浏览器缓存**：
- 解析后的依赖请求会以http头`max-age=31536000,immutable`强缓存，以提高开发时页面重载性能
- 一旦被缓存，这些请求将不会再到达开发服务器
- 如果想通过本地编辑来调试依赖项，可以通过下列三个步骤：
  1. 浏览器调试工具的network选项卡禁用缓存
  2. 重启vite dev server，添加`--force`
  3. 重载页面

### 静态资源处理

使用：
- 引入一个静态资源（可以是相对路径和绝对路径）会返回解析后的公共路径`import imgurl from './img.png'`，imgurl在开发时是`/img.png`，在生产时是`/assets/img.sadfa3f.png`，行为类似webpack的file-loader
- css中的`url()`引用处理方式同上
- vite使用vue插件时，vue sfc模板的资源引用将自动转为导入
- 常见的图像、媒体、字体文件类型会被自动检测为资源，可使用`assetsInclude`选项自行扩展其他类型
- 未被包含在内部列表或`assetsInclude`中的资源，可在路径后添加`?url`后缀显式导入为一个url，比如`import url from 'extra-scalloped-border/worklet.js?url`
- 资源可以使用`?raw`后缀声明作为字符串引入
- 脚本可以使用`?worker`或`?shareworker`后缀导入为web worker
- 引用的资源作为构建资源图的一部分包括在内，将生成散列文件名，可以由插件处理优化
- 较小的资源（小于`assetsInlineLimit`选项配置的）会被内联为base64
- git lfs占位符会自动排除在内联之外，因为他们不包含他们所表示的文件的内容，要获得内联，需确保在构建之前通过git lfs下载文件内容
- 默认typescript不会将静态资源导入视为有效的模块，解决这个问题，需添加`vite/client`

**public目录**：
- 若有下列资源，可以将他们放在public目录中：
  - 不会被源码引用的，比如robots.txt
  - 必须保持原有文件名的
  - 不想引入资源，仅是得到他的url的
- 该目录的资源在开发时能通过`/`根路径访问，打包时会被完整复制到目标目录的根目录下
- 目录默认是`<root>/public`，可通过`publicDir`选项配置
- 引入public的资源应使用根绝对路径，以`/`开头，比如`public/icon.png`，使用`/icon.png`引入
- public的资源不应被js文件引用

**new URL**：
- `import.meta.url`是esm原生功能，会暴露当前模块的url，和原生url构造器`new URL`一起使用，可得到一个完整解析的静态资源url，比如`const imgurl = new URL('./img.png', import.meta.url).href`，这能在现代浏览器中直接使用，不需vite处理
- 还支持动态url，通过模板字符串引入动态变量路径
- 不支持完全的变量名作为路径，出上面的模板字符串外，必须是静态字符串
- 无法在ssr中使用

## 使用插件

前置信息：
- vite可以使用插件进行扩展，得益于rollup的插件接口设计和一部分vite独有的额外选项，意味着vite用户可以利用rollup插件的强大生态，根据需要扩展开发服务器和ssr

**添加插件**：
- 使用一个插件，需要将其添加到项目的`devDependencies`字段下
- 在配置文件vite.config.js的plugins字段数组中引入该插件

**强制插件顺序**：为了与某些rollup插件兼容，可能需要强制修改插件的执行顺序（使用enforce），或者只在某种模式下使用（使用apply）

**按需应用**：默认情况下插件会在开发和生产模式下都调用，若想仅在某种模式下调用，可声明apply字段

```javascript
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

## 构建生产版本

使用`vite build`命令构建生产环境，默认情况下，会使用`root/index.html`作为构建入口。

默认情况下，vite的目标是能够支持原生ESM script标签、原生ESM动态导入、import.meta的浏览器。可以通过build.target选项指定构建目标（最低支持es6）。

对于传统浏览器可以通过插件@vitejs/plugin-legacy使用vite构建产物，该插件会自动生成传统版本的chunk和es语言特性对于的polyfill。兼容版的chunk只会在不支持原生ESM的浏览器进行按需加载。

若想在嵌套的公共路径下部署项目，需要指定base选项，然后所有资源路径（js引入的资源url、css的url()引用、html文件引入的资源）都会根据该配置自动调整。而对于动态链接的url，可以使用全局注入的import.meta.env.BASE_URL变量（只能使用点语法，不能使用中括号语法），它的值就是公共基础路径base的值。

可以通过build.rollupOptions选项来自定义构建，直接调整底层的rollup选项。

可以通过build.rollupOptions.output.manualChunks自定义chunk分割策略。vite2.8之前，chunk默认分割成index和vendor。在之后的版本，manualChunks默认情况下不再被更改，可以在plugins选项中引入vite中的splitVendorChunkPlugin函数继续使用vendor chunk策略。

可以使用vite build --watch启用rollup监听器，也可通过build.watch选项启用，当设置后，对于vite.config.js的改动和任何要打包文件的改动，都会触发重新构建。

### 多页面应用配置

构建多页面项目，需要在build.rollupOptions.input对象选项中指定多个入口点即可，key为页面标识，value为页面路径。若指定了其他的根目录，__dirname的值仍然是当前配置文件所在目录。

示例详解：假设项目中有两个入口src/moduleA/index.html，src/moduleB/index.html，每个入口都有一套完整的路由、组件等内容（和单页面类似）
1. 配置vite.config.js
2. 若想在首次加载时就展现moduleA的内容，需要在根目录配置index.html，然后使用`location.href="./src/moduleA/"`跳转到moduleA的入口；或者直接使用`xxx/src/moduleA`这样的路径去访问。
3. 此时展现了moduleA中mount挂载的根节点内容，但是不会展示`RouterView`节点内容，这时需要在`script setup`中使用路由跳转到当前位置`router.push(xxx)`
4. 若想在moduleA中跳转到moduleB，重复第2、3步即可

::: code-group

```typescript [viteconfig设置]
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // __dirname: viteconfigjs所在目录，路径可以是index.html的路径，也可以是其所在的目录路径
        main: path.resolve(__dirname, './src/moduleA'),
        main2: path.resolve(__dirname, './src/moduleB/index.html')
      }
    }
  }
})
```

```vue [配置模块跳转]
<template>
  <div id="moduleA">
    <button @click="toModuleB">跳转到B</button>
    <router-view/>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳转到moduleA 路由设置的相关路径，必须，否则不展示router view的内容
router.push('/')

function toModuleB () {
  location.href = '/src/moduleB/'
}
</script>
```
:::

### 缓存优化（实验性）

若想将部署的资源、公共文件使用不同的缓存策略存放在不同的位置，比如：
- 生成的入口html文件
- 生成的带hash的文件（js、css、其他文件）
- 拷贝的公共文件（public目录下的）

```typescript
// vite.config.ts
export default {
  experimental: {
    renderBuiltUrl (
      filename: string,
      { hostId, hostType, type}: {
        hostId: string,
        hostType: 'html' | 'js' | 'css',
        type: 'public' | 'asset'
      }) {
        // 如果是public目录下的文件，存放在该位置
        if (type === 'public') {
          return 'https://xxx.xx.com/' + filename
        }
        // hostId：即文件的路径字符串，extname获取文件类型
        // 如果是js文件，则：
        else if (path.extname(hostId) === '.js') {
          return {
            runtime: `window.__assetsPath(${JSON.stringify(filename)})`
          }
        }
        else {
          // 其他文件，存放于该位置
          return 'https://aa.bb.com/' + filename
        }
      }
  }
}
```

## SSR

## 环境变量和模式

**环境变量**：
- vite在一个特殊的`import.meta.env`对象上暴露环境变量，下列是在所有情形下都能使用的内建变量：
  - `import.meta.env.MODE`：应用运行的模式
  - `import.meta.env.BASE_URL`：部署应用时的基本url，由base配置项决定
  - `import.meta.env.PROD`：是否运行在生产环境
  - `import.meta.env.DEV`：是否运行在开发环境
  - `import.meta.env.SSR`：是否运行在server环境
- 在生产环境中，
  - 上述环境变量会在构建时被静态替换，所以引用时应使用完全静态的字符串，动态的key无法生效，比如`import.meta.env[key]`
  - 他还将替换出现在js和vue模板中的字符串，比如将`process.env.NODE_ENV`替换为development，可能出现missing semicolon或unexpected token的错误，避免这种情况可以用：
    - 对于js字符串，使用`import.meta\u200b.env.MODE`替换
    - 对于vue或其他编译到js字符串的html，可以使用`<wbr>`标签，比如`import.meta.<wbr>env.MODE`

**.env文件**：
- vite使用dotenv从环境目录中的下列文件加载额外的环境变量：
  - `.env`：所有情况都加载
  - `.env.local`：所有情况都加载，被git忽略
  - `.env.[mode]`：指定模式加载
  - `.env.[mode].local`
- 加载的环境变量通过`import.meta.env.xxx`的形式暴露给源码，只有以`VITE_`前缀的变量才能获取到它的值，可使用`envPrefix`自定义变量前缀
- 若想在环境变量中使用$符，应用\对其转义
- 默认情况下vite在vite/client.d.ts中为import.meta.env提供了类型定义，如果想在代码中获取以VITE_开头的环境变量的提示，应在src下创建一个env.d.ts文件声明env的类型
- 如果代码依赖于浏览器类型，可以在tsconfig中修改lib字段，比如`lib: ['WebWorker']`

```javascript
// env的ts提示，env.d.ts
// 在tsconfig.json下的compilerOptiosn.types字段下定义了"vite/client"，就不要写下列三斜线注释了
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // ....
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

**模式**：
- 在某些情况下，若想在vite build时运行不同的模式渲染不同内容，可传递`--mode`选项覆盖默认mode，比如`vite --mode staging`，这时需要env的值为staging

## vite config

> 参考：
> - https://github.com/vbenjs/vue-vben-admin
> - https://github.com/pure-admin/vue-pure-admin

```typescript

```