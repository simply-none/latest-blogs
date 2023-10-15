import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("../../package.json");

export function nav() {
  return [
    { text: "指南", link: "/usage-frame/README", activeMatch: "/usage-frame/" },
    {
      text: "笔记",
      link: "/usage-books/README",
      activeMatch: "/usage-books/",
    },
    {
      text: "项目相关",
      link: "/usage-project/README",
      activeMatch: "/usage-project/",
    },
    {
      text: "效率提升工具",
      link: "/usage-work-tool/README",
      activeMatch: "/usage-work-tool/",
    },
    {
      text: "速记",
      link: "/usage-interview/README",
      activeMatch: "/usage-interview/",
    },
    {
      text: 'v' + pkg.version,
      items: [
        {
          text: "单词表",
          link: "/usage-dicts/README",
          activeMatch: "/usage-dicts/",
        },
        {
          text: "突发灵感",
          link: "/usage-inspiration/README",
          activeMatch: "/usage-inspiration/",
        },
        {
          text: "随感",
          link: "/usage-diaries/感悟",
          activeMatch: "/usage-diaries/",
        },
      ],
    },
  ];
}
