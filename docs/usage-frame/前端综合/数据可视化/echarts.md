# echarts

## 阅读前须知

[需求帮助的渠道](https://echarts.apache.org/handbook/zh/basics/help):

- 官方文档：aip、配置项、文档实例、常见问题
- 社区
- 搜索引擎

## 特性

**丰富的可视化类型**：

包括折线图、柱状图、散点图、饼图、K线图、热力图、地图、关系图、树图、旭日图、漏斗图。

同时支持自定义图形渲染，只需要传入一个renderItem函数，就可以从数据映射到任意图形，并且还能和已有的交互组件组合使用。

**✅多种数据格式无需转换直接使用**：

echarts内置的dataset属性（4.0+）支持直接传入包括二维表、key-value等格式的数据源，通过简单设置encode属性，就可以完成从数据到图形的映射，省去了大部分场景下数据转换的步骤，而且多个组件能够共享一份数据无需克隆。

为了配合大数据量的展现，还支持输入TypedArray格式的数据，该格式在大数据存储中占用内存更少。

**千万数据的前端展现**：

通过增量渲染技术（4.0+），能够展现千万级的数据量，在该数据量级下依然可以保持流畅的交互体验。

通过对流加载（4.0+）的支持，可以使用WebSocket或者对数据分块后加载，加载多少渲染多少，不用等所有数据加载完再渲染。

**移动端优化**：

比如移动端小屏适于用手指操作，可以支持手势缩放和平移。PC端支持鼠标滚轮缩放和平移操作。

细粒度的模块化和打包机制可以让echarts在移动端也拥有很小的体积，可选的SVG渲染模块让移动端内存占用不再捉襟见肘。

**多渲染方案，跨平台使用**：

echarts支持Canvas、SVG、VML来渲染图表。Canvas可以轻松应对大数据量和特效的展现，SVG可以让移动端不再为内存担忧，VML可以兼容低版本的IE。

除了PC和移动端的浏览器，还支持在node上配合node-canvas进行高效的服务端渲染（SSR），以及对微信小程序的适配。

**深度的交互式数据探索**：

交互是从数据中发掘信息的重要手段，echarts提供了图例、视觉映射、数据区域缩放、tooltip、数据刷选等开箱即用的交互组件，可以对数据进行多维度数据筛取（矩形选择、圈选、保持选择、取消选择）、视图缩放、展示细节等交互操作。

**多维数据的支持以及丰富的视觉编码手段**：

echarts（3.0+）加强了对多维数据的支持，除了加入了平行坐标等常见的多维数据可视化工具外，对于传统的散点图，传入的数据也可以是多维度的。

配合视觉映射组件visualMap提供的丰富的视觉编码，能够将不同维度的数据映射到颜色、大小、透明度、明暗度等视觉通道上，让数据更加直观。

**动态数据**：

动态数据的实现异常简单，只需要获取数据，填入数据，echarts会找到两组数据之间的差异，然后通过合适的动画去表现数据的变化。

配合timeline组件能够在更高的时间维度上去表现数据的信息。

**绚丽的特效**：

echarts针对线数据，点数据等地理数据的可视化，提供了吸引眼球的特效。

**通过GL实现更多更强大绚丽的三维可视化**：

若想在VR、大屏场景中实现三维可视化效果，可以使用基于WebGL的echarts GL，用法和echarts基本一致。

**无障碍访问（4.0+）**：

ECharts 4.0 遵从W3C 制定的无障碍富互联网应用规范集，支持自动根据图表配置项智能生成描述，使得盲人可以在朗读设备的帮助下了解图表内容，让图表可以被更多人群访问。

## 安装和引入

**安装**：

- 包管理工具：`npm install echarts`
- cdn：jsDelivr、unpkg、cdnjs
- [github](https://github.com/apache/echarts/releases)：解压后dist目录下的echarts.js是完整的echarts包，引入即可使用。

**在项目中引入**：

通常使用包管理工具安装后，可以完整引入或者按需引入。在按需引入时，echarts不再提供任何渲染器，需要开发者自行引入。

::: code-group

```javascript [完整引入]
import * as echarts from 'echarts'

// 初始化echarts实例
const myChart = echarts.init(document.getElementById('main'))

// 绘制图表
myChart.setOption({
  title: {
    text: 'ECharts 入门示例'
  },
  tooltip: {},
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }
  ]
})
```

```javascript [按需引入]
// 引入echarts核心模块（提供echarts使用必需要的接口）
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart} from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import { TitleComponent, TooltipComponent, GridComponent, DatasetComponent } from 'echarts/components'
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// ✅引入canvas渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])

// 后续操作同上，即初始化echarts实例，配置图表
const myChart = echarts.init(document.getElementById('main'))
myChart.setOption({
  // ...
})
```

```typescript [在typescript中按需引入]
import * as echarts from 'echarts'
import { 
  BarChart,
  LineChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components'
import {
  LabelLayout,
  UniversalTransition
} from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

// 引入类型
import type {
  // 系列类型的定义后缀都是 SeriesOption
  BarSeriesOption,
  LineSeriesOption
} from 'echarts/charts'
import type {
  // 组件类型的定义后缀都是 ComponentOption
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  DatasetComponentOption,
} from 'echarts/components'
import type {
  ComposeOption,
} from 'echarts/core'

// ✅通过ComposeOption组合出一个只有必须组件和图表的Option类型
type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])

const option: ECOption = {
  // ...
}

const myChart = echarts.init(document.getElementById('main'))
myChart.setOption(option)
```

:::

## 概念

### 图表容器和大小

通常情况下，图表容器的宽高默认为初始化传入的dom节点的宽高（通过css设置），可以通过`option.width`和`option.height`将其覆盖。

在图表容器被销毁之后，必须先调用`myChart.dispose()`销毁图表实例，释放资源，避免内存泄露。后续在图表容器重新被添加后，再次调用`myChart.init()`初始化图表实例。

::: code-group

```html [默认为dom节点宽高]
<div id="main" style="width: 600px; height: 400px;"></div>
<script type="text/javascript">
  const myChart = echarts.init(document.getElementById('main'))
</script>
```

```html [指定图表的宽高]
<div id="main"></div>
<script type="text/javascript">
  const myChart = echarts.init(document.getElementById('main'), null, {
    width: 600,
    height: 400
  })
</script>
```

```html [图表宽高响应式变更]
<style>
  #main,
  html,
  body {
    width: 100%;
  }
  #main {
    height: 400px;
  }
</style>
<div id="main"></div>
<script type="text/javascript">
  const myChart = echarts.init(document.getElementById('main'))
  window.addEventListener('resize', function () {
    myChart.resize()
    // 或者设置特定的宽高
    // myChart.resize({
    //    width: 600,
    //    height: 400
    // })
  })
</script>
```

:::

### 样式

设置样式，改变图形元素/文字的颜色、明暗、大小，可以通过下述几种方式：

- 颜色主题（theme）
- 调色盘
- 直接样式设置（itemStyle、lineStyle、areaStyle、label...）
- 视觉映射（visualMap）：能指定数据到颜色、图形尺寸的映射规则

**颜色主题（theme）**：

颜色主题是最简单的更改全局样式的方式，echarts内置了默认主题、dart主题。其他主题需要自行加载注册

::: code-group

```javascript [切换深色模式]
const myChart = echarts.init(document.getElementById('main'), 'dark')
```

```javascript [加载json格式自定义主题]
// 假设主题名为vintage
fetch('xxx/vintage.json')
  .then(res => res.json())
  .then(theme => {
    echarts.registerTheme('vintage', theme)
    const myChart = echarts.init(document.getElementById('main'), 'vintage')
  })
```

```javascript [加载umd-js格式自定义主题]
// umd格式的js文件，文件内部已经做了自注册，直接引入即可
// html通过script标签引入了vintage.js文件后
const myChart = echarts.init(document.getElementById('main'), 'vintage')
```

:::

**调色盘**：

调色盘可以在option中设置，给定一组颜色，图形、系列会自动从中选择颜色。

可以设置全局调色盘，也可以单独给某个系列指定调色盘。

::: code-group

```javascript [全局调色盘]
const option = {
  // 指定全局调色盘
  color: [
    '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae'
  ]
}
```

```javascript [给某个系列指定调色盘]
const option = {
  sereis: [{
    type: 'bar',
    // 指定调色盘
    color: [
      '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae'
    ]
  }]
}
```

:::

**直接的样式设置**：

echarts中，很多地方可以设置itemStyle、lineStyle、areaStyle、label等，这些样式可以直接设置图形元素的颜色、线宽、点的大小、标签的文字/样式等。一般来说，echarts各组件和系列都遵从这些命名习惯。

在鼠标悬浮到图形元素上时，一般会出现高亮样式，默认情况下高亮样式是根据普通样式自动生成，但也可通过emphasis定制。emphasis结构如下：

::: code-group

```javascript [emphasis-echarts4+]
const option = {
  series: {
    type: 'scattter',
    // 普通样式
    itemStyle: {
      // 点的颜色
      color: 'red'
    },
    label: {
      show: true,
      // 标签文字
      formatter: 'this is a normal label'
    },
    // 高亮样式
    emphasis: {
      itemStyle: {
        // 高亮时点的颜色
        color: 'blue'
      },
      label: {
        show: true,
        // 高亮时标签文字
        formatter: 'this is a emphasis label'
      }
    }
  }
}
```

```javascript [emphasis-echarts3]
// 该种写法仍被兼容，但不推荐使用
const option = {
  series: {
    type: 'scattter',
    itemStyle: {
      noraml: {
        color: 'red'
      },
      emphasis: {
        color: 'blue'
      }
    },
    label: {
      noraml: {
        show: true,
        formatter: 'this is a normal label'
      },
      emphasis: {
        sow: true,
        formatter: 'this is a emphasis label'
      }
    }
  }
}
```

:::

### 数据集

设置数据的方式：

- 系列（series）
- 数据集（dataset）

> 虽然每个系列都可以在series.data中设置数据，但从echarts4.0+开始，更推荐使用数据集管理数据。这种形式的数据可以被多个组件复用，方便进行数据和其他配置分离的配置风格。

**系列（series）**：

优点：适用于对一些特殊的数据结构（树、图、超大数据）进行一定的数据类型定制。

缺点：

- 常需要用户先处理数据，把数据分割设置到各个系列和类目轴中；
- 不利于多个系列共享一份数据；
- 不利于基于原始数据进行图表类型、系列的映射安排。

**数据集（dataset）**：专门用来管理数据的组件

优点：

- 能够贴近数据可视化常见思维方式：提供数据；指定数据到视觉的映射，形成图表。
- 数据和其他配置分离，易于分别管理
- 数据可以被多个系列/组件复用
- 支持更多的数据常用格式，如二维数组、对象数组，一定程度上避免了数据的转换
