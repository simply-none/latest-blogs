# Vitejs开源项目实践指南

本篇预告，Vitejs开源项目实践指南（一），内容包括：
> - vite定义和功能简述
> - vitejs安装和运行
> - vite.config.ts及vite用户配置说明
> - vitejs字段解析（实例讲解）：base、root、路径别名设置、本地开发server设置、打包构建选项build
> - 重要字段的类型源码，都放在附录知识里面折叠隐藏了，可点击展开查看


> 注意：本文以[vue-pure-admin](https://github.com/pure-admin/vue-pure-admin) 和[vue-vben-admin](https://github.com/vbenjs/vue-vben-admin)为例，进行vite配置入门介绍

## vite定义和功能简述

Vite（法语意为 "快速的"，发音 `/vit/`，发音同 "veet"）是一种新型前端构建工具，能够显著提升前端开发体验。它主要由两部分组成：
- 一个开发服务器，它基于 [原生 ES 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 提供了 [丰富的内建功能](https://cn.vitejs.dev/guide/features.html)，如速度快到惊人的 [模块热更新（HMR）](https://cn.vitejs.dev/guide/features.html#hot-module-replacement)。
- 一套构建指令，它使用 [Rollup](https://rollupjs.org/) 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。

## vitejs安装和运行

### 安装

若使用[vite相关模板](https://cn.vitejs.dev/guide/#scaffolding-your-first-vite-project)构建的项目，会自动安装vite到开发依赖devDependencies选项中 *(注：由上文功能简述可知，vite仅在项目开发时、打包时工作的，故而放在开发依赖下)* 。下面是安装vite的相关命令：

使用 NPM:
```bash
$ npm install vite@latest
```

使用 Yarn:
```bash
$ yarn install vite
```

使用 PNPM:
```bash
$ pnpm install vite
```

### 运行

在package.json文件的scripts字段中记录了项目运行的相关脚本命令，这些命令（比如`npm run dev`, `npm run build`中的`dev`, `build`）可以在项目中通过环境变量`process.env.npm_lifecycle_script`获取，该环境变量用于辅助判断当前环境，进而执行对应的内容。

vite的命令行参数有：
- `dev`, `serve`, ` `：表示启动开发服务器
- `build`：表示构建生产环境产物，即上线运行的内容
- `preview`：表示在本地dist目录 *（该目录默认是存放构建产物的，可通过build.outDir进行设置）* 预览上线后的内容，所以必须要先进行构建`build`命令

```json
// package.json
{
  "name": "demo",
  "scripts": {
    "bootstrap": "pnpm install",
    "dev": "cross-env NODE_ENV=production vite",
    "build": "cross-env NODE_ENV=production NODE_OPTIONS=--max-old-space-size=8192 vite build && esno ./build/script/postBuild.ts",
    "preview": "npm run build && vite preview"
  }
}
```

注意，在执行上述脚本命令时，可能会发生一些错误，比如：
1. **'NODE_OPTIONS' 不是内部或外部命令，也不是可运行的程序或批处理文件**，出现该错误表示识别不出该字段，解决方案是安装一个npm包`cross-env`去设置相应的系统环境变量NODE_OPTIONS，同时上述命令中NODE_ENV前面添加`cross-env `
2. **FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory**，出现该错误的原因可能是因为内存泄漏、Node.js 在不同版本之间管理内存的方式不同，解决方案是加大分配给Nodejs使用的进程内存，即上述命令中的`NODE_OPTIONS=--max-old-space-size=8192`，将分配给Nodejs的内存加到8G

## vite.config.ts及vite用户配置说明

下面是`vite.config.ts`大体结构设置：

- 直接导出vite配置userConfig：

```typescript
/** @type {import('vite').UserConfig} */
// 上面内容是配置ts只能提示用的

// vite配置的第一种形式：直接返回配置内容
export default {
  // userconfig的内容
}
```

- 以函数形式导出vite配置userConfig：

```typescript
import type { ConfigEnv, UserConfigExport } from 'vite'

// vite配置的第一种形式：函数返回配置内容
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  return {
    // userconfig的内容
  }
}
```

- 使用defineConfig直接导出userConfig：

```typescript
import { defineConfig } from 'vite'

export default defineConfig ({
  // userconfig的内容
})
```

- 使用defineConfig以函数形式导出vite配置userConfig：

```typescript
import type { defineConfig, ConfigEnv, UserConfigExport } from 'vite'

// vite配置的第一种形式：函数返回配置内容
export default defineConfig(({ command, mode }: ConfigEnv): UserConfigExport => {
  return {
    // userconfig的内容
  }
})
```

**用户配置UserConfig常用字段简要说明**：

```typescript
const userconfig = {
  // 开发环境或线上环境项目存放的路径
  base: '',
  // 项目根目录，index.html所在位置
  root: '',
  resolve: {
    // 路径别名设置
    alias: { }
  },
  // 项目用到的插件
  plugins: [],
  // 预构建相关配置，比如需预构建的依赖，需要预构建的依赖，是否强制预构建依赖（缓存）
  optimizeDeps: {
    include: {},
    exclude: {},
    force: boolean
  },
  // 生产构建设置
  build: { },
  // 开发服务器选项设置
  server: { },
  // 全局变量定义，可在源码中直接访问
  define: { },
  // css及其预处理器配置
  css: {
    preprocessorOptions: {
      less: {
        // 设置全局的css变量
        modifyVars: { },
        javascriptEnabled: true
      }
    }
  }
  // 其他配置
  // ....
}
```

## vitejs字段解析（实例讲解）

该节的内容结合上述的用户配置userConfig和具体实例展开。

### base

`base`字段设置了开发或生产环境服务的公共基础路径 *（开发环境或线上运行的程序存放的路径）*，若启动开发服务`npm run dev`或线上项目运行出现空白，可能就是该字段设置错误，应根据情况重新修正。该字段合法的值包括：
-  绝对 URL 路径名，例如 `/foo/`, `/`
-  完整的 URL，例如 `https://foo.com/`
-  空字符串或 `./`（用于嵌入形式的开发）

### root

`root`字段表示的是项目根目录，默认是index.html所在的位置，值为`process.cwd()`

附录知识：

`process.cwd()`：表示当前执行node命令时文件夹的地址，而非源码目录。他和`__dirname`的对比如下：

```javascript
// 比如在d://process/index.js文件下，有下列代码：
console.log(process.cwd())
console.log(__dirname)
```

| 命令 | process.cwd() | \_\_dirname |
| --- | --- | --- |
| node index.js | d://process | d://process |
| node process/index.js | d: | d://process |

### 路径别名配置

在项目中，引用文件或资源一般是使用相对路径的语法，类似`import imgUrl from '../../assets/img.jpeg'`，若不想使用这么长的`../`的字符串引用文件或资源时，则可以通过`resolve.alias`字段配置路径别名，配置的语法如下：

- 第一种配置是使用对象的语法形式：

```typescript
import {resolve } from 'path'

// 生成对应的路径
const pathResolve = (dir: string): string => {
  return resolve(__dirname, './', dir)
}

// 设置别名
const alias: Record<string, string> = {
  // 对src/下的目录设置别名，后续src目录下内容src/xxx 可通过 @/xxx引用
  "@": pathResolve('src'),
  // 对build/下的目录设置别名，后续build目录下内容build/xxx 可通过 @build/xxx引用
  "@build": pathResolve('build')
}

// 最后将别名对象alias添加到上述userConfig的alias的值的位置即可
```

- 第二种配置是使用对象数组的形式：

```typescript
import { resolve } from 'path'

// 生成对应路径
const pathResolve = (dir: string): string => {
  return resolve(process.cwd(), '.', dir)
}

// 设置别名
const alias = [{
  // 注意正则表达式需要对特殊字符（/、@）进行转义
  // 将src/xxx的引用 用 /@/xxx 替代
  find: /\/@\//,
  replacement: pathResolve('src') + '/'
}, {
  // 将types/xxx的引用 用 /#/替代
  find: /\/#\//,
  replacement: pathResolve('types') + '/'
}]

// 最后将别名对象alias添加到上述userConfig的alias的值的位置即可
```

在设置了路径别名之后，为了让编辑器更好的识别包含别名的导入语句 *（即在编辑器中点击`import url from '/@/test/index.ts'`中的`url`和`'/@/test/index.ts'`时，自动的跳到对应的文件或函数上）* ，需要在`jsconfig.json`或`tsconfig.json`文件的`compilerOptions.paths`字段下配置和`vite.config.ts`类似的内容，如下所示：
 
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // 配置1，对应上面的内容
      "@/*": ["src/*"],
      "@build/*": ["build/*"],
      // 配置2，对应上面的内容
      "/@/*": ["src/*"],
      "/#/*": ["types/*"]
    }
  }
}
```

注意：
- 当vscode编辑器出现了initializing js/ts language features的提示时，别名路径点击后不会跳转的，除非initializing js/ts language features已经完成。
- 当配置完成后，若点击别名路径不生效，应重启vscode

**附录知识**：

`path.resolve`函数：将一系列的字符串拼接成一个url路径，函数参数是一系列的列表，注意事项：
- 当某项字符串是一个绝对路径时，则自动放弃前面的字符串，从这里开始拼接。比如，若第二项是__dirname，因为它是一个绝对路径，则第一项无效自动废弃
- 当某项字符串是一个带有相对路径的内容时，则会根据前面的字符串，获取当前项字符串所在的路径。比如，若第一项是__dirname, 第二项是'../'时，则第二项具体的路径是__dirname父级路径

`jsconfig.json`文档：[地址](https://code.visualstudio.com/docs/languages/jsconfig)

`tsconfig.json`文档：[地址](https://www.typescriptlang.org/tsconfig)

### 本地开发server配置

常用配置如下：

```typescript
// proxy.ts
import type { ProxyOptions } from 'vite'

type ProxyItem = [string, string]
type ProxyList = proxyItem[]
type ProxyTargetList = Record<string, ProxyOptions>

const httpsRE = /^https:\//

export function createProxy (list: ProxyList = []) {
  const ret: ProxyTargetList = {}
  for (const [prefix, target] of list) {
    const isHttps = httpsRE.test(target)
    ret[prefix] = {
      // 后端接口url前缀
      target: target,
      changeOrigin: true,
      ws: true,
      // 当请求后端接口地址时，转成另一个不报错的接口地址
      // 比如请求http://localhost:3000下的接口时，会自动转成 本机ip:端口/basic-api
      // 替换axios设置的baseurl换成后端的二级或其他级别路径
      /**
       * example:
       * 后端地址：https://xxx.xxx.com/v1/api/file-service/file/get-file
       * target: https://xxx.xxx.com
       * axios baseurl: /api-test
       * rewrite: 替换的值，即将 /api-test 替换成 接口目标(除去域名target后的前缀），
       *    若值为'', 这时你的axios请求接口地址就得是`/v1/api/file-service/file/get-file`
       *    若值为'/v1/api', 这时你的axios请求接口地址就得是`/file-service/file/get-file`
       * 
       *        值为'/v1/api'
       *        axios.defaults.baseURL = '/api-test'
       *        axios.get('/file-service/file/get-file')，
       *        这时，浏览器控制台展示的接口完整路径是：https://localhost:8080（开发地址）+ '/api-test' + '/file-service/file/get-file'
       * 
       *        而被代理的后端接口地址其实是：https://xxx.xxx.com（接口地址）+ '/v1/api' + '/file-service/file/get-file'
       */
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
      // http模式下，需关闭不安全提示
      ...(isHttps ? { secure: false } : {} )
    }
  }
}

// vite.config.ts
import { createProxy } from './proxy.ts'

const viteProxy = [
  ["/basic-api","http://localhost:3000"], 
  ["/upload","http://localhost:3300/upload"]
]
const server:Record<string, any> = {
  // 是否开启https，通过https访问本地项目
  https: true,
  // 指定本地服务器监听的ip地址，值可以是string和boolean类型，默认是'localhost', 设置成'0.0.0.0'或true将监听所有本地地址（可通过ipconfig查看这些地址）
  // 该选项可通过命令行选项--host设置值
  host: true,
  // 设置端口号，该选项可通过命令行选项--port设置值
  port: '9876',
  // 设为true时代表严格的端口占用，若端口被占用，会强制退出，默认情况会尝试其他端口
  strictPort: true,
  // 启动项目是否自动在浏览器打开
  open: true,
  // 是否允许跨域（cors），默认为true，也可以是一个选项对象，看下列源码类型
  cors: true,
  // http服务器响应头设置
  headers: {
    Access-Control-Allow-Origin: '*'
  },
  hmr: {
    // 关闭浏览器出现的错误弹窗
    overlay: false
  },
  // 开发代理设置：主要是开发模式下请求后端接口时，防止出现跨域的错误
  // 将后端接口地址转成另一个真实的后端 API 地址，这样前后端就视为使用了相同的域名、协议和端口，就避免了跨域的问题
  proxy: createProxy(viteProxy),
  // 对代码更改进行监听
  watch: {
    // 忽略某些文件，!开头表示取反，除了your-package-name之外其他都忽略
    // 同时需要监听的内容your-package-name，必须添加到optimizeDeps.exclude下，不能进行依赖优化，以便它能出现在依赖关系图中并触发热更新
    ignored: ['!**/node_modules/your-package-name/**']
  },
  // 用于定义开发调试阶段生成资源的 origin
  origin: 'http://127.0.0.1:8080',
}

// 最后将server对象添加到上述userConfig的server的值的位置即可
```

<details> 
    <summary>附录知识: ServerOptions类型说明</summary>

`ServerOptions`类型说明：

```typescript
export declare interface ServerOptions extends CommonServerOptions {
  /**
   * Configure HMR-specific options (port, host, path & protocol)
   */
  hmr?: HmrOptions | boolean;
  /**
   * chokidar watch options
   * https://github.com/paulmillr/chokidar#api
   */
  watch?: WatchOptions;
  /**
   * Create Vite dev server to be used as a middleware in an existing server
   * @default false
   */
  middlewareMode?: boolean | 'html' | 'ssr';
  /**
   * Prepend this folder to http requests, for use when proxying vite as a subfolder
   * Should start and end with the `/` character
   */
  base?: string;
  /**
   * Options for files served via '/\@fs/'.
   */
  fs?: FileSystemServeOptions;
  /**
   * Origin for the generated asset URLs.
   *
   * @example `http://127.0.0.1:8080`
   */
  origin?: string;
  /**
   * Pre-transform known direct imports
   * @default true
   */
  preTransformRequests?: boolean;
  /**
   * Whether or not to ignore-list source files in the dev server sourcemap, used to populate
   * the [`x_google_ignoreList` source map extension](https://developer.chrome.com/blog/devtools-better-angular-debugging/#the-x_google_ignorelist-source-map-extension).
   *
   * By default, it excludes all paths containing `node_modules`. You can pass `false` to
   * disable this behavior, or, for full control, a function that takes the source path and
   * sourcemap path and returns whether to ignore the source path.
   */
  sourcemapIgnoreList?: false | ((sourcePath: string, sourcemapPath: string) => boolean);
  /**
   * Force dep pre-optimization regardless of whether deps have changed.
   *
   * @deprecated Use optimizeDeps.force instead, this option may be removed
   * in a future minor version without following semver
   */
  force?: boolean;
}

export declare interface CommonServerOptions {
  /**
   * Specify server port. Note if the port is already being used, Vite will
   * automatically try the next available port so this may not be the actual
   * port the server ends up listening on.
   */
  port?: number;
  /**
   * If enabled, vite will exit if specified port is already in use
   */
  strictPort?: boolean;
  /**
   * Specify which IP addresses the server should listen on.
   * Set to 0.0.0.0 to listen on all addresses, including LAN and public addresses.
   */
  host?: string | boolean;
  /**
   * Enable TLS + HTTP/2.
   * Note: this downgrades to TLS only when the proxy option is also used.
   */
  https?: boolean | ServerOptions_2;
  /**
   * Open browser window on startup
   */
  open?: boolean | string;
  /**
   * Configure custom proxy rules for the dev server. Expects an object
   * of `{ key: options }` pairs.
   * Uses [`http-proxy`](https://github.com/http-party/node-http-proxy).
   * Full options [here](https://github.com/http-party/node-http-proxy#options).
   *
   * Example `vite.config.js`:
   * ``` js
   * module.exports = {
   *   proxy: {
   *     // string shorthand
   *     '/foo': 'http://localhost:4567/foo',
   *     // with options
   *     '/api': {
   *       target: 'http://jsonplaceholder.typicode.com',
   *       changeOrigin: true,
   *       rewrite: path => path.replace(/^\/api/, '')
   *     }
   *   }
   * }
   * ```
   */
  proxy?: Record<string, string | ProxyOptions>;
  /**
   * Configure CORS for the dev server.
   * Uses https://github.com/expressjs/cors.
   * Set to `true` to allow all methods from any origin, or configure separately
   * using an object.
   */
  cors?: CorsOptions | boolean;
  /**
   * Specify server response headers.
   */
  headers?: OutgoingHttpHeaders;
}

export declare interface CorsOptions {
  origin?: CorsOrigin | ((origin: string, cb: (err: Error, origins: CorsOrigin) => void) => void);
  methods?: string | string[];
  allowedHeaders?: string | string[];
  exposedHeaders?: string | string[];
  credentials?: boolean;
  maxAge?: number;
  preflightContinue?: boolean;
  optionsSuccessStatus?: number;
}
```
</details>

<details> 
    <summary>附录知识: ProxyOptions类型说明</summary>

`ProxyOptions`类型说明：
```typescript
export declare interface ProxyOptions extends HttpProxy.ServerOptions {
  /**
   * rewrite path
   */
  rewrite?: (path: string) => string;
  /**
   * configure the proxy server (e.g. listen to events)
   */
  configure?: (proxy: HttpProxy.Server, options: ProxyOptions) => void;
  /**
   * webpack-dev-server style bypass function
   */
  bypass?: (req: http.IncomingMessage, res: http.ServerResponse, options: ProxyOptions) => void | null | undefined | false | string;
}

export declare namespace HttpProxy {
  export interface ServerOptions {
    /** URL string to be parsed with the url module. */
    target?: ProxyTarget
    /** URL string to be parsed with the url module. */
    forward?: ProxyTargetUrl
    /** Object to be passed to http(s).request. */
    agent?: any
    /** Object to be passed to https.createServer(). */
    ssl?: any
    /** If you want to proxy websockets. */
    ws?: boolean
    /** Adds x- forward headers. */
    xfwd?: boolean
    /** Verify SSL certificate. */
    secure?: boolean
    /** Explicitly specify if we are proxying to another proxy. */
    toProxy?: boolean
    /** Specify whether you want to prepend the target's path to the proxy path. */
    prependPath?: boolean
    /** Specify whether you want to ignore the proxy path of the incoming request. */
    ignorePath?: boolean
    /** Local interface string to bind for outgoing connections. */
    localAddress?: string
    /** Changes the origin of the host header to the target URL. */
    changeOrigin?: boolean
    /** specify whether you want to keep letter case of response header key */
    preserveHeaderKeyCase?: boolean
    /** Basic authentication i.e. 'user:password' to compute an Authorization header. */
    auth?: string
    /** Rewrites the location hostname on (301 / 302 / 307 / 308) redirects, Default: null. */
    hostRewrite?: string
    /** Rewrites the location host/ port on (301 / 302 / 307 / 308) redirects based on requested host/ port.Default: false. */
    autoRewrite?: boolean
    /** Rewrites the location protocol on (301 / 302 / 307 / 308) redirects to 'http' or 'https'.Default: null. */
    protocolRewrite?: string
    /** rewrites domain of set-cookie headers. */
    cookieDomainRewrite?: false | string | { [oldDomain: string]: string }
    /** rewrites path of set-cookie headers. Default: false */
    cookiePathRewrite?: false | string | { [oldPath: string]: string }
    /** object with extra headers to be added to target requests. */
    headers?: { [header: string]: string }
    /** Timeout (in milliseconds) when proxy receives no response from target. Default: 120000 (2 minutes) */
    proxyTimeout?: number
    /** Timeout (in milliseconds) for incoming requests */
    timeout?: number
    /** Specify whether you want to follow redirects. Default: false */
    followRedirects?: boolean
    /** If set to true, none of the webOutgoing passes are called and it's your responsibility to appropriately return the response by listening and acting on the proxyRes event */
    selfHandleResponse?: boolean
    /** Buffer */
    buffer?: stream.Stream
  }
}
```
</details>

### 打包构建选项build

常用配置如下：

```typescript
import type { BuildOptions } from "vite";

const build: BuildOptions = {
  // 设置最终构建的浏览器兼容目标，默认是modules，表示支持原生esm、原生esm动态导入和import.meta的浏览器，其他值有esnext、es2015
  // 当值是esnext时，若build.minify值为terser，则esnext会强制降级为es2021
  target: 'es2015',
  // 将css样式转为对应浏览器兼容的css代码
  cssTarget: 'chrome80',
  // 指定打包内容输出的路径，默认是dist
  outDir: 'dist',
  // 指定混淆器，默认是esbuild，其他值由：false（禁用混淆）、terser（这里需要安装对应的插件）
  minify: 'esbuild'
  // 是否展示gzip压缩大小报告，禁用会提高构建性能
  reportCompressedSize: true,
  // 是否生成sourcemap文件
  // `Source Map` 就是一个信息文件，里面存储了代码打包转换后的位置信息，实质是一个 `json` 描述文件，维护了打包前后的代码映射关系
  // 作用是便于debug，即使打包过后的代码，也可以找到具体的报错位置
  // 值有：
  //   false: 
  //   true: 创建一个独立的sourcemap文件
  //   inline: 作为一个data uri附加到输出文件中
  //   hidden：和true类似，但是bundle文件中对应的注释不保留
  sourcemap: true,
  // 规定触发警告的chunk的大小（kb）
  chunkSizeWarningLimit: 4096,
  // 自定义底层的rollup打包配置
  rollupOptions: {
    // 打包入口
    input: {
      index: pathResolve('index.html')
    },
    // 1. 静态资源分类打包-自动分割包名，对应的资源生成对应的文件
    output: {
      chunkFileNames: 'static/js/[name]-[hash].js',
      entryFileNames: 'static/js/[name]-[hash].js',
      assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
    },
    // 2. 手动指定包名打包
    output: {
      manualChunks: {
        'echarts': ['echarts'],
        'loadsh': ['lodash']
      }
    }
  }
}

// // 最后将build对象添加到上述userConfig的build的值的位置即可
```

<details> 
    <summary>附录知识: BuildOptions类型说明</summary>

`BuildOptions`类型说明：

```typescript
export declare interface BuildOptions {
  /**
   * Compatibility transform target. The transform is performed with esbuild
   * and the lowest supported target is es2015/es6. Note this only handles
   * syntax transformation and does not cover polyfills (except for dynamic
   * import)
   *
   * Default: 'modules' - Similar to `@babel/preset-env`'s targets.esmodules,
   * transpile targeting browsers that natively support dynamic es module imports.
   * https://caniuse.com/es6-module-dynamic-import
   *
   * Another special value is 'esnext' - which only performs minimal transpiling
   * (for minification compat) and assumes native dynamic imports support.
   *
   * For custom targets, see https://esbuild.github.io/api/#target and
   * https://esbuild.github.io/content-types/#javascript for more details.
   * @default 'modules'
   */
  target?: 'modules' | EsbuildTransformOptions['target'] | false;
  /**
   * whether to inject module preload polyfill.
   * Note: does not apply to library mode.
   * @default true
   * @deprecated use `modulePreload.polyfill` instead
   */
  polyfillModulePreload?: boolean;
  /**
   * Configure module preload
   * Note: does not apply to library mode.
   * @default true
   */
  modulePreload?: boolean | ModulePreloadOptions;
  /**
   * Directory relative from `root` where build output will be placed. If the
   * directory exists, it will be removed before the build.
   * @default 'dist'
   */
  outDir?: string;
  /**
   * Directory relative from `outDir` where the built js/css/image assets will
   * be placed.
   * @default 'assets'
   */
  assetsDir?: string;
  /**
   * Static asset files smaller than this number (in bytes) will be inlined as
   * base64 strings. Default limit is `4096` (4kb). Set to `0` to disable.
   * @default 4096
   */
  assetsInlineLimit?: number;
  /**
   * Whether to code-split CSS. When enabled, CSS in async chunks will be
   * inlined as strings in the chunk and inserted via dynamically created
   * style tags when the chunk is loaded.
   * @default true
   */
  cssCodeSplit?: boolean;
  /**
   * An optional separate target for CSS minification.
   * As esbuild only supports configuring targets to mainstream
   * browsers, users may need this option when they are targeting
   * a niche browser that comes with most modern JavaScript features
   * but has poor CSS support, e.g. Android WeChat WebView, which
   * doesn't support the #RGBA syntax.
   * @default target
   */
  cssTarget?: EsbuildTransformOptions['target'] | false;
  /**
   * Override CSS minification specifically instead of defaulting to `build.minify`,
   * so you can configure minification for JS and CSS separately.
   * @default minify
   */
  cssMinify?: boolean;
  /**
   * If `true`, a separate sourcemap file will be created. If 'inline', the
   * sourcemap will be appended to the resulting output file as data URI.
   * 'hidden' works like `true` except that the corresponding sourcemap
   * comments in the bundled files are suppressed.
   * @default false
   */
  sourcemap?: boolean | 'inline' | 'hidden';
  /**
   * Set to `false` to disable minification, or specify the minifier to use.
   * Available options are 'terser' or 'esbuild'.
   * @default 'esbuild'
   */
  minify?: boolean | 'terser' | 'esbuild';
  /**
   * Options for terser
   * https://terser.org/docs/api-reference#minify-options
   */
  terserOptions?: Terser.MinifyOptions;
  /**
   * Will be merged with internal rollup options.
   * https://rollupjs.org/configuration-options/
   */
  rollupOptions?: RollupOptions;
  /**
   * Options to pass on to `@rollup/plugin-commonjs`
   */
  commonjsOptions?: RollupCommonJSOptions;
  /**
   * Options to pass on to `@rollup/plugin-dynamic-import-vars`
   */
  dynamicImportVarsOptions?: RollupDynamicImportVarsOptions;
  /**
   * Whether to write bundle to disk
   * @default true
   */
  write?: boolean;
  /**
   * Empty outDir on write.
   * @default true when outDir is a sub directory of project root
   */
  emptyOutDir?: boolean | null;
  /**
   * Copy the public directory to outDir on write.
   * @default true
   * @experimental
   */
  copyPublicDir?: boolean;
  /**
   * Whether to emit a manifest.json under assets dir to map hash-less filenames
   * to their hashed versions. Useful when you want to generate your own HTML
   * instead of using the one generated by Vite.
   *
   * Example:
   *
   * ```json
   * {
   *   "main.js": {
   *     "file": "main.68fe3fad.js",
   *     "css": "main.e6b63442.css",
   *     "imports": [...],
   *     "dynamicImports": [...]
   *   }
   * }
   * ```
   * @default false
   */
  manifest?: boolean | string;
  /**
   * Build in library mode. The value should be the global name of the lib in
   * UMD mode. This will produce esm + cjs + umd bundle formats with default
   * configurations that are suitable for distributing libraries.
   * @default false
   */
  lib?: LibraryOptions | false;
  /**
   * Produce SSR oriented build. Note this requires specifying SSR entry via
   * `rollupOptions.input`.
   * @default false
   */
  ssr?: boolean | string;
  /**
   * Generate SSR manifest for determining style links and asset preload
   * directives in production.
   * @default false
   */
  ssrManifest?: boolean | string;
  /**
   * Emit assets during SSR.
   * @experimental
   * @default false
   */
  ssrEmitAssets?: boolean;
  /**
   * Set to false to disable reporting compressed chunk sizes.
   * Can slightly improve build speed.
   * @default true
   */
  reportCompressedSize?: boolean;
  /**
   * Adjust chunk size warning limit (in kbs).
   * @default 500
   */
  chunkSizeWarningLimit?: number;
  /**
   * Rollup watch options
   * https://rollupjs.org/configuration-options/#watch
   * @default null
   */
  watch?: WatcherOptions | null;
}
```

</details>

<details> 
    <summary>附录知识: RollupOptions类型说明</summary>

`RollupOptions`类型说明：
```typescript
export interface RollupOptions extends InputOptions {
	// This is included for compatibility with config files but ignored by rollup.rollup
	output?: OutputOptions | OutputOptions[];
}

export interface OutputOptions {
	amd?: AmdOptions;
	assetFileNames?: string | ((chunkInfo: PreRenderedAsset) => string);
	banner?: string | AddonFunction;
	chunkFileNames?: string | ((chunkInfo: PreRenderedChunk) => string);
	compact?: boolean;
	// only required for bundle.write
	dir?: string;
	/** @deprecated Use the "renderDynamicImport" plugin hook instead. */
	dynamicImportFunction?: string;
	dynamicImportInCjs?: boolean;
	entryFileNames?: string | ((chunkInfo: PreRenderedChunk) => string);
	esModule?: boolean | 'if-default-prop';
	/** @deprecated This option is no longer needed and ignored. */
	experimentalDeepDynamicChunkOptimization?: boolean;
	experimentalMinChunkSize?: number;
	exports?: 'default' | 'named' | 'none' | 'auto';
	extend?: boolean;
	externalImportAssertions?: boolean;
	externalLiveBindings?: boolean;
	// only required for bundle.write
	file?: string;
	footer?: string | AddonFunction;
	format?: ModuleFormat;
	freeze?: boolean;
	generatedCode?: GeneratedCodePreset | GeneratedCodeOptions;
	globals?: GlobalsOption;
	hoistTransitiveImports?: boolean;
	indent?: string | boolean;
	inlineDynamicImports?: boolean;
	interop?: InteropType | GetInterop;
	intro?: string | AddonFunction;
	manualChunks?: ManualChunksOption;
	minifyInternalExports?: boolean;
	name?: string;
	/** @deprecated Use "generatedCode.symbols" instead. */
	namespaceToStringTag?: boolean;
	noConflict?: boolean;
	outro?: string | AddonFunction;
	paths?: OptionsPaths;
	plugins?: OutputPluginOption;
	/** @deprecated Use "generatedCode.constBindings" instead. */
	preferConst?: boolean;
	preserveModules?: boolean;
	preserveModulesRoot?: string;
	sanitizeFileName?: boolean | ((fileName: string) => string);
	sourcemap?: boolean | 'inline' | 'hidden';
	sourcemapBaseUrl?: string;
	sourcemapExcludeSources?: boolean;
	sourcemapFile?: string;
	sourcemapIgnoreList?: SourcemapIgnoreListOption;
	sourcemapPathTransform?: SourcemapPathTransformOption;
	strict?: boolean;
	systemNullSetters?: boolean;
	validate?: boolean;
}
```
</details>

### esbuild

由于esbuild的生态还不够完备，**esbuild**主要用于开发环境（npm run dev）中（比如依赖预构建、文件编译等），而生产环境（npm run build）使用的是rollup（在build.rollupOptions字段中配置）进行代码构建的。

对于非JSX项目来说，在使用vue3+vite的项目中，esbuild目前可用于在**构建生产代码之前删除**项目中的debugger和console，对于console来说，可全部清除，也可以特定删除console的部分api（比如console.log、console.error、console.info等），用法如下所示：

```typescript
const esbuildOptions: ESBuildOptions = {
  // 全部删除代码中的console 和debugger语句
  drop: ['console', 'debugger']
}

const esbuildOptions2: ESBuildOptions = {
  // 仅删除debugger语句和console.log、console.info，其他console不进行删除
  drop: ['debugger'],
  pure: ['console.log', 'console.info']
}

// 最后将esbuildOptions对象添加到上述userConfig的esbuild的值的位置即可
```

同时，你想使用其他代码压缩功能，vite还集成了js压缩工具库[terser](https://terser.org/docs/api-reference#minify-options)，使用`build.terserOptions`字段进行配置，配置选项如下所示：

```typescript
// vite.config.ts
import type { Terser, ConfigEnv, UserConfig } from 'vite'

const terserOptions: Terser.MinifyOptions = {
  compress: {
    // 防止将infinite被压缩成 1/0 ,1/0将导致chrome性能问题
    keep_infinity: true,
    // 删除所有的console语句和debugger语句
    // 若想删除特定console语句，则不能使用drop_console,应该使用pure_funcs
    drop_console: true,
    drop_debugger: true,
    // 删除特定的console
    pure_funcs: ['console.log', 'console.info']
  }
}

export default ({command, mode}: ConfigEnv): UserConfig => {
  return {
    build: {
      terserOptions: terserOptions
    }
  }
} 
```

**依赖预构建**：在vue项目启动之前，因为vite的开发服务器会将所有代码都视为原生ESM模块，因此vite必须先将用CommonJS、UMD模块发布的依赖项（devDependencies、dependencies）转为ESM模块；同时vite会将含有大量的模块依赖关系（通过import进行导入）的模块（比如lodash-es库，内置了大量的常用函数模块）转成单个模块，以此来减少http请求数量，提升页面加载性能。这个过程仅在开发环境下执行。

<details> 
  <summary>
    附录知识: ESBuildOptions类型说明
  </summary>

`ESBuildOptions`类型说明：

```typescript
export declare interface ESBuildOptions extends EsbuildTransformOptions {
  include?: string | RegExp | string[] | RegExp[];
  exclude?: string | RegExp | string[] | RegExp[];
  jsxInject?: string;
  /**
   * This option is not respected. Use `build.minify` instead.
   */
  minify?: never;
}

export interface TransformOptions extends CommonOptions {
  tsconfigRaw?: string | {
    compilerOptions?: {
      alwaysStrict?: boolean,
      importsNotUsedAsValues?: 'remove' | 'preserve' | 'error',
      jsx?: 'react' | 'react-jsx' | 'react-jsxdev' | 'preserve',
      jsxFactory?: string,
      jsxFragmentFactory?: string,
      jsxImportSource?: string,
      preserveValueImports?: boolean,
      target?: string,
      useDefineForClassFields?: boolean,
    },
  };

  sourcefile?: string;
  loader?: Loader;
  banner?: string;
  footer?: string;
}

interface CommonOptions {
  /** Documentation: https://esbuild.github.io/api/#sourcemap */
  sourcemap?: boolean | 'linked' | 'inline' | 'external' | 'both';
  /** Documentation: https://esbuild.github.io/api/#legal-comments */
  legalComments?: 'none' | 'inline' | 'eof' | 'linked' | 'external';
  /** Documentation: https://esbuild.github.io/api/#source-root */
  sourceRoot?: string;
  /** Documentation: https://esbuild.github.io/api/#sources-content */
  sourcesContent?: boolean;

  /** Documentation: https://esbuild.github.io/api/#format */
  format?: Format;
  /** Documentation: https://esbuild.github.io/api/#global-name */
  globalName?: string;
  /** Documentation: https://esbuild.github.io/api/#target */
  target?: string | string[];
  /** Documentation: https://esbuild.github.io/api/#supported */
  supported?: Record<string, boolean>;
  /** Documentation: https://esbuild.github.io/api/#platform */
  platform?: Platform;

  /** Documentation: https://esbuild.github.io/api/#mangle-props */
  mangleProps?: RegExp;
  /** Documentation: https://esbuild.github.io/api/#mangle-props */
  reserveProps?: RegExp;
  /** Documentation: https://esbuild.github.io/api/#mangle-props */
  mangleQuoted?: boolean;
  /** Documentation: https://esbuild.github.io/api/#mangle-props */
  mangleCache?: Record<string, string | false>;
  /** Documentation: https://esbuild.github.io/api/#drop */
  drop?: Drop[];
  /** Documentation: https://esbuild.github.io/api/#minify */
  minify?: boolean;
  /** Documentation: https://esbuild.github.io/api/#minify */
  minifyWhitespace?: boolean;
  /** Documentation: https://esbuild.github.io/api/#minify */
  minifyIdentifiers?: boolean;
  /** Documentation: https://esbuild.github.io/api/#minify */
  minifySyntax?: boolean;
  /** Documentation: https://esbuild.github.io/api/#charset */
  charset?: Charset;
  /** Documentation: https://esbuild.github.io/api/#tree-shaking */
  treeShaking?: boolean;
  /** Documentation: https://esbuild.github.io/api/#ignore-annotations */
  ignoreAnnotations?: boolean;

  /** Documentation: https://esbuild.github.io/api/#jsx */
  jsx?: 'transform' | 'preserve' | 'automatic';
  /** Documentation: https://esbuild.github.io/api/#jsx-factory */
  jsxFactory?: string;
  /** Documentation: https://esbuild.github.io/api/#jsx-fragment */
  jsxFragment?: string;
  /** Documentation: https://esbuild.github.io/api/#jsx-import-source */
  jsxImportSource?: string;
  /** Documentation: https://esbuild.github.io/api/#jsx-development */
  jsxDev?: boolean;
  /** Documentation: https://esbuild.github.io/api/#jsx-side-effects */
  jsxSideEffects?: boolean;

  /** Documentation: https://esbuild.github.io/api/#define */
  define?: { [key: string]: string };
  /** Documentation: https://esbuild.github.io/api/#pure */
  pure?: string[];
  /** Documentation: https://esbuild.github.io/api/#keep-names */
  keepNames?: boolean;

  /** Documentation: https://esbuild.github.io/api/#color */
  color?: boolean;
  /** Documentation: https://esbuild.github.io/api/#log-level */
  logLevel?: LogLevel;
  /** Documentation: https://esbuild.github.io/api/#log-limit */
  logLimit?: number;
  /** Documentation: https://esbuild.github.io/api/#log-override */
  logOverride?: Record<string, LogLevel>;
}
```

</details>

<details> 
  <summary>
    附录知识: Terser.MinifyOptions类型说明
  </summary>

`Terser.MinifyOptions`类型说明：

```typescript
export interface MinifyOptions {
  compress?: boolean | CompressOptions
  ecma?: ECMA
  ie8?: boolean
  keep_classnames?: boolean | RegExp
  keep_fnames?: boolean | RegExp
  mangle?: boolean | MangleOptions
  module?: boolean
  nameCache?: object
  format?: FormatOptions
  /** @deprecated use format instead */
  output?: FormatOptions
  parse?: ParseOptions
  safari10?: boolean
  sourceMap?: boolean | SourceMapOptions
  toplevel?: boolean
}

export interface CompressOptions {
  arguments?: boolean
  arrows?: boolean
  booleans_as_integers?: boolean
  booleans?: boolean
  collapse_vars?: boolean
  comparisons?: boolean
  computed_props?: boolean
  conditionals?: boolean
  dead_code?: boolean
  defaults?: boolean
  directives?: boolean
  drop_console?: boolean
  drop_debugger?: boolean
  ecma?: ECMA
  evaluate?: boolean
  expression?: boolean
  global_defs?: object
  hoist_funs?: boolean
  hoist_props?: boolean
  hoist_vars?: boolean
  ie8?: boolean
  if_return?: boolean
  inline?: boolean | InlineFunctions
  join_vars?: boolean
  keep_classnames?: boolean | RegExp
  keep_fargs?: boolean
  keep_fnames?: boolean | RegExp
  keep_infinity?: boolean
  loops?: boolean
  module?: boolean
  negate_iife?: boolean
  passes?: number
  properties?: boolean
  pure_funcs?: string[]
  pure_getters?: boolean | 'strict'
  reduce_funcs?: boolean
  reduce_vars?: boolean
  sequences?: boolean | number
  side_effects?: boolean
  switches?: boolean
  toplevel?: boolean
  top_retain?: null | string | string[] | RegExp
  typeofs?: boolean
  unsafe_arrows?: boolean
  unsafe?: boolean
  unsafe_comps?: boolean
  unsafe_Function?: boolean
  unsafe_math?: boolean
  unsafe_symbols?: boolean
  unsafe_methods?: boolean
  unsafe_proto?: boolean
  unsafe_regexp?: boolean
  unsafe_undefined?: boolean
  unused?: boolean
}
```

</details>

### 预构建配置optimizeDeps

**optimizeDeps**字段：用于配置依赖优化（依赖预构建）的选项。

vite预构建的项目依赖检测：默认情况下vite会抓取项目中的`index.html`文件检测需要预构建的项目依赖；若`vite.config.ts`中指定了`build.rollupOptions.input`字段，则从这里检测；若你想指定自定义的预构建依赖检测入口，可以通过`optimizeDeps.entries`字段进行配置。

使用`optimizeDeps.exclude`字段强制排除_一些依赖_进行预构建，注意，所有以 `@iconify-icons/` 开头引入的的本地图标模块，都应该加入到下面的 `exclude` 里，因为平台推荐的使用方式是哪里需要哪里引入而且都是单个的引入，不需要预构建，直接让浏览器加载就好

使用`optimizeDeps.include`字段可以强制_一些依赖_必须进行预构建，`vite` 启动时会将include 里的模块，编译成 esm 格式并缓存到 node_modules/.vite 文件夹，页面加载到对应模块时如果浏览器有缓存就读取浏览器缓存，如果没有会读取本地缓存并按需加载。尤其当您禁用浏览器缓存时（这种情况只应该发生在调试阶段）必须将对应模块加入到 include里，否则会遇到开发环境切换页面卡顿的问题（vite 会认为它是一个新的依赖包会重新加载并强制刷新页面），因为它既无法使用浏览器缓存，又没有在本地 node_modules/.vite 里缓存。注意，如果您使用的第三方库是全局引入，也就是引入到 src/main.ts 文件里，就不需要再添加到 include 里了，因为 vite 会自动将它们缓存到 node_modules/.vite

注意，默认情况下`node_modules`, `build.outDir`文件夹会被忽略掉，所以可通过include字段对node_modules下的依赖进行强制预构建。


下面是依赖预构建的相关配置：

```typescript
// optimize.ts
const include = [
  "qs",
  "mitt",
  "xlsx",
  "dayjs",
  "axios",
  "pinia",
  "echarts",
  // commonJs的依赖应该进行预构建优化，即使他们是嵌套在其他ESM中
  // 比如在esm-dep（esm依赖）用到了一个cjs-dep（commonjs依赖）
  "esm-dep > cjs-dep"
]

const exclude = [
  "@iconify-icons/ep",
  "@iconify-icons/ri",
  "@pureadmin/theme/dist/browser-utils"
]

// vite.config.ts
import { include, exclude } from './optimize.ts'
import type { Terser, ConfigEnv, UserConfig } from 'vite'

export default ({command, mode}: ConfigEnv): UserConfig => {
  return {
    optimizeDeps: {
      include: include,
      exclude: exclude,
      // 强制进行依赖预构建，即使依赖已经缓存过、优化过
      // 或者删除node_modules/.vite文件夹
      force: true
    }
  }
} 
```

<details> 
  <summary>
    附录知识: DepOptimizationOptions类型说明
  </summary>

**DepOptimizationOptions**类型说明：

```typescript
export declare interface DepOptimizationOptions {
  /**
   * By default, Vite will crawl your `index.html` to detect dependencies that
   * need to be pre-bundled. If `build.rollupOptions.input` is specified, Vite
   * will crawl those entry points instead.
   *
   * If neither of these fit your needs, you can specify custom entries using
   * this option - the value should be a fast-glob pattern or array of patterns
   * (https://github.com/mrmlnc/fast-glob#basic-syntax) that are relative from
   * vite project root. This will overwrite default entries inference.
   */
  entries?: string | string[];
  /**
   * Force optimize listed dependencies (must be resolvable import paths,
   * cannot be globs).
   */
  include?: string[];
  /**
   * Do not optimize these dependencies (must be resolvable import paths,
   * cannot be globs).
   */
  exclude?: string[];
  /**
   * Options to pass to esbuild during the dep scanning and optimization
   *
   * Certain options are omitted since changing them would not be compatible
   * with Vite's dep optimization.
   *
   * - `external` is also omitted, use Vite's `optimizeDeps.exclude` option
   * - `plugins` are merged with Vite's dep plugin
   * - `keepNames` takes precedence over the deprecated `optimizeDeps.keepNames`
   *
   * https://esbuild.github.io/api
   */
  esbuildOptions?: Omit<BuildOptions_2, 'bundle' | 'entryPoints' | 'external' | 'write' | 'watch' | 'outdir' | 'outfile' | 'outbase' | 'outExtension' | 'metafile'>;
  /**
   * @deprecated use `esbuildOptions.keepNames`
   */
  keepNames?: boolean;
  /**
   * List of file extensions that can be optimized. A corresponding esbuild
   * plugin must exist to handle the specific extension.
   *
   * By default, Vite can optimize `.mjs`, `.js`, and `.ts` files. This option
   * allows specifying additional extensions.
   *
   * @experimental
   */
  extensions?: string[];
  /**
   * Disables dependencies optimizations
   * @default false
   * @experimental
   */
  disabled?: boolean;
}
```

</details>

### 全局变量配置define

**define**字段用于定义可在代码中使用的全局常量。该字段不会经过任何的语法分析，而是直接替换文本，故而应只对常量使用define。

如果定义了一个字符串常量，需要被显式的打上引号（比如通过`JSON.stringify`）。

若使用了typescript进行开发，应该给定义的全局常量在`.d.ts`文件下添加相应的类型声明，确保其能够获得类型检查和代码提示。

用法如下所示：

```typescript
// vite.config.ts
import dayjs from 'dayjs'
import type { ConfigEnv, UserConfig } from 'vite'
import package from './package.json'

const { name, version, dependencies, devDependencies } = package
const __APP_INFO__ = {
  pkg: { name, version, dependencies, devDependencies },
  lastBuildTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
}
export default ({command, mode}: ConfigEnv): UserConfig => {
  return {
    define: {
      // 常量不需要使用
      __INTLIFY_PROD_DEVTOOLS__: false,
      // 对象形式需要使用json格式化
      __APP_INFO__: JSON.stringify(__APP_INFO__),
      
      // 下面的形式是不推荐的：
      // 使用对象简写
      __APP_INFO__
    }
  }
}

// 类型声明文件需要位于tsconfig.json文件的compilerOptions.typeRoots字段下声明的目录下进行定义才能被ts解析到，比如：
// compilerOptions.typeRoots = ['./types']
// 定义类型声明：./types/env.d.ts
declare global {
  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
  };
  const __INTLIFY_PROD_DEVTOOLS__: boolean;
}

// 定义好之后，可在代码中直接使用该变量，比如在main.ts中输出
console.log('app info: ', __APP_INFO__)
```

**常量和变量**：常量是具有预定义值的命名数据项，而变量是在程序执行过程中其值可以更改的命名数据项。

### css及其预处理器配置

**css.preprocessorOptions**字段：指定传递给css预处理器的选项，预处理器文件的扩展名作为选项的键名（比如`scss`, `less`, `styl`），键值为各自预处理器支持的选项。

在配置该字段时，需要安装相应的预处理器依赖，比如`npm install -D [sass | less | stylus]`，但不需要想webpack那样安装对于的loader，因为vite提供了对这三者的内置支持。

**css.preprocessorOptions**字段可以结合**css.modules**字段一起使用，只需要将对应的`.scss`后缀改为`.module.scss`即可

所有预处理器的选项除了支持各自的选项（[sass选项](https://sass-lang.com/documentation/js-api/interfaces/LegacyStringOptions), [less选项](https://lesscss.org/usage/#less-options), [stylus选项](https://stylus-lang.com/docs/js.html#define-name-node)）外，还支持`additionalData选项，用于注入额外的代码（比如全局样式）。

用法如下：
```typescript
// generateModifyVars.ts
import { generateAntColors, primaryColor } from '../config/themeConfig';
import { getThemeVariables } from 'ant-design-vue/dist/theme';
import { resolve } from 'path';

export function generateModifyVars(dark = false) {
  const palettes = generateAntColors(primaryColor);
  const primary = palettes[5];

  const primaryColorObj: Record<string, string> = {};

  for (let index = 0; index < 10; index++) {
    primaryColorObj[`primary-${index + 1}`] = palettes[index];
  }

  const modifyVars = getThemeVariables({ dark });
  // 定义less的全局变量
  return {
    ...modifyVars,
    // Used for global import to avoid the need to import each style file separately
    // reference:  Avoid repeated references
    // 全局导入一个文件config.less里面所有的样式，不需要像下面的单个写
    // 这里使用到了JavaScript nodejs的resolve函数
    hack: `${modifyVars.hack} @import (reference) "${resolve('src/design/config.less')}";`,
    'primary-color': primary,
    ...primaryColorObj,
    'info-color': primary,
    'processing-color': primary,
    'success-color': '#55D187', //  Success color
    'error-color': '#ED6F6F', //  False color
    'warning-color': '#EFBD47', //   Warning color
    'warning-color12': 'red', //   Warning color
    //'border-color-base': '#EEEEEE',
    'font-size-base': '14px', //  Main font size
    'border-radius-base': '2px', //  Component/float fillet
    'link-color': primary, //   Link color
    'app-content-background': '#fafafa', //   Link color
  };
}

// vite.config.ts
import type { ConfigEnv, UserConfig } from 'vite'
import { generateModifyVars } from './generateModifyVars.ts'

export default ({command, mode}: ConfigEnv): UserConfig => {
  return {
    css: {
      preprocessorOptions: {
        scss: {
          // 允许在css文件中使用JavaScript语法
          javascriptEnabled: true,
          // 比如引入一个全局样式文件，另外添加一个全局变量
          adtionalData: `@import "./golbal.scss"; $primary-color: #eee;`
        },
        less: {
          javascriptEnabled: true,
          // 另一种添加全局变量的方式
          modifyVars: generateModifyVars()
        }
      }
    }
  }
}

// 使用，在一个功能模块中，比如./src/App.vue
<style lang="scss">
.app {
  &_main {
    color: $primary-color;
  }
}
</style>
```

**注意：**
- 只能在scss文件里面使用additionalData里面导入的内容，即在`main.ts`导入的scss文件内，或者是`*.vue`文件下的`<style lang="scss"></style>`内使用additionalData里面的变量。
- 同时建议additionalData里面导入的内容最好只写scss变量，不要写css变量（运行时属性），[参考](https://juejin.cn/post/7065929016569495565)

**_提示：_** 如果官方文档中未对具体的选项做说明，假设`css.preprocessorOptions`下每个预处理器具体的选项配置没有给出上述所说的文档或出处，同时鼠标悬浮在css这个选项时，点进去看类型也没有具体的类型设置。这时可以查看不同的预处理器的配置选项对应的插件，比如less，可以查看[1](https://lesscss.org/usage/#using-less-in-the-browser-modify-variables)，以及在`./node_modules/less/`下搜索less源码对应的选项（比如javascriptEnabled），即可知道其他配置项还有什么

**css.modules**字段：该字段用于配置导入css模块时的一些行为，比如具名导入（`import primaryColor from './variables.module.css`）。

**css.postcss**字段：用于设置postcss配置源的路径。

<details> 
  <summary>
    附录知识: CSSOptions类型说明
  </summary>

`CSSOptions`类型说明：

```typescript
export declare interface CSSOptions {
  /**
   * https://github.com/css-modules/postcss-modules
   */
  modules?: CSSModulesOptions | false;
  preprocessorOptions?: Record<string, any>;
  postcss?: string | (PostCSS.ProcessOptions & {
      plugins?: PostCSS.AcceptedPlugin[];
  });
  /**
   * Enables css sourcemaps during dev
   * @default false
   * @experimental
   */
  devSourcemap?: boolean;
}

export declare interface CSSModulesOptions {
  getJSON?: (cssFileName: string, json: Record<string, string>, outputFileName: string) => void;
  scopeBehaviour?: 'global' | 'local';
  globalModulePaths?: RegExp[];
  generateScopedName?: string | ((name: string, filename: string, css: string) => string);
  hashPrefix?: string;
  /**
   * default: undefined
   */
  localsConvention?: 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly' | ((originalClassName: string, generatedClassName: string, inputFile: string) => string);
}

export interface ProcessOptions {
  /**
   * The path of the CSS source file. You should always set `from`,
   * because it is used in source map generation and syntax error messages.
   */
  from?: string

  /**
   * The path where you'll put the output CSS file. You should always set `to`
   * to generate correct source maps.
   */
  to?: string

  /**
   * Function to generate AST by string.
   */
  parser?: Syntax | Parser

  /**
   * Class to generate string by AST.
   */
  stringifier?: Syntax | Stringifier

  /**
   * Object with parse and stringify.
   */
  syntax?: Syntax

  /**
   * Source map options
   */
  map?: SourceMapOptions | boolean
}

```
</details>

<details> 
  <summary>
    附录知识: less默认配置选项说明
  </summary>

`less默认配置选项`说明：

```typescript
function default_1() {
  return {
    /* Inline Javascript - @plugin still allowed */
    javascriptEnabled: false,
    /* Outputs a makefile import dependency list to stdout. */
    depends: false,
    /* (DEPRECATED) Compress using less built-in compression.
      * This does an okay job but does not utilise all the tricks of
      * dedicated css compression. */
    compress: false,
    /* Runs the less parser and just reports errors without any output. */
    lint: false,
    /* Sets available include paths.
      * If the file in an @import rule does not exist at that exact location,
      * less will look for it at the location(s) passed to this option.
      * You might use this for instance to specify a path to a library which
      * you want to be referenced simply and relatively in the less files. */
    paths: [],
    /* color output in the terminal */
    color: true,
    /* The strictImports controls whether the compiler will allow an @import inside of either
      * @media blocks or (a later addition) other selector blocks.
      * See: https://github.com/less/less.js/issues/656 */
    strictImports: false,
    /* Allow Imports from Insecure HTTPS Hosts */
    insecure: false,
    /* Allows you to add a path to every generated import and url in your css.
      * This does not affect less import statements that are processed, just ones
      * that are left in the output css. */
    rootpath: '',
    /* By default URLs are kept as-is, so if you import a file in a sub-directory
      * that references an image, exactly the same URL will be output in the css.
      * This option allows you to re-write URL's in imported files so that the
      * URL is always relative to the base imported file */
    rewriteUrls: false,
    /* How to process math
      *   0 always           - eagerly try to solve all operations
      *   1 parens-division  - require parens for division "/"
      *   2 parens | strict  - require parens for all operations
      *   3 strict-legacy    - legacy strict behavior (super-strict)
      */
    math: 1,
    /* Without this option, less attempts to guess at the output unit when it does maths. */
    strictUnits: false,
    /* Effectively the declaration is put at the top of your base Less file,
      * meaning it can be used but it also can be overridden if this variable
      * is defined in the file. */
    globalVars: null,
    /* As opposed to the global variable option, this puts the declaration at the
      * end of your base file, meaning it will override anything defined in your Less file. */
    modifyVars: null,
    /* This option allows you to specify a argument to go on to every URL.  */
    urlArgs: ''
  };
}
```
</details>

### 其他配置项

```typescript
// vite.config.ts
import type { ConfigEnv, UserConfig } from 'vite'

export default ({command, mode}: ConfigEnv): UserConfig => {
  return {
    // 用于加载.env文件的目录，可以是绝对路径，也可以是相对与项目根目录的路径，默认是root
    envDir: './envDirs',
    // 该字段开头的环境变量可以在代码其他位置通过import.meta.env.xxx读取到，默认是 VITE_
    envPrefix: 'SYing_',
    // 该字段配置的内容自动会作为静态资源进行处理，返回解析后的路径
    assetsInclude: ['**/*.gltf'],
    json: {
      // 支持按名导入json文件的字段，比如`import { name } from 'package.json'
      namedExports: true,
      // 不支持按名导入，而是会将josn导入为默认导入，即`import pkg from 'package.json'，开启此项，按名导入会被禁用
      stringift: false,
    },
    resolve: {
      // 设置导入时想要省略的扩展名，不建议自行设置，默认值如下：
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
    },
    // 值为false时可以避免vite清屏而错过终端中（terminal）打印的某些信息，因为默认情况下每次vite重构建时，会删除之前的信息
    clearScreen: false,
  }
}
```

## 结尾

下篇预告，Vitejs开源项目实践指南（三），内容包括：
> - 插件配置plugins

## 一些对你有用的文章索引

- [一份关于vite.config.ts项目常用项配置](https://segmentfault.com/a/1190000041200999)
- [Vite 源码（一）ESbuild 使用](https://juejin.cn/post/7043777969051058183)
- [Vite 项目配置环境变量和全局变量](https://juejin.cn/post/7153129286415679518#heading-6)
- [vite配置全局变量和less全局变量](https://juejin.cn/s/vite%20%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F)
- [关于Vite配置preprocessorOptions.scss.additionalData全局引入scss文件无效问题](https://juejin.cn/post/7065929016569495565)


## 参考文档

- [vite 官网-配置](https://cn.vitejs.dev/config/)
- [esbuild 官网- 配置](https://esbuild.github.io/api/#drop)
- [terser 官网- 配置](https://terser.org/docs/api-reference#minify-options)
- [github: vue-pure-admin](https://github.com/pure-admin/vue-pure-admin)   
- [github: vue-vben-admin](https://github.com/vbenjs/vue-vben-admin)  
- [常量和变量](https://www.ibm.com/docs/zh/cloud-pak-system-w3500/2.3.3?topic=language-constants-variables)
- [响应标头（Response header）](https://developer.mozilla.org/zh-CN/docs/Glossary/Response_header)
