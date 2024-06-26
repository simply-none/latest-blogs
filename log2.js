/*
 * @Author: 简隐 jousindea@163.com
 * @Date: 2024-03-31 19:15:45
 * @LastEditors: 简隐 jousindea@163.com
 * @LastEditTime: 2024-04-16 22:28:34
 * @FilePath: \latest-blogs\log2.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 简隐, All Rights Reserved. 
 */
// const gitlog = require("gitlog").default;
import gitlog from 'gitlog'
import { computed } from 'vue'
import moment from 'moment/moment'


const VirtualModuleID = 'virtual:git-changelog'
const ResolvedVirtualModuleId = `${VirtualModuleID}`

export default function GitChangelogMarkdownSection(options = {}) {
  let commits = {}

  return {
    name: '@jadeq/vitefdsfsfpress-plugin-markdown-changelog',
    buildStart () {
      commits = gitlog.default({
        // repo: './',
        branch: 'master',
        number: 1000000,
        includeMergeCommitFiles: true,
        fields: ["hash", "abbrevHash", "subject", "authorName", "authorDate", "committerName", "committerDate", "authorDateRel", "tag", 'rawBody'],
        ...options
      })
      commits = generateFileCommits(commits)
    },
    resolveId(id) {
      if (id === ResolvedVirtualModuleId) {
        return ResolvedVirtualModuleId
      }
    },
    load(id) {
      if (id !== ResolvedVirtualModuleId)
        return null
      const changelogData = {
        commits,
      }

      return `export default ${JSON.stringify(changelogData)}`
    },
  }
}

function commitSortByDate (commits) {
  return commits.sort(function (a, b) {
    return new Date(a.authorDate) - new Date(b.authorDate) < 0 ? 1 : -1;
  });
}

function toChinese(str) {
  const matches = str.match(/(\\\d{3}){3}/g);
  if (matches) matches.forEach(match => {
      let decoded = '';
      const splits = match.split('\\');
      splits.forEach(code => !code || (decoded += '%' + parseInt(code, 8).toString(16)));
      const cChar = decodeURI(decoded);
      str = str.replace(match, cChar);
  });
  // 删除首尾的双引号
  str = str.replace(/^"|"$/g, '')
  return str;
}

function generateFileCommits (commits) {
  return commits.reduce((pre, cur) => {
    cur.files.map((originFile) => {
      let file = toChinese(originFile)
      if (!file.startsWith("docs") || !file.endsWith(".md")) {
        return false;
      }

      if (!pre[file]) {
        pre[file] = [];
      }
      delete cur.files;
      delete cur.status;
      cur.committerDate = moment(new Date(cur.committerDate)).format('YYYY-MM-DD HH:mm:ss')
      pre[file].push(cur);
      pre[file] = commitSortByDate(pre[file])
      
    });

    return pre;
  }, {});
  
}

