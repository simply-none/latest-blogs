# Vitejs开源项目实践指南

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
      target: target,
      changeOrigin: true,
      ws: true,
      // 当请求后端接口地址时，转成另一个不报错的接口地址
      // 比如请求http://localhost:3000下的接口时，会自动转成 本机ip:端口/basic-api
      rewrite: (pathhttp://localhost:3000下的接口时，会自动转成) => path.replace(new RegExp(`^${prefix}`), ''),
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
  // 启动项目是否自动在浏览器打开
  open: true,
  hmr: {
    // 关闭浏览器出现的错误弹窗
    overlay: false
  },
  // 开发代理设置：主要是开发模式下请求后端接口时，防止出现跨域的错误
  // 将后端接口地址转成另一个真实的后端 API 地址，这样前后端就视为使用了相同的域名、协议和端口，就避免了跨域的问题
  proxy: createProxy(viteProxy)
}

// 最后将server对象添加到上述userConfig的server的值的位置即可
```

<details> 
    <summary>附录知识</summary>

`ProxyOptions`类型源码：
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
const build: any = {
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
    <summary>附录知识</summary>




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

附录知识：

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

## 结尾

下篇预告，Vitejs开源项目实践指南（二），内容包括：
> - esbuild
> - 预构建配置optimizeDeps
> - 全局变量配置define
> - css及其预处理器配置

下下篇预告，Vitejs开源项目实践指南（三），内容包括：
> - 插件配置plugins

## 参考文档

> [vite官网-配置](https://cn.vitejs.dev/config/)  
> [github: vue-pure-admin](https://github.com/pure-admin/vue-pure-admin)   
> [github: vue-vben-admin](https://github.com/vbenjs/vue-vben-admin)  
> [一份关于vite.config.ts项目常用项配置](https://segmentfault.com/a/1190000041200999)
