# nvue开发指导

## 官网注意事项

### template

- 只能在`text`标签中设置字体大小、颜色等属性
- 文字内容必须只能在text标签中，放在div、view中无法绑定js变量
- text组件不能换行写内容，否则会出现无法去除的周边空白
- 只支持`v-if`，不支持`v-show`
- `image`标签不支持svg图片，支持base64
- `:render-whole="true"`：将组件及其子组件信息结构一次性和原生层通信，通过整个节点的重绘提升了排版渲染性能。为false时，总体渲染时间可能更久。该属性在高版本手机中效果不是很明显
- 页面没有bounce回弹效果，仅有列表组件（list、recycle-list、waterfall）有该效果
- 原生开发无页面滚动概念，页面高度超过屏幕高度不会自动滚动，需要在外层自动套scroller组件

### script

- 不支持`onLoad`钩子，可使用`mounted`钩子
- 在App.vue中定义的全局js变量不会在nvue页面中生效，globalData和vuex是生效的
- 不支持在nvue页面中使用typescript/ts

### css

- 只支持`class`选择器
- nvue盒模型box-sizing默认为border-box，即`width = content + padding + border`
- nvue+android中，只支持`overflow:hidden;`，ios中支持hidden和visible
- 不支持`/deep/`
- 支持定位布局（position）
- 支持动画、过渡、转换、阴影（box-shadow，安卓平台不是很完善，故新增elevation属性设置组件层级，层级越大阴影越明显）、线性渐变（linear-gradient）
- 只支持flex布局，默认布局为column
- flex成员项，暂不支持flex-shrink、flex-basis、align-content
- 只支持`px`，`rpx`，不支持`%`, `rem`, `vw`, `vh`, 媒体查询
- 不支持`background-image`，可使用`image`组件和`position`定位代替
- `fixed`不支持`z-index`
- `:class`, `:style`只支持数组模式
- 全局样式，应该放在`uni.scss`文件中，或者将样式导入到该文件。这样整个项目都可以用这些样式了
- 切换横竖屏时可能导致样式错乱，在nvue的页面中建议锁定手机方向
- nvue组件在Android端默认是透明的，不设置背景颜色会导致出现重影问题
- App.vue中定义的全局css，对nvue和vue页面同时生效
- 不能在style中引入字体文件，nvue中字体图标的使用参考[加载自定义字体](https://uniapp.dcloud.net.cn/tutorial/nvue-api.html#addrule)，本地字体可用plus.io转换路径

### 加载自定义字体

```vue
<template>
  <view>
    <text class="my-iconfont">&#xe85c;</text>
  </view>
</template>

<script>
export default {
  beforeCreate() {
    const domModule = uni.requireNativePlugin('dom')
    // fontFace为固定协议名称，不可修改
    domModule.addRule('fontFace', {
      // 添加字体，此处的名字可以随便取，
      // 但是应该保证ttf实际的字体名字（默认为iconfont）特殊，不然注册时会发生冲突，从而注册失败
      'fontFamily': 'myIconfont',
      'src': 'url("http://at.alicdn.com/t/font_2234252_v3hj1klw6k9.ttf")'
    })
  }
}
</script>

<style>
.my-iconfont {
  /* 使用字体 */
  font-family: myIconfont;
  font-size: 60rpx;
  color: red;
}
</style>
```

### nvue获取组件的节点信息

在nvue中，不能使用 uni.createSelectorQuery获取节点信息

可使用下面方案进行代替：

```vue
<script>
  // 注意平台差异
  // #ifdef APP-NVUE
  const dom = weex.requireModule("dom");
  // #endif

  export default {
    data() {
      return {
        size: {
          width: 0,
          height: 0,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      };
    },
    onReady() {
      setTimeout(() => {
        const result = dom.getComponentRect(this.$refs.box, (option) => {
          console.log("getComponentRect:", option);
          this.size = option.size;
        });
        console.log("return value:", result);
        console.log("viewport:", dom.getComponentRect("viewport"));
      }, 100);
    },
  };
</script>
```

### 与webview事件通信

#### 事前准备

第一步：点击[DCloud uni-app](https://gitcode.net/dcloud/hello-uni-app-x/-/tree/alpha/hybrid/html)，下载`uni.webview.x.x.x.js`文件，放入到与`index.html`同级的目录下

第二步：在应用的入口文件（比如index.html）中，加入以下代码：

```html
<html>
  <body>
    <div id="app"></div>
  </body>
  <!-- 开始加入uni通信功能代码 -->
  <script type="text/javascript" src="./uni.webview.x.x.x.js"></script>
  <script>
    document.addEventListener('UniAppJSBridgeReady', function() {
       // ......
    });
  </script>
  <!-- 结束加入uni通信功能代码 -->
</html>
```

第三步：在使用`uni.xxx`功能的代码文件中，关闭eslint功能

#### web应用发送给/接收到基座apk的数据

第一步：在使用`uni.xxx`功能的代码文件中，关闭eslint功能

第二步：`uni.postMessage`方法的参数定义：

```javascript
/**
 * type: {string} 发送数据的目的，比如获取token（getToken）
 *   type的值：
 *      getToken
 *      getAuth
 *      ......
 *  payload：{object} 发送数据附带的其他数据信息
 */
function uni.postMessage ({
  type: string,
  payload: object
}) {
  return null
}
```

第三步：发送数据

**vue3**：

```vue
<template>
  <div>
    <button @click="sendDataToBaseApp">
      发送数据给基座app
    </button>
  </div>
  <div>
    展示从基座app接收的数据：{{ baseAppData }}
  </div>
</template>

<script setup>
import { ref } from 'vue'

let baseAppData = ref({})

function sendDataToBaseApp () {
  const data = {
    name: 'sub-app',
    date: (new Date()).toLocaleTimeString()
  }
  // 使用uni.postMessage()发送数据
  uni.postMessage({
    type: 'getToken',
    payload: data
  })
}

// 必须将uni.postMessage参数type的值，附加到window对象上对应的该函数上，以获取相应的信息
window.getToken = function (data) {
  baseAppData.value = JSON.parse(data)
}
</script>
```

#### 基座apik发送给/接收到web应用的数据

```vue
<template>
  <!-- 可使用class设置web-view的高宽度 -->
  <web-view class="web-nview-inner" ref="webview" :webview-styles="{
      // 加载时顶部进度条颜色
      progress: {
        color: '#eee'
      }
    }"
    :fullscreen='false' :src="webUrl.url" @onPostMessage="receiveMessage" @message="receiveMessage">
  </web-view>
</template>

<script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: () => false
      },
      webUrl: Object
    },
    data() {
      return {

      };
    },
    methods: {
      openActiveView() {
        this.$emit('openActiveView', this.webUrl)
      },
      // data: { type: 发送数据类型, payload: 数据体 }
      sendMessage(data) {
        try {
          let transData = JSON.stringify(data)

          // vue文件
          // let currentWebView = this.$scope ? this.$scope.$getAppWebview() : this.$parent.$scope.$getAppWebview()
          // let webView = currentWebView.children()[0]
          // console.log(currentWebView)
          // console.log(webView, 'webview')
          // webView.evalJS(`setAccountInfo(${transData})`)
          // setTimeout(function() {
          //   webView.setStyle({ //设置web-view距离顶部的距离以及自己的高度，单位为px
          //     top: 65, //此处是距离顶部的高度，应该是你页面的头部 40  65
          //     bottom: 60,
          //     height: 200, //webview的高度
          //     scalable: true, //webview的页面是否可以缩放，双指放大缩小,
          //   })
          // }, 500); //如页面初始化调用需要写延迟

          // nvue文件
          this.$refs.webview.evalJS(`setAccountInfo(${transData})`)
        } catch (err) {
          console.log(err, 'err')
        }
      },
      // 接收数据
      receiveMessage(evt) {
        console.log('来自子页面的数据=', evt)
        this.subData = evt.detail.data
        this.$emit('receiveData', evt.detail.data)
      },
    }
  }

</script>
```

## 开发注意事项

### 项目运行

对于某些包，需要使用`npm i xxx`进行安装，所以在第一次运行的时候，需要使用`npm i`进行项目依赖的安装

### 连接到模拟器

打开模拟器安装目录，找到类似`adb.exe`的文件后，然后运行`adb connect 127.0.0.1:[port]`提示连接成功后，打开【运行】-【运行到手机或模拟器】-【运行到安卓基座】，点击刷新，找到相同的`port`即可

### 本地离线打包

建议使用uniapp官方推荐的离线sdk的目录中的项目进行修改更快，而非创建一个新项目

Android Studio打包没有`Generate signed apk`选项，解决方法：

- 必须配置代理，下载控制台提示的某些文件（比如gradle-6.5-all.zip），放在本地，在`gradle\wrapper\gradle-wrapper.properties`文件中通过本地路径`distributionUrl=file:///C:/Users/admin/Downloads/Android-SDK@3.99.81993_20231227/HBuilder-Integrate-AS/gradle-6.5-all.zip`引入它
- 【必须配置代理，下载控制台提示的某些文件，放在本地，然后通过本地引入它】，再点击`file`，选中`Sync Project with Gradle Files`，等需要增加的文件下载完，在重启就可以了。

### 复杂布局可多使用插槽

在复杂的页面布局中，可灵活使用（嵌套的）插槽的形式进行组件的开发。这样数据的传递和获取都变得更加的容易。类似下面：

```vue
<template>
  <n-setting :tab="activeTab" @close='handleCloseSetting'>
    <component :apps="webViews" :is="activeTab.component" @setActiveWebview="setActiveWebview">
      <component :is="innerCompInSys.component" @editTitle="editSysTitle"></component>
    </component>
  </n-setting>
</template>
```

### 系统导航栏占位

使用`uni-nav-bar`中的`status-bar`组件放在页面/组件顶部即可；

或使用`uni.getSystemInfoSync().statusBarHeight`获取状态栏高度，然后绑定到对应的元素上进行占位

### u-image图片无法显示

使用网络图片，或者使用类似`@/static/xxx.png`的形式，而非相对路径`..`的形式

### webview非实际高宽展示

出现该问题，应该该路由页面的后缀改为`.nvue`即可，因为`.vue`后缀模式中webview是直接占据全屏的

### 在webview上面（z-index）显示其他内容

使用position定位属性、`cover-view`元素。若上面内容需全面覆盖webview窗口，则上面内容组件的flex应该设为1

### webview在nvue安卓手机无法滚动

当页面整体存在滚动条时，内部是滚动条是失效的，所以，要让内部子元素（比如列表、webview）的滚动条生效，则子元素的祖先元素必须不能出现滚动条，即该元素的高度不能超过视口最大高度，否则滚不动

### template、block占位元素失效

两者互相替换试试，总有一个有效果

### 内容无法滚动

若想使得内容滚动，需要嵌套一个`scroll-view`

### 点击事件触发不了

view、text赋予点击事件无法触发时，可使用其他第三方组件库的组件进行包裹

### 页面元素布局混乱

- 检查元素的高宽度是否合适，可将不应该显示的元素高度设为0
- 设置元素的flex，当为0时，元素的占位是实际的高宽度，当为1时，是剩余宽度/均分剩余宽度

## 错误汇总
