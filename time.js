const shell = require('shelljs');
const fs = require('fs');
const date = require('./date.format.js');
process.setMaxListeners(0);
require('events').EventEmitter.defaultMaxListeners = 0;

function getLog() {
  let mds = [];
	let filesLatestLog = {};
  
  shell.ls(['*.md', 'usage-*/*.md', 'usage-*/*/*.md', 'usage-*/*/*/*.md', 'code-*/*.md', 'dicts/*.md']).forEach(md => {
		mds.push(md);
	});


	mds.forEach(path => {
    const bash = `git log -1 -- ./${path}`
		shell.exec(bash.toString(), (code, stdout, stderr) => {
			console.log(stdout, 'test');
			let arr = stdout.split('commit');
			arr = arr.filter(a => a);
			arr = arr.map(arr => {
				let cmt = arr.split(/\n+/);
				return {
					id: cmt[0].trim(),
					author: cmt[1].slice(8),
					date: date.formatTimestamp(cmt[2].slice(8)),
					desc: cmt
						.filter((val, index) => index > 2)
						.join(', ')
						.trim(),
				};
			});

			const result = arr;
			if (code) {
				log = [];
			} else {
				log = result;
      }
      filesLatestLog[path] = log[0] ? log[0] : {}
		});
	});
	setTimeout(() => {
    fs.writeFile('./logs.json', JSON.stringify(filesLatestLog), function (err) {
      // 读取失败 err的值也是为空  null转换为布尔值还是false
      if (err) {
        console.log(err + '写入失败的');
      }
      console.log('成绩写入成功');
      shell.exec('git add .')
      shell.exec('git commit -m "update: 更新git日志；"')
      shell.exec('git push')
    });
	}, 2000);

}

getLog();
