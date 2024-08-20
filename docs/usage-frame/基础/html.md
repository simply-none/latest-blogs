# html

## `<meta>`

meta必须包含的属性：charset、name、http-equiv、itemprop中的其中一个，同时后四者必须包含content属性。

meta标签name属性支持的值，可以查看：https://wiki.whatwg.org/wiki/MetaExtensions

```html
<html>
  <head>
    <!-- charset 声明文档的字符编码，有且仅有一个 -->
    <meta charset="utf-8">
    
    <meta name="application-name" content="app name">
    <meta name="author" content="author name">
    <meta name="description" content="description">
    <meta name="keywords" content="keyword1,keyword2,keyword3">
    <!-- 引用策略 -->
    <meta name="referrer" content="origin-when-cross-origin">
    <!-- 定义页面或周围用户界面应该使用的建议颜色 -->
    <meta name="theme-color" content="#000" media="(prefers-color-scheme: dark)">
    <meta name="color-scheme" content="dark">

    <meta http-equiv="content-language" content="zh-CN">
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta http-equiv="content-security-policy" content="default-src 'self'; object-src 'none'">
    <meta http-equiv="refresh" content="30; url=http://www.baidu.com">
    <meta http-equiv="set-cookie" content="name=value; expires=Wed, 12 Aug 2021 13:58:46 GMT;
    path=/; domain=example.com">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="default-style" content="document">

    <!-- 其他不在mdn文档中描述的内容 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- 设置网页过期时间 -->
    <meta http-equiv="expires" content="30">
    <!-- 禁止从本地缓存中访问页面内容 -->
    <meta http-equiv="pragma" content="no-cache">
    <!-- 指定请求和响应遵循的缓存机制 -->
    <!-- 请求时缓存指令包括：no-cache、no-store、max-age、max-stale、min-fresh、only-if-cached -->
    <!-- 响应时缓存指令包括：public、private、no-cache、max-age、no-transform、must-revalidate、proxy-revalidate -->
    <meta http-equiv="cache-control" content="no-cache, no-store, must-revalidate">
  </head>
</html>
```
