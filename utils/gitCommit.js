const shell = require('shelljs')
const pkg = require('../package.json')

let gitAddMsg = shell.exec('git add .')
if (gitAddMsg.code !== 0) {
  console.error(gitAddMsg.stderr)
}

let gitCommitMsg = shell.exec(`git commit -m "chore(release): ${pkg.version}"`)
if (gitCommitMsg.code !== 0) {
  console.error(gitCommitMsg.stderr)
}