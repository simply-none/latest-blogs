# nuxtjs官网文档 demo

## 准备工作

环境准备：

- 环境：`Node.js v18+`，最好是偶数版本号
- vscode插件：`vue official`、`Nuxtr`
- 项目依赖：预处理器`sass`

项目初始化：

- `npx nuxi@latest init <project-name>`
- `pnpm dlx nuxi@latest init <project-name>`

项目初始化时，若出现项目模板安装不下来时，在浏览器中输入报错提供的url，然后会得到模板压缩包的地址，输入该地址下载即可

## demo配置

::: code-group

```typescript [nuxt.config.ts]
// defineNuxtConfig无需导入，全局可用
export default defineNuxtConfig({
  // nuxt配置项

  // 单独设置每个环境的配置
  $production: {
    routeRules: {
      '/**': { isr: true }
    }
  },
  $development: {}

  // 导出全局可用的环境变量，给server-side和client-side使用；
  // 在构建后需要指定的变量（比如私有token）
  // 该变量可通过env环境进行覆盖他们，比如在env文件中使用 NUXT_API_SECRET=api_secret_token 替代下面的apiSecret变量
  // 该配置内容可通过useRuntimeConfig()获取
  runtimeConfig: {
    // 非public的仅在server-side中可用
    apiSecret: '123',
    // public内部的可以在client-side中使用
    public: {
      apiBase: '/api'
    }

  },

  // css配置
  css: [
    // 设置完后，global.css将注入到所有的页面中
    "~/assets/global.css",
    // 通过npm安装的第三方样式可以放入
    "animate.css",
    // 注入scss文件
    "~/assets/global.scss"
  ],

  app: {
    head: {
      // 导入外部样式表，类似html原生导入方式
      link: [
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        }
      ],
      // 改善seo
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },


  // 配置nitro代替nitro.config.ts
  nitro: {},
  // nuxt内置了postcss，postcss代替postcss.config.ts
  postcss: {
    plugins: {
      'postcss-nested': {}
    }
  },
  // vite代替vite.config.ts
  vite: {
    // 导入可供全局使用的样式
    css: {
      preprocessorOptions: {
        scss: {
          // 这里将assets下的global.scss文件注册到了全局，此后项目里所有地方都可使用该文件的样式
          additionalData: '@use "~/assets/global.scss" as *;'
        }
      }
    }

  },
  // webpack代替webpack.config.ts
  webpack: {},

  
})
```

```typescript [app.config.ts]
// defineAppConfig无需导入，全局可用
// 公开在构建时确定的公共变量（比如public token、网站配置、其他非敏感配置），该变量不可被env环境覆盖
// 该配置内容可通过useAppConfig()获取
// 该配置可以为每个请求进行配置，可以热模块替换，值可以是非原始类型
export default defineAppConfig({
  title: 'hello, nuxt',
  theme: {
    dark: true,
    colors: {
      primary: '#ff0000',
    }
  }
})
```

```vue [app.vue]
<!-- 默认情况下，nuxt会将此文件视为入口点，类似vue中的App.vue，里面的内容会渲染到每个路由上 -->
<!-- 当只有一个布局时，使用app.vue+NuxtPage组件合适 -->
<template>
  <div>
    <!-- 该组件渲染具体页面的内容 -->
    <NuxtPage/>

    <!-- nuxt提供了Title、Base、NoScript、Style、Meta、Link、Body、Html、Head，分别对应原生的html元素 -->
    <!-- 这样写，不会影响head最终渲染的位置 -->
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="description" :content="title" />
      <Style type="text/css" children="body { background-color: green; }" ></Style>
    </Head>
  </div>
</template>

<script lang="ts" setup>
// 在组件script中导入样式：静态导入
import '~/assets/css/global.css'
// 导入npm包
import 'animate.css'
// 动态导入
import('~/assets/css/global.css')

const myTitle = ref('my app')

// useHead设置头部信息，该方法不支持整体响应式数据，建议在app.vue中使用
useHead({
  title: 'my app',
  // 支持局部响应式数据
  title: myTitle,
  // 动态标题：通过捕获page中设置的title等信息
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - site title` : 'site title'
  },
  // 动态标题（%s）：通过捕获page中设置的title等信息
  titleTemplate: '%s - site title',
  meta: [
    {
      name: 'description',
      content: 'my amazing site.'
    }
  ],
  bodyAttrs: {
    class: 'test',
  },
  script: [
    { innerHTML: 'console.log(\'hello world\')' },
    // 追加到body标签的末尾
    { src: 'https:xxx.com', tagPosition: 'bodyClose' }
  ],
  // 使用useHead在代码中动态添加外部样式表
  link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css' }]
})

// useSeoMeta()：将useHead的内容平铺，功能和useHead一致
useSeoMeta({
  title: 'my app',
  ogTitle: 'my amazing site.'
  // ... 
})

</script>

<style>
// 在组件style中导入样式
@import url('~/assets/css/global.css');
@import url('animate.css');
</style>

<style lang="scss">
// 导入样式
@use "~/assets/css/global.scss";
</style>

<!-- 使用postcss的语法 -->
<style lang="postcss"></style>

```

```vue [layouts/default.vue]
<!-- 当有多个布局时，使用layouts目录+slot组件合适 -->
<template>
  <div>
    <AppHeader/>
    <!-- slot元素渲染具体页面的内容 -->
    <slot/>
    <AppFooter/>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()

useHead({
  meta: [
    {
      property: 'og:title',
      // 捕获到页面通过definePageMeta设置的元数据信息
      content: `app name - ${route.meta.title}`
    }
  ]
})
</script>
```

```typescript [server/plugins/xx.ts]
// server/plugins/render-html.ts
// render:html钩子的回调函数允许在html发送到client-side之前修改html
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    // 在head内插入一个meta元素
    html.head.push(`<meta name="description" content="my custom description" />`)
    // 添加外部样式：外部样式会中断资源的渲染，必须在浏览器呈现页面之前加载和处理他们
    html.head.push('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">')
  })

  // 拦截响应内容
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    console.log(response)
  })
})

```

```vue [使用资源]
<template>
  <!-- 
    public目录：内容在服务器根目录下原样提供
      通过 `/`开头访问public下的资源
   -->
  <img src="/img/nuxt.png" alt="nuxt 3 picture"/>
  <!-- 
    assets：包含希望被构建工具（vite、webpack）处理的资源
    通过 `~`开头进行访问，该目录名可使用任意的名称，比如assets、resource等
   -->
   <img src="~/assets/img/nuxt.png" alt="nuxt 3 picture"/>
</template>

```

```vue [页面和路由]
<!-- 
  nuxt的核心之一（文件系统路由）：给每一个在pages/下的文件都创建了一个路由
 -->
<script setup lang="ts">
// 使用useRoute()获取路由参数
const route = useRoute()
console.log(route.params.id, route.query.name)

// 路由中间件：在导航到特定路由之前提取要允许的代码
// 分类：
// 1.匿名（内联）路由中间件：直接在使用他们的地方定义

// 2.命名路由中间件：放在`/middleware/`目录下，名称规范：kebab-case，通过异步导入自动加载
// middleware/auth.ts
export default defineNuxtRouteMiddleware({
  // 无权限，就跳转到login
  if(isAuthenticated() === true) {
    return navigateTo('/login')
  }
})

// 使用auth.ts中间件
definePageMeta({
  // 设置页面的元数据信息，然后在布局文件中（比如layouts/default.vue）捕获到该信息，进而使用useHead添加该信息
  title: 'some page',

  // 第一种方式：使用具名路由中间件
  middleware: 'auth',

  // 第二种方式：使用匿名路由中间件
  // 路由验证：接受参数route，返回Boolean，返回false，将导致404错误
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  }
})

// 3.全局路由中间件：放在`/middleware/`目录下且带有`.global`后缀，在每次路由更改时自动允许
</script>
```

:::
