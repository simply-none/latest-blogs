/*
 * @Author: 简隐 jousindea@163.com
 * @Date: 2024-03-31 19:15:45
 * @LastEditors: 简隐 jousindea@163.com
 * @LastEditTime: 2024-03-31 23:08:41
 * @FilePath: \latest-blogs\log.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 简隐, All Rights Reserved. 
 */
// const gitlog = require("gitlog").default;
import gitlog from 'gitlog'

const options = {
  repo: '/',
  number: 1000000,
  branch: 'master',
  fields: ["hash", "abbrevHash", "subject", "authorName", "authorDate", "authorDateRel", "tag"],
  execOptions: { maxBuffer: 1000 * 1024 * 10 },
};

export default function GitChangelogMarkdownSection(options) {

  let root = ''

  return {
    name: '@jadeq/vitepress-plugin-markdown-changelog',
    // May set to 'pre' since end user may use vitepress wrapped vite plugin to
    // specify the plugins, which may cause this plugin to be executed after
    // vitepress or the other markdown processing plugins.
    enforce: 'pre',
    configResolved(config) {
      root = config.root ?? ''
    },
    transform(code, id) {

      if (!id.endsWith('.md'))
        return code
      let path = id.split('docs')

      const thislog = gitlog.default({
        repo: './',
        branch: 'master',
        number: 1000000,
        file: id,
        fields: ["hash", "abbrevHash", "subject", "authorName", "authorDate", "authorDateRel", "tag"],
      })
      // console.log(thislog, path, 'arguments')

      return test(code, id, '测试标题')
    },
  }
}

function test(code, thislog, title) {
  return `${code}

## ${title}

<CA id="thislog">
</CA>
`
}
