# 前端渲染pdf

> 参考链接：https://www.i4k.xyz/article/m0_37903882/113320701

### 前端打印pdf

> vue-print-nb

### 渲染方式

直接按照文档进行引入时，会发现有字体缺少的情况（pdfh5除外）

使用的pdf插件渲染pdf：
1. pdfvuer：修改cmapurl能获取后台填充的内容，以将pdf展示完整，渲染较快
2. vue-pdf：修改cmapurl能获取后台填充的内容，以将pdf展示完整，渲染较快
3. vue-pdf-embed：暂未发现修改cmapurl接口
4. vue-pdf-app：暂未发现修改cmapurl接口
5. pdfh5：能直接展示，但渲染慢

直接使用html元素渲染pdf：
  1. pdfjs部署，并用iframe嵌套，
  ```html
   <iframe src="http://127.0.0.1:5500/web/viewer.html?file=http://localhost:21212/%E7%AE%97%E6%B3%95%E5%AF%BC%E8%AE%BA%20(Thomas%20H.Cormen)%20(z-lib.org).pdf" width="100%" height="1000px"></iframe>

   <!-- mozilla pdf在线渲染 -->
   <iframe src="https://mozilla.github.io/pdf.js/web/viewer.html?file=http://localhost:21212/%E7%AE%97%E6%B3%95%E5%AF%BC%E8%AE%BA%20(Thomas%20H.Cormen)%20(z-lib.org).pdf" width="100%" height="1000px"></iframe>

   ```
  2. 直接使用embed：`<embed src="http://localhost:21212/%E7%AE%97%E6%B3%95%E5%AF%BC%E8%AE%BA%20(Thomas%20H.Cormen)%20(z-lib.org).pdf" type="application/pdf" width="100%" height="1000px">`

### 插件渲染用法及试错

> vue-pdf-embed、vue-pdf-app、pdfh5的使用请见官方文档

##### pdfvuer、vue-pdf

> 注意事项：vue-pdf可能会出现控制台警告，或许应当将vue-cli对应的版本从v5->v4，以及webpack也降级成v4
> 目前使用：pdfvuer

安装、引入、展示，可以看各自的文档介绍

字体缺失的修改：（使用链接的渲染时）
```html
<pdf :src="pdfsrc" :page="num">
  <template slot="loading">
    loading content here...
  </template>
</pdf>
```
```js
import pdf from 'pdfvuer'

computed: {
  pdfsrc () {
    // 处理pdfUrl返回，pdf为导入的包名
    const src = pdf.createLoadingTask({
      // pdf地址
      url: 'http://xxx.xxx.pdf',
      // 引入pdf.js字体（这是字体展示不全的原因）
      // cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.5.207/cmaps/',
      // 若为本地服务器引入，则必须将`pdfjs-dist-2.13.216`整个包都下载并存放到服务器上，不能只下载cmaps文件夹
      cMapUrl: 'http://localhost:21212/pdfjs-dist-2.13.216/cmaps/',
      // 也可以使用本地cmaps
      cMapUrl: 'file:///C:/Users/pdfjs-dist-2.13.216/cmaps/',
      cMapPacked: true
    })
    return src
  }
}
```

1，对于pdfvuer，当修改url时，组件不会切换成对应的pdf，解决方案是：对pdf组件加上`:key="pdfChangeFlag"`，当切换url时，修改key，让组件重新渲染
2，对于vue-pdf，第一次加载时，渲染不出模板填充的数据，之后能够渲染
