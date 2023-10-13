import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("../../package.json");

export function nav() {
  return [
    { text: "指南", link: "/usage-frame/README", activeMatch: "/usage-frame/" },
    {
      text: "文章集锦",
      link: "/usage-article/README",
      activeMatch: "/usage-article/",
    },
    {
      text: "项目相关",
      link: "/usage-project/README",
      activeMatch: "/usage-project/",
    },
    {
      text: "工具使用",
      link: "/usage-tool/README",
      activeMatch: "/usage-tool/",
    },
    {
      text: "速记",
      link: "/usage-interview/README",
      activeMatch: "/usage-interview/",
    },
    {
      text: pkg.version,
      items: [
        {
          text: "单词表",
          link: "/usage-dicts/README",
          activeMatch: "/usage-dicts/",
        },
        {
          text: "代码片段",
          link: "/usage-code-frames/README",
          activeMatch: "/usage-code-frames/",
        },
        {
          text: "配置文件",
          link: "/usage-config/README",
          activeMatch: "/usage-config/",
        },
        {
          text: "其他工作相关",
          link: "/usage-other/README",
          activeMatch: "/usage-other/",
        },
        {
          text: "效率提升工具",
          link: "/usage-work-tool/README",
          activeMatch: "/usage-work-tool/",
        },
        {
          text: "突发灵感",
          link: "/usage-inspiration/README",
          activeMatch: "/usage-inspiration/",
        },
        {
          text: "usage-books",
          link: "/usage-books/README",
          activeMatch: "/usage-books/",
        },
        {
          text: "随感",
          link: "/usage-diaries/README",
          activeMatch: "/usage-diaries/",
        },
      ],
    },
  ];
}