# nextjs doc

> 该文档仅记录了当时阅览时的有用的内容，故而会忽略一些在将来看来重要的内容
> 第一次阅览：2024-02-01

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

## 路由

- nextjs使用基于文件系统的路由器，路由结构由文件路径决定

### app路由

#### 页面和布局

**app每个路由的文件结构**：

- layout.js
- template.js
- error.js
- loading.js
- not-found.js
- page.js，或者子级的layout.js

```jsx
// 一个路由的结构，其中page可以是子级路由的Layout，即又是一整套的layout嵌套循环
<Layout>
  <Template>
    <ErrorBoundary fallback={<Error/>}>
      <Suspense fallback={<Loading/>}>
        <ErrorBoundary fallback={<NotFound/>}>
          <Page/>
        </ErrorBoundary>
      </Suspense>
    </ErrorBoundary>
  </Template>
</Layout>
```

上面所述，为内置的路由结构，其中只有page.js(路由地址)/route.js(后端api)可被访问，同时在每个路由文件夹内还可以定义其他的文件，但是不可通过地址进行访问。

路由访问形式：

- `app/page.js`，通过`/`进行访问
- `app/dashboard/page.js`，通过`/dashboard`进行访问
- `app/api/route.js`，通过`/api`进行访问

根路由布局：

- 应该导出一个接受children prop的函数，用于在渲染期间填充布局/子页面
- 必须包含html和body tag，且仅有根布局有这些tags
- 可以使用路由组创建多个根布局
- 如果要添加元数据（比如head，title、meta tag），应该使用元数据api，而非手动添加到根布局上（仅支持服务器组件）

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
  )
}
```

路由：

- 任何路由段都可以选择性定义自己的布局，该布局在路由段及其子路由段之间共享
- 默认情况下，路由布局是嵌套的，每个父布局都使用`children` prop将子布局包裹
- 默认情况下，布局是服务器组件，也可设置为客户端组件
- 可以使用路由组选择特定的路由共享（不共享）布局
- 无法在父子布局中传递数据，但可多次获取路由中的相同数据，react会自动删除重复请求，不会影响性能
- 布局无法访问子布局的路径，在客户端组件中，可使用useSelectedLayoutSegment或useSelectedLayoutSegments访问所有路由段

模板template：

- 和布局layout类似，但布局可以跨路由持久化且保持状态，模板却在导航上为每个子级创建新的实例（所以每次切换导航都会显示fallback），不保留状态
- 使用模板的情况：比如依赖于useEffect和useState、更改框架定义的默认行为（比如Suspense组件仅在Layout第一次加载时才会显示loading fallback，而模板在每次导航切换时都会显示loading fallback）
- 接收一个`children` prop，用于呈现布局内容

```jsx
export default function Template({ children }) {
  return <div>{ children }</div>
}
```

加载loading：

- 在数据未渲染之前展示的内容

错误处理ui error：

- 在页面出错时展示的内容

#### 路由组

- 使用`(groupName)`的方式定义文件夹名称，该名词无任何意义，仅用于组织相同布局，在渲染时`(groupName)`将被省略，例如`app/(nav)/about/page.js`将在`/about`下访问
- `(groupName)`的目录结构和普通groupName的一致，都包含layout等文件
- 可用于创建布局
- 多个路由组，可能导致解析成相同的url路径，将导致错误发生

#### 动态路由

- 动态字段将作为params属性传给layout、page、route、generateMetadata函数，然后在函数内部做相关处理
- 定长路由`[slug]`：`app/blog/[slug]/page.js`，将匹配`/blog/a`, `/blog/b`等，其params参数为`{slug: 'a'}`, `{slug: 'b'}`
- 捕获不定长度的路由`[...slug]`：`app/blog/[...slug]/page.js`，将匹配`/blog/a`, `/blog/b`, `/blog/a/a`, `/blog/a/a/a`等，其params参数为`{slug: ['a']}`, `{slug: ['b']}`, `{slug: ['a', 'a']}`, `{slug: ['a', 'a', 'a']}`
- 可选的不定长度的路由`[[...slug]]`：`app/blog/[[...slug]]/page.js`，将匹配`/blog`, `/blog/a`, `/blog/b`, `/blog/a/a`, `/blog/a/a/a`等，其params参数为`{}`, `{slug: ['a']}`, `{slug: ['b']}`, `{slug: ['a', 'a']}`, `{slug: ['a', 'a', 'a']}`

#### 导航和链接

路由导航的4种方式：

- `<Link></Link>`：推荐用法
- `useRouter()`
- `redirect()`：服务器只能用这个
- `permanentRedirect()`：永久重定向，只能在服务器组件、服务器操作、路由处理函数中使用
- js history api
- `next.config.js`的redirects属性

Link组件：

- 参数href，支持path，path#id
- 参数scroll：是否禁用默认滚动行为

```jsx
import Link from 'next/link'

export default function Page() {
  return <Link href='/dashboard'>dashboard</Link>
}
```

useRouter hook：

- 第一个参数，为path
- 第二个参数，为选项对象，包括scroll属性

```jsx
'use client'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  return (
    <button type='button' onClick={() => router.push('/dashboard', { scroll: false })}>
      dashboard
    </button>
  )
}
```

redirect：

- 默认情况下，返回307，303（服务器操作）
- 可以在呈现过程中在客户端组件调用，但不能用于事件处理程序内（改用useRouter）
- 接受绝对url地址
- 用法：`redirect(path)`

history api（pushState、replaceState）：

- 该用法可以更新浏览器历史记录堆栈，而不会重载页面

next.config.js的redirects属性：

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

### page路由

## 组件分类

### 客户端组件

- 允许编写可在客户端使用的内容，比如事件、侦听器、浏览器API、useState、useEffect等
- 客户端组件是可选的，在组件文件顶部加入`use client;`即可
- 在表明了这是客户端组件后，该组件内部导入的组件，或子组件均可使用客户端相关的api，而不需要在所有的文件中定义

### 服务器组件

- 默认情况下，nextjs使用的是服务器组件
