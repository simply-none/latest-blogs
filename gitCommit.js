const shell = require('shelljs')
const pkg = require('./package.json')

let gitAddMsg = shell.exec('git add .')
console.log(gitAddMsg, 'git')
if (gitAddMsg.code !== 0) {
  console.error(gitAddMsg.stderr)
}

let gitCommitMsg = shell.exec(`git commit -m "chore(release): ${pkg.version}"`)
console.log(gitCommitMsg, 'git')
if (gitCommitMsg.code !== 0) {
  console.error(gitCommitMsg.stderr)
}