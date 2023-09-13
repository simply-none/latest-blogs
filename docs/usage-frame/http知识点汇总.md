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