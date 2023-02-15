const shell = require('shelljs')

function getLog () {
  let _cmd = 'git log -1'
  shell.ls('*.md').forEach(md => {
    console.log(md)
  })
  return new Promise((resolve, reject) => {
    shell.exec(_cmd, (code, stdout, stderr) => {
      if (code) {
        reject(stderr)
      } else {
        resolve((stdout))
      }
    })
  })
}

async function commit () {
  let _gitLog = await getLog()
  let str = _gitLog.split(/(\r\n)|\r|\n/g)
  // console.log(typeof _gitLog, str, str.length)
}

commit()
