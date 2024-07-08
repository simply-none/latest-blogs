# electron

> 官方中文文档：https://www.electronjs.org/zh/docs/latest/

## 进程通信

### 渲染进程->主进程

主要使用的api有：

- ipcMain.on
- ipcRenderer.send

1. 主进程监听渲染进程发送的消息

```javascript
const { ipcMain, BrowserWindow } = require('electron')

app.whinReady().then(() => {
  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BroswerWindow.fromWebContents(webContents)
    win.setTitle(title)
  })
})
```

2. 预加载脚本暴露`ipcRenderer`对象：

```javascript
// 渲染进程发送消息到主进程
const { ipcRenderer, contextBridge } = require('electron')

// 后续可在渲染进程中使用window.electronAPI.setTitle()
contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title)
})
```

3. 渲染进程触发事件：

```javascript
const setButton = document.getElementById('btn')

setButton.addEventListener('click', () => {
  window.electronAPI.setTitle('Hello World!')
})
```

### 主进程->渲染进程

主要使用的api有：

- mainWindow.webContents.send
- ipcRenderer.on

1. 主进程使用webContents.send()发送消息：

```javascript
const { app, BrowserWindow, Menu, ipcMain } = require('electron')

function createWindow () {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // 使用node特性
      nodeIntegrationInWorker: true
    }
  })

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          label: 'Increment',
          click: () => {
            mainWindow.webContents.send('update-counter', 1)
          }
        }
      ]
    }
  ])
}
```

2. 通过预加载脚本preload.js暴露`ipcRenderer`对象：

```javascript
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateCounter: (callback) => {
    ipcRenderer.on('update-counter', (_event, value) => {
      callback(value)
    })
  }
})
```

3. 渲染进程监听主进程发送的消息：

```javascript
const counter = document.getElementById('counter')

window.electronAPI.onUpdateCounter((value) => {
  const oldValue = Number(counter.innerText)
  const newValue = oldValue + value
  counter.innerText = newValue.toString()
})
```

### 主进程和渲染进程双向通信

主要使用的api有：

- ipcMain.handle
- ipcRenderer.invoke(Electron 7新增)

1. 主进程使用ipcMain.handle()监听事件：

```javascript
const { app, dialog, ipcMain } = require('electron')
app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({})
    if (!canceled) {
      return filePaths[0]
    }
  })
})
```

2. 通过预加载脚本preload.js暴露`ipcRenderer`对象：

```javascript
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile')
})
```

3. 渲染器进程触发事件：

```javascript
const btn = document.getElementById('btn')

btn.addEventListener('click', async () => {
  cont filePath = await window.electronAPI.openFile()
  console.log(filePath)
})
```

## 键盘快捷键

顶部菜单栏快捷键:

```javascript
const { Menu, MenuItem } = require('electron')

const menu = new Menu()

menu.append(new MenuItem({
  label: 'electron',
  submenu: [{
    role: 'help',
    accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
    click: () => {
      console.log('click')
    }
  }]
}))

Menu.setApplicationMenu(menu)
```

全局快捷键：

```javascript
const { app, globalShortcut, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+Alt+I', () => {
    console.log('CommandOrControl+Alt+I is pressed')
  })

  // 拦截keydown、keyup事件，这里也可以使用第三方库（mousetrap）解析
  win.webContents.on('before-input-event', (e, input) => {
    if (input.control && input.key.toLowerCase() === 'i') {
      console.log('control+i is pressed')
      eve.preventDefault()
    }
  })
}).then(createWindow)
```

渲染进程内部的快捷方式：

```javascript
window.addEventListener('keydown', (e) => {
  console.log(e)
}, true)
```

## 托盘图标

```javascript
const { Tray, Menu } = require('electron')

let tray = null

app.whenReady().then(() => {
  const icon = nativeImage.createFromPath('icon.png')
  tray = new Tray(icon)
})

// 创建上下文菜单
tray.setContextMenu(Menu.buildFromTemplate([
  {
    label: 'item',
    type: 'radio'
  }
]))

// 设置提示和标题
tray.setToolTip('tooltip')
try.setTitle('title')

// 销毁托盘图标
tray.destroy()
```

## `app`

事件：

- ready：应用程序初始化完成
- window-all-closed：所有窗口都关闭时触发
- will-quit：当所有窗口被关闭后，同时应用程序退出前触发

方法：

- `app.quit()`: 退出应用程序，此方法会确保执行所有beforeunload和unload事件，可以在这些事件中返回false取消程序退出
- `app.exit([exitCode])`: 退出应用程序，并使用指定的exitCode(默认0)。所有窗口会立即关闭，不会询问用户，且上述两事件不会触发
- `app.relaunch([options])`: 重启应用程序
- `app.whenReady()`: 
- `app.setAsDefauleProtocolClient(protocol[, path, args])`: 设置协议为默认客户端
- `app.removeAsDefaultProtocolClient(protocol)`: 移除协议

```javascript
const { app } = require('electron')

// 事件监听
// ready: 应用程序初始化完成
app.on('ready', () => {

})

```

## `BrowserWindow`

创建并控制浏览器窗口，只能在ready事件触发后创建

事件：

- close：窗口要关闭时触发
- closed：窗口关闭时触发
- focus/blur：窗口获得/失去焦点时触发
- maximize/unmaximize：窗口最大化/取消最大化时触发
- minimize/unminimize：窗口最小化/取消最小化时触发
- show/hide：窗口显示/隐藏时触发
- restore：窗口被还原时触发
- will-resize：窗口大小改变前触发
- resize: 窗口大小改变时触发
- will-move/moved：窗口移动前/移动后触发

## `webContents`

渲染进程的webContents对象，用于控制页面

## 命令行

```javascript
app.commandLine.appendSwitch('--disable-http-cache')
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')
app.commandLine.appendSwitch('disable-site-isolation-trials')
app.commandLine.appendSwitch('ignore-certificate-errors')
```

## 附录

### 计算机硬件信息识别

> 以`systeminformation`为研究对象，`标识唯一性确认`未完待续
> 注：若【获取信息】章节中有一个以上的标识是唯一的，则可确定在pc端是可用的

```bash
## 环境准备

1. Windows 10
2. Node.js v12.18.3
3. systeminformation v4.33.0(npm package)
```

**`systeminformation`前置知识**

1. 该npm pkg支持部分win7，支持win10（只支持nodejs4.0+，若系统支持nodejs4.0+，该pkg也应是支持的）
2. 只支持使用了nodejs服务的项目，不支持web端（electron项目是集成了nodejs的）
3. 几乎所有函数都是`异步函数`
4. 通过函数`getStaticData()`获取静态数据

**获取系统信息**：

> 注：仅仅包含部分可能具有唯一性标识的函数

**系统：`system()`**

获取的信息：

```json
"system": {
  "manufacturer": "LENOVO", // 生厂商
  "model": "20KN000VCD",
  "version": "ThinkPad E480",
  "serial": "PF1MAPY9",
  "uuid": "1455C9CC-2B62-11B2-A85C-E599E86F7BF1",
  "sku": "LENOVO_MT_20KN_BU_Think_FM_ThinkPad E480"
}
```

**主板：`baseboard()`**

获取的信息：

```json
"baseboard": {
  "manufacturer": "LENOVO",
  "model": "20KN000VCD",
  "version": "SDK0L77769 WIN",
  "serial": "L1HF93805M7",  // 序列号
  "assetTag": ""
}
```

**内存：`memLayout()`**

获取的信息：

```json
"memLayout": [{
  "size": 8589934592,
  "bank": "BANK 0",
  "type": "Unknown",
  "clockSpeed": 2400,
  "formFactor": "SODIMM",
  "manufacturer": "Ramaxel",
  "partNum": "RMSA3260ME78HAF-2666",  // 零件编号
  "serialNum": "1356259B",  // 序列号
  "voltageConfigured": 1.2,
  "voltageMin": 0,
  "voltageMax": 0
}]
```

**操作系统：`osInfo()`、`uuid()`**

os获得的信息：

```json
"os": {
  "platform": "win32",
  "distro": "Microsoft Windows 10 רҵ��",
  "release": "10.0.18363",
  "codename": "",
  "kernel": "10.0.18363",
  "arch": "x64",
  "hostname": "DESKTOP-LVCL22J",
  "fqdn": "DESKTOP-LVCL22J.%USERDNSDOMAIN%",
  "codepage": " 936",
  "logofile": "windows",
  "serial": "00331-10000-00001-AA777",
  "build": "18363",
  "servicepack": "0.0",
  "uefi": false
}
```

uuid获得的信息：

```json
"uuid": {
  "os": "d64ba63f-a625-4cb7-b873-303783c535c1"
}
```

**磁盘：`diskLayout()`**

获取的信息：

```json
"diskLayout": [{
  "device": "",
  "type": "HD",
  "name": "ST500LM034-2GH17A",
  "vendor": "(��׼����������)",
  "size": 500105249280,
  "bytesPerSector": 512,
  "totalCylinders": 60801,
  "totalHeads": 255,
  "totalSectors": 976768065,
  "totalTracks": 15504255,
  "tracksPerCylinder": 255,
  "sectorsPerTrack": 63,
  "firmwareRevision": "LXM3",
  "serialNum": "WGS49T4E",
  "interfaceType": "SATA",
  "smartStatus": "Ok"
}, {
  "device": "",
  "type": "SSD",
  "name": "KBG30ZMT128G TOSHIBA",
  "vendor": "(��׼����������)",
  "size": 128034708480,
  "bytesPerSector": 512,
  "totalCylinders": 15566,
  "totalHeads": 255,
  "totalSectors": 250067790,
  "totalTracks": 3969330,
  "tracksPerCylinder": 255,
  "sectorsPerTrack": 63,
  "firmwareRevision": "0106ADLA",
  "serialNum": "0008_0D04_005D_BAB7.",  // 序列号
  "interfaceType": "NVMe",
  "smartStatus": "Ok"
}]
```

**网络信息：`networkInterfaces()`**

```json
"net": [{
  "iface": "本地连接* 2",
  "ifaceName": "Realtek 8821CE Wireless LAN 802.11ac PCI-E NIC",
  "ip4": "192.168.137.1",
  "ip4subnet": "255.255.255.0",
  "ip6": "fe80::1ccb:c64e:66ec:4f40",
  "ip6subnet": "ffff:ffff:ffff:ffff::",
  "mac": "3c:91:80:40:a5:6d",
  "internal": false,
  "virtual": false,
  "operstate": "down",
  "type": "wireless",
  "duplex": "",
  "mtu": "",
  "speed": 150,
  "dhcp": "true",
  "dnsSuffix": "",
  "ieee8021xAuth": "Unknown",
  "ieee8021xState": "Unknown",
  "carrierChanges": 0
}, {
  "iface": "以太网",
  "ifaceName": "Realtek PCIe GbE Family Controller",
  "ip4": "10.2.0.111",
  "ip4subnet": "255.255.255.0",
  "ip6": "fe80::30a5:5965:210:24a8",
  "ip6subnet": "ffff:ffff:ffff:ffff::",
  "mac": "e8:6a:64:d0:89:3a",
  "internal": false,
  "virtual": false,
  "operstate": "up",
  "type": "wired",
  "duplex": "",
  "mtu": "",
  "speed": 100,
  "dhcp": "false",
  "dnsSuffix": "",
  "ieee8021xAuth": "Unknown",
  "ieee8021xState": "Unknown",
  "carrierChanges": 0
}, {
  "iface": "Loopback Pseudo-Interface 1",
  "ifaceName": "Loopback Pseudo-Interface 1",
  "ip4": "127.0.0.1",
  "ip4subnet": "255.0.0.0",
  "ip6": "::1",
  "ip6subnet": "ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff",
  "mac": "00:00:00:00:00:00",
  "internal": true,
  "virtual": false,
  "operstate": "down",
  "type": "",
  "duplex": "",
  "mtu": "",
  "speed": -1,
  "dhcp": false,
  "dnsSuffix": "",
  "ieee8021xAuth": "Unknown",
  "ieee8021xState": "Unknown",
  "carrierChanges": 0
}]
```

**使用方法**：

1. 安装：`npm install systeminformation --save`
2. 引入：`const si = require('systeminformation')`
3. 使用：

   ```javascript
    // 1.
    si.cpu(function (data) {
      console.log(data)
    })
    // 2.
    si.cpu().then(data => {
      console.log(data)
    }).catch(err => {
      console.log(err.response)
    })
    // 3. async/await、try-catch
    const cpuInfo = await si.cpu()
   ```

## 参考文档

1. [systeminformation文档](https://systeminformation.io/)
2. [硬盘的序列号在全球范围内唯一吗?](https://qastack.cn/server/300448/is-a-hard-drives-serial-number-globally-unique)