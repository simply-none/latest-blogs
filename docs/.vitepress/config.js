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
  head: [["link", { rel: "icon", href: "/vitepress/logo.png" }]],
  ignoreDeadLinks: true,
  lastUpdated: true,
  themeConfig: {
    // https://skewb.gitee.io/vitepress/reference/default-theme-config
    logo: "/logo.png",
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
    nav: nav(),
    sidebar: sidebar(),
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
    footer: {
      copyright: "内容整理权归解璎所有 Copyright © 2022-present",
    },
  },
  lang: "zh-cn",
  vite: {
    plugins: [
      pagefindPlugin({
        btnPlaceholder: "搜索",
        placeholder: "搜索文档",
        emptyText: "空空如也",
        heading: "共: {{searchResult}} 条结果",
        customSearchQuery(input) {
          // 将搜索的每个中文单字两侧加上空格
          return input
            .replace(/[\u4e00-\u9fa5]/g, " $& ")
            .replace(/\s+/g, " ")
            .trim();
        },
      }),
    ],
  },
});

