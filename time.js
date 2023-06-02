const shell = require('shelljs');
const fs = require('fs');
const date = require('./date.format.js');
process.setMaxListeners(0);
require('events').EventEmitter.defaultMaxListeners = 0;

function getLog() {
  let mds = [];
	let filesLatestLog = {};
  
  shell.ls(['*.md', 'docs/usage-*/*.md', 'docs/usage-*/*/*.md', 'docs/usage-*/*/*/*.md', 'docs/code-*/*.md', 'docs/dicts/*.md']).forEach(md => {
		mds.push(md);
	});


	mds.forEach(path => {
		const relativePath = './' + path
		const fsObj = fs.statSync(relativePath)
		filesLatestLog[path] = {
			date: date.formatTimestamp(fsObj.mtime),
			id: fsObj.ino
		}
	});
	const len = Object.values(filesLatestLog).length
	console.log('计算中...', len)

	setTimeout(() => {
    fs.writeFile('./logs.json', JSON.stringify(filesLatestLog), function (err) {
      // 读取失败 err的值也是为空  null转换为布尔值还是false
      if (err) {
        console.log(err + '写入失败的');
      }
      console.log('成绩写入成功');
    });
	}, 500);

}

getLog();
