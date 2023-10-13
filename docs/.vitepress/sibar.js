

export function sidebarUsageFrame() {
  return [
    { text: "技术栈工具链", link: "/usage-frame/技术栈工具链" },
    { text: "http知识点", link: "/usage-frame/http知识点汇总" },
    { text: "electron", link: "/usage-frame/electron知识" },
    { text: "JavaScript", link: "/usage-frame/JavaScript知识点" },
    { text: "CSS", link: "/usage-frame/CSS知识点" },
    { text: "css处理器", link: "/usage-frame/CSS处理器" },
    {
      text: "Vue",
      items: [
        { text: "Vue2", link: "/usage-frame/Vue2知识点" },
        { text: "ElementUI", link: "/usage-frame/elementui知识点" },
        { text: "vue3保点", link: "/usage-frame/vue3保点" },
        { text: "vue实战技巧", link: "/usage-frame/vue实战技巧" },
        { text: "pinia", link: "/usage-frame/Pinia" },
        { text: "vite", link: "/usage-frame/vite" },
        {
          text: "vue-router迁移指南",
          link: "/usage-frame/vue-router迁移指南",
        },
      ],
    },
    { text: "NodeJs知识点", link: "/usage-frame/nodejs知识点" },
    {
      text: "typescript",
      items: [
        {
          text: "第一阶段知识点",
          link: "/usage-frame/typescript/typescript一期知识点",
        },
        {
          text: "第二阶段知识点",
          link: "/usage-frame/typescript/typescript二期知识点",
        },
        {
          text: "tsconfig选项解释",
          link: "/usage-frame/typescript/tsconfig",
        },
        {
          text: "更新汇总",
          link: "/usage-frame/typescript/typescript更新汇总",
        },
        {
          text: "奇怪或有用的代码",
          link: "/usage-frame/typescript/typescript-code",
        },
      ],
    },
    {
      text: "小程序",
      items: [
        {
          text: "微信小程序",
          collapsed: true,
          items: [
            {
              text: "基础能力",
              link: "/usage-frame/wechat-mini-program/基础能力",
            },
            {
              text: "自定义组件",
              link: "/usage-frame/wechat-mini-program/自定义组件",
            },
            {
              text: "内置组件",
              link: "/usage-frame/wechat-mini-program/组件",
            },
          ],
        },
        {
          text: "uniapp",
          collapsed: true,
          items: [{ text: "速记", link: "/usage-frame/uniapp/速记" }],
        },
      ],
    },
    {
      text: "react",
      items: [
        { text: "基础知识", link: "/usage-frame/react/react" },
        { text: "高级指引", link: "/usage-frame/react/高级指引" },
        { text: "hooks", link: "/usage-frame/react/hooks" },
        { text: "api", link: "/usage-frame/react/api" },
        { text: "react生态", link: "/usage-frame/react/react生态" },
      ],
    },
    {
      text: "微前端",
      items: [{ text: "qiankun", link: "/usage-frame/qiankun" }],
    },
  ];
}


export function sidebarUsageCodeFrames() {
  return [
    { text: "JavaScript", link: "/usage-code-frames/JavaScript" },
    { text: "CSS", link: "/usage-code-frames/CSS" },
    { text: "SCSS", link: "/usage-code-frames/SCSS" },
    { text: "Vue", link: "/usage-code-frames/Vue" },
  ];
}

export function sidebarUsageArticle() {
  return [
    {
      text: "Vitejs开源项目实践指南",
      link: "usage-article/Vitejs开源项目实践指南",
    },
  ];
}
export function sidebarUsageProject() {
  return [
    { text: "项目版本依赖升级", link: "/usage-project/项目版本升级" },
    {
      text: "项目启动时依赖安装失败问题汇总",
      link: "/usage-project/项目启动安装依赖失败问题汇总",
    },
    {
      text: "项目package.json介绍",
      link: "/usage-project/项目package.json介绍",
    },
    {
      text: "项目gitignore规则解析",
      link: "/usage-project/gitignore规则",
    },
    {
      text: "项目editorconfig规则解析",
      link: "/usage-project/editorconfig",
    },
    { text: "项目npmrc规则解析", link: "/usage-project/npmrc规则" },
    {
      text: "项目git历史大文件删除追踪",
      link: "/usage-project/git历史大文件删除追踪",
    },
    {
      text: "electron-vue依赖升级",
      link: "/usage-project/electron-vue依赖升级",
    },
    {
      text: "报错与分析",
      items: [
        {
          text: "vue-cli项目启动报错汇总",
          link: "/usage-project/项目启动报错汇总-vue-cli",
        },
        {
          text: "vite项目启动报错汇总",
          link: "/usage-project/项目启动报错汇总-vite",
        },
        {
          text: "小程序项目启动报错汇总",
          link: "/usage-project/项目启动报错汇总-小程序",
        },
        {
          text: "其他项目启动报错汇总",
          link: "/usage-project/项目启动报错汇总-其他",
        },
      ],
    },
  ];
}
export function sidebarUsageTool() {
  return [
    { text: "术语解释", link: "/usage-tool/术语解释" },
    { text: "前端工程化实操", link: "/usage-tool/前端工程化实操" },
    { text: "前端开发工具库", link: "/usage-tool/前端开发工具库" },
    {
      text: "JavaScript工具函数",
      link: "/usage-tool/JavaScript工具函数",
    },
    { text: "git", link: "/usage-tool/git操作" },
    { text: "npm", link: "/usage-tool/npm操作" },
    { text: "babel", link: "/usage-tool/babel操作" },
    { text: "webpack", link: "/usage-tool/webpack操作" },
    { text: "http请求", link: "/usage-tool/http请求" },
    { text: "命令行快捷操作", link: "/usage-tool/命令行快捷操作" },
    { text: "不好分类的内容", link: "/usage-tool/不好分类的内容" },

    {
      text: "使用docsify plugin",
      items: [
        {
          text: "使用docsify plugin",
          link: "/usage-tool/usage-docsify-plugin",
        },
      ],
    },
  ];
}
export function sidebarUsageInterview() {
  return [
    {
      text: "速记",
      items: [
        { text: "随心所欲", link: "/usage-interview/quick-look" },
        { text: "零散的记录", link: "/usage-interview/零散的记录" },
        { text: "快速记忆", link: "/usage-interview/z-quick-note" },
      ],
    },
  ];
}
export function sidebarUsageDicts() {
  return [
    { text: "英语单词表", link: "/usage-dicts/dict" },
    { text: "养生", link: "/usage-dicts/养生" },
    { text: "技能提升", link: "/usage-dicts/技能提升" },
  ];
}
export function sidebarUsageConfig() {
  return [
    {
      text: "配置文件",
      items: [
        { text: "vue.config.js", link: "/usage-config/vue.config.js" },
        {
          text: "webpack.config.js",
          link: "/usage-config/webpack.config.js",
        },
        {
          text: "babel.config.js",
          link: "/usage-config/babel.config.js",
        },
        { text: "tsconfig.json", link: "/usage-config/tsconfig.json" },
        { text: "eslintrc.js", link: "/usage-config/eslintrc.js" },
      ],
    },
  ];
}
export function sidebarUsageOther() {
  return [
    {
      text: "其他工作相关",
      items: [
        { text: "前端工具函数", link: "/usage-other/前端工具函数" },
        { text: "vscode技巧", link: "/usage-other/vscode技巧" },
        { text: "前端渲染pdf", link: "/usage-other/前端渲染pdf" },
        { text: "pdfjs本地化部署", link: "/usage-other/pdfjs本地部署" },
        {
          text: "docker打包electron",
          link: "/usage-other/Linux-docker打包electron",
        },
        { text: "git提交脚本", link: "/usage-other/gitCommit" },
        { text: "nginx基础", link: "/usage-tool/nginx基础" },
        { text: "前端缓存", link: "/usage-tool/前端缓存" },
      ],
    },
  ];
}

export function sidebarUsageWorkTool() {
  return [
   
    {
      text: "效率提升工具",
      items: [
        { text: "常用软件及开发包", link: "/usage-work-tool/常用软件及开发包" },
  { text: "在任何地方使用沙拉查词", link: "/usage-work-tool/沙拉查词" },
  { text: "工作技巧", link: "/usage-work-tool/工作技巧" },
      ],
    },
  ];
}
export function sidebarUsageInspiration() {
  return [
    { text: "突发灵感", link: "/usage-inspiration/inspiration" },

    { text: "english", link: "/usage-inspiration/english" },
   
  ];
}
export function sidebarUsageBooks() {
  return [
    { text: "写给大家看的设计书", link: "/usage-books/写给大家看的设计书" },
  { text: "学习力：颠覆职场学习的高效方法", link: "/usage-books/学习力：颠覆职场学习的高效方法" },
    {
      text: "ECMAScript",
      items: [{ text: "01.let和const", link: "/usage-books/ECMAScript入门/01.let和const" },
      { text: "02.变量的解构赋值", link: "/usage-books/ECMAScript入门/02.变量的解构赋值" },
      { text: "03.字符串的扩展", link: "/usage-books/ECMAScript入门/03.字符串的扩展" },
      { text: "04.字符串的扩展方法", link: "/usage-books/ECMAScript入门/04.字符串的扩展方法" },
      { text: "05.正则的扩展", link: "/usage-books/ECMAScript入门/05.正则的扩展" },
      { text: "06.数值的扩展", link: "/usage-books/ECMAScript入门/06.数值的扩展" },
      { text: "07.函数的扩展", link: "/usage-books/ECMAScript入门/07.函数的扩展" },
      { text: "08.数组的扩展", link: "/usage-books/ECMAScript入门/08.数组的扩展" },
      { text: "09.对象的扩展", link: "/usage-books/ECMAScript入门/09.对象的扩展" },
      { text: "10.对象的新增方法", link: "/usage-books/ECMAScript入门/10.对象的新增方法" },
      { text: "11.Symbol", link: "/usage-books/ECMAScript入门/11.Symbol" },
      { text: "12.set和map", link: "/usage-books/ECMAScript入门/12.set和map" },
      { text: "13.Proxy语法", link: "/usage-books/ECMAScript入门/13.Proxy语法" },
      { text: "14.Reflect", link: "/usage-books/ECMAScript入门/14.Reflect" },
      { text: "15.Promise对象", link: "/usage-books/ECMAScript入门/15.Promise对象" },
      { text: "16.Iterator与for循环", link: "/usage-books/ECMAScript入门/16.Iterator与for循环" },
      { text: "17.Generator函数", link: "/usage-books/ECMAScript入门/17.Generator函数" },
      { text: "18.async函数", link: "/usage-books/ECMAScript入门/18.async函数" },
      { text: "19.class语法", link: "/usage-books/ECMAScript入门/19.class语法" },
      { text: "20.Module", link: "/usage-books/ECMAScript入门/20.Module" },],
    },
   
  ];
}
export function sidebarUsageDiaries() {
  return [
    { text: "记录5月29日以后的感想感悟", link: "/usage-diaries/README" },
  ];
}

export function sidebar () {
  return {
    "/usage-frame/": sidebarUsageFrame(),
    "/usage-article/": sidebarUsageArticle(),
    "/usage-project/": sidebarUsageProject(),
    "/usage-tool/": sidebarUsageTool(),
    "/usage-interview/": sidebarUsageInterview(),
    "/usage-dicts/": sidebarUsageDicts(),
    "/usage-code-frames/": sidebarUsageCodeFrames(),
    "/usage-config/": sidebarUsageConfig(),
    "/usage-other/": sidebarUsageOther(),
    "/usage-work-tool/": sidebarUsageWorkTool(),
    "/usage-inspiration/": sidebarUsageInspiration(),
    "/usage-books/": sidebarUsageBooks(),
    "/usage-diaries/": sidebarUsageDiaries(),
  }
}