# nuxtjs文档

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

项目结构:

```bash
- public: 静态资源目录
- assets:资源目录（样式表、字体、图像等）
- components:组件目录
- composables:组合函数目录
- middleware: 中间件目录
- utils: 工具函数目录
- plugins: 插件目录
  - xx.server.ts: 服务端插件
  - xx.client.ts: 客户端插件
- pages: 页面目录
- layouts: 布局目录
  - default.vue: 默认布局
  - 其他布局
- server: 服务端目录,https://nuxt.com/docs/guide/directory-structure/server
  - api: 接口目录
  - plugins: 插件目录
  - middleware: 中间件目录
  - routes: 路由目录
  - utils: 工具函数目录
  - tsconfig.json
- content: 创建基于文件的CMS
- app.vue: 入口文件
- err.vue: 错误页面
- nuxt.config.ts
- app.config.ts
- tsconfig.json
- package.json
- .nuxtignore: 构建时忽略项目中的某些文件，用法和.gitignore一致
- .gitignore
- .env: 指定环境变量，`.env.local`, `.env.production`, `.env.development`
- .output: 构建生产应用时创建的目录
- .nuxt: 开发时生成vue app的目录

```

### nuxt.config.ts

```typescript [nuxt.config.ts]
// 若存在`.nuxtrc`文件，相同的属性将覆盖nuxt.config.ts中的
// defineNuxtConfig无需导入，全局可用
export default defineNuxtConfig({
  // nuxt配置项

  // 从其他配置文件继承
  extends: [
    '../base',
    '@my-themes/awesome',
    'github:my-themes/awesome#v1',
    // 继承私有仓库
    ['github:my-themes/awesome#v1', { auth: process.env.GITHUB_TOKEN }]
  ],

  // 仅客户端渲染,和原生vue程序一样
  // 若值为false，应该添加一个相同的html文件`~/app/spa-loading-template.html`，该文件将在页面显示完成之前显示
  ssr: false,

  // 强制使用页面路由，即包含pages/目录，或者有一个app/router.options.ts文件
  page: true,

  // 单独设置每个环境的配置
  $production: {
    routeRules: {
      '/**': { isr: true }
    }
  },
  $development: {}

  // 导出全局可用的环境变量，给server-side和client-side使用；
  // 在构建后需要指定的变量（比如私有token）
  // 该变量可被.env文件覆盖，比如在env文件中使用 NUXT_API_SECRET=api_secret_token 替代下面的apiSecret变量
  // 该配置内容可通过useRuntimeConfig()获取
  runtimeConfig: {
    // 非public的仅在server-side中可用
    apiSecret: '123',
    // public内部的可以在client-side中使用，在template使用$config.public.xxx访问
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

  // 启用源映射，方便代码调试
  // 或者使用命令行:nuxi dev --inspect
  sourcemap: true,
  sourcemap: {
    server: true,
    client: true
  },

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
    },
    // 给所有页面设置自动过渡效果，同时应该在app.vue的style中设置对应的过渡css样式.page-xx-xx{}
    // 在页面切换时生效
    // 若改动了布局layouts，则此处设置不生效。替代方案是给layouts设置transition
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    // 给布局layouts设置过渡效果，同时应该在app.vue的style中设置对应的过渡css样式.layout-xx-xx{}
    // 在页面切换且两个页面所使用的布局不同时生效
    layoutTransition: {
      name: 'layout',
      mode: 'out-in',
    },

    // 全局禁用过渡效果
    pageTransition: false,
    layoutTransition: false,
  },

  // 使用routeRules定义每个路由的呈现方式
  routeRules: {
    // 在构建时预渲染
    '/': {
      preRender: true,
    },
    '/api/**': {
      // 缓存1小时
      cache: { maxAge: 3600 },
      // 添加跨域请求头
      cors: true,
      // 添加headers
      headers: {},
    },
    '/product': {
      // 将缓存标头添加到服务器响应中，在服务器或反向代理缓存以配置ttl
      // 当ttl过期时，将发送缓存的响应，同时在后台重新生成页面
      // 若值为true，则会添加一个没有MaxAge的标头stale-while-revalidate
      swr: true || 3600,
      // 行为等同swr，在能够支持的平台上将响应添加到cdn缓存中
      // 若值为true，将一直保留到下一次cdn部署时
      isr: true || 3600,
    },
    // [SSR/SSG/ISR/DPR都在做什么](https://cloud.tencent.com/developer/article/1819396)
    // https://ithelp.ithome.com.tw/articles/10339578
    // https://blog.risingstack.com/nuxt-3-rendering-modes/
    // CSR：Client Side Rendering，客户端（通常是浏览器）渲染；
    // SSR：Server Side Rendering，服务端渲染；
    // SSG：Static Site Generation，静态网站生成；
    // ISR：Incremental Site Rendering，增量式的网站渲染；
    // DPR：Distributed Persistent Rendering，分布式的持续渲染。
    '/admin/**': {
      // 仅在客户端渲染(spa)
      ssr: false
    },
    // 重定向
    '/old-page': {
      redirect: {
        to: '/new-page',
        statusCode: 302
      }
    },
  },

  // 导入
  imports: {
    // 禁用自动导入，但还可显式从 `#imports` 导入
    autoImport: false,
    // 第三方包自动导入，这里设置了自动导入组合对象useI18n
    presets: [
      {
        from: 'vue-i18n',
        imports: ['useI18n'],
      }
    ],
    dirs: [
      // 扫描顶层文件
      'composables',
      // 扫描嵌套文件
      'composables/**',
      'composables/*/indx.{ts,js,mjs,mts}',
    ]
  },
  components: {
    // 禁用从当前项目为基准的`~/components`导入，设置为空数组即可
    dirs: [],
    // ~/components下的所有组件都注册全局变量
    global: true,
    dirs: ['~/components'],
  },
  // 默认情况下，仅对~/components目录进行自动导入
  // 可修改该配置对其他目录自动导入
  components: [
    {
      path: '~/components',
      // 仅根据组件名而非组件路径自动导入组件
      pathPrefix: false,
      // 限制组件的扩展类型，即只有指定的后缀才能作为组件
      extensions: ['vue'],
    },
    {
      path: "~/calendar-module/components",
      pathPrefix: false
    },
    {
      path: "~/components/special-components",
      // 设置该值后，此时`~/components/special-components/Btn.vue`通过<SpecialBtn>使用组件
      prefix: 'Special'
    }
  ],

  // 将模块添加到modules中，能够提供额外的使用步骤和详情
  modules: [
    '@nuxtjs/example',
    './modules/example',
    // 包括内联选项
    ['./modules/example', { token: '123' }],
    // 内联的模块定义
    async (inlineOptions, nuxt) => {}
  ],

  // 插件的自动导入
  plugins: [
    '~/plugins/example',
  ],

  // 使用路由器选项
  router: {
    options: {
      // 启用hashmode，启用后url不会发送到服务器，且不支持ssr
      hashMode: true,
      // 自定义hash链接的滚动行为，比如平滑滚动到该锚点
      scrollBehaviorType: 'smooth',
    }
  },

  hooks: {
    // 添加命名路由中间件到符合条件的页面
    'pages:extend'(pages) {
      function setMiddleware(pages: NuxtPage[]) {
        for(const page of pages) {
          if(xxx === true) {
            page.meta ||= {}
            page.meta.middleware = ['named']
          }
          if (page.children) {
            setMiddleware(page.children)
          }
        }
      }
      setMiddleware(pages)
    },
    // 添加更多的路由器选项文件，files后面的会覆盖前面的
    // 此挂钩添加options将仅基于页面路由启用时有效
    'pages:routerOptions'({ files }) {
      const resolver = createResolver(import.meta.url)
      // 添加路由
      files.push({
        path: resolver.resolve('./runtime/app/router-options'),
        optional: true
      })
    }
  },

  // typescript支持
  typescript: {
    // 在构建时进行类型检查
    typeCheck: true,
    // 启用严格类型检查
    strict: true,
  },

  // 配置nitro代替nitro.config.ts
  nitro: {
    // 指定在构建时获取和预渲染的路由
    prerender: {
      // 使用crawlLink预渲染无法被爬虫发现的路由(比如robots.txt)
      crawlLinks: true,
      routes: ['/user/1', '/user/2', '/robots.txt'],
      // 忽略不想预渲染的路由
      ignore: ['/dynamic']
    }
  },
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

### app.config.ts

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

### app.vue

```vue [app.vue]
<!-- 默认情况下，nuxt会将此文件视为入口点，类似vue中的App.vue，里面的内容会渲染到每个路由上 -->
<!-- 当只有一个布局时，使用app.vue+NuxtPage组件合适 -->
<template>
  <div>
    <!-- 当有pages/目录时，使用，该组件渲染具体页面的内容 -->
    <!-- 注意：NuxtLayout内部使用suspense组件，故而不能作为根组件 -->
    <NuxtLayout>
      <!-- 当NuxtPage用在app.vue中时，过渡选项可以直接作为组件props进行传递，以激活全局过渡 -->
      <!-- 页面中的definePageMeta的过渡 **不能** 覆盖该设置 -->
      <NuxtPage 
        :transition={
          name: 'page',
          mode: 'out-in'
        }
      />
    </NuxtLayout>

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

// 设置布局过渡效果
.layout-enter-active, .layout-leave-active {
  transition: all 0.5s;
}
.layout-enter-from, .layout-leave-to {
  filter: grayscale(1);
}

// 设置页面过渡效果，配合nuxt.config.ts中的pageTransition使用（此处name === page）
.page-enter-active, .page-leave-active {
  transition: all 0.5s;
}
.page-enter-from, .page-leave-to {
  opacity: 0;
  filte: blur(5px);
}

// 可设置页面自定义的过渡效果，name===xxx，在页面中配合definePageMeta({pageTransition: 'xxx'})使用
.xxx-enter-active, .xxx-leave-active {}

</style>

<style lang="scss">
// 导入样式
@use "~/assets/css/global.scss";
</style>

<!-- 使用postcss的语法 -->
<style lang="postcss"></style>

```

### error.vue

```vue [error.vue]
<!-- 该文件与app.vue同级 -->
<script setup lang="ts">
// error组件中不能使用definePageMeta
import type { NuxtError } from '#app'
const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div>
    {{ error.statusCode }}
    <button @click="handleError">clear error</button>
  </div>
  <!-- 可以使用布局组件 -->
  <NuxtLayout name="xxx">
    <!-- xxx -->
  </NuxtLayout>
</template>
```

### layouts/default.vue

布局名称规范：kebap-case

布局文件必须是单根元素

如果是布局位于嵌套目录中，则布局名称使用`-`分割，同时删除重复的段，为了清晰起见，建议布局文件名和名称匹配

- `~/layouts/desktop/default.vue` => `desktop-default`
- `~/layouts/desktop-base/base.vue` => `desktop-base`
- `~/layouts/desktop/index.vue` => `desktop`

启用布局，需要在app.vue的template中添加`<NuxtLayout>`，否则布局组件不会被渲染

使用布局：(未指定，默认使用layouts/default.vue)

- 在页面中使用definePageMeta设置layout属性，该值为布局组件的文件名
- 设置`<NuxtLayout>`的name prop，覆盖所有页面的默认布局

可以在页面中使用setPageLayout动态更改布局

若页面仅有一个布局，应该使用app.vue

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

### server/api/xxx.ts

```typescript [server/api/xxx.ts]
// 服务端的接口
exprot default defineEventHandler(async (event) => {
  // 可以返回text,html,json,stream等
})
```

### server/plugins/xx.ts

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

// 错误类型:
// 错误处理:server/plugins/error-handler.ts
export default defineNitroPlugin((nuxtApp) => {
  // 方式1:处理vue的错误
  nuxtApp.vueApp.config.errorHandler = (err, vm, info) => {
    // 处理错误
  }
  // 方式2:处理vue的错误,vue:error基于onErrorCaptured
  nuxtApp.hook('vue:error', (err, vm, info) => {
    // 处理错误
  })

  // 启动程序的错误,将调用app:error钩子

  // nitro服务错误,将跳转到对于的错误页面
})

```

### plugins/xx.ts

插件的注册顺序由文件名的字符串顺序决定，故而插件b.ts能够访问a.ts的内容

如果插件中使用了组合函数，若该组合函数依赖稍后注册的插件，则该插件无法工作；若该组合函数依赖vue生命周期，则该插件无法工作

```typescript [plugins/xx.ts]
import VueGtagNext, { trackRouter } from 'vue-gtag-next'
// 函数参数
export default defineNuxtPlugin((nuxtApp) => {
  // 在插件中使用组合函数
  const foo = useFoo()

  // 在插件中使用vue插件(比如vue-gtag-next)
  nuxtApp.vueApp.use(VueGtagNext, {
    property: {
      id: 'G-XXXXXXXXX'
    }
  })
  trackRouter(useRouter())

  // 在插件中使用自定义指令
  // 若注册了一个vue指令，必须同时在客户端和服务端同时注册
  // 或者同时提供.client.ts和.server.ts文件
  nuxtApp.vueApp.directive('focus', {
    mounted(el) {
      el.focus()
    },
    getSSRProps(binding, vnode) {
      return {}
    }
  })


  return {
    // 插件提供函数，然后在使用他的地方通过 useNuxtApp 获取该函数
    // const { $hello } = useNuxtApp()
    // $hello('xxx')
    provide: {
      hello: (msg: string) => `hello ${msg}`
    }
  }
})

// 对象参数
export default defineNuxtPlugin({
  name: 'xxx',
  // 此处的顺序不能使用动态属性
  enforce: 'pre',
  // 设置插件并行加载，默认情况下顺序加载的
  parallel: true,
  // 如果一个插件需要依赖另一个插件才能运行，应该设置
  dependsOn: ['other-plugin'],
  async setup(nuxtApp) {
    // todo
  },
  hooks: {
    'app:created'(){
      const nuxtApp = useNuxtApp()
    },
  },
  env: {
    islands: true
  }
})


```

### middleware/xx.ts

中间件命名规范：kebab-case

路由中间件分类：

- 匿名（内联）路由中间件：直接在页面中定义（通过definePageMeta）
- 命名路由中间件：通过异步导入加载（也可通过definePageMeta定义）
- 全局路由中间件，用.global.ts后缀标识，在每次路由更改时运行

中间件运行顺序：

1. 全局中间件（字符串字母顺序，特定顺序可使用编号01.xx.global.ts）
2. 页面中代码定义的中间件顺序

动态添加中间件：使用`addRouteMiddleware(name, handler, options)`函数

在构建时添加路由中间件，而不是在每个页面中重复添加，在nuxt.config.ts设置

```typescript [middleware/xx.ts]
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.params.id === '1') {
    // 中止导航
    return abortNaviagtion()
  }
  if (to.path !== '/') {
    // 重定向到给定路由
    return navitaionTo('/')
  }

  // 若中间件需要特定环境，使用import.meta属性
  if (import.meta.server) {}
  if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) {}

  // 返回值
  // 1：nothing
  // 2：
  return naviagtionTo('/')
  return naviagtionTo('/', { redirectCode: 301 })
  return aboartNaviagtion()
  return aboartNaviagtion(error)
})
```

### composables/useXxx.ts

对于自动导入，Nuxt仅扫描顶层文件，嵌套文件不会扫描

```typescript [composables/useXxx.ts]
// 1. 具名导出
export const useFoo = () => {
  // 嵌套组合函数
  const nuxtApp = useNuxtApp()
  const bar = useBar()

  return useState('foo', () => 'bar')
}

// 2. 默认导出
exprot default function () {
  return useState('foo', () => 'bar')
}

// 访问插件的provide
export const useHello = () => {
  const nuxtApp = useNuxtApp()
  return nuxtApp.$hello
})

// 若想使嵌套模块也能够自动导入，可以重新导出，或者在nuxt.config.ts中配置imports.dirs属性
export { utils } from './nested/utils.ts'

```

### components/xxx.ts

嵌套组件的名称：基于路径目录和文件名，同时删除重复的片段，比如`components/base/foo/Button.vue`，组件名为`<BaseFooButton>`，为了清晰起见，建议组件名和名称相匹配，比如将Button重命名为BaseFooButton

如果只想根据组件名，而非路径使用该组件，需要在nuxt.config.ts中配置pathPrefix

动态组件：若想使用component+is语法，需要使用resolveComponent函数或从`#components`显式导入

动态导入组件（延迟加载）：给对应的组件添加Lazy前缀即可

全局组件：使用`.global.vue`后缀，或者通过nuxt.config.ts设置

客户端组件（仅在挂载后才会渲染， onMounted+nextTick或使用ClientOnly组件）使用.client.vue后缀，服务端组件使用.server.vue后缀

::: code-group

```vue [pages/index.vue]
<script setup lang="ts">
// 直接导入组件（非自动导入）
import { SomeComponent } from '#components'

// 该方式，确保参数必须是字符串，而非变量
const MyButton = resolveComponent('MyButton')

let show = ref(false)
</script>

<template>
  <div>
    <component :is="clickable ? MyButton : 'div'"/>
    <component :is="SomeComponent"/>

    <!-- 动态导入 -->
    <LazyMountainsList v-if="show"/>
    <button v-if="!show" @click="show = !show">show list</button>
  </div>
</template>
```

```typescript [mudules/register-component.ts]
import { addComponent, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  setup() {
    addComponent({
      // 该设置相当于在使用时自动导入了import { MyComponent as MyAutoImportedComponent } from 'my-npm-package'
      // 后面直接使用MyAutoImportedComponent即可
      name: 'MyAutoImportedComponent',
      export: 'MyComponent',
      filePath: 'my-npm-package'
    })
  }
})

:::

### 使用资源assets

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

### 页面和路由

Nuxt提供基于文件的路由系统

页面是vue组件，支持.vue（默认）, .js, .ts, .jsx, .tsx, .mjs作为组件的扩展

可以用后缀`.client.vue`定义仅限客户端呈现的页面，用后缀`.server.vue`定义仅限服务端呈现的页面

页面必须具有单个根元素，注意注释也当做一个元素

动态路由：将任何内容放在方括号内`[]`，将被转为动态路由参数(通过`$route.params`, `useRoute().params`获取)，可以在文件名或目录中混合匹配多个参数，即使是非动态文本

可选路由参数：将内容放在双方括号内`[[]]`

路由优先级：命名的父路由优先于嵌套的子路由，比如路由`/foo/hello`，`~/pages/foo.vue`优先于`~/pages/foo/[slug].vue`

全路径路由（剩余路径）：使用`[...slug]`的形式，比如`pages/[...slug].vue`将匹配`/foo/bar/baz`, `/foo/baz`等

嵌套路由：`pages/parent.vue`, `pages/parent/child.vue`，此时在parent.vue的template中必须包含`NuxtPage`组件，才能显示`pages/parent/child.vue`

pages/index.vue将映射到应用的根路由

页面导航:

- 使用`<NuxtLink to="path">跳转</NuxtLink>`组件进行页面跳转
- 使用`navigateTo({path, query})`函数进行页面跳转

多页应用：在pages同级创建多个其他页面的结构other-page，内部包含nuxt.config.ts，pages等内容，此时外部的nuxt.config.ts需要使用extends继承其他页面的nuxt.config.ts`extends: ['./other-page']`

::: code-group

```typescript [ts扩展]
export default defineComponent({
  render(){
    return h('div', 'hello')
  }
})
```

```vue [vue扩展]
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

// 访问页面元数据
// 如果使用了嵌套路由，则所有这些页面的pageMeta将合并到单个对象中
const route = useRoute()
console.log(route.meta.title)

let myTitle = ref('')

// 设置页面元数据
// 只能用在页面组件中，无法用在其他组件中，因为会被编译掉
definePageMeta({
  // name: 定义页面路由的名称
  name: 'page-xxx',

  // 若模式比文件名能表现的路由模式更复杂，用此代替
  path: '',

  // 控制NuxtPage组件的重新渲染时间
  key: route => route.fullPath,

  // alias: 路径别名，可通过里面的路径访问当前页面
  alias: ['/xxx'] || '/xxx',

  // keep-alive：保留页面状态
  keepalive: true,

  // 同时传递给他的元数据将被吊出组件，故而不能引用组件和组件上定义的值
  // error
  title: myTitle,

  // 设置页面的元数据信息，然后在布局文件中（比如layouts/default.vue）捕获到该信息，进而使用useHead添加该信息
  title: 'some page',

  // 设置页面使用的布局，未设置则默认使用layouts/default.vue
  // 此处表示使用的是layouts/admin.vue文件的布局
  layout: 'admin',
  // 也可和page一样，设置该页面所属布局的过渡效果（覆盖全局配置），应用于该页面中
  layoutTransition: {
    name: 'xxx',
    mode: 'out-in'
  },
  // 设置页面过渡（覆盖全局配置）
  pageTransition: {
    name: 'xxx',
    mode: 'out-in',
    // 其他选项用于创建高度动态和自定义的过渡效果
    onBeforeEnter(el) {},
    onAfterEnter(el) {},
    onEnter(el) {},
  },

  // 当前页面禁用过渡效果
  layoutTransition: false,
  pageTransition: false,

  // 使用内联中间件应用动态过渡，用于同一个组件页面切换（例如pages/[id].vue）,此时需要设置.slide-left和.slide-right对应的过渡样式
  middleware: (to, from) => {
    if(to.mata.pagenTransition && tyepof to.mata.pagenTransition !== 'boolean') {
      t.meta.pagenTransition.name = +to.params.id > +from.params.id ? 'slide-left' : 'slide-right'
    }
  },

  // 第一种方式：使用具名路由中间件
  middleware: 'auth',

  // 第二种方式：使用匿名路由中间件
  // 路由验证：接受参数route，返回Boolean，返回false，将导致404错误
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  }
})

// 3.全局路由中间件：放在`/middleware/`目录下且带有`.global`后缀，在每次路由更改时自动允许

// 数据获取
// 方式1：使用useFetch，该函数只能用在setup函数或者script setup顶层作用域中
// 该函数是useAsyncData和$fetc的包装器(useFetch(url) === useAsyncData(url, () => $fetch(url))
// useFetch和useAsyncData返回值有:
// data: 获取的数据结果
// error、
// pending:是否正在请求
// refresh/execute:通过handler函数属性返回值
// status:数据请求的状态
// clear: 可将data设为undefined,error设为null,pending设为false,status设为'idle',同时取消当前的请求
// 如果设置了ssr为false(即不在服务器上获取数据)时,在水合作用(hydration)完成之前获取不到数据(null),即使使用了await
// useFetch和useAsyncData使用key防止获取重复的数据,其中:
// useFetch使用url作为key,或者在最后一个参数(选项对象)中提供一个key属性
// useAsyncData使用第一个参数为string的值为key,否则会生成一个useAsyncData实例的行号和文件名作为key
const { data: count } = await useFetch('/api/count', {
  // 默认情况下,该函数将等待异步调用的解析,然后再使用suspense导航到新页面
  // 当设置了lazy后,应该在template中手动设置不同的情况(即v-if="pening",v-else)
  // 或者使用useLazyFetch和useLazyAsyncData代替lazy选项
  // 设置了lazy之后,则对于ssr为false的客户端代码,能够获取到数据
  lazy: true,
  ssr: false,
  // 使用pick返回 需要的 属性,其他属性不返回
  pick: ['title', 'name'],
  // 使用transform返回 需要的 属性,其他属性不返回
  transform: (count) => {
    return count.map(count => ({
      title: count.title,
      name: count.name,
    }))
  },
  // 在响应式值变更时,重新运行该函数
  watch: ['id'],
  // 注意,若url中函数包含响应式值,该值一直是初始值,而非变化后的值,若想获取变化的值,应该使用computed url或者使用query将响应式值加入进去
  query: {
    user_id: id,
  },
  // 是否在调用时立刻获取,还是在响应式变更后再获取
  immedite: false,
})

// 方式2:使用$fetch,该函数适合根据用户交互发送网络请求
// 注意,该方式不会提供消除网络重复调用和导航防护功能
// 建议该方法用在客户端事件交互的数据获取场景中,或在获取组件初始化数据时结合useAsyncData使用
async function addTodo() {
  const todo = await $fetch('/api/todos', {
    method: 'POST',
    body: {
      // data
    }
  })
}

// 方式3:使用useAsyncData,该函数负责包装异步逻辑,第一个参数todos是一个唯一的key(可忽略,通过第二个参数自动生成,不建议忽略),用于缓存第二个参数的结果
// 设置第一个参数,对于在组件之间使用useNuxtData共享数据,或者刷新特定的数据是十分有用的
// 将服务端(server文件夹内的)数据传递给客户端时,使用useAsyncData和useLazyAsyncData,data可以被序列化(包括原始类型和其他对象类型),其他fetch方法只能序列化(json.parse)原始数据类型.不过可以自定义序列化方法,在服务器端,这样所有方法都可以获取到正确的值类型了
const { data, error } = await useAsyncData('todos', () => myGetTodos('todos'))
// 等同于
const { data, error } = await useAsyncData(() => myGetTodos('todos'))
// 可包装多个$fetch异步请求,并返回他们的结果
const { data: todos, error, pending } = await useAsyncData('todos', async () => {
  const [todos, users] = await Promise.all([
    $fetch('/api/todos'),
    $fetch('/api/users')
  ])

  return { todos, users }
})
// 获取
console.log(todos.vlaue.todos, todos.value.users)

// 序列化
// 方法1:在服务器端自定义序列化函数:server/api/todos.ts
export default defineEvntHandler(() => {
  const data = {
    createdAt: new Date(),

    toJSON(){
      // 后续请求该接口时,返回的就是这个格式的数据
      return {
        createdAt: {
          year: this.createdAt.getFullYear(),
          month: this.createdAt.getMonth(),
          date: this.createdAt.getDate(),
        }
      }
    }
  }
  return data
})
// 方法2:使用第三方库,比如superjson:server/api/todos.ts
import superjson from 'superjson'
export default defineEvntHandler(() => {
  const data = {
    cratedAt: new Date(),

    toJSON(){
      return this
    }
  }
  return superjson.stringify(data) as unknown as typeof data
})
// 方法2使用
import superjson from 'superjson'
const { data } = await useFetch('/api/todos', {
  tranform: (value) => superjson.parse(value as unknown as string),
})

// 传递请求头给api
// 在服务端中$fetch请求是在服务器内部进行的,因此cookie不会自动发送和传递
// 使用useRequestHeaders访问cookie
const headers = useRequestHeaders(['cookie'])
const { data } = await useFecth('/api/todos', { headers })

// 在ssr响应中传递来自服务器端的api调用的cookie
// 第一步:composables/fetch.ts
import { appendResponseHeader, H3Event } from 'h3'
export const fetchWithCookie = async (event: H3Event, url: string) => {
  const response = await fetch.raw(url)
  const cookies = (response.headers.get('set-cookie') || '').split(',')
  for (const cookie of cookies) {
    appendResponseHeader(event, 'set-cookie', cookie)
  }
  retrun response._data
}
// 第二步:当前文件
const event = useRequestEvent()
const { data: result } = await useAsyncData('todos', () => fetchWithCookie(event!, '/api/todos'))
onMounted(() => {
  console.log(document.cookie)
})

// 状态共享:使用useState,通过key在组件间共享
const counter = useState('counter', () => Math.round(Math.random() * 10))
// 结合callOnce函数使用异步解析进行状态初始化
const website = useState('website')
await callOnce(async () => {
  website.value = await $fetch('/api/website')
})
// 结合pinia一起使用
const webiste = useWebisteStore()
// 这里的website.fetch是pinia useWebisteStore内action的方法
await callOnce(website.fetch)

// 定义一个全局状态(自动导入),在任意组件中都可以使用:composables/state.ts
export const useColor = () => useState<string>('color', () => 'red')
// 使用
const color = useColor()

// 使用第三方库:pinia,harlem,XState


// 抛出错误,供处理程序处理,需要设置fatal: true(触发全屏页面)
if (!data.value) {
  throw crateError({
    statusCode: 500,
    statusMessage: 'Something went wrong',
  })
}

// 动态更改布局，通过调用该函数动态修改
function enableCustomLayout() {
  setPageLayout('custom')
}
definePageMeta({
  layout: false,
})

// 页面布局覆盖设置
// 先定义layout为false，然后在页面的template中使用NuxtLayout
definePageMeta({
  layout: false,
})
</script>

<!-- 在选项式api中执行asyncData -->
<script>
export default defineNuxtComponent({
  // 提供一个key
  fetchKey: 'todos',
  async asyncData(){
    return {
      todos: await $fetch('/api/todos')
    }
  }
})
</script>

<template>
  <div>
    <!-- 组件内的错误处理,而非使用错误页面 -->
    <NuxtErrorBoundary @error="onError">
      <template #error="{ error, clearError }">
        <button @click="clearError">clear error</button>
      </template>
    </NuxErrorBoundary>

    <!-- 若当前文件上父级，包含一个嵌套路由，必须包含 -->
    <NuxtPage/>
    <!-- 为了更好控制NuxtPage组件的重新渲染时间，可以传递pageKey属性(字符串/函数)，或者在子组件的definePageMeta中设置 -->
    <NuxtPage :pageKey="route => route.fullPath"/>

    <!-- 页面布局覆盖 -->
    <NuxtLayout name="custom">
      <template #header>
        xxx
      </template>
    </NuxtLayout>
  </div>

</template>
```

:::

## 自定义路由

添加自定义路由的方式：

- `app/router.options.ts`
- `pages:extend` hook：在扫描路由时增加/修改/删除路由
- nuxt module + nuxt kit：添加路由的方法extendPages、extendRouteRules

::: code-group

```typescript [app/router.options.ts]
import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  // 若返回null或undefined，则回退到默认路由
  routes: (_routes) => [
    {
      name: 'home',
      path: '/',
      component: () => import("~/pages/home.vue").then(r => r.default || r)
    }
  ]
}
```

```typescript [nuxt.config.ts]
export default defineNuxtConfig({
  hooks: {
    'pages:extend'(pages) {
      // 添加路由
      pages.push({
        name: 'profile',
        path: '/profile',
        file: '~/extra-pages/profile.vue'
      })

      // 删除路由
      function removePagesMatching (pattern: RegExp, pages: NuxtPage[] = []) {
        const pagesToRemove = []
        for (const page of pages) {
          if (pattern.test(page.file)) {
            pagesToRemove.push(page)
          } else {
            removePagesMatching(pattern, page.children)
          }
        }
        for (const page of pagesToRemove) {
          page.splice(pages.indexOf(page), 1)
        }
      }
      removePagesMatching(/\.ts$/, pages)
    }
  }
})
```
:::

## 自动导入

Nuxt能够自动导入组件(`components/`)、组合函数(`composables/`)、辅助函数(`utils/`)、`server/utils/`的函数变量、插件的一级文件(`plugins/xx.ts`)、vue api,而无需显式导入，禁用可在nuxt.config.ts中设置

可以通过配置nuxt.config.ts的imports字段自动导入其他文件夹或第三方包导出的函数

可以使用`#imports`别名导入这些自动导入的内容，比如`import { ref } from '#imports'`

Nuxt会自动导入`~/components`目录（以当前组件为基准）的组件，禁用可在nuxt.config.ts中设置

Nuxt允许从第三方软件包自动导入，如果使用nuxt模块开发包，则该包已经配置了自动导入。手动导入须在nuxt.config.ts中设置

导入依赖于浏览器api且具有副作用（side effects）的库时，确保导入该库仅在客户端调用

## 渲染模式

Nuxt支持的渲染模式:通用渲染（默认）、客户端渲染、混合渲染、边缘服务器渲染

通用渲染：服务器段+客户端渲染

- 能够立即获取app的内容（无需进行js解析，提供快速的页面加载时间），但是也保留了客户端的特性（动态界面、页面过渡，在后台进行js解析）。使静态页面在浏览器中具有交互性称作水合（hydration）
- 优势：提升获取页面的速度，搜索引擎优化（SEO）
- 缺点：服务端和客户端的api不尽相同（开发受限），需要运行服务器动态呈现页面（增加成本）

客户端渲染：传统的vue应用呈现方式

- 优势：开发速度快（完全在浏览器工作），仅需要运行静态服务器即可（成本低），可离线运行
- 缺点：必须进行js解析渲染页面（性能较低），seo需要花更多的时间

混合渲染（hydration）：允许使用路由规则对每个路由使用不同的缓存规则，并决定服务器应该怎么响应给定url的请求，在nuxt.config.ts配置

边缘端渲染（edge-side）：允许通过cdn的边缘服务器让nuxt应用更靠近用户，提高性能减少延迟（通过缩短数据传输的物理距离）

- 支持该模式的平台有：cloudflare pages、vercel edge functions、netlify functions

## 服务器引擎nitro

提供的功能：

- 对nodejs、浏览器、service-workers提供跨平台支持
- 支持serverless开箱即用
- 支持api路由
- 自动对chunks进行代码拆分和异步加载
- 支持静态+serverless站点的混合模式
- 开发服务器热重载

## 生命周期钩子

构建时的nuxt hooks（可在nuxt.config.ts和模块中使用）：

- close

运行时的app hooks：

- page:start

运行时的服务器钩子：

- render:html
- render:response

其他钩子：自定义钩子

## Nuxt kit

该套件为模块作者提供相关功能

## NuxtApp

NuxtApp：应用程序上下文实例（通过useNuxtApp()访问），能够在插件、nuxt hooks、nuxt middleware、页面和组件的setup函数中使用

可以提供一个provide，后续使用时通过useNuxtApp().$xxx获取

```typescript
const nuxtApp = useNuxtApp()
// 提供provide：hello
nuxtApp.provide('hello', (name) => `hello, ${name}`)

// 在能使用nuxtApp的地方使用（$hello）提供的provide
console.log(nuxtApp.$hello('world'))
```

## Nuxt Layers

nuxt layers可用于monorepo或git/npm中共享重用部分nuxt app。

nuxt layers的结构和nuxt app几乎相同，最小的nuxt layer至少要包含一个nuxt.config.ts（表示他是一个layer）

layers中的其他结构会自动扫描，和标准nuxt app一致

在layer组件和组合函数中使用别名（`~/`, `@/`）导入时，是相对于用户项目路径解析的。相对当前目录可使用相对路径`./`等

```bash [基础示例]
# 基础示例，项目结构
# nuxt需要继承base/nuxt.config.ts（'extends: ["./base"]'）
# 如果是github仓库或npm包的layers，也应放在extends中
- nuxt.config.ts
# 当前，可在app.vue中使用BaseComponent组件
- app.vue
# 这是一个nuxt layer
- base
  - nuxt.config.ts
  - components
    - BaseComponent.vue
```

## debugging

可在nuxt.config.ts中配置sourcemap

在vscode中调试：需要安装nuxi作为开发依赖

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "client: chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "server: nuxt",
      "outputCapture": "std",
      "program": "${workspaceFolder}/node_modules/nuxi/bin/nuxi.mjs",
      "args": [
        "dev"
      ],
    }
  ],
  "compounds": [
    {
      "name": "fullstack: nuxt",
      "configurations": [
        "server: nuxt",
        "client: chrome"
      ]
    }
  ]
}

```

## 部署

使用nodejs部署:

```bash
# 第一步
npm run build
# 第二步:根据运行提示运行类似下面命令
node .output/server/index.mjs

```

使用pm2部署:

```json
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'NuxtAppName',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
```

静态托管:

- 方式1:nuxt.config.ts设置ssr为true配合nuxt generate一起使用(可进行页面预渲染和seo)
- 方式2:nuxt.config.ts设置ssr为false(此时将生成一个空的div)

## 注意事项

在组件生命周期中，vue通过全局变量跟踪当前组件的临时实例，且在同一时间点取消这个变量。这样做是为了避免交叉请求状态污染泄漏两个用户之间的共享引用，也是为了避免不同组件之间的泄漏。这意味着不能在nuxt插件、路由中间件、setup函数之外使用这个实例。同时，在调用一个组合函数之前（除了在script setup块内、defineNuxtComponent+setup函数内、defineNuxtRouteMiddleware函数内）不能使用await。[详情](https://nuxt.com/docs/guide/concepts/auto-imports#vue-and-nuxt-composables)

若收到了一些类似`nuxt instance is unavailable`的报错，需要注意是否在错误的地方调用了某些代码，需要调整这些代码的位置，比如把函数外部的调用移到内部，或者把内部的调用移到外部。

