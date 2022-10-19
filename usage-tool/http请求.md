# http请求

<!-- tabs:start -->
<!-- tab:get请求 -->
```JavaScript
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
```JavaScript
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