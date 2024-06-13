# chrome插件开发

## 阅读前准备

浏览器插件开发，首先是选择一个合适的开发框架和语言，然后在这基础之上阅读相关api进行填入即可。第二个是熟知清单文件（Manifest）的内容，方便后续开发。

## 清单文件

当下以minifest_version 3为标准进行介绍。重要的几个字段如下：

- background：后台脚本，可获取除了控制台之外的权限
- content_scripts：内容脚本，注入内容到网页当中
- action：定义工具栏中扩展图标的外观和行为，比如默认图标、点击时展示的页面(popup)
- side_panel：侧边栏
- options_ui：选项页，用于在扩展程序页面(edge://extensions)中更改该扩展选项
- chrome_url_overrides：覆盖浏览器默认的页面(NewTab、History、Bookmarks Manager)
- chrome_settings_overrides：覆盖浏览器设置，比如主页、启动页、搜索引擎

::: details Manifest.ts

```javascript
import pkg from '../package.json'

const manifest: chrome.runtime.Manifest = {
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  icons: {
    // 仅能使用相对于public下的资源
    16: "assets/app/icon-16.png",
    32: "assets/app/icon-32.png",
    48: "assets/app/icon-48.png",
    64: "assets/app/icon-64.png",
    128: "assets/app/icon-128.png",
    256: "assets/app/icon-256.png",
  },
  content_security_policy: {
    "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
  },
  permissions: [
    "sidePanel",
    "webNavigation",
    "webRequest",
    "contextMenus", // 右键菜单
    "tabs", // 标签
    "activeTab",
    "scripting",
    "notifications", // 通知
    "webRequest", // web请求
    "webRequestBlocking",
    "storage", // 插件本地存储
    "unlimitedStorage", // 存储扩展
  ],
  host_permissions: ['*://*/*'],
  background: {
    service_worker: 'src/background/main.ts',
  },
  // 该内容会注入到匹配到网站当中
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: [
        'src/content/main.ts',
        'src/contentScripts/event.ts',
        'src/contentScripts/script.ts'
      ],
      css: [
        'src/content/style.css'
      ]
    }
  ],
  // 只有放进该目录下的资源才能被访问到
  web_accessible_resources: [
    {
      resources: [
        'assets/*'
      ],
      matches: ['<all_urls>'],
    }
  ],
  action: {
    default_popup: 'src/popup/index.html',
    "default_title": "点击打开侧面板",
  },
  options_ui: {
    page: 'src/options/index.html',
    open_in_tab: false,
  },
  side_panel: {
    default_path: 'src/popup/index.html',
  },
  chrome_url_overrides: {
    "newtab": "src/newTab/index.html",
  },
}

export default manifest
```

:::

在设置完清单文件后，就可以根据选择的框架进行开发了。可在开发时边查阅边开发，灵活变通，不要太死板。

## 权限

| 模块             | Chrome API                     | DOM API      | 获取网页内容 | 跨域 |
| ---------------- | ------------------------------ | ------------ | ------------ | ---- |
| injected scripts | 和普通JS一致，✗                | ✓            | ✓            | ✗    |
| content scripts  | 仅extension、runtime           | ✓            | ✗            | ✗    |
| popup            | 除devtools之外的所有API        | 不可直接访问 | ✗            | ✓    |
| background       | 除devtools之外的所有API        | 不可直接访问 | ✗            | ✓    |
| options          | 除devtools之外的所有API        | ✓            | ✗            | ✓    |
| devtools         | 仅devtools、extension、runtime | ✓            | ✓            | ✗    |

## 通信

对于有些可以直接访问chrome api的模块，不需要和相关模块进行通信，而是直接使用chrome api，除非有特殊需求迫不得已。

options未研究过，这里省略。

使用`window.postMessage`进行通信的，需要使用`window.addEventListener('message', cb)`进行监听。

使用`chrome.tabs/runtime.sendMessage`进行通信的，需要使用`chrome.tabs/runtime.onMessage.addListener(cb)`进行监听。

使用`chrome.tabs/runtime.connect`进行通信的，需要使用`chrome.runtime.onConnect.addListener(cb)`进行监听。

| 模块             | injected scripts                     | content scripts                              | popup                                              | background                                         | devtools | options |
| ---------------- | ------------------------------------ | -------------------------------------------- | -------------------------------------------------- | -------------------------------------------------- | -------- | ------- |
| injected scripts | /                                    | window.postMessage                           | /                                                  | /                                                  | /        | /       |
| content scripts  | window.postMessage                   | /                                            | chrome.runtime.sendMessage、chrome.runtime.connect | chrome.runtime.sendMessage、chrome.runtime.connect | /        | /       |
| popup            | /                                    | chrome.tabs.sendMessage、chrome.tabs.connect | /                                                  | chrome.tabs.sendMessage、chrome.tabs.connect       | /        | /       |
| background       | /                                    | chrome.tabs.sendMessage、chrome.tabs.connect | chrome.tabs.sendMessage、chrome.tabs.connect       | /                                                  | /        | /       |
| devtools         | chrome.devtools.inspectedWindow.eval | /                                            | chrome.runtime.sendMessage                         | chrome.runtime.sendMessage                         | /        | /       |
| options          | /                                    | /                                            | /                                                  | /                                                  | /        | /       |
