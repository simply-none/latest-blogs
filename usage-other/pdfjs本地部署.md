# pdfjs本地部署

> 官方文档：`https://github.com/mozilla/pdf.js`

# 使用

```html
<!-- http://127.0.0.1:5500/web/viewer.html：表示部署的pdf路径 -->
<!-- http://localhost:21212/%E7%AE%97%E6%B3%95%E5%AF%BC%E8%AE%BA%20(Thomas%20H.Cormen)%20(z-lib.org).pdf：表示需要查看的pdf文件地址 -->
<iframe src="http://127.0.0.1:5500/web/viewer.html?file=http://localhost:21212/%E7%AE%97%E6%B3%95%E5%AF%BC%E8%AE%BA%20(Thomas%20H.Cormen)%20(z-lib.org).pdf" width="100%" height="1000px"></iframe>
```



## 简易部署方案

```bash
# 下载项目
$ git clone https://github.com/mozilla/pdf.js.git
$ cd pdf.js

# 安装构建包gulp
$ npm install -g gulp-cli

# 安装依赖
$ npm install

# 启动项目
$ gulp server

# 构建项目，运行到服务器
$ gulp generic
# 构建项目，运行到服务器（支持旧的浏览器）
$ gulp generic-legacy
```

## 自定义部署

1. 端口号自定义

```javascript
// 在gulpfile.js中
function createServer() {
  console.log();
  console.log("### Starting local server");

  const WebServer = require("./test/webserver.js").WebServer;
  const server = new WebServer();
  // 自定义端口号
  server.port = 9856;
  server.start();
}
```

## 报错

报错1：`Uncaught (in promise) Error: file origin does not match viewer's`

解决：注释`web/app.js`中判断远程地址的代码
```javascript
try {
    const viewerOrigin = new URL(window.location.href).origin || "null";
    if (HOSTED_VIEWER_ORIGINS.includes(viewerOrigin)) {
      // Hosted or local viewer, allow for any file locations
      return;
    }
    const fileOrigin = new URL(file, window.location.href).origin;
    // Removing of the following line will not guarantee that the viewer will
    // start accepting URLs from foreign origin -- CORS headers on the remote
    // server must be properly configured.
    // 注释下面这三行
    // if (fileOrigin !== viewerOrigin) {
    //   throw new Error("file origin does not match viewer's");
    // }
  } catch (ex) {
    PDFViewerApplication.l10n.get("loading_error").then(msg => {
      PDFViewerApplication._documentError(msg, { message: ex?.message });
    });
    throw ex;
  }
};
```

报错2：`/MyApp/Scripts/pdfjs-dist/web/locale/locale.properties Failed to load resource: the server responded with a status of 404 (Not Found)`

解决：因为文件缺少，需要生成对应的文件，运行命令`gulp locale`