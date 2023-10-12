# http请求

<!-- tabs:start -->
<!-- tab:get请求 -->
```javascript
// get请求参数带数组
// 假设后端需要传入请求参数为ids：[1, 2, 3]
// 浏览器实际需传入类似效果：idList: 1  idList: 2  idList: 3
import qs from 'qs'
axios.get(url, {
  params: {
    ids: [1, 2, 3]
  },
  // qs对数组等的处理，放在paramsSerializer属性中
  paramsSerializer: function (params) {
    return qs.stringify(params, {
      indices: false
    })
  }
})

// 请求excel数据
axios.get(url, {
  params: upload,
  headers: {
    'Content-Type': 'application/json; application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  },
  responseType: 'arraybuffer'
})
// 请求pdf数据
axios.get(url, {
  params: upload,
  headers: {
    'Content-Type': 'application/json; application/octet-stream'
  },
  responseType: 'blob'
})
```

<!-- tab:post请求 -->
```javascript
// post请求类型为form数据格式
let formUrlencodedData = new URLSearchParams()
Object.keys(upload).forEach(key => {
  formUrlencodedData.append(key, upload[key])
})
axios.post(url, formUrlencodedData, header)

// 请求pdf数据
axios.post(url, upload, {
  headers: {
    'Content-Type': 'application/json; application/octet-stream'
  },
  responseType: 'blob'
})
```
<!-- tabs:end -->

## 接口请求传参方式

**post application/x-www-form-urlencoded传参**

```javascript
// 在接口为该提交方式时有效，Content-Type: application/x-www-form-urlencoded;charset=UTF-8

// 将post的信息由请求头 => 请求链接参数中
function translateUploadData (dataObj) {
  const params = new URLSearchParams()
  Object.keys(dataObj).forEach(key => {
    if (!dataObj[key]) { return }
    key += ''
    params.append(key, dataObj[key])
  })
  return params
}

axios({
  url,
  method: 'POST',
  data: translateUploadData(data),
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
```

**post multipart/form-data传参**

```javascript
function postReqByMultipartFormdata (data) {
  let formData = new FormData()
  // 文件数据
  formData.append('picture', data.file)
  // 其他参数
  formData.append('name', data.name)
  return formData
}

axios({
  url,
  method:'POST',
  data: postReqByMultiFormData(data),
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
```

**post application/json传参**: 默认的接口传参方式

```javascript
axios({
  url,
  method: 'POST',
  // 此处若是传参特殊的数组形式,需要使用到其他npm包,比如qs,querystring等
  // 同时,此处的data属性,可以直接是一个数组(而非对象),这时若传输错误,同样需要配合qs等npm包使用
  data: JSON.stringify(data)
})
```

**get 请求体传参**:

方案参考:
- 浏览器不支持get body
- 使用xhr
- 使用fetch api

```javascript
// xhr
var data = JSON.stringify(data);

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("GET", url);

// 重要的设置
xhr.withCredentials = false;

xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Accept", "*/*");
xhr.setRequestHeader("Cache-Control", "no-cache");
xhr.setRequestHeader("Postman-Token", "7c8c5c5f-effc-4cbb-a5c9-6e3f72c554a6,2bc402e6-9654-4f13-9e7e-33550bed91bc");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);

```

**get 默认url传参**:

```javascript
// 默认
axios.get(url, {
  params: data
})

// 参数拼接
axios.get(`http://xxx.com/${params1}/${params2}`)

```
