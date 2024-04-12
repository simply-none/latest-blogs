export function sidebarUsageFrame() {
  return [
    {
      text: "基础",
      items: [
        {
          text: "技术栈工具链",
          link: "/usage-frame/基础/技术栈工具链",
        },
        {
          text: "http知识点",
          link: "/usage-frame/基础/http知识点汇总",
        },
        {
          text: "electron",
          link: "/usage-frame/基础/electron知识",
        },
        {
          text: "JavaScript",
          link: "/usage-frame/基础/JavaScript知识点",
        },
        {
          text: "CSS",
          link: "/usage-frame/基础/CSS知识点",
        },
        {
          text: "css处理器",
          link: "/usage-frame/基础/CSS处理器",
        },
      ],
    },
    {
      text: "Vue",
      items: [
        {
          text: "Vue2",
          link: "/usage-frame/vue/Vue2知识点",
        },
        {
          text: "ElementUI",
          link: "/usage-frame/vue/elementui知识点",
        },
        {
          text: "vue3保点",
          link: "/usage-frame/vue/vue3保点",
        },
        {
          text: "vue3-API",
          link: "/usage-frame/vue/vue3-API",
        },
        {
          text: "vue实战技巧",
          link: "/usage-frame/vue/vue实战技巧",
        },
        {
          text: "pinia",
          link: "/usage-frame/vue/Pinia",
        },
        {
          text: "vite",
          link: "/usage-frame/vue/vite",
        },
        {
          text: "vue-router迁移指南",
          link: "/usage-frame/vue/vue-router迁移指南",
        },
      ],
    },
    {
      text: "nodejs",
      items: [
        {
          text: "NodeJs知识点",
          link: "/usage-frame/nodejs/nodejs知识点",
        },
      ],
    },
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
              link: "/usage-frame/小程序/wechat-mini-program/基础能力",
            },
            {
              text: "自定义组件",
              link: "/usage-frame/小程序/wechat-mini-program/自定义组件",
            },
            {
              text: "内置组件",
              link: "/usage-frame/小程序/wechat-mini-program/组件",
            },
          ],
        },
        {
          text: "uniapp",
          collapsed: true,
          items: [
            {
              text: "速记",
              link: "/usage-frame/小程序/uniapp/速记",
            },
            {
              text: "nvue开发指导",
              link: "/usage-frame/小程序/uniapp/nvue开发指导",
            },
          ],
        },
      ],
    },
    {
      text: "react",
      items: [
        {
          text: "基础知识",
          link: "/usage-frame/react/react",
        },
        {
          text: "高级指引",
          link: "/usage-frame/react/高级指引",
        },
        {
          text: "hooks",
          link: "/usage-frame/react/hooks",
        },
        {
          text: "api",
          link: "/usage-frame/react/api",
        },
        {
          text: "react生态",
          link: "/usage-frame/react/react生态",
        },
        {
          text: 'react@18.2.0',
          link: '/usage-frame/react/react@18.2.0'
        },
        {
          text: 'react@18.2.0文档',
          link: '/usage-frame/react/react@18.2.0文档'
        },
        {
          text: 'react-dom@18.2.0',
          link: '/usage-frame/react/react-dom@18.2.0'
        },
        {
          text: 'react-router@6',
          link: '/usage-frame/react/react-router@6'
        },
        {
          text: "nextjs",
          link: "/usage-frame/react/nextjs",
        },
        {
          text: 'react状态管理',
          collapsed: true,
          items: [
            {
              text: 'react-toolkit@2',
              link: "/usage-frame/react/react-toolkit@2"
            },
            {
              text: 'zustand@4',
              link: '/usage-frame/react/zustand@4'
            }
          ]
        }
      ],
    },
    {
      text: "前端综合",
      items: [
        {
          text: "微前端",
          items: [
            {
              text: "qiankun",
              link: "/usage-frame/前端综合/微前端/qiankun",
            },
          ],
        },
      ],
    },
    {
      text: "工具链",
      items: [
        {
          text: "前端业务工具库",
          link: "/usage-frame/工具链/前端开发工具库",
        },
        {
          text: "git",
          link: "/usage-frame/工具链/git操作",
        },
        {
          text: "npm",
          link: "/usage-frame/工具链/npm操作",
        },
        {
          text: "babel",
          link: "/usage-frame/工具链/babel操作",
        },
        {
          text: "webpack",
          link: "/usage-frame/工具链/webpack操作",
        },
        {
          text: "http请求",
          link: "/usage-frame/工具链/http请求",
        },
      ],
    },
  ];
}

export function sidebarUsageProject() {
  return [
    {
      text: "配置文件",
      items: [
        {
          text: "项目package.json介绍",
          link: "/usage-project/配置文件/项目package.json介绍",
        },
        {
          text: "项目gitignore规则解析",
          link: "/usage-project/配置文件/gitignore规则",
        },
        {
          text: "项目editorconfig规则解析",
          link: "/usage-project/配置文件/editorconfig",
        },
        {
          text: "项目npmrc规则解析",
          link: "/usage-project/配置文件/npmrc规则",
        },
        {
          text: "eslintrc.js",
          link: "/usage-project/配置文件/eslintrc.js",
        },
        {
          text: "vue.config.js",
          link: "/usage-project/配置文件/vue.config.js",
        },
        {
          text: "webpack.config.js",
          link: "/usage-project/配置文件/webpack.config.js",
        },
        {
          text: "babel.config.js",
          link: "/usage-project/配置文件/babel.config.js",
        },
        {
          text: "tsconfig.json",
          link: "/usage-project/配置文件/tsconfig.json",
        },
      ],
    },
    {
      text: "项目实践",
      items: [
        {
          text: "✅工作注意事项【谨记】",
          link: "/usage-project/项目实践/重要的工作共识",
        },
        {
          text: "项目版本依赖升级",
          link: "/usage-project/项目实践/项目版本升级",
        },
        {
          text: "项目启动时依赖安装失败问题汇总",
          link: "/usage-project/项目实践/项目启动安装依赖失败问题汇总",
        },

        {
          text: "项目git历史大文件删除追踪",
          link: "/usage-project/项目实践/git历史大文件删除追踪",
        },
        {
          text: "electron-vue依赖升级",
          link: "/usage-project/项目实践/electron-vue依赖升级",
        },
        {
          text: "术语解释",
          link: "/usage-project/项目实践/术语解释",
        },
        {
          text: "前端工程化实操",
          link: "/usage-project/项目实践/前端工程化实操",
        },
        {
          text: "前端渲染pdf",
          link: "/usage-project/项目实践/前端渲染pdf",
        },
        {
          text: "pdfjs本地化部署",
          link: "/usage-project/项目实践/pdfjs本地部署",
        },
        {
          text: "docker打包electron",
          link: "/usage-project/项目实践/Linux-docker打包electron",
        },
        {
          text: "git提交脚本",
          link: "/usage-project/项目实践/gitCommit",
        },
        {
          text: "nginx基础",
          link: "/usage-project/项目实践/nginx基础",
        },
        {
          text: "前端缓存",
          link: "/usage-project/项目实践/前端缓存",
        },
        {
          text: "如何从网页打开一个应用",
          link: "/usage-project/项目实践/从网页打开一个应用",
        },
      ],
    },

    {
      text: "报错与分析",
      items: [
        {
          text: "vue-cli项目启动报错汇总",
          link: "/usage-project/报错与分析/项目启动报错汇总-vue-cli",
        },
        {
          text: "vite项目启动报错汇总",
          link: "/usage-project/报错与分析/项目启动报错汇总-vite",
        },
        {
          text: "小程序项目启动报错汇总",
          link: "/usage-project/报错与分析/项目启动报错汇总-小程序",
        },
        {
          text: "其他项目启动报错汇总",
          link: "/usage-project/报错与分析/项目启动报错汇总-其他",
        },
        {
          text: "react项目启动报错汇总",
          link: "/usage-project/报错与分析/项目启动报错汇总-react",
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
        {
          text: '工作梳理',
          link: '/usage-interview/工作梳理',
        },
        {
          text: "手册",
          collapsed: true,
          // link: "/usage-interview/quick-look",
          items: [
            {
              text: "html",
              link: "/usage-interview/速记手册/html",
            },
            {
              text: "css",
              link: "/usage-interview/速记手册/css",
            },
            {
              text: "javascript",
              link: "/usage-interview/速记手册/javascript",
            },
            {
              text: "vue",
              link: "/usage-interview/速记手册/vue",
            },
            {
              text: "前端综合",
              link: "/usage-interview/速记手册/前端综合",
            },
          ],
        },
        {
          text: "短笔记",
          link: "/usage-interview/short-note",
        },
        {
          text: "零散的记录",
          link: "/usage-interview/零散的记录",
        },
        {
          text: "快速记忆",
          link: "/usage-interview/z-quick-note",
        },
        {
          text: "微前端需求解析",
          link: "/usage-interview/microapp",
        },
        {
          text: "暂记内容",
          link: "/usage-interview/video.download",
        },
      ],
    },
  ];
}
export function sidebarUsageDicts() {
  return [
    {
      text: "英语单词表",
      link: "/usage-dicts/dict",
    },
    {
      text: "english",
      link: "/usage-dicts/english",
    },

    {
      text: "养生",
      link: "/usage-dicts/养生",
    },
  ];
}

export function sidebarUsageWorkTool() {
  return [
    {
      text: "效率提升工具",
      items: [
        {
          text: "常用软件及开发包",
          link: "/usage-work-tool/效率提升工具/常用软件及开发包",
        },
        {
          text: "在任何地方使用沙拉查词",
          link: "/usage-work-tool/效率提升工具/沙拉查词",
        },
        {
          text: "工作技巧",
          link: "/usage-work-tool/效率提升工具/工作技巧",
        },
        {
          text: "技能提升",
          link: "/usage-work-tool/效率提升工具/技能提升",
        },
        {
          text: "前端工具函数",
          link: "/usage-work-tool/效率提升工具/前端工具函数",
        },
        {
          text: "vscode技巧",
          link: "/usage-work-tool/效率提升工具/vscode技巧",
        },
        {
          text: "JavaScript工具函数",
          link: "/usage-work-tool/效率提升工具/JavaScript工具函数",
        },

        {
          text: "命令行快捷操作",
          link: "/usage-work-tool/效率提升工具/命令行快捷操作",
        },
        {
          text: "不好分类的内容",
          link: "/usage-work-tool/效率提升工具/不好分类的内容",
        },
        {
          text: "阮一峰工具集",
          link: "/usage-work-tool/效率提升工具/阮一峰工具集",
        },
      ],
    },
    {
      text: "其他工具",
      items: [
        {
          text: "使用docsify plugin",
          link: "/usage-work-tool/其他工具/usage-docsify-plugin",
        },
        {
          text: "使用viteprss",
          link: "/usage-work-tool/其他工具/usage-vitepress",
        },
      ],
    },
  ];
}
export function sidebarUsageInspiration() {
  return [
    {
      text: "突发灵感",
      link: "/usage-inspiration/inspiration",
    },
  ];
}
export function sidebarUsageBooks() {
  return [
    {
      text: "笔记",
      items: [
        {
          text: "写给大家看的设计书",
          link: "/usage-books/笔记/写给大家看的设计书",
        },
        {
          text: "学习力：颠覆职场学习的高效方法",
          link: "/usage-books/笔记/学习力：颠覆职场学习的高效方法",
        },
        {
          text: "认知觉醒：伴随一生的学习方法论",
          link: "/usage-books/笔记/认知觉醒：伴随一生的学习方法论",
        },
        {
          text: "认知觉醒：开启自我改变的原动力",
          link: "/usage-books/笔记/认知觉醒：开启自我改变的原动力",
        },
        {
          text: "被讨厌的勇气：“自我启发之父”阿德勒的哲学课",
          link: "/usage-books/笔记/被讨厌的勇气：“自我启发之父”阿德勒的哲学课",
        },
        {
          text: "基础设施即代码：云服务器管理",
          link: "/usage-books/笔记/基础设施即代码：云服务器管理",
        },
        {
          text: "ECMAScript入门",
          collapsed: true,
          items: [
            {
              text: "01.let和const",
              link: "/usage-books/笔记/ECMAScript入门/01.let和const",
            },
            {
              text: "02.变量的解构赋值",
              link: "/usage-books/笔记/ECMAScript入门/02.变量的解构赋值",
            },
            {
              text: "03.字符串的扩展",
              link: "/usage-books/笔记/ECMAScript入门/03.字符串的扩展",
            },
            {
              text: "04.字符串的扩展方法",
              link: "/usage-books/笔记/ECMAScript入门/04.字符串的扩展方法",
            },
            {
              text: "05.正则的扩展",
              link: "/usage-books/笔记/ECMAScript入门/05.正则的扩展",
            },
            {
              text: "06.数值的扩展",
              link: "/usage-books/笔记/ECMAScript入门/06.数值的扩展",
            },
            {
              text: "07.函数的扩展",
              link: "/usage-books/笔记/ECMAScript入门/07.函数的扩展",
            },
            {
              text: "08.数组的扩展",
              link: "/usage-books/笔记/ECMAScript入门/08.数组的扩展",
            },
            {
              text: "09.对象的扩展",
              link: "/usage-books/笔记/ECMAScript入门/09.对象的扩展",
            },
            {
              text: "10.对象的新增方法",
              link: "/usage-books/笔记/ECMAScript入门/10.对象的新增方法",
            },
            {
              text: "11.Symbol",
              link: "/usage-books/笔记/ECMAScript入门/11.Symbol",
            },
            {
              text: "12.set和map",
              link: "/usage-books/笔记/ECMAScript入门/12.set和map",
            },
            {
              text: "13.Proxy语法",
              link: "/usage-books/笔记/ECMAScript入门/13.Proxy语法",
            },
            {
              text: "14.Reflect",
              link: "/usage-books/笔记/ECMAScript入门/14.Reflect",
            },
            {
              text: "15.Promise对象",
              link: "/usage-books/笔记/ECMAScript入门/15.Promise对象",
            },
            {
              text: "16.Iterator与for循环",
              link: "/usage-books/笔记/ECMAScript入门/16.Iterator与for循环",
            },
            {
              text: "17.Generator函数",
              link: "/usage-books/笔记/ECMAScript入门/17.Generator函数",
            },
            {
              text: "18.async函数",
              link: "/usage-books/笔记/ECMAScript入门/18.async函数",
            },
            {
              text: "19.class语法",
              link: "/usage-books/笔记/ECMAScript入门/19.class语法",
            },
            {
              text: "20.Module",
              link: "/usage-books/笔记/ECMAScript入门/20.Module",
            },
          ],
        },
        {
          text: '英语学习',
          items: [
            {
              text: '英语语法新思维 基础版（套装共3册）张满胜',
              link: '/usage-books/笔记/english/英语语法新思维-基础版（套装共3册）张满胜',
            },
          ],
        },
      ],
    },
    {
      text: "文章",
      items: [
        {
          text: "Vitejs开源项目实践指南",
          link: "/usage-books/文章/Vitejs开源项目实践指南",
        },
      ],
    },
  ];
}
export function sidebarUsageDiaries() {
  return [
    {
      text: "记录5月29日以后的感想感悟",
      link: "/usage-diaries/感悟",
    },
    {
      text: "resume",
      link: "/usage-diaries/resume",
    },
  ];
}
export function sidebarUsageGames() {
  return [
    {
      text: "游戏攻略",
      items: [
        {
          text: "中世纪王朝",
          link: "/usage-games/中世纪王朝",
        }
      ]
    },
  ];
}

export function sidebar() {
  return {
    "/usage-frame/": sidebarUsageFrame(),
    "/usage-project/": sidebarUsageProject(),
    "/usage-interview/": sidebarUsageInterview(),
    "/usage-dicts/": sidebarUsageDicts(),
    "/usage-work-tool/": sidebarUsageWorkTool(),
    "/usage-inspiration/": sidebarUsageInspiration(),
    "/usage-books/": sidebarUsageBooks(),
    "/usage-games/": sidebarUsageGames(),
    "/usage-diaries/": sidebarUsageDiaries(),
  };
}
