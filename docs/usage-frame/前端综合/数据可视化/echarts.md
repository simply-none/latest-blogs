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
