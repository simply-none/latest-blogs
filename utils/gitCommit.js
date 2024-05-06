const shell = require('shelljs')
const pkg = require('../package.json')
const generateVersion = require("./utils").generateVersion
const updatedVersion = require("./updatedVersion").updatedVersion

// 先获取下个 版本号
const nextVersion = generateVersion(pkg.version)

// 更新项目的版本号
updatedVersion(pkg.version)

// 提交代码
let gitAddMsg = shell.exec('git add .')
if (gitAddMsg.code !== 0) {
  console.error(gitAddMsg.stderr)
}

let gitCommitMsg = shell.exec(`git commit -m "chore(release): ${nextVersion}"`)
if (gitCommitMsg.code !== 0) {
  console.error(gitCommitMsg.stderr)
}

// 添加git tag
let gitTagMsg = shell.exec(`git tag ${'v' + nextVersion}`)
if (gitTagMsg.code !== 0) {
  console.error(gitTagMsg.stderr)
}

// 推送到远程仓库
let gitPushMsg = shell.exec('git push --tags origin master')
if (gitPushMsg.code !== 0) {
  console.error(gitPushMsg.stderr)
}