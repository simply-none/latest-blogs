let fs = require('fs')

let dir = fs.readdirSync('./')

console.log(dir)

let utils = []
let originUtils = []
let falseUtils = []

dir.forEach((file, index) => {
    if (!file.includes('md')) {
      return false
    }
    let data = fs.readFileSync(file, { encoding: 'utf-8' })
    data = data.replace(/\r\n/g, 'jadeq')

    let re = /##\s工具(.*?)jadeqjadeq##\s/

    let matchData = data.match(re)
    if (!matchData || matchData.length <= 0) {
      return false
    }
    matchData = matchData[0]
    matchData = matchData.split('jadeq')
    matchData = matchData.filter(data => data && !/^##/.test(data) && !/^\!/.test(data))
    matchData = matchData.map(data => {
      let newData = data.replace(/^\d+、/, '')
      return newData
    })


    let newMatchData = []
    for (let i = 0; i < matchData.length; i++) {
      let re = /^(\s)*\[/
      if (re.test(matchData[i])) {
        newMatchData.push(matchData[i] + ': ')
        falseUtils.push(1)
      } else {
        newMatchData[newMatchData.length - 1] = newMatchData[newMatchData.length - 1] + matchData[i]
        falseUtils.push(0)
      }
    }

    utils.push(...newMatchData)
    originUtils.push(...matchData)
})

console.log(falseUtils, falseUtils.length, falseUtils.i)
console.log(originUtils.length, utils.length)

fs.writeFileSync('../data.md', (['## 工具资源'].concat(utils)).join(`\n- `))
fs.writeFileSync('../odata.md', originUtils.join(`\n`))
fs.writeFileSync('../falsedata.txt', falseUtils.join(''))