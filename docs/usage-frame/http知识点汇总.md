# http知识点汇总

## http标头

### Content-Disposition

定义：指示返回的内容以何种形式展示

使用场景：用于文档的预览、展示

第一个参数的值：
- inline，表示返回的消息体作为页面的一部分/整个页面进行展示（预览），默认值
- attachment：表示返回的消息体能够被下载
- form-data：作为多部分主体的标头，在使用multipart/form-data格式提交表单时，每个部分都需要提供一个该标头，以提供相关信息

<!-- tabs:start -->

<!-- tab:作为消息体的标头 -->
```bash
Content-Disposition: inline
Content-Disposition: attachment
# 多个参数用分号隔开
Content-Disposition: attachment; filename="filename.jpg"
```

<!-- tab:作为多部分主体的标头 -->
```bash
POST /test.html HTTP/1.1
Host: example.org
Content-Type: multipart/form-data;boundary="boundary"

--boundary
Content-Disposition: form-data; name="field1"

value1
--boundary
Content-Disposition: form-data; name="field2"; filename="example.txt"

value2
--boundary--
```
<!-- tabs:end -->

### Content-Type

定义：Content-Type实体头部用于指示资源的MIME类型（media type）
- 在响应（response headers）中，是服务器实际返回内容的类型
- 在请求（request headers）中，是客户端发送给服务器的数据类型

表示结构：`Content-Type: type/subtype;parameter=value`，即包括资源类型，字符编码标准，boundary（传输表单或部分数据时有用）

web中重要的MIME类型：
- `text/plain`：文本文件默认值
- `text/css`：
- `text/html`：
- `text/javascript`：
- `application/json`：
- 图片类型：`image/gif`, `image/png`等
- 音视频类型：`audio/wav`, `audio/webm`, `audio/ogg`, `video/webm`, `video/ogg`等
- `application/octet-stream`：二进制文件的默认值，一般用于文件下载
- `application/x-www-form-urlencoded`：使用url编码的方式（view source中用&分隔键值对，用=连接键值对，例如`name=jade&sex=man`，view parsed中是一个对象形式）编码表单，默认值
- `multipart/form-data`：用于将html表单（通常是二进制文件）发送给服务器，是多部分文档格式，由边界线(--开始的字符串)划分出不同的部分，每部分都有实体、http请求头、Content-Disposition、Content-Type
- `multipart/byteranges`：把部分的响应报文发送给浏览器