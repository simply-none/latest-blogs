const standardVersion = require('standard-version')
const { exec } = require('child_process')

// Options are the same as command line, except camelCase
// standardVersion returns a Promise
standardVersion({
  // major|minor|patch|regular_version_number<like 3.0.0>
  releaseAs: 'patch',
  skip: {
    changelog: true,
    commit: true,
    tag: false
  },
}).then(() => {
  // standard-version is done
  // const COMMAND = `git push -u origin --tags && npm publish`

  // exec(COMMAND, (err, stdout,) => {
  //   if (err) {
  //     console.log(err.stack)
  //   }
  //   console.log('stdout: ' + stdout)
  // })
}).catch(err => {
  console.error(`standard-version failed with message: ${err.message}`)
})