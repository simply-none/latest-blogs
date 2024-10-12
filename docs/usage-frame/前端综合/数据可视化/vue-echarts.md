# vue echarts

定义：echarts的vue组件

## props

### init-options

该选项对应于`echarts.init`的第三个参数ops，可选属性有：

```typescript
// echarts.init的类型定义
(
  dom: HTMLDivElement | HTMLCanvasElement,
  theme?: string | object,
  opts?: {
    // init-options可选属性
    devicePixelRatio?: number;
    renderer?: string;
    useDirtyRect?: boolean;
    useCoarsePointer?: boolean;
    pointerSize?: number;
    ssr?: boolean;
    width?: number|string;
    height?: number|string;
    locale?: string;
  }
) => EChart
```

### theme

应用的主题，对应于`echarts.init`的第二个参数theme，值类型为`string | object`

### option

图表配置，对应于`echartsInstance.setOption`的第一个参数option。

```typescript
// echartsInstance.setOption的类型定义
(
  option: Object,
  notMerge?: boolean,
  lazyUpdate?: boolean
)

// 或者：
(
  option: Object,
  opts?: {
    notMerge?: boolean;
    lazyUpdate?: boolean;
    replaceMerge?: string | string[];
  }
)
```

修改该prop会触发echarts的setOption方法，从而进行图表的更新。当不指定update-options prop时，修改option且不改变其引用地址，默认会将当前的option和旧的option进行合并。否则将直接替换旧的option。

### update-options

更新图表选项的配置，对应于`echartsInstance.setOption`的第二个之后的参数。类型定义见上面。

### group

在多个chart实例进行连接时的组名称，对应于`echartsInstance.group`。

### autoresize

是否应该在调整图表根的大小时自动调整图表的大小，使用options对象指定自定义限制延迟（ms），或额外的resize回调函数。

类型定义如下：

```typescript
boolean | {
  throttle?: number;
  onResize?: () => void;
}
```

### loading

图表是否处于加载状态

### loading-options

加载动画的配置项，对应于`echartsInstance.showLoading`的opts参数。

```typescript
// echartsInstance.showLoading的类型定义
(
  // 未来只有default被支持
  type?: string,
  opts?: {
    // type为default时的属性
    text: 'loading',
    color: '#c23531',
    textColor: 'white',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0
    fontSize: 12,
    showSpinner: true,
    spinnerRadius: 10,
    lineWidth: 5,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontFamily: 'sans-serif',
  }
)
```

### maunal-update

是否手动更新option，对于性能关键的场景，最好绕过vue的option prop响应式系统。此时可设置该属性为ture，同时不指定option，而是通过ref检索到echarts实例，手动调用setOption方法更新图表。

## 事件

可以使用`v-on`绑定事件，注意此时仅支持`.once`修饰符，因为其他的修饰符与DOM事件系统紧密耦合。

当要绑定原生DOM事件时，需要使用例如`@native:click`的形式。

## provide/inject

可以使用依赖注入的形式替换`theme`, `init-options`, `update-options`, `loading-options` prop的功能。

使用形式是在使用到vue-echarts组件的地方引入provide即可：

```typescript
import { THEME_KEY } from 'vue-echarts'
import { provide } from 'vue'

// 组合式
provide(THEME_KEY, 'dark')

// 选项式
export default {
  provide: {
    [THEME_KEY]: 'dark'
  }
}
```

<!--  -->

## 方法

在获取到echarts实例（通过ref）后，可以调用一些方法，例如：setOption、getWidth、getHeight、getDom、getOption、resize、dispatchAction、convertToPixel、convertFromPixel、containPixel、getDataURL、getConnectedDataURL、clear、dispose、showLoading、hideLoading。

静态方法可以直接通过echarts本身进行访问。
