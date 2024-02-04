# nextjs doc

> 该文档仅记录了当时阅览时的有用的内容，故而会忽略一些在将来看来重要的内容
> 第一次阅览：2024-02-01

通常情况下，如果需要使用服务端渲染或者全栈开发，则使用nextjs；仅使用客户端渲染推荐vite、umijs、create-react-app等

## 安装

```bash
Need to install the following packages:
create-next-app@14.1.0
Ok to proceed? (y) y
√ Would you like to use TypeScript? ... No / Yes
√ Would you like to use ESLint? ... No / Yes
√ Would you like to use Tailwind CSS? ... No / Yes
# 内容是否放在src目录下，而非根目录
√ Would you like to use `src/` directory? ... No / Yes
# 是选择app router还是pages router
√ Would you like to use App Router? (recommended) ... No / Yes
# 是否支持默认导入，即@/代表根目录
√ Would you like to customize the default import alias (@/*)? ...
No / Yes
√ What import alias would you like configured? ... @/*
```

## 配置

### 项目结构

- 对于pages router模式，结构为`/src/pages`, `/src/app`
- 对于app router模式，结构为`/pages`, `/app`

### 元数据文件

#### 网站图标

文件生成：

- 对于`favicon.ico`，仅能位于`app/`下
- 对于`icon.ico/jpg/jpeg/png/svg`，位于`app/**/*`下
- 对于`app-icon.jpg/jpeg/png`，位于`app/**/*`下

代码生成：创建默认的导出函数

- `icon.js/ts/tsx`
- `apple-icon.js/ts/tsx`

```js
import { ImageResponse } from 'next/og'

// 导出图标属性
export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

// 生成图标
export default function Icon ({params}: { params: { slug: string }}) {
  return new ImageResponse((
    <div style={{fontSize: 24, color: 'white'}}>A</div>
  ), { ...size })
}
```

### 绝对导入和路径别名

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    // paths里面的 components/*是基于baseUrl前缀的，所以此处省略了./的形式，而是使用绝对路径
    "paths": {
      "@/components/*": ["components/*"]
    }
  }
}
```

### next.config.js

```js
// 使用对象形式
export default {}

// 使用函数形式
export default (phase) => {
  return {
    // 域名子路径部署网站时有用，存放应用资源的请求路径，这样相对路径会添加相应的前缀
    assertPrefix: isProd ? 'https://cdn.xxx.com' : undefined,
    // 域名子路径部署网站有用，这样所有的路由请求，资源文件都将添加相应前缀
    basePath: '/docs',
    // 默认压缩是gzip，可禁用压缩，使用自身服务器（比如nginx）的压缩算法
    compress: false,
    // 构建缓存目录，默认是.next
    distDir: 'build',
    // 添加env配置，通过process.env.xxx进行访问
    env: {
      xxx: ''
    },
    // eslint配置，可用于忽略某些报错
    eslint: {},
    // url是否带有尾部斜杠，比如/about变为/about/
    trailingSlash: true,
    // ...
  }
}

// v12.1+可以使用异步函数
```

### nextjs命令行

```bash
[npx] next start -p 5000

[npx] next -h
```

## 路由

- nextjs 使用基于文件系统的路由器，路由结构由文件路径决定
- app路由和page路由可并行工作

### app 路由

#### 页面和布局

**app 每个路由的文件结构**：

- layout.js
- template.js
- error.js、global-error.js
- loading.js
- not-found.js
- page.js，或者子级的 layout.js

```jsx
// 一个路由的结构，其中page可以是子级路由的Layout，即又是一整套的layout嵌套循环
<Layout>
  <Template>
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<Loading />}>
        <ErrorBoundary fallback={<NotFound />}>
          <Page />
        </ErrorBoundary>
      </Suspense>
    </ErrorBoundary>
  </Template>
</Layout>
```

上面所述，为内置的路由结构，其中只有 page.js(路由地址)/route.js(后端 api)可被访问，同时在每个路由文件夹内还可以定义其他的文件，但是不可通过地址进行访问。

路由访问形式：

- `app/page.js`，通过`/`进行访问
- `app/dashboard/page.js`，通过`/dashboard`进行访问
- `app/api/route.js`，通过`/api`进行访问

根路由布局：

- 应该导出一个接受 children prop 的函数，用于在渲染期间填充布局/子页面
- 必须包含 html 和 body tag，且仅有根布局有这些 tags
- 可以使用路由组创建多个根布局
- 如果要添加元数据（比如 head，title、meta tag），应该使用元数据 api，而非手动添加到根布局上（仅支持服务器组件）

```jsx
export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <section>
          <nav></nav>
          {/* 用于渲染布局/子页面 */}
          {children}
          <footer></footer>
        </section>
      </body>
    </html>
  );
}
```

路由：

- 任何路由段都可以选择性定义自己的布局，该布局在路由段及其子路由段之间共享
- 默认情况下，路由布局是嵌套的，每个父布局都使用`children` prop 将子布局包裹
- 默认情况下，布局是服务器组件，也可设置为客户端组件
- 可以使用路由组选择特定的路由共享（不共享）布局
- 无法在父子布局中传递数据，但可多次获取路由中的相同数据，react 会自动删除重复请求，不会影响性能
- 布局无法访问子布局的路径，在客户端组件中，可使用 useSelectedLayoutSegment 或 useSelectedLayoutSegments 访问所有路由段

路由段：

- 即项目目录结构或url结构
- 在page.js、layout.js、route.js中配置

```js
// 路由段配置
export const dynamic = 'auto' || 'force-dynamic' || 'error' || 'force-static'
export const dynamicParams = true || false
export const revalidate = false || true || 0
export const fetchCache = 'auto' || 'default-cache' || 'only-cache' || 'force-cache' || 'force-no-store' || 'default-no- store' || 'only-no-store'
export const runtime = 'nodejs' || 'edge'
export const preferredRegion = 'auto' || 'global' || 'home' || string || string[]
export const maxDuration = number

export default function Component （） {}
```

模板 template：

- 和布局 layout 类似，但布局可以跨路由持久化且保持状态，模板却在导航上为每个子级创建新的实例（所以每次切换导航都会显示 fallback），不保留状态
- 使用模板的情况：比如依赖于 useEffect 和 useState、更改框架定义的默认行为（比如 Suspense 组件仅在 Layout 第一次加载时才会显示 loading fallback，而模板在每次导航切换时都会显示 loading fallback）
- 接收一个`children` prop，用于呈现布局内容

```jsx
export default function Template({ children }) {
  return <div>{children}</div>;
}
```

加载 loading：

- 在数据未渲染之前展示的内容

错误处理 ui error：

- 在页面出错时展示的内容
- props属性：err: `{message, digest, reset}`

根组件错误处理 ui global-error：

- 专门处理根layout.js中的错误，与根组件同级，该组件必须包含html和body tags

not-found：

- 在路由段抛出notFound()函数时呈现的ui
- 在根组件中定义将处理整个app的任何不匹配的url

#### 路由组

- 使用`(groupName)`的方式定义文件夹名称，该名词无任何意义，仅用于组织相同布局，在渲染时`(groupName)`将被省略，例如`app/(nav)/about/page.js`将在`/about`下访问
- `(groupName)`的目录结构和普通 groupName 的一致，都包含 layout 等文件
- 可用于创建布局
- 多个路由组，可能导致解析成相同的 url 路径，将导致错误发生

#### 动态路由

- 动态字段将作为 params 属性传给 layout、page、route、generateMetadata 函数，然后在函数内部做相关处理，通过`useRouter()`获取
- 定长路由`[slug]`：目录结构`app/blog/[slug]/page.js`，将匹配：
  - `/blog/a`, 其 params 参数为`{slug: 'a'}`
  - `/blog/b`，其 params 参数为 `{slug: 'b'}`
  - ...
- 捕获不定长度的路由`[...slug]`：`app/blog/[...slug]/page.js`，将匹配：
  - `/blog/a`,其 params 参数为`{slug: ['a']}`
  - `/blog/b`,其 params 参数为`{slug: ['b']}`
  - `/blog/a/a`,其 params 参数为`{slug: ['a', 'a']}`
  - `/blog/a/a/a`，其 params 参数为`{slug: ['a', 'a', 'a']}`
  - ...
- 可选的不定长度的路由`[[...slug]]`：`app/blog/[[...slug]]/page.js`，将匹配：
  - **_`/blog`,其 params 参数为`{}`_**
  - `/blog/a`, 其 params 参数为`{slug: ['a']}`
  - `/blog/b`, 其 params 参数为`{slug: ['b']}`
  - `/blog/a/a`, 其 params 参数为`{slug: ['a', 'a']}`
  - `/blog/a/a/a`，其 params 参数为`{slug: ['a', 'a', 'a']}`
  - ...

#### parallel routes

parallel: 形容词释义，其一为 two lines, paths etc that are parallel to each other are the same distance apart along their whole length；其二为 formal similar and happening at the same time

- 该路由是使用具名插槽`@folder`的形式创建的
- 形式：`app/dashboard/@folder/home/page.js`
- `@folder`目录段在实际的路由渲染中会被忽略，不会影响 url 结构
- `@folder`通过与 children 同级的结构 folder 传递给 layout 等组件，例如有`@folder1`, `@folder2`，传给 layout 的属性 props 结构是`{ children, folder1, folder2 }`
- 该路由通常配合路由拦截一起使用，用于创建 modals

#### intercepting routes

- 通常和 parallel route 一起使用，用于创建 modals
- 形式：`app/dashboard/(..)folder/home/page.js`，其中`(..)`的种类有：
  - `(.)`：拦截当前级别下的所有区段路由
  - `(..)`：拦截当前父级别下的所有区段路由
  - `(..)(..)`：拦截当前祖父级别下的所有区段路由
  - `(...)`：拦截根目录下的所有路由
- 允许在不改变当前布局的情况下，加载一个 modals（类似弹窗，显示内容），同时地址栏的路径也一同发生变化

#### 导航和链接

路由导航的 4 种方式：

- `<Link></Link>`：推荐用法
- `useRouter()`
- `redirect()`：服务器只能用这个
- `permanentRedirect()`：永久重定向，只能在服务器组件、服务器操作、路由处理函数中使用
- js history api
- `next.config.js`的 redirects 属性

Link 组件：

- 参数 href，支持 path，path#id
- 参数 scroll：是否禁用默认滚动行为

```jsx
import Link from "next/link";

export default function Page({ posts }) {
  return (
    <ul>
      {posts.map((post) => {
        <li key={post.id}>
          {/* 注意：为了url和utf-8编码兼容，
              需要对字符串使用`encodeURLComponent`进行编码 
          */}
          <Link href={`/blog/${encodeURIComponent(post.slug)}`}>
            {post.title}
          </Link>
          {/* 或使用URL对象 */}
          <Link href={{
            pathname: '/blog/[slug]',
            query: { slug: post.slug }
          }}>
            {post.title}
          </Link>
        </li>
      })}
    </ul>
  )
}
```

useRouter hook：

- 第一个参数，为 path
- 第二个参数，为选项对象，包括 scroll 属性

```jsx
"use client";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.push("/dashboard", { scroll: false })}
    >
      dashboard
    </button>
  );
}
```

redirect：

- 默认情况下，返回 307，303（服务器操作）
- 可以在呈现过程中在客户端组件调用，但不能用于事件处理程序内（改用 useRouter）
- 接受绝对 url 地址
- 用法：`redirect(path)`

history api（pushState、replaceState）：

- 该用法可以更新浏览器历史记录堆栈，而不会重载页面

next.config.js 的 redirects 属性：

```js
module.exports = {
  aysnc redirects () {
    return [
      {
        source: '/about',
        // 重定向地址
        destination: '/',
        // 是否永久重定向
        permanent: true
      }
    ]
  }
}
```

路由和导航工作原理：略

## 组件分类

### 客户端组件

- 允许编写可在客户端使用的内容，比如事件、侦听器、浏览器 API、useState、useEffect 等
- 客户端组件是可选的，在组件文件顶部加入`use client;`即可
- 在表明了这是客户端组件后，该组件内部导入的组件，或子组件均可使用客户端相关的 api，而不需要在所有的文件中定义

### 服务器组件

- 默认情况下，nextjs 使用的是服务器组件

## 样式

nextjs 支持的样式设置方式：

- global css
- css modules
- tailwind css
- sass
- css-in-js
- 外部样式，例如 bootstrap

### global css

- 全局样式可以导入到 app 目录下的任何地方，但是 pages 目录下仅能导入到`_app.js`中

```jsx
// app/layout.jsx
import "./global.css";
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

#### 外部样式

- 外部样式需要使用 npm 包下载，然后通过导入的方式使用，不能使用`<link>`的方式引入

```jsx
// app/layout.jsx
import "bootstrap/dist/css/bootstrap.css";
export default function Layout({ children }) {
  // className使用了导入的样式
  return (
    <html lang="en">
      <body className="boot-container">{children}</body>
    </html>
  );
}
```

### css modules

- nextjs 内置支持使用了`.module.css`后缀的 css 文件，该后缀文件不会产生命名冲突

```jsx
import styles from "./styles.module.css";
export default function Layout({ children }) {
  // 这里使用了styles内的样式
  return <section className={styles.dashboard}>{children}</section>;
}
```

```css
.dashboard {
  padding: 24px;
}
```

### tailwind css

安装：`npm i -D tailwindcss postcss autoprefixer`

生成 tailwind.config.js、postcss.config.js：`npx tailwindcss init -p`

配置：

```js
// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // 若使用src目录
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};
```

导入样式到全局：

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```jsx
// 导入到根文件，这样下面所有的组件都能够使用tailwind类
import "./globals.css";
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

使用：

```jsx
export default function Page() {
  return <h1 className="text-3xl font-bold underline">hello</h1>;
}
```

### sass

- nextjs 内置支持使用 scss 后缀文件

安装：npm install -D sass

配置：

```js
// next.config.js
const path = require("path");
module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};
```

定义变量：

```scss
// app/variables.module.scss
$primary-color: #eee;

:export {
  primary-color: $primary-color;
}
```

使用：

```js
import variables from "./variables.module.scss";
export default function Page() {
  return <h1 style={{ color: variables.primaryColor }}>hello</h1>;
}
```

### css-in-js

- css-in-js 大多仅支持客户端组件，对于服务器组件需要库升级到最新的版本

## 优化

### metadata

nextjs 的 metadata api 允许修改页面的 head 元素，通过 2 种方式配置：

- config-based metadata
- file-based metadata

config-based metadata：在任何文件夹下的 layout/page.js 中导出一个静态的 metadata 对象、或者是动态的 generateMetadata 函数，若文件结构中有多个该对象，将使用离当前组件最近的一个，对于相同的一级属性，将进行覆盖，不同的一级属性，将继承

```jsx
// layout.jsx
export const metadata = {
  title: "next.js",
  description: '...'
};

export function generateMetadata({params?, searchParams?}, parent?) {
  return {
    title: "next.js",
  };
}
```

### 懒加载

懒加载的方式有2种：

- 使用next/dynamic
- React.lazy()和Suspense一起使用

使用next/dynamic：

```js
// components/C.js
export function C () {
  return <p>hello</p>
}

// app/page.js
import dynamic from 'next/dynamic'

const ComponentA = dynamic(() => import('../components/A'))
// 跳过预渲染，对于客户端，默认是预渲染的
const ComponentB = dynamic(() => import('../components/B'), {ssr: false})

// 导入 具名的导出
const ComponentC = dynamic(() => import('../components/C').then(module) => {
  return module.C
})

// 添加自定义的loading后备内容
const ComponentD = dynamic(() => import('../components/D'), {
  loading: () => <p>loading...</p>
})

export default function Layout() {
  return (
    <div>
      <ComponentA/>
    </div>
  )
}
```

### page 路由

文件结构：

- /**/xxx.js：导出的组件，将构成一个路由（即页面）
- pages/_app.js：自定义App组件
- pages/_document.js：自定义document html、body等
- pages/api/**/*.js： api接口所在目录
- pages/404.js：自定义的404页面，类似的还有500，更多错误(pages/_error.js)

#### 页面和布局

- page路由中，每个具有默认导出的组件的`js/ts/jsx/tsx`文件都是一个页面
- 页面构成的路径组成路由
- index文件，路由会默认省略index

##### shallow routing

用法：`router.push('/?xxx=10', undefined, { shallow: true })`

- 第一点注意：`/?xxx=10`，这里是传递query属性xxx，值为10，同时改变路由pathname为`/`
- 第二点注意：`{shallow: true}`，设置shallow属性

- 设置了该属性，改变url之后不会运行数据fetch方法（包括：getServerSideProps、getStaticProps、getInitialProps）
- 设置了该属性，地址栏的url和router对象将被更新，但页面不会被替换，此时可以通过router对象的query等属性进行监听（useEffect），或者使用类组件的componentDidUpdate监视

##### 自定义App组件

- 如果你想让整个应用都具备相同的某个部分（比如导航和页脚），则应该创建一个`_app.js/ts/tsx/jsx`进行自定义

::: details 安装

1. 整个应用共用一个单布局

```js
// pages/_app.js
// 一个布局组件，可以随便定义
import Layout from '../components/layout'
// component: 代表活跃的page页面，pageProps：代表传递给组件的初始props对象
export default function MyApp({component, pageProps}) {
  return (
    <Layout>
      <Component {...pageProps}/>
    </Layout>
  )
}
```

2. 设置getLayout属性让每一个组件都有一个自定义布局

```js
// pages/_app.js
export default function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(<Component {...pageProps} />)
}

// pages/index.js
import Layout from '../components/layout'
import NestedLayout from '../components/nested-layout'

export default function Page() {
  return (
    // 组件详细内容
  )
}

// 设置getLayout属性
Page.getLayout = function getLayout (page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  )
}
```

:::

##### 自定义document

- 若想自定义html和body，可以在`pages/_document.js/ts/tsx/jsx`中定义
- _document仅在服务器上呈现，所以不能使用onClick事件

```js
// 必须传递下面四个组件
import { Html, Head, Main, NextScript } from 'next/document'
export default function Document() {
  return (
    <Html lang='en'>
      <Head/>
      <body>
        <Main/>
        <NextScript/>
      </body>
    </Html>
  )
}
```

#### 渲染

nextjs有两种形式的pre-rendering方式：

- 静态生成（SSG）：html将在构建时生成，同时在每个请求中重用
- 服务端渲染（SSR）：在每个请求中生成html

使用：

- 可以混合使用两种模式，建议使用静态生成，可以通过cdn缓存，无需额外配置即可提高性能。某些情况下SSR可能是唯一选择

静态生成：

- 使用导出getStaticProps函数的形式获取props的数据，请求api
- 使用导出getStaticPaths函数的形式获取paths里面的params等数据
- 该函数仅能在page中导出，其他文件（比如_app、_err）都不能导出它

服务端渲染：

- 使用导出getServerSideProps函数的形式获取porps数据，请求api
