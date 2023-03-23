# electron

命令行：
```javascript
app.commandLine.appendSwitch('--disable-http-cache')
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')
app.commandLine.appendSwitch('disable-site-isolation-trials')
app.commandLine.appendSwitch('ignore-certificate-errors')
```

## nodejs计算机硬件信息识别

> 以`systeminformation`为研究对象，`标识唯一性确认`未完待续
> 注：若【获取信息】章节中有一个以上的标识是唯一的，则可确定在pc端是可用的

```bash
## 环境准备

1. Windows 10
2. Node.js v12.18.3
3. systeminformation v4.33.0(npm package)
```

### `systeminformation`

#### `systeminformation`前置知识

1. 该npm pkg支持部分win7，支持win10（只支持nodejs4.0+，若系统支持nodejs4.0+，该pkg也应是支持的）
2. 只支持使用了nodejs服务的项目，不支持web端（electron项目是集成了nodejs的）
3. 几乎所有函数都是`异步函数`
4. 通过函数`getStaticData()`获取静态数据

#### 获取系统信息

> 注：仅仅包含部分可能具有唯一性标识的函数

##### 系统：`system()`

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

##### 主板：`baseboard()`

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

##### 内存：`memLayout()`

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

##### 操作系统：`osInfo()`、`uuid()`

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

##### 磁盘：`diskLayout()`

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

##### 网络信息：`networkInterfaces()`

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

#### 使用方法

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

### 参考文档

1. [systeminformation文档](https://systeminformation.io/)
2. [硬盘的序列号在全球范围内唯一吗?](https://qastack.cn/server/300448/is-a-hard-drives-serial-number-globally-unique)