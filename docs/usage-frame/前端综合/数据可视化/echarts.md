# echarts

## 阅读前须知

[需求帮助的渠道](https://echarts.apache.org/handbook/zh/basics/help):

- 官方文档：aip、配置项、文档实例、常见问题
- 社区
- 搜索引擎

**注意事项**：

- 某些值只在某个版本之后才会生效
- 某些属性只有在其他某些属性搭配下才会生效

## 零散小记

数据为空,可以用`-`代替,此时该处位置将是空白的,而非展示0的内容

有些值为对象的属性,设置为空对象时也会有相应的效果,因为对象会有默认的属性值

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

**系列（series）**：

优点：

- 适用于对一些特殊的非table格式的数据结构（树、图、超大数据等）进行一定的数据类型定制。这些结构仍不支持在dataset中设置，只能通过series.data设置。
- 对于巨大数据量的渲染，需要使用appendData进行增量加载，这种情况下不支持使用dataset。

缺点：

- 常需要用户先处理数据，把数据分割设置到各个系列和类目轴中；
- 不利于多个系列共享一份数据；
- 不利于基于原始数据进行图表类型、系列的映射安排。

若系列已经声明了series.data，那么就会使用series.data中的数据，而非dataset。

**数据集（dataset）**：专门用来管理数据的组件

优点：

- 能够贴近数据可视化常见思维方式：提供数据；指定数据到视觉的映射，形成图表。
- 数据和其他配置分离，易于分别管理
- 数据可以被多个系列/组件复用
- 支持更多的数据常用格式，如二维数组、对象数组，一定程度上避免了数据的转换

虽然每个系列都可以在series.data中设置数据，但从echarts4.0+开始，更推荐使用数据集管理数据。这种形式的数据可以被多个组件复用，方便进行数据和其他配置分离的配置风格。

同时，并非所有图表都支持dataset，目前支持dataset的图表有：line、bar、pie、scatter、effectScatter、parallel、candlestick、map、funnel、custom

::: code-group

```javascript [系列(series)]
const option = {
  // x为类目轴
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  // y为数值轴
  yAxis: {},
  series: [
    {
      type: 'bar',
      name: '2015',
      data: [18203, 23489, 29034, 104970, 131744, 630, 233]
    },
    {
      type: 'bar',
      name: '2016',
      data: [19325, 23438, 31000, 121594, 134141, 630, 213]
    },
    {
      type: 'bar',
      name: '2017',
      data: [1325, 3438, 4000, 129494, 104141, 630, 213]
    }
  ]
}
```

```javascript [数据集：二维数组]
const option = {
  legend: {},
  tootip: {},
  dataset: {
    // 提供一份数据
    source: [
      ['product', '2015', '2016', '2017'],
      ['Matcha Latte', 41.1, 30.4, 65.1],
      ['Milk Tea', 26.4, 35.6, 71.8],
      ['Cheese Cocoa', 12.4, 30.5, 61.9],
      ['Walnut Brownie', 7.9, 32.8, 60.4],
    ]
  },
  // 声明类目轴，默认情况下对应到dataset的第一列
  xAxis: { type: 'category' },
  // 声明数值轴
  yAxis: {},
  // 声明多个bar系列，默认情况下每个系列自动对应到dataset的每一列
  series: [{type: 'bar'}, {type: 'bar'}, {type: 'bar'}]
}
```

```javascript [数据集：对象数组]
const option = {
  legend: {},
  tootip: {},
  dataset: {
    // 声明维度，比如直角坐标系，第一个维度映射到X轴，后面维度映射到Y轴
    // 不指定dimensions，可以通过指定series.encode完成映射
    dimensions: ['product', '2015', '2016', '2017'],
    source: [
      { product: 'Matcha Latte', '2015': 41.1, '2016': 30.4, '2017': 65.7 },
      { product: 'Milk Tea', '2015': 26.4, '2016': 35.6, '2017': 8 },
      { product: 'Cheese Cocoa', '2015': 12.4, '2016': 30.5, '2017': 61.9 },
      { product: 'Walnut Brownie', '2015': 7.9, '2016': 32.8, '2017': 4 }
    ]
  },
  xAxis: { type: 'category' },
  yAxis: {},
  seires: [{type: 'bar'}, {type: 'bar'}, {type: 'bar'}]
}
```

:::

#### 数据到图形的映射

数据到图形的映射方式：

- 指定数据集（dataset）的列（column，默认）还是行（row）映射为系列（series），可以用`series.seriesLayoutBy`属性来配置
- 指定维度（dimension）映射的规则，如何从dataset的维度（行/列）映射到坐标轴（X、Y）、提示框（tooltip）、标签（label）、图形元素大小颜色（visualMap）。可以使用`series.encode`属性、visualMap组件来配置

如果未给出相应的映射配置，echarts会按照最常见的理解进行默认映射。即X坐标轴声明为类目轴，默认情况下会自动对应到`dataset.source`中的第一列，剩余的内容会一一对应到后面的每一列。

**把数据集（dataset）的行/列映射为系列（series）**：

使用`series.seriesLayoutBy`属性，改变图表对行列的理解，取值如下：

- column: 默认值，数据集的列映射为系列
- rwo: 数据集的行映射为系列

**维度（dimension）**：

常用图表描述的数据大部分是二维表结构，当把系列（series）对应到列时，那么每一列就是一个维度（dimension），而每一行叫做一个数据项（item）。反之，当把系列对应到行时，每一行就是一个维度，而每一列叫做一个数据项。

维度可以有单独的名字，便于在图表中显示，通常定义在dataset的第一行/列中，从第二行/列开始才是正式的数据。可以通过`dataset.sourceHeader: true`显式声明第一行/列就是维度，或者通过`dataset.sourcelHeader: false`表明第一行/列开始直接就是数据。

维度的定义，可以使用单独的`dataset.dimensions`或者`series.dimensions`来定义，这样可以同时指定维度名和维度类型。大多数情况无需设置维度类型，当维度类型不够精确时，可以手动设置，取值如下：

- `number`：默认，表示普通数据
- `ordinal`：对于类目、文本这些string类型数据，若需要能在数轴上使用，需要指定为该类型
- `time`： 表示时间数据，指定为该类型后，能自动解析数据为时间戳形式。如果维度被用在时间数轴（`axis.type = 'time'`）上，则会自动设置为该类型
- `float`：设为该类型后，在存储时会使用TypedArray，对性能优化有好处
- `int`：设为该类型后，在存储时会使用TypedArray，对性能优化有好处

::: details 维度的定义

```javascript
const option1 = {
  dataset: {
    dimensions: [
      { name: 'score' },
      // 简写形式，表示dimension name
      'amount',
      { name: 'product', type: 'ordinal' },
    ]
  }
}

const option2 = {
  dataset: {
    source: [],
  },
  series: {
    type: 'line',
    // series.dimensions 优先于 dataset.dimensions
    dimensions: [
      // 不想设置维度名
      null,
      'amount',
      { name: 'product', type: 'ordinal' },
    ]
  }
}
```

:::

**数据到图形的映射（series.encode）**:

`series.encode`的基本结构为：冒号左边是坐标系、标签等特定名称，比如`x`, `y`, `tooltip`等；冒号右边是数据中的维度名（string格式）或者维度序号（number格式，从0开始），可以指定一个或多个维度（数组）。

::: details series.encode支持的属性

```javascript [任何坐标系/系列]
// 在任何坐标系和系列中都支持的：
const encode = {
  // 使用维度product和score的 值 在tooltip中显示
  tooltip: ['product', 'score'],
  // 使用维度序号1和3的 维度名 连起来作为系列名
  seriesName: [1, 3],
  // 使用维度序号2的 值 作为id，在使用setOption动态更新数据时有用
  // 可以使新老数据用id对应起来，从而产生合适的数据更新动画
  itemId: 2,
  // 使用维度序号3 指定数据项的名称，在饼图等图表中有用，可以使用这个名字显示在图例（legend）中
  itemName: 3,
}
```

```javascript [直角坐标系]
// 直角坐标系（grid、Cartesian）特有的属性：
const encode = {
  // 把维度序号1和3，以及维度名为score的维度，映射到x轴
  x: [1, 3, 'score'],
  // 把维度序号0的维度映射到y轴
  y: 0,
}
```

```javascript [单轴(singleAxis)]
// 单轴（singleAxis）特有的属性：
const encode = {
  single: 3
}
```

```javascript [极坐标系]
// 极坐标系（polar）特有的属性：
const encode = {
  radius: 3,
  angle: 2
}
```

```javascript [地理坐标系]
// 地理坐标系（geo）特有的属性：
const encode = {
  lng: 3,
  lat: 2
}
```

```javascript [无坐标系的图表]
// 对于一些没有坐标系的图表（饼图、漏斗图等），可以是：
const encode = {
  value: 3
}
```

:::

当`series.encode`中没有指定时，echarts会有一些默认的映射规则，大体如下：

- 在坐标系（直角坐标系、极坐标系等）中，若有类目轴（`axis.type = 'category`），则将第一列/行映射到这个轴上，后续每一列/行对应一个系列；若无类目轴，假如坐标系有2个轴（X、Y），则每两列对应一个系列，这两列分别映射到这2个轴上
- 若无坐标系（饼图等），则取第一列/行作为名字，第二列/行作为数值；若只有一列，则取这一列作为数值

若上述默认规则不满足要求，可以自己手动配置encode。

#### 多个数据集的引用

可以同时定义多个dataset，系列可以通过`series.datasetIndex`来指定使用哪个数据集。

```javascript
const option = {
  dataset: [
    {
      // 序号为0的数据集
      source: []
    },
    {
      // 序号为1的数据集
      source: []
    },
    {
      // 序号为2的数据集
      source: []
    }
  ],
  series: [
    {
      // 使用序号为2的数据集
      datasetIndex: 2
    },
    {
      // 默认使用序号为0的数据集
      datasetIndex: 0
    }
  ]
}
```

### 数据转换

echarts5开始支持数据转换（data transform）。

数据转换是指给定一个已有的数据集（dataset）和一个转换方法（transform），echarts能生成一个新的数据集，然后使用新的数据集绘制图表。

数据转换类似于：`outData = f(inputData)`，f是转换方法，例如filter、sort、regression、boxplot、cluster、aggregate等。

数据转换能够做的事情有：

- 把数据分成多份，用不同的饼图展现
- 进行一些数据统计运算，并展示结果
- 用某些数据可视化算法处理数据，并展示结果
- 数据排序
- 去除或直接选择数据项
- ……

大多数场景下，transform只需要输出一个data，但在某些场景（比如boxplot transform）中，一个transform可以输出多个data，每个data可以被不同的series或dataset使用。

多个data输出时，默认情况下，直接引用dataset得到的是多个data中的第一个。若想得到其他data，需要使用`dataset.fromTranformResult`配置进行再次转换，然后引用这个transform所在的dataset。

`dataset.fromTransformResult`和`dataset.transform`能够同时出现在一个dataset中，此时表示该transform的输入，是上一个transform 输出结果的 指定索引值为`fromTransformResult`值的数据。

在使用transform时，有时候配置可能不对，显示不出结果，这是可以通过配置项`transform.print`打印出transform的结果。

数据转换用到的属性有以下几种：

- `dataset`
  - `id`：数据集的id
  - `transform`：数据转换的配置项（对象或对象数组），当为对象数组时，表示链式调用，前一个transform的输出作为下一个transform的输入
    - `type`：转换方法，例如`filter`, `sort`等
    - `config`：转换方法的配置参数（对象格式），用于指定筛选条件
    - `print`：是否打印转换结果，用于调试
  - `fromDatasetIndex`：指定从哪个数据集（指向数据集的索引）中获取数据（inputData），未指定默认为0
  - `fromDatasetId`：指定从哪个数据集（指向数据集的id）中获取数据（inputData），未指定默认为index为0的数据集
  - `fromTransformResult`：当一个transform输出多个data时，指定使用哪个data（指向data的索引）
- `series`
  - `datasetIndex`：指定使用哪个数据集（指向数据集的索引）

::: details transform示例

```javascript
const option = {
  dataset: [
    {
      // 这个dataset的index为0
      // 可以设置id
      id: 'a',
      source: [
        ['product', 'sales', 'price', 'year'],
        ['iphone', 10, 2345.6789, '2019'],
        ['cake', 10, 2345.6789, '2019'],
        ['tofu', 10, 2345.6789, '2019'],
        ['ipone', 10, 2345.6789, '2020'],
        ['cake', 10, 2345.6789, '2020'],
        ['tofu', 10, 2345.6789, '2020'],
      ]
    },
    {
      // 这个dataset的index为1
      transform: {
        // debug
        print: true,
        type: 'filter',
        // 筛选条件：
        // 筛选出year为2019的所有数据
        config: { dimension: 'year', value: '2019' }
      },
      // 默认使用index为0的数据集
      // 可以手动指定输入
      fromDatasetIndex: 0,
      fromDatasetId: 'a',
    },
    {
      // 这个dataset的index为2
      // 链式声明，前一个transform的输出是后一个的输入
      transform: [
        {
          type: 'filter',
          // 筛选条件：
          // 筛选出year为2019的所有数据
          config: { dimension: 'year', value: '2019' }
        },
        {
          type: 'sort',
          // 排序条件：
          // 按照price降序排列
          config: { dimension: 'price', order: 'desc' }
        }
      ]
    },
    {
      // 这个dataset的index为3
      // 这个boxplot transform的输出2个数据
      // result[0]： boxplot series所需的数据，使用时，默认得到的是这个
      // result[1]： 离群点数据
      id: 'boxplot-e',
      transfrom: {
        type: 'boxplot'
      }
    },
    {
      // 这个dataset的index为4
      // 若想得到上述boxplot transform的输出result[1]，则需要使用fromTransformResult
      fromDatasetId: 'boxplot-e',
      fromTransformResult: 1
    },
    {
      // 同时使用fromTranformResult和transform
      fromDatasetId: 'boxplot-e',
      fromTransformResult: 1,
      transform: {
        type: 'sort',
        config: { dimension: 2, order: 'desc' }
      }
    },
  ],
  series: [
    {
      type: 'pie',
      // 饼图的半径
      radius: 50,
      // 饼图的中心点偏移位置（画布左上角为0,0）
      center: ['25%', '50%'],
      // 指定使用index为1的数据集
      datasetIndex: 1,
    },
    {
      name: 'boxplot',
      type: 'boxplot',
      // 这里获取到的数据是index为3的数据集的输出result[0]
      datasetIndex: 3,
    },
    {
      name: 'outlier',
      type: 'scatter',
      // 这里获取到的数据是index为4的数据集的输出result[1]
      datasetIndex: 4,
    }
  ]
}
```

:::

#### 数据转换器filter

`transfor.type: 'filter'`：内置的起筛选过滤作用的数据转换器。

在filter转换器中，配置项有以下要素：

- 维度（dimension）：维度名或维度索引
- 关系比较操作符：`>`、`>=`、`<`、`<=`、`=`、`!=`、`gt`、`gte`、`lt`、`lte`、`eq`、`ne`、`reg`
- 逻辑比较操作符
- 解析器（parser）

**关系比较操作符**：

多个关系比较操作符能够声明在一个`{}`中，这表明`与`的关系。

如果需要对日期对象或者日期字符串进行比较，需要指定`parser: 'time'`。

纯字符串比较只能用在`=`和`!=`中，其他比较操作符（`>`, `>=`, `<`, `<=`）不支持纯字符串比较。即后四者操作符的右侧不能是字符串。

reg操作符能提供正则表达式毕竟，即筛选出符合正则表达式的数据。

**逻辑比较操作符**：与（and）、或（or）、非（not），这三者可以相互嵌套使用

**解析器（parser）**：

可以指定解析器对值进行解析后进行比较，支持的解析器有：

- `time`：将原始值解析成时间戳后进行比较，不能解析时值为`NaN`
- `trim`：将原始值字符串trim后进行比较，非字符串不做操作
- `number`：将原始值解析成数字后进行比较，不能解析时值为`NaN`，该解析器解析规则比较宽松，若遇到含有尾缀的字符串（例如12px，33%），尾缀将自动去除（12，33）

::: details filter形式化定义

```typescript
type FilterTransform = {
  type: 'filter';
  config: ConditionalExpressionOption;
}

type ConditionalExpressionOption = 
  | true
  | false
  | RelationalExpressionOption
  | LogicalExpressionOption;


type RelationalExpressionOption = {
  dimension: DimensionName | DimesionIndex;
  parser?: 'time' | 'number' | 'trim';
  lt?: DataValue; // 小于，lt可换成 '<'
  lte?: DataValue; // 小于等于，lte可换成 '<='
  gt?: DataValue; // 大于，gt可换成 '>'
  gte?: DataValue; // 大于等于，gte可换成 '>='
  eq?: DataValue; // 等于，eq可换成 '=', value
  ne?: DataValue; // 不等于，ne可换成 '!='
  re?: RegExp | string; // 正则匹配
}

type LogicalExpressionOption = {
  and?: ConditionalExpressionOption[];
  or?: ConditionalExpressionOption[];
  not?: ConditionalExpressionOption;
}

type DataValue = number | string | Date;
type DimensionName = string;
type DimesionIndex = number;
```

:::

#### 数据转换器sort

sort是内置的起排序作用的数据转换器。主要用于在类目轴（axis.type: 'category'）中显示排过序的数据

sort的功能有：

- 排序
- 多重排序，多维度一起排序

**多重排序**：

默认按照数值大小排序，若不能转为数值的字符串，也能够按字符串排序。

当同时存在数值和不可转为数值的字符串，或者说其他类型的值进行比较时，将它们称为incomparable，可以设置`incomparable: 'min' | 'max'`，来指定在这个比较中是最大还是最小，从而使它们能产生比较结果。

解析器和filter转换器中的用法类似。

::: details sort形式化定义

```typescript
type SortTransform = {
  type: 'sort';
  config: OrderExpression | OrederExpression[];
}

type OrderExpression = {
  diemension: DimensionName | DimesionIndex;
  order: 'asc' | 'desc';
  incomparable?: 'min' | 'max';
  parser?: 'time' | 'number' | 'trim';
}

type DimensionName = string;
type DimesionIndex = number;
```

:::

#### 外部数据转换器

外部数据转换器能提供和定制更丰富的功能，比如使用第三方库[ecStat](https://github.com/ecomfe/echarts-stat)进行数据转换，生成聚集、直方图、聚类、回归线等。

用法如下：

```javascript
// 注册外部数据转换器
echarts.registerTransform(ecStatTansform(ecStat).regression);

// 使用
const option = {
  dataset: [
    { source: rawData },
    {
      trnasform: {
        type: 'ecStat:regression',
        config: {
          method: 'exponential',
        }
      }
    }
  ],
  xAxis: { type: 'category' },
  yAxis: {},
  series: [
    {
      name: 'regrssion',
      type: 'line',
      symbol: 'none',
      daatasetIndex: 1,
    }
  ]
}
```

### 坐标轴

直角坐标系的x轴（xAxis）和y轴（yAxis），这2个轴都由轴线（axisLine）、刻度（axisTick）、刻度标签（axisLabel）、轴标题四部分组成。部分图表中还有网格线帮助查看和计算数据。

通常情况下，一个坐标轴用来表示数据的维度（类别），另一个坐标轴用来标示数据的数值。

当x轴的跨度很大时，可以采用区域缩放（dataZoom）方式灵活显示数据内容。

二维数据中，可以有多个轴。多个轴可以通过配置offset属性防止同个位置多个轴的重叠。两个x轴在上下，两个y轴在左右。

```javascript
const option = {
  // 对象或对象数组
  xAxis: {
    type: 'time',
    // 轴标题
    name: '时间',
    // 轴线
    axisLine: {
      symbole: 'arraw',
      lineStyle: {
        type: 'dashed'
      }
    },
    // 刻度
    axisTick: {
      length: 10,
      lineStyle: {
        type: 'dashed'
      }
    },
    // 刻度标签
    axisLabel: {
      formatter: '{value} kg',
      algin: 'right',
    }
  },
  // 对象或对象数组
  yAxis: [
    {
      type: 'value',
      name: '数值1',
    },
    {
      type: 'value',
      name: '数值2',
    }
  ]
}
```

### 视觉映射`visualMap`

数据可视化是数据到视觉元素的映射过程。比如折线图是数据映射到线，柱状图是数据映射到长度。

echarts提供了visualMap组件来提供通用的视觉映射，该组件可以使用的视觉元素有：

- 图形类别（symbol）、图形大小（symbolSize）
- 颜色（color）、透明度（opacity）、颜色透明度（colorAlpha）
- 颜色明暗度（colorLightness）、颜色饱和度（colorSaturation）、色调（colorHue）

在图表中，默认把data的前面一两个维度进行映射，比如第一个维度映射到x轴，第二个维度映射到y轴。若想展现更多维度，可以使用visualMap组件。

**visualMap组件**：

定义了把数据的哪个维度映射到什么视觉元素上，提供2种类型的visualMap组件：

- contiunous：连续型
- piecewise：分段型

**连续型视觉映射**：

通过指定最大值、最小值，确定视觉映射的范围。

**分段型视觉映射**：

三种模式：

- 连续型数据平均分段：依据visualMap-piecewise.splitNumber自动平均分割成若干块
- 连续型数据自定义分段：通过visualMap-piecewise.pieces定义每块的范围
- 离散数据（类别性数据）：定义在visualMap-piecewise.cateories中

::: details visualMap组件用法

```javascript
const option = {
  viusalMap: [
    {
      // 连续型
      type: 'continuous',
      min: 0,
      max: 100,
      // 取series.data中的第4个维度(value[3])被映射
      dimension: 3,
      // 对第四个系列进行映射
      seriesIndex: 4,
      // 选中范围内的视觉配置
      inRange: {
        // 定义了图形颜色映射到颜色列表
        // 数据最小值映射到red，最大值映射到blue，其他自动线性计算
        color: ['red', 'purple', 'blue'],
        // 定义图形尺寸的映射范围
        // 数据最大值映射到20，最小值映射到5，其他自动线性计算
        symbolSize: [5, 20],
      },
      outOfRange: {
        // 选中范围外的视觉配置
        symbolSize: [5, 20],
      }
    },
    {
      // 分段型
      type: 'piecewise',
      // ...
    }
  ]
}
```

:::

### 图例`legend`

图例是图表中对内容区元素的注释，用不同形状、颜色、文字等来标示不同数据列，通过点击对应数据列的标记，可以显示或隐藏该数据列。

::: details 图例用法

普通用法：

```javascript
const option = {
  legend: {
    // 图例较多时，可以使用可滚动翻页的图例
    type: 'scroll',
    data: ['图例1', '图例2', ......],
    // 方向及偏移量
    orient: 'vertical',
    right: 10,
    top: 'cneter',
    bottom: 10,
    // 图例样式
    bacgroundColor: '#ccc',
    textStyle: {
      color: 'red'
    }
    // 图例形状
    icn: 'rect',
    // 图例交互，点击图例按钮/初始化时展示隐藏对应数据列
    selected: {
      // 初始时，展示图例1
      '图例1': true,
      // 初始时，隐藏图例2
      '图例2': false,
    }
  }
}

```

当包含了多种图表类型时，不同类型的图例样式要有所区分：

```javascript
const option = {
  legend: {
    data: [
      {
        name: '图例1',
        icon: 'rect',
      },
      {
        name: '图例2',
        icon: 'circle',
      },
      {
        name: '图例3',
        icon: 'pin'
      }
    ]
  },
  series: [
    { name: '图例1' },
    { name: '图例2' },
    { name: '图例3' },
  ]
}
```

:::

### 标签和富文本标签

标签label是系列series内图形上的文本，用于说明图形上的数据信息，比如值、名称等。

标签label包含的属性分类：

- 是否显示：show
- 标签文本：formatter，支持字符串模板和回调函数
  - 字符串模板：支持标签变量有系列名`{a}`、数据名`{b}`、数据值`{c}`、数据中xxx维度的值`{@xxx}`、数据中维度索引为n时该维度的值`{@[n]}`，其他内容则为字符串
  - 回调函数：`(params: Object|Array) => string`，params是formatter需要的单个数据集
- 位置：position（标签相对图形的位置，可为string(top、inside等)、绝对像素、百分比）、distance（标签与图形之间的距离，position为string时有效）、offset（标签相对于图形的偏移量，会和distance叠加）、rotate（标签旋转角度）
- 文本排版样式：width、height、padding、lineHeight（行高）、align（文字水平对齐）、verticalAlign（文字垂直对齐）
- 文本样式：color、backgroundColor、字体（fontStyle、fontWeight、fontSize）、边框（borderColor、borderWidth、borderRadius、borderType）、阴影（shadowColor、shadowBlur、shadowOffsetX、shadowOffsetY）、文字边框（textBorderColor、textBorderWidth、textBorderRadius、textBorderType）、文字阴影（textShadowColor、textShadowBlur、textShadowOffsetX、textShadowOffsetY）
- 文本省略样式：overflow、ellipsis
- 富文本标签：rich，配合formatter使用，定制文本样式

::: details 标签代码示例

```javascript
const option = {
  xAxis: {
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {},
  series: [
    {
      type: 'line',
      data: [21, 23, 45, 56, 23, 34, 12],
      label: {
        show: true,
        position: 'top',
        distance: 3,
        offset: [0, 10],
        rotate: 45,
        formatter: function(params) {
          console.log(params)
          let paramsObj = {
            componentType: 'series',
            componentSubType: 'line',
            componentIndex: 0,
            // 系列
            seriesType: 'line',
            seriesIndex: 0,
            seriesName: 'series\u00000',
            // 类目名
            name: 'Mon',
            dataType: null,
            dataIndex: 0,
            // 原始数据
            data: 21,
            value: 21,
            // 维度
            dimensionIndex: undefined,
            deimensionNames: ['x', 'y'],
            // 坐标轴映射信息
            encode: {
              x: [0],
              y: [1]
            },
            $vars: ['seriesName', 'name', 'value'],
            color: '#5470c6',
            borderColor: undefined,
            status: 'normal',
          }

          // 返回字符串，其中：
          // {rich样式名|文本内容}，rich样式名可以在rich中定制样式
          return [
            `{type|图类型：${params.seriesType}}`,
            `{name|类目名：${params.name}}`,
            `{value|数据值：${params.value}}`,
          ].join('\n')
        },
        rich: {
          // rich样式名，定制文本内容样式
          type: {
            fontSize: 18,
            color: 'red',
          },
          name: {
            fontSize: 16,
            color: 'blue',
          },
          value: {
            fontWeight: 'bold',
            backgroundColor: 'green',
          }
        }
      }
    }
  ]
}
```

:::

### 事件与行为

在echarts的图表中，用户的操作将会触发相应的事件，常用的事件和事件对应参数在[events](https://echarts.apache.org//api.html#events)文档中可查询到。监听这些事件，通过回调函数进行相应的处理，比如跳转到一个地址、弹出对话框、做数据下钻、重新更新图表等。

echarts的事件名对应DOM事件名，均为小写的字符串。

echarts的两种事件类型：

- zrender事件：鼠标在任何地方都会被触发的事件
- echarts事件：鼠标仅在图形元素上才会被触发的事件

触发echarts事件的3种方式：

- 鼠标操作点击、hover图表的图形触发的事件
- 使用可以交互的组件触发的行为事件，例如切换图例开关legendselectchanged、数据区域缩放datazoom、highlight等
- 代码中调用`myChart.dispatchAction({type: ''})`触发，比如显示tooltip、选中图例等

**echarts支持的鼠标事件**：`click`、`dblclick`、`mouseover`、`mouseout`、`mousedown`、`mouseup`、`moousemove`、`contextmenu`、`globalout`

::: details echarts事件用法

`chart.on(eventName, callback)`:

```typescript
myChart.setOption(option)

type EventParams = {
  // 当前点击的图形元素所属的组件名称
  // 例如：series、markLine、markPoint、timeLine
  componentType: string;
  // 系列类型，例如：line、bar、pie，当componentType为series时有意义
  seriesType: string;
  seriesIndex: number;
  seriesName: string;
  // 数据名，类目名
  name: string;
  // 数据在传入的data数组中的索引
  dataIndex: number;
  // 传入的原始数据项
  data: Obejct;
  // sankey、graph等图表同时含有nodeData和edgeData两种data
  // dataType的值会是node、edge
  // 其他大部分图表只有一种data、dataType无意义
  dataType: string;
  // 传入的数据值
  value: number | Array;
  // 数据图形的颜色，当componentType为series时有意义
  color: string;
}

// 事件监听
myChart.on('click', function(params: EventParams) {
  window.open('https://www.baidu.com')
})
```

`chart.on(eventName, qurey, callback)`：只监听query中指定的图形元素，值可以是string、Object。

如果值是string，表示组件类型，格式可以是`mainType`或`mainType.subType`，例如：series、series.line、dataZoom、xAxis.category

如果值是Object，可以包含以下的一个或多个属性：

```typescript
type QueryObjectParams = {
  // 组件index
  ${mainType}Index: numbber;
  // 组件name
  ${mainType}Name: string;
  // 组件id
  ${mainType}Id: string;
  // 数据项index
  dataIndex: number;
  // 数据项name
  name: string;
  // 数据项type，如关系图的node、edge
  dataType: string;
  // 自定义系列中el的name
  element: string;
}

myChart.setOption({
  series: [
    { name: 'uuu' }
  ]
})

myChart.on('click', { seriesName: 'uuu' }, function(params) {
  // series name === 'uuu'的系列中的图形元素被mouseover时，进入回调
  // 可以在回调函数中，更新图表信息，即：
  // myChart.setOption({xxx})
})

myChart2.setOption({
  series: {
    type: 'custom',
    renderItem: function(params, api) {
      return {
        type: 'group',
        children: [
          {
            type: 'circle',
            name: 'my_el'
          }
        ]
      }
    },
    data: [
      [12, 34]
    ]
  }
})
myChart2.on('click', { element: 'my_el' }, function(params) {}
```

手动触发事件：

```typescript
// 高亮当前图形
myChart.dispatchAction({
  type: 'highlight',
  seriesIndex: 0,
  dataIndex: currentIndex
})

// 显示tooltip
myChart.dispatchAction({
  type: 'showTip',
  seriesIndex: 0,
  dataIndex: currentIndex
})
```

:::

**监听空白处的事件**：

```typescript
myChart.getZr().on('click', function (event) {
  // 正在监听一个zrender事件
  if (!event.target) {
    // 点击了空白处
  }
})

myChart.on('click', function (event) {
  // 正在监听一个echarts事件
})
```

## 应用

### 数据加载与更新

在echarts中，数据加载和更新是通过`setOption`方法完成的。

首次设置时，可以先将样式等信息传入到setOption的参数中，后续只要将数据等关键信息传入到setOption的参数中即可。

当获取数据源时，需要较长的加载时间，可以先提供一个loading动画提示目前数据正在加载中，加载完成后，关闭loading动画，再调用setOption进行数据更新。

对于实时动态更新的数据（比如按秒更新等），也是将更新后的数据传入到setOption中即可。用户只需要定时获取并填入数据到options中，而不需考虑数据到底产生了哪些变化，echarts会自动找到两组option数据之间的差异，然后通过合适的动画去表现数据的变化。

::: details 数据加载与更新用法

1. 通过接口获取数据后，填入到setOption的参数中：

```javascript
const myChart = echarts.init(document.getElementById('main'))

// 通过jQuery获取数据
$.get('data.json').done(function (data) {
  myChart.setOption({
    title: {
      text: '异步加载数据示例'
    },
    // 有些选项为空，但也要设置，
    // 因为设置完之后，会自动应用echarts设置的默认样式，不然某些效果不会生效
    tooltip: {},
    legend: {},
    xAxis: {
      // 假设获取到的数据可以直接使用
      data: data.categories,
    },
    yAxis: {},
    series: [{
      name: '销量',
      type: 'bar',
      data: data.values
    }]
  })
})
```

2. 先设置其他样式，在获取到数据后，填入数据（之前的设置的内容不需要重新设置一遍）即可：

```javascript
const myChart = echarts.init(document.getElementById('main'))
// 显示标题、图例、空的坐标轴
myChart.setOption({
  title: {
    text: '异步加载数据示例'
  },
  tooltip: {},
  legend: {
    data: ['销量']
  },
  xaxis: {
    data: []
  },
  yaxis: {},
  series: [{
    name: '销量',
    type: 'bar',
    data: []
  }]
})

// 异步加载数据
$.get('data.json').done(function (data) {
  // 填入数据，此时之前设置的内容无需再重复，只需要将数据等信息填入即可
  myChart.setOption({
    xAxis: {
      data: data.categories
    },
    series: [{
      // 根据名字对应到之前设置的series（最好加上），虽然说不存在也可以根据系列的顺序正常更新
      name: '销量',
      data: data.values
    }]
  })
})
```

3. 先展示loading动画（showLoading），后续获取到数据后关闭loading动画（hideLoading）再展示图表：

```javascript
const myChart = echarts.init(document.getElementById('main'))
// 展示loading动画
myChart.showLoading()
// 异步加载数据
$.get('data.json').done(function (data) {
  // 关闭loading动画
  myChart.hideLoading()
  // 填入数据
  myChart.setOption(...)
})
```

4. 实时更新数据（比如按秒更新），大致思路：

```javascript
// 添加数据，如果仅展示100条，删除最开始隐藏的数据，将最新加入的数据展示出来
let data = [Math.random() * 100]
let date = []
// addData函数，模拟代码，实际运行不了
function addData (shift) {
  const newData = Math.random() * 100
  const newDate = new Date()
  date.push(newDate)
  data.push(newData)
  if (shift) {
    date.shift()
    data.shift()
  }
}
for (let i = 0; i < 100; i++) {
  addData()
}

const option = {
  xAxis: {
    type: 'category',
    // boundaryGap: 坐标轴两边的【留白策略】，
    // 第一个值，若设置的越大，则-y轴的刻度就越大（即会出现-y轴）
    // 第二个值，若设置的越大，则+y轴的刻度就越大
    // 在类目轴中，该选项可以设为true（默认），这时刻度只是作为分隔线，标签和数据点都会在两个刻度之间的带(band)中间绘制。也可设置为false
    boundaryGap: false,
    data: date
  },
  yAxis: {
    // 在非类目轴中，包括时间、数值、对数轴
    // 值可以是一个包含两个元素（数值、百分比）的数组，分别表示数据最小值和最大值的延申范围
    // 在设置min、max属性后无效
    boundaryGap: [0, '50%']
    type: 'value'
  },
  series: [{
    name: '成交',
    type: 'line',
    // 是否显示为平滑曲线
    smooth: true,
    // 线 端点 标记（展示）的图形，echarts提供的标记类型有：
    // circle、rect、roundRect、triangle、diamond、pin、arrow、none
    // 也可以通过image://url的方式自定义图片，url可以是链接，也可以是base64
    // 也可以是svg的path
    // 若每个数据的图形都不一样，可以设置为函数：(value: Array | number, params: Object) => string
    symbol: 'none',
    // 标记（展示图形）的大小
    // symbolSize: 10,
    // 数据堆叠，同一个类目轴上系列 配置 相同的stack值 的数据 可以堆叠在一起（也就是实现数据累加的堆叠效果）
    // 比如两个类目轴的stack值都是'a'，同时数据都是[1, 2, 3]，这时后一个系列的值显示的是[2, 4, 6]
    // 目前stack只支持堆叠于value和log类型的类目轴上，不支持time和category类目轴
    stack: 'a',
    areaStyle: {
      normal: {}
    },
    data: data
  }]
}
// 每隔1秒更新一次数据
setInterval(function () {
  addData(true)
  myChart.setOption({
    // 这里面，只需要将需要更新的项目填入，不需要更新的项目可以不填
    xAxis: {
      data: date
    },
    series: [{
      name: '成交',
      data: data
    }]
  })
}, 1000)
```

:::

### 绘制图形

绘制图形的方式：

- graphic：支持的图形包括image（自定义图像）, text, circle, sector（扇形）, ring（圆环）, arc（圆弧）, polygon（多边形，可以描绘一些图形）, polyline（折线，可以描绘一些图形）, rect, line, bezierCurve（贝塞尔曲线）, group，同时支持图形嵌套
- series.markPoint
- series.markLine
- series.markArea

::: details 绘制图形代码示例

```javascript
const option = {
  graphic: {
    id: 'a',
    elements: [
      {
        type: 'group',
        children: [
          {
            type: 'rect',
            shape: {
              width: 100,
              height: 100
            },
            style: {
              fill: 'red',
              stroke: 'blue'
            }
          }
        ]
      },
      // 多边形
      {
        type: 'polygon',
        shape: {
          points: [
            [10, 20],
            [30, 40],
            [50, 60],
            [70, 80],
          ]
        }
      }
    ]
  },
  xAxis: {},
  yAxis: {},
  series: [
    {
      type: 'line',
      data: [
        [10, 20],
        [30, 40],
        [50, 60],
        [70, 80],
        [90, 100],
      ],
      markPoint: {
        symbol: 'pin',
        data: [
          {
            name: '坐标位置',
            coord: [10, 20]
          },
          {
            name: '屏幕像素坐标',
            x: 100,
            y: 200
          }
        ]
      },
      markLine: {
        symbol: 'pin',
        data: [
          // 元素也是一个数组，首尾坐标
          [
            {
              // 支持的属性：可以用xAsix、yAxis的索引指定范围
              // { type , valueIndex , valueDim , coord , name , x , y , xAxis , yAxis , value , symbol , symbolSize , symbolRotate , symbolKeepAspect , symbolOffset , lineStyle , label , emphasis , blur }
              name: '坐标位置',
              coord: [10, 20]
            },
            {
              coord: [30, 40]
            }
          ]
        ]
      },
      // 是一个矩形，对角线围成的区域
      markArea: {
        data: [
          // 元素也是一个数组
          [
            {
              name: '坐标位置',
              coord: [10, 20]
            },
            {
              coord: [30, 40]
            }
          ]
        ]
      },

    }
  ]
}
```

:::

## 常用图表

### 柱状图

柱状图分类：

- 基本柱状图：
- 堆叠柱状图：

::: details 柱状图代码示例

```javascript
const option = {
  xAxis: {
    // 类目轴分类
    data: ['1月', '2月', '3月', '4月', '5月'],
  },
  // 数值轴，会自动根据series的data生成对应的坐标范围
  yAxis: {},
  series: [
    {
      type: 'bar',
      data: [10, 20, {
        // 也支持设置单个数据项的样式
        value: 30,
        itemStyle: {
          color: 'red',
          shadowColor: 'blue',
          borderType: 'dashed',
          opacity: 0.1
      }, 40, 50],
      // 当前系列柱条统一样式
      // 柱条的宽度，默认是自适应，可以是绝对值数值和百分比（相对于当前类目轴宽度的百分比）
      barWidth: 10,
      // 柱条的最大/小宽度，超过/小于这个值，柱条宽度会按照这个值进行缩放
      // 同一坐标系中，此属性会被多个bar系列共享，若需共享，需要设置到最后一个bar系列才会生效
      barMaxWidth: 100,
      barMinWidth: 10,
      // 柱条的最小高度，小于这个值，柱条高度会按照这个值进行展示
      barMinHeight: 10,
      // 同一类目下（类目轴的值相同时的）柱条间的间距，可为数值或百分比
      // 设置了barGap和barCategoryGap，就不需要设置barWidth了（会自动调整）
      // 同一坐标系中，此属性会被多个bar系列共享，若需共享，需要设置到最后一个bar系列才会生效
      barGap: 10,
      // 不同类目下（类目轴的值不相同时的）柱条间的间距
      barCategoryGap: 20,
      // 为柱条添加背景色（即默认柱高度是数值轴高度，柱条的高度某数值，柱条背景高度是y轴高度减去该数值高度）
      showBackground: true,
      // 柱条背景颜色，属性和itemStyle一样
      backgroundStyle: {
        color: 'red',
        opacity: 0.5,
      },
      itemStyle: {
        // 柱条填充颜色
        color: '#00ff00',
        // 柱条描边的颜色、宽度、样式
        borderColor: '#00ffff',
        borderWidth: 2,
        borderType: 'solid',
        // 柱条边框圆角半径
        borderRadius: 5,
        // 柱条透明度，即填充颜色的显示效果（透明度）
        opacity: 0.5,
        // 柱条阴影的模糊大小、阴影颜色、阴影水平偏移、阴影垂直偏移
        shadowBlur: 10,
        shadowColor: 'purple',
        shadowOffsetX: 5,
        shadowOffsetY: 5,
    },
    {
      // 当出现多个系列时，相当于每个类目轴下会有多个柱子
      type: 'bar',
      data: [20, 30, 40, 50, 60],
      // 数据堆叠，当多个系列中，stack值相同时，会堆叠在一个柱条上，而不是展示多个柱条
      // 值应该取有意义的字符串
      stack: 'x',
      // 堆叠策略，不同的堆叠效果
      stackStrategy: 'all',
    },
    {
      type: 'bar',
      data: [30, 40, 50, 60, 70],
      stack: 'x',
    },
  ]
}
```

动态排序柱状图：

```javascript
const option = {
  xAxis: {
    // 数值轴
    // 坐标轴刻度的最大值，此时表示数据在该轴上的最大值作为最大刻度
    max: 'dataMax',
  },
  // y轴是类目轴
  yAxis: {
    type: 'category',
    // 类目轴中，最多展示多少个类目
    // 值可以是数字，表示最大展示类目个数（按索引，从0开始）
    // 值可以是函数：function (value) { return value.max - 20; }
    max: 10,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    // 柱条从大到小排序
    inversed: true,
    // 第一次柱条排序动画的时长
    animationDuration: 300,
    // 第一次之后柱条排序动画的时长
    animationDurationUpdate: 300,
  },
  series: [
    {
      // 是否开启实时排序，实现动态排序图效果
      realtimeSort: true,
      // 系列名称,用于在tooltip中显示, legend的图例筛选
      // 在setOption更新数据和配置项时用于指定对应的系列,即只更新name为Y的系列
      name: 'Y',
      type: 'bar',
      data: [10, 20, 30, 40, 50, 60, 70],
      // 图形上（柱条）的文本标签，说明图形的一些数据信息
      label: {
        // 显示标签
        show: true,
        // 文本标签的位置，比如在柱条的右边
        // 值可以是top，bottom，left，right,inside,及inside和前几个的组合(insideTopLeft, insideTop)
        position: 'right',
        // 开启实时改变标签文本数据
        valueAnimation: true,
      }
    }
  ],
  // 图例组件,控制显示哪些系列
  legend: {
    show: true
  },
  // 动画
  // 是否开启动画
  animation: true,
  // 开启动画的阈值,单个系列显示的图形数量大于这个值会关闭动画
  animationThreshold: 200,
  // 初始/更新动画的时长,
  // 支持回调函数, 为每个数据返回不同时长实现戏剧效果,
  // function (idx) { return idx * 100; }
  animationDuration: 3,
  animationDurationUpdate: 3000,
  // 初始/更新动画的缓动效果
  animationEasing: 'linear',
  animationEasingUpdate: 'linear',
  // 初始/更新动画的延迟,支持函数
  animationDelay: 0,
  animationDelayUpdate: 0,
}

function update() {
  const data = option.series[0].data;
  // 修改data
  // ...

  myChart.setOption(option);
}

// 定时器更新数据
setInterval(update, 1000);
```

:::

### 折线图

折线图分类:

- 基本折线图(类目轴+数值轴)
- 笛卡尔坐标系折线图(数值轴+数值轴)

::: details 折线图示例

1. 基本折线图:

```javascript
const opiton = {
  // x轴为类目轴
  xAxis: {
    type: 'category',
    // 指定了data默认是类目轴,故可以省略type
    data: ['A', 'B', 'C', 'D'],
  },
  // y轴为数值轴
  yAxis: {
    // type可省略
    type: 'value',
  },
  series: [
    {
      data: [10, 20, 30, 40],
      type: 'line',
      // 🎫线条样式
      lineStyle: {
        // normal是古早写法,现在可直接省去normal,直接写在lineStyle上
        normal: {
          // 线条颜色, 宽度
          color: 'red',
          width: 2,
          // 参考: https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/stroke-dasharray
          // 线条的类型,可以是string, number, array<number>
          // 当为数组时(展示为长短不一的虚线),可配合dashOffset实现灵活的虚线效果
          type: 'solid',
          // 虚线的偏移量
          dashOffset: 10,
          // 线条末端展示的效果,是方形(butt), 圆形(round), 斜接(square, 增加了线段的长度)
          cap: 'round',
          // 线条的阴影/大小/偏移量
          shadowColor: 'red',
          shadowBlur: 10,
          shadowOffsetX: 10,
          shadowOffsetY: 10,
          // 线条的透明度
          opacity: 0.5,
        }
      },
      // 是否展示标记(此时是数据点)
      showSymbol: true,
      // 标记(此时是数据点)的图形
      // 值有: circle, rect, roundRect, triangle, diamond, pin, arrow, none
      symbol: 'circle',
      // 标记(此时是数据点)的图形大小
      symbolSize: 10,
      // 标记(此时是数据点)的旋转角度
      symbolRotate: 90,
      // 标记(此时是数据点)的偏移量
      symbolOffset: [10, 20],

      // 🎫数据点的样式
      itemStyle: {
        // 颜色
        color: 'red',
        // 描边颜色/宽度/类型
        borderColor: 'red',
        borderWidth: 2,
        borderType: 'solid',
        // 数据点阴影的模糊大小/颜色/偏移量
        shadowBlur: 10,
        shadowColor: 'red',
        shadowOffsetX: 10,
        shadowOffsetY: 10,
        // 透明度
        opacity: 0.5,
      },
      // 🎫图形(此处是数据点)上的文本标签,用于标注图形的信息
      label: {
        // 是否显示标签文本
        show: true,
        // 显示标签的位置
        // 值有: inside(内部正中间), left, right, top, bottom,以及inside和其他四者的结合
        position: 'insideTopLeft',
        // 距离图形(数据点)的距离
        distance: 10,
        // 标签文本的旋转角度
        rotate: 90,
        // 标签文本的偏移量
        offset: [10, 20],
        // 标签内容格式器,支持字符串模板和回调函数两种形式
        // 字符串模板变量:
        // {a}: 系列名
        // {b}: 数据名称
        // {c}: 数据值
        // {@xxx}: 某维度名下的数据值
        // {@[n]}: 某维度索引下的数据值
        fomatter: '{b}: {c}',
        // 回调函数:(params: Object | Array) => string
        // 参数params:单个数据集的内容,包括:
        // 组件类型,系列类型/索引/名称, 数据/类目名/索引,原始数据项,数据值,encode,维度列表/索引,颜色

        // 其他值有: 
        // color, backgroundColor, fontStyle, fontWeight, fontSize, fontFamily, 
        // 文本描边: textBorderColor, textBorderWidth, textBorderType, 
        // align(水平对齐方式), verticalAlign(垂直对齐方式), 
        // width(文本宽度), height(文本高度), padding, lineHeight, 
        // borderColor, borderWidth, borderType, borderRadius, 
        // 文字块的阴影:shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY,
        // 文本阴影: textShadowColor, textShadowBlur, textShadowOffsetX, textShadowOffsetY

        // 文本是否省略/换行,配置了width有效
        overflow: 'none' | 'truncate' | 'break' | 'breakAll',
        // overflow=trancate时,文本末尾显示的内容
        ellipsis: '...',

        // 🎫🎫自定义富文本样式
        rich: {}
      },
      // 🎫高亮时的样式(鼠标移动到图形上时)
      emphasis: {
        label: {
          // 只有在鼠标移动到该数据才显示标签文本
          show: true,
        }
      }
    },
    {
      data: [22, 34, 12, 89],
      type: 'line',
      // 堆叠折线图,建议配合areaStyle(使用区域填充色)使用,表示堆叠情况
      stack: 'a',
      areaStyle: {},
    },
    {
      data: [2, 43, 15, 89],
      type: 'line',
      stack: 'a',
      // 区域填充样式,设置后显示成区域面积图
      areaStyle: {
        // 填充颜色
        color: 'red',
        // 填充阴影的模糊大小/颜色/偏移量
        shadowBlur: 10,
        shadowColor: 'red',
        shadowOffsetX: 10,
        shadowOffsetY: 10,
        // 填充透明度
        opacity: 0.5,
      },
    },
    {
      data: [22, 143, 15, 89],
      type: 'line',
      // 是否平滑曲线
      smooth: true,
      // 平滑曲线是否在一个维度上保持单调性,可以是x,y轴
      smoothMonotone: 'x',
    },
    {
      data: [2, 43, 15, 89],
      type: 'line',
      // 不设置step时,直接使用一条直线连接两点
      // 阶梯线图:使用多条线(类似楼梯)连接两点,值可以是:
      // start: 起点就开始有楼梯
      // middle: 中间开始有楼梯
      // end: 终点开始有楼梯
      step: 'start',
    }
  ]
}
```

2. 笛卡尔坐标系折线图:

```javascript
const opiton = {
  xAxis: {},
  yAxis: {},
  series: [
    {
      // 若想让折线图在横纵坐标都是连续的
      // data每个数据项的值都应当是一个包含两个值的数组
      data: [
        [20, 100],
        [30, 200],
        [25, 50],
      ],
      type: 'line',
    }
  ]
}
```

:::

### 饼图

饼图分类:

- 普通饼图:
- 环形饼图:
- 南丁格尔图:

注意:

::: details 饼图示例代码

1. 普通/圆环饼图: data中的value不需要是百分比数据,echarts会根据所有数据的value,按比例分配他们所占的百分比(圆弧的弧度)

```javascript
const option = {
  // 饼图的半径,值可以是像素数值,百分比,前两者的数组形式
  // 当为百分比时,相对于容器宽和高中较小的那个
  // 当为数组时,第一项是内半径,第二项是外半径,也就是圆环
  radius: '75%',
  // 展示标题组件,包括主标题和副标题
  title: {
    // 主标题文本,支持\n换行
    text: '某站点用户访问来源',
    // 主标题超文本链接
    link: 'https://www.baidu.com',
    target: '_blank',
    // 主标题文本样式
    textStyle: {
      // 字体,颜色,阴影,文本阴影,宽高,文本描边,省略,富文本
    },
    // 副标题文本,支持\n换行
    subtext: '纯属虚构',
    // 副标题其他属性同主标题
    // 标题内边距
    padding: [10, 20],
    // 主副标题间距
    itemGap: 10,
    // 组件离容器的距离:left, top, right, bottom
    // 标题背景,阴影
  },
  // 图例组件
  legend: {
    // 图例布局朝向, 水平布局为'horizontal', 垂直布局为'vertical'
    orient: 'vertical',
    // 距容器的距离top, left, right, bottom
    top: 'center',
    itemStyle: {},
    lineStyle: {},
    // 图例的标记
    // 标记的类型: 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
    icon: 'circle',
    // 图例的数据数组,数组项可以是字符串(代表系列的name)
    data: [
      {
        // 等于系列的name(series.name),饼图则是series.data[x].name
        name: '直接访问',
        icon: 'circle',
        // 图例项的文本样式
        textStyle: {
          color: 'red',
        },
        // 图例项图形中线的样式
        lineStyle: {},
        // 图例项的图形样式
        itemStyle: {},

      }
    ]
  },
  series: [
    {
      type: 'pie',
      data: [
        {
          value: 10,
          name: '直接访问'
        },
        {
          value: 20,
          name: '邮件营销'
        },
        {
          value: 30,
          name: '联盟广告'
        }
      ]
    },
    {
      type: 'pie',
      data: [
        {
          value: 0,
          name: '直接访问'
        },
        {
          value: 0,
          name: '邮件营销'
        },
        {
          value: 0,
          name: '联盟广告'
        }
      ],
      // 如果数据和为0,则默认会平分饼图
      // 若此时想不显示饼图,可以将series.stillShowZeroSum设为false
      stillShowZeroSum: false,
      // 若此时想不显示标签,可以将series.label.show设为false
      label: {
        show: false,
      }
    },
    {
      type: 'pie',
      // 环形饼图
      radius: ['20%', '75%'],
      data: [
        {
          value: 10,
          name: '直接访问'
        },
        {
          value: 20,
          name: '邮件营销'
        },
        {
          value: 30,
          name: '联盟广告'
        }
      ],
      // 饼图图形上的文本标签
      label: {
        // 默认不展示标签
        show: false,
        position: 'center',
      },
      // 饼图到饼图文本标签的视觉引导线,在label.position为outside时有效
      labelLine: {
        show: true,
        lineStyle: {}
      },
      // 高亮状态(包括鼠标移动到)的扇区和标签样式
      emphasis: {
        // 是否关闭高亮状态
        // 关闭高亮状态可以通过tooltip触发
        disabled: false,
        // 高亮后扇区放大效果,v5+
        scale: true,
        scaleSize: 10,
        // 高亮状态下标签样式
        label: {
          show: true,
          formatter: '{b}: {c}',
          // 其他文本样式属性
        },
        labelLine: {},
        itemStyle: {},
      },
      // 防止标签重叠,默认true
      avoidLabelOverlap: true,
    }
  ]
}

```

2. 南丁格尔图(玫瑰图): 用弧度相同,但半径不同的扇形表示各个类目

```javascript
const option = {
  series: [
    {
      type: 'pie',
      // 设置每个饼图的相对位置
      top: 200,
      left: 300,
      data: [
        {
          valaue: 100,
          name: '直接访问'
        },
        {
          value: 20,
          name: '邮件营销'
        },
        {
          vlaue: 30,
          name: '联盟广告'
        }
      ],
      // 设置成玫瑰图形式
      // area: 每项圆心角度相同,半径不同
      // radius: 圆心角展示数据的百分比,半径展示数据的大小
      roseType: 'area'
    }
  ]
}
```

:::

### 散点图

散点图分类:

- 基础散点图
- 笛卡尔坐标系散点图

::: details 散点图代码示例

1. 基础散点图

```javascript
const option = {
  xAsix: {
    data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },
  yAxis: {},
  series: [
    {
      type: 'scatter',
      data: [220, 182, 191, 234, 290, 330, 310],
      // 散点图标记图形,内置的图形有:circle,rect,roundRect,triangle,diamond,pin,arrow
      // 也可以使用图片,自定义图形: image://url
      // 也可以使用自定义图形: path://svgPathString
      // 也可以是回调函数,自定义每个项的图形
      // (value: Array | number, params: Object) => string
      sybol: function(value) { return value / 10 },
      symolSize: 10,
    }
  ]
}
```

2. 笛卡尔坐标系散点图:两个都是数值轴

```javascript
const option = {
  xAsix: {},
  yAxis: {},
  series: [
    {
      type: 'scatter',
      // 用包含2个数值的二维数组表示
      data: [
        [10, 20],
        [20, 30],
        [30, 40],
        [40, 50],
      ]
    }
  ]
}
```

:::

## 常用配置项

setOption方法参数常用属性：

- title: 图表标题组件
- legend：图例组件，控制系列series的展示隐藏
- dataZoom：区域缩放组件
- visualMap：视觉映射组件
- tooltip：提示框组件
- graphic：原生的图形元素组件，可以在图表中绘制特定图形
- dataset：数据集组件，可被多个组件复用
- series：系列
- axisPointer：坐标轴指示器组件，提示当前鼠标位置所在的标线和刻度
- toolbox：工具栏，比如导出图片，数据视图，动态类型切换，数据区域缩放，重置等
- brush：区域选择组件
- timeline：时间线组件
- darkMode：是否开启暗黑模式
- color：调色盘颜色列表，若系列没有设置颜色，则会依次循环从该列表中取颜色作为系列颜色
- backgroundColor：图表背景色
- textStyle：全局字体样式
- animation：是否开启动画
- aniamtionDuration：动画时长
- aniamtionEasing：动画缓动效果
- aniamtionDelay：动画延迟
- aniamtionDurationUpdate：更新动画时长
- animationEasingUpdate：更新动画缓动效果
- aniamtionDelayUpdate：更新动画延迟
- hoverLayerThreshold：图形数量阈值
- options：用于timeline的option数组
- media：移动端自适应

坐标系：

- grid：直角坐标系及其网格分区
- xAxis：直角坐标系的X轴组件
- yAxis：直角坐标系的Y轴组件
- polar：极坐标系
- radiusAxis：极坐标系的径向轴
- angleAxis：极坐标系的角度轴
- radar：雷达图坐标系组件
- geo：地理坐标系组件
- parallel：平行坐标系组件
- parallelAxis：平行坐标系轴
- singleAxis：单轴，展现一维数据
- calendar：日历坐标系组件

子配置：

- itemStyle：图形样式
- lineStyle：线条样式
- areaStyle：区域填充样式
- textStyle：字体样式
- emphasis：高亮样式
- data：数据
- label：图形的标签配置
- endLabel：端点标签设置
- labelLine：标签的视觉引导线
- rich：富文本样式
- markPoint：标记点
- markLine：标记线
- markArea：标记区域
- select：数据选中的样式
- blur：淡出时的样式
