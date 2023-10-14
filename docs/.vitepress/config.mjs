import { defineConfig } from "vitepress";
import {
  chineseSearchOptimize,
  pagefindPlugin,
} from "vitepress-plugin-pagefind";
import { nav } from "./nav";
import { sidebar } from "./sibar";


// https://skewb.gitee.io/vitepress/reference/site-config
export default defineConfig({
  base: "/latest-blogs/",
  title: "璎耜",
  description: "Vite 和 Vue 强力驱动的静态网站生成器",
  head: [["link", { rel: "icon", href: "/latest-blogs/icon.svg" }]],
  ignoreDeadLinks: true,
  lastUpdated: true,
  themeConfig: {
    // https://skewb.gitee.io/vitepress/reference/default-theme-config
    logo: "/icon.svg",
    lastUpdated: {
      text: "上次更新",
    },
    outline: [1, 3],
    outlineTitle: "本页目录",
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    darkModeSwitchLabel: "外观",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "返回顶部",
    externalLinkIcon: true,
    nav: nav(),
    sidebar: sidebar(),
    socialLinks: [
      { icon: "github", link: "https://github.com/simply-none/latest-blogs/" },
    ],
    footer: {
      copyright: "内容整理权归解璎所有 Copyright © 2022-present",
    },
    search: {
      provider: 'algolia',
      options: {
        appId: 'N4M009QH1O',
        apiKey: '62038b1e84670a59365b0dfc75595345',
        indexName: 'blogs',
        maxResultsPerGroup: 100,
        locales: {
          'zh-cn': {
            searchParameters: {
              page: 100,
              hitsPerpage: 100,
            }
          },
          'zh': {
            searchParameters: {
              page: 100,
              hitsPerpage: 100,
            }
          },
          'en-us': {
            searchParameters: {
              page: 100,
              hitsPerpage: 100,
            }
          },
          'en': {
            searchParameters: {
              page: 100,
              hitsPerpage: 100,
            }
          }
        },
        placeholder: '搜索文档',
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            searchBox: {
              resetButtonTitle: '清除查询条件',
              resetButtonAriaLabel: '清除查询条件',
              cancelButtonText: '取消',
              cancelButtonAriaLabel: '取消'
            },
            startScreen: {
              recentSearchesTitle: '搜索历史',
              noRecentSearchesText: '没有搜索历史',
              saveRecentSearchButtonTitle: '保存至搜索历史',
              removeRecentSearchButtonTitle: '从搜索历史中移除',
              favoriteSearchesTitle: '收藏',
              removeFavoriteSearchButtonTitle: '从收藏中移除'
            },
            errorScreen: {
              titleText: '无法获取结果',
              helpText: '你可能需要检查你的网络连接'
            },
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
              searchByText: '搜索提供者'
            },
            noResultsScreen: {
              noResultsText: '无法找到相关结果',
              suggestedQueryText: '你可以尝试查询',
              reportMissingResultsText: '你认为该查询应该有结果？',
              reportMissingResultsLinkText: '点击反馈'
            }
          }
        },
      }
    }
  },
  lang: "zh-cn",
  vite: {
    esbuild: {
      // exclude: '@vue/reactivity'
    },
    plugins: [
      // pagefindPlugin({
      //   btnPlaceholder: "搜索",
      //   placeholder: "搜索文档",
      //   emptyText: "空空如也",
      //   heading: "共: {{searchResult}} 条结果",
      //   customSearchQuery(input) {
      //     // 将搜索的每个中文单字两侧加上空格
      //     return input
      //       .replace(/[\u4e00-\u9fa5]/g, " $& ")
      //       .replace(/\s+/g, " ")
      //       .trim();
      //   },
      // }),
    ],
  },
});

