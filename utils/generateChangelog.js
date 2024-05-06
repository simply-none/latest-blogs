const gitlog = require("gitlog").default;
const pkg = require('../package.json')
const fs = require('fs')
const generateVersion = require('./utils').generateVersion

const repo = pkg.repository.url.replace('.git', '')

const options = {
  repo: './',
  number: 1000000,
  branch: 'master',
  fields: ["hash", "abbrevHash", "subject", "authorName", "authorDate", "authorDateRel", "tag"],
  execOptions: { maxBuffer: 1000 * 1024 * 10 },
};

// Synchronous
const commits = gitlog(options);

let type = ['others']
let start = false
let count = 0
let nc = 0
let s = 0
let firstCommit = {}
let currentTag = {}

// type标题
let typeSort = [
  { "type": "fix", "section": "Bug Fixes", "hidden": false },
  { "type": "feat", "section": "Features", "hidden": false },
  { "type": "improvement", "section": "Feature Improvements", "hidden": false },
  { "type": "perf", "section": "Performance Improvements", "hidden": false },
  { "type": "docs", "section": "Docs", "hidden": false },
  { "type": "refactor", "section": "Code Refactoring", "hidden": false },

  { "type": "chore", "section": "Others", "hidden": false },
  { "type": "other", "section": "Others", "hidden": false },
  { "type": "revert", "section": "Reverts", "hidden": false },
  { "type": "style", "section": "Styling", "hidden": false },
  { "type": "config", "section": "Code Refactoring", "hidden": false },
  { "type": "test", "section": "Tests", "hidden": false },
  { "type": "build", "section": "Build System", "hidden": false },
  { "type": "ci", "section": "CI", "hidden": false }
]

let commitObj = {
}

for (let i = 0; i < commits.length; i++) {
  let commit = commits[i]
  firstCommit = commit
  if (commit.tag.includes('tag:') || commit.tag.includes('HEAD')) {
    start = true
    if (!s) {
      s = i
    }
    // 对tag进行分类
    let tag = commit.tag.split(',').find(name => {
      return name.includes('tag:') || name.includes('HEAD')
    })
    if (tag.includes('HEAD')) {
      tag = generateVersion(pkg.version)
    }
    tag = tag.replace('tag:', '').replace('v', '').trim()
    let tagSort = tag.split('.').map(t => t.padStart(3, '0')).join('.')
    currentTag = tagSort

    if (!commitObj[currentTag]) {
      commitObj[currentTag] = {
        info: {
          ...commit,
          tagNum: tag
        },
        items: {}
      }
    }
  }

  if (!start) {
    currentTag = 'current'
    // 从最近的一个tag开始记录
    // if(!commitObj['current']) {
    //   commitObj['current'] = {
    //     info: {
    //       ...commit,
    //       tagNum: 'current'
    //     },
    //     items: {}
    //   }
    // }
    continue;
  }

  let commitCtx = ''

  const firstLine = commit.subject.match(/^(.*?)(\((.*?)\))?(\:)(.*)$/)
  firstLine && (count = count + 1)
  !firstLine && (nc = nc + 1)

  // 匹配git规范提交的commit
  if (firstLine) {
    let curType = firstLine[1].replace(/[^a-zA-Z]/g, '')

    if (firstLine[1].includes('Merge branch') || commit.subject.includes('chore(release):')) {
      // 忽略
      if (!commitObj[currentTag].items.other) {
        commitObj[currentTag].items.other = []
      }

      let authorDate = commit.authorDate.split(' ').slice(0, 2).join(' ')
      let commitCtx = `* ${authorDate} ${commit.subject} ([${commit.abbrevHash}](${repo + '/commit/' + commit.hash}))`
      // merge的不展示
      commitObj[currentTag].items.other.push({
        line: commitCtx,
        show: false,
        commit
      })
    } else {

      if (curType) {
        // 干正事
        let subjectTitle = firstLine[3] ? `**${firstLine[3] + ':'}**` : ''

        let isMeaningCommit = !!firstLine[5].trim() && firstLine[5].trim().length >= 2 && firstLine[5] !== null && firstLine[5].trim() !== 'null'

        if (isMeaningCommit) {
          let authorDate = commit.authorDate.split(' ').slice(0, 2).join(' ')
          commitCtx = `* ${authorDate} ${subjectTitle} ${firstLine[5].trim()} ([${commit.abbrevHash}](${repo + '/commit/' + commit.hash}))`

          if (!commitObj[currentTag].items[curType]) {
            commitObj[currentTag].items[curType] = []
          }
          commitObj[currentTag].items[curType].push({
            line: commitCtx,
            commit
          })
        } else {
          // 没有subject提交注释的commit
          if (!commitObj[currentTag].items.other) {
            commitObj[currentTag].items.other = []
          }
          let authorDate = commit.authorDate.split(' ').slice(0, 2).join(' ')
          let commitCtx = `* ${authorDate} ${commit.subject} ([${commit.abbrevHash}](${repo + '/commit/' + commit.hash}))`
          // 有主题，但是没具体内容的，不保存到changelog
          commitObj[currentTag].items.other.push({
            line: commitCtx,
            show: false,
            commit
          })
        }
      } else {
        // 这里是一些非英文主题的subject type
        if (!commitObj[currentTag].items.other) {
          commitObj[currentTag].items.other = []
        }
        let authorDate = commit.authorDate.split(' ').slice(0, 2).join(' ')
        let commitCtx = `* ${authorDate} ${commit.subject} ([${commit.abbrevHash}](${repo + '/commit/' + commit.hash}))`
        commitObj[currentTag].items.other.push({
          line: commitCtx,
          commit
        })
      }

      if (!type.includes(curType)) {
        if (curType) {
          type.push(curType)
        }


      }
    }

  } else {
    // 不规范的git提交
    if (!commitObj[currentTag].items.other) {
      commitObj[currentTag].items.other = []
    }
    let authorDate = commit.authorDate.split(' ').slice(0, 2).join(' ')

    let commitSubject = commit.subject.replace(/'|"|；/g, '')

    let isMeaningCommit = !!commitSubject.trim() && commitSubject.trim().length >= 2 && commitSubject !== null && commitSubject.trim() !== 'null'
    let commitCtx = `* ${authorDate} ${commitSubject} ([${commit.abbrevHash}](${repo + '/commit/' + commit.hash}))`
    commitObj[currentTag].items.other.push({
      line: commitCtx,
      show: isMeaningCommit,
      commit
    })

  }
}

// 计算commit次数
const a = Object.keys(commitObj).reduce((pre, cur) => {
  let b = Object.keys(commitObj[cur].items).reduce((p, c) => {
    return {
      ...p,
      total: p.total + commitObj[cur].items[c].length,
      all: commits.length - s,
      [cur]: commitObj[cur].items[c].length
    }
  }, {
    total: 0
  })


  return {
    total: pre.total + b.total
  }
}, { total: 0 })

let tagArr = Object.keys(commitObj).sort(function (a, b) {
  return a < b ? 1 : -1
})

// 开始生成changelog

let tagArrLine = ''

tagArr.forEach((tag, index) => {
  let curTagObj = commitObj[tag]

  let tagTitle = ''
  let authorDate = curTagObj.info.authorDate.split(' ').slice(0, 1).join(' ')
  if (tag === 'current') {
    tagTitle = `## [${curTagObj.info.tagNum}](${repo}/compare/v${commitObj[tagArr[index + 1]].info.abbrevHash}...v${curTagObj.info.abbrevHash}) (${authorDate})\n\n`
  } else if (index === tagArr.length - 1) {
    tagTitle = `## [${curTagObj.info.tagNum}](${repo}/compare/v${firstCommit.abbrevHash}...v${curTagObj.info.abbrevHash}) (${authorDate})\n\n`
  } else {
    tagTitle = `## [${curTagObj.info.tagNum}](${repo}/compare/v${commitObj[tagArr[index + 1]].info.tagNum}...v${curTagObj.info.tagNum}) (${authorDate})\n\n`

  }

  let typeItems = {}

  typeSort.forEach(typeItem => {
    let typeTitle = `### ${typeItem.section}\n\n`

    let curTagTypeObj = curTagObj.items[typeItem.type]

    if (!curTagTypeObj || curTagTypeObj.length === 0 ) {
      return false
    }

    let isAllhide = curTagTypeObj.every(item => item.show === false)

    if (isAllhide) {
      return false
    }

    let tItems = curTagTypeObj.sort(function (a, b) {
      return a.line < b.line ? 1 : -1
    })
    let tItemsLine = ''

    if (tItems) {
      tItemsLine = tItems.reduce((pre, cur) => {
        if (cur.show === false) {
          return pre
        }
        return pre + cur.line + '\n'
      }, '')
    }

    if (!typeItems[typeTitle]) {
      typeItems[typeTitle] = []
    }
    typeItems[typeTitle].push(tItemsLine)

  })

  let typeItemsLine = Object.keys(typeItems).reduce((pre, cur) => {
    return pre + cur + typeItems[cur] + '\n'
  }, '')

  tagArrLine = tagArrLine + tagTitle + typeItemsLine



})

tagArrLine = `# Changelog\n\n` + `本文档通过规范的git commit，结合gitlog npm包生成\n\n` + tagArrLine

tagArrLine = tagArrLine.replace(/\n*$/, '\n')

fs.writeFileSync('./docs/CHANGELOG.md', (tagArrLine), {
  flag: 'w'
})

// fs.writeFileSync('zzz.json', JSON.stringify(commitObj), {
//   flag: 'w'
// }, (err) => {
//   if (err) {
//     console.error(err)
//   }
// })

