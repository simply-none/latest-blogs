/*
 * @Author: 简隐 jousindea@163.com
 * @Date: 2024-03-31 19:15:45
 * @LastEditors: 简隐 jousindea@163.com
 * @LastEditTime: 2024-03-31 23:34:05
 * @FilePath: \latest-blogs\log2.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 简隐, All Rights Reserved. 
 */
// const gitlog = require("gitlog").default;
import gitlog from 'gitlog'
import { computed } from 'vue'


const VirtualModuleID = 'virtual:git-changelog'
const ResolvedVirtualModuleId = `${VirtualModuleID}`

export default function GitChangelogMarkdownSection(options) {

  let root = ''
  let commits = {}
  

  return {
    name: '@jadeq/vitefdsfsfpress-plugin-markdown-changelog',
    buildStart () {
      commits = gitlog.default({
        repo: './',
        branch: 'master',
        number: 1000000,
        fields: ["hash", "abbrevHash", "subject", "authorName", "authorDate", "authorDateRel", "tag"],
      })
    },
    resolveId(id) {
      if (id === ResolvedVirtualModuleId) {
        return ResolvedVirtualModuleId
      }
    },
    load(id) {
      if (id !== ResolvedVirtualModuleId)
        return null
console.log(id, arguments)
      const changelogData = {
        commits,
      }

      return `export default ${JSON.stringify(changelogData)}`
    },
  }
}



