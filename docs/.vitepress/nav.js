import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("../../package.json");
import { sidebar } from "./sibar";

function getFirstRoute (menu) {
  return sidebar()[menu][0].link || sidebar()[menu][0].items[0].link || sidebar()[menu][0].items[0].items[0].link
}

export function nav() {
  return [
    { text: "指南", link: getFirstRoute("/usage-frame/"), activeMatch: "/usage-frame/" },
    {
      text: "笔记",
      link: getFirstRoute("/usage-books/"),
      activeMatch: "/usage-books/",
    },
    {
      text: "项目相关",
      link: getFirstRoute("/usage-project/"),
      activeMatch: "/usage-project/",
    },
    {
      text: "效率提升工具",
      link: getFirstRoute("/usage-work-tool/"),
      activeMatch: "/usage-work-tool/",
    },
    {
      text: "速记",
      link: getFirstRoute("/usage-interview/"),
      activeMatch: "/usage-interview/",
    },
    {
      text: "关于我",
      link: "/README",
      activeMatch: "/README",
    },
    {
      text: 'v' + pkg.version,
      items: [
        {
          text: "CHANGELOG",
          link: '/CHANGELOG',
          activeMatch: "/CHANGELOG",
        },
        {
          text: "单词表",
          link: getFirstRoute("/usage-dicts/"),
          activeMatch: "/usage-dicts/",
        },
        {
          text: "突发灵感",
          link: getFirstRoute("/usage-inspiration/"),
          activeMatch: "/usage-inspiration/",
        },
        {
          text: "随感",
          link: getFirstRoute("/usage-diaries/"),
          activeMatch: "/usage-diaries/",
        },
        {
          text: "游戏攻略",
          link: getFirstRoute("/usage-games/"),
          activeMatch: "/usage-games/",
        },
      ],
    },
  ];
}
