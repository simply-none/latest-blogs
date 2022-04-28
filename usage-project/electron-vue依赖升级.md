# electron-vue插件依赖升级

```bash
项目启动环境：
Windows10
Node.js 14.18.3
NPM 6.14.15
```

## 启动Nodejs版本不同的项目介绍

1. 使用nvm管理nodejs版本，下载：windows-nvm
2. 打开某项目（比如electron-vue）
3. 切换node版本：nvm use `[version-number]`
4. 安装依赖：例如（npm install）
5. 运行项目
6. 打开另一个node版本（大版本：比如12和14）不同的项目
7. 重复步骤3-6

## electron-vue版本升级记录

1. 对electron项目相关插件进行升级：
   1. electron: ^2.0.4 -> ^16.2.1
   2. electron-builder: ^20.19.2 -> ^23.0.3
   3. electron-devtools-installer: ^2.2.4 -> ^3.2.0
   4. electron-updater: 3.0.0(devDependencies) -> ^4.3.5(dependencies)：开发依赖要换成生产依赖，否则报错：`electron build ERROR in unknown: Unexpected token`
   5. 删除vuex-electron依赖包，一来未使用，二来导致`Uncaught TypeError: Cannot read properties of undefined (reading 'app')     at new ElectronStore`

#### 升级控制台报错

报错1： `electron Uncaught ReferenceError: require is not defined`, `Uncaught ReferenceError process is not defined`, `Uncaught ReferenceError module is not defined`

解决方案1：
```javascript
// src/main/index.js
// 之前
webPreferences: {
  nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
  webSecurity: false,
  contextIsolation: false
}

// 现在
webPreferences: {
  nodeIntegration: true,
  nodeIntegrationInWorker: true,
  webSecurity: false,
  enableRemoteModule: true,
  contextIsolation: false
}
```

报错2：`Uncaught TypeError: Cannot read properties of undefined (reading 'app')     at new ElectronStore`

解决方案2：由报错可知是`new ElectronStore`出现了问题，所以删除vuex-electron依赖包就解决了，由于项目中未实际使用该包，所以删除，并删除对应的测试代码；若以后需要解决缓存问题，再行其他思路解决

报错3：`electron build ERROR in unknown: Unexpected token`

解决方案3：修改配置文件中依赖包`electron-updater`所在的环境对象
```javascript
// package.json
// 之前
"devDependencies": {
  "electron-updater": "^4.3.5"
}

// 现在
"dependencies": {
  "electron-updater": "^4.3.5"
}
```
