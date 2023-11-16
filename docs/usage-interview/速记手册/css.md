# css

> 参考：    
> https://juejin.cn/post/6854573212337078285?searchId=20230918161839BB14B00D6457CDEF6F9A    

## css的三大特性

三大特性：
- 层叠：指浏览器通过一定规则确定当多个css规则应用于同一个元素时，哪个规则优先级最高，以此来确定元素样式。元素的层叠等级从上往下依次为：
  - z-index为正值，在最上面
  - z-index: 0、auto，或者未设值
  - 行内元素
  - 浮动元素
  - 块级元素
  - z-index为负值
  - background/border，背景和边框在最下面
- 继承：父子间样式的继承规则，`text-*`,`font-*`,`line-*`,`color`都可被继承
- 优先级：样式的权重
  - *：0,0,0,0
  - tag: 0,0,0,1
  - (pseudo-)class:0,0,1,0
  - id:0,1,0,0
  - 行内样式：1,0,0,0
  - !important: +∞

## css属性继承

所有元素都可继承的：
- visibility
- cursor

子元素可继承的：
- letter-spacing、word-spacing、white-spacing
- line-height
- font、color
- text-(decoration、transform、indent、align)、direction

列表元素可继承的：
- list-style

表格元素可继承的：
- border-collapse

不可继承的属性，若想和父元素保持一致，可将该属性设置为inherit

## css选择器分类

- 基础选择器：
  - 标签选择器（元素选择器，`div`）
  - id选择器（`#title`）
  - class选择器（`.title`）
  - 通配符选择器（`*`）
  - 群组选择器（逗号选择器，`div, p, span`）
- 关系选择器：
  - 后代选择器（空格选择器，`.parent .child`）
  - 子代选择器（大于号选择器，`div>.first`）
  - 相邻选择器（加号选择器，`.first+.second`）
  - 兄弟选择器（选择器，`div~p`）
- 属性选择器：
  - `div[class]`
  - `div[class='parent']`
  - `div[class^='par']`
  - `div[class$='par']`
  - `div[class*='par']`，属性值里面包含该字符串即可
  - `div[class~='par']`，属性值必须完全匹配
  - `div[class|='par']`，匹配以par或par-开头的
- 伪类选择器：用于选择元素
  - :first-child, :nth-child(n)
  - :first-of-type(表示第一个子元素)，:nth-of-type(n)
  - :not()
  - :link, :visited, :hover, :active
- 伪元素选择器
  - :before, :after
  - ::first-letter, ::first-line(分别表示第一个字母和第一行)

## 重绘repaint和重排reflow(回流)

重绘：结构未变化，只是改变了某个元素的外观风格，而不影响周围或内部的布局时，会发生重绘，情况有：
- 改变背景属性
- 改变字体颜色
- visibility属性变化
- box-shadow变更

重排：结构、尺寸、排版发生了变化，或者说页面上元素的占位面积、定位方式、边距等发生了变化，会引起重排，情况有：
- 网页初始化时
- 增删dom节点时
- 移动dom节点、给dom节点添加动画
- 窗口大小发生变化时、页面滚动时
- 元素内容发生变化时、元素尺寸发生变化时、元素字体大小种类变化时
- 查询调用某些属性时（offsetxxx、scrollXXX、clientXXX、设置style属性、调用getComputedStyle）

注意：
- **重排一定会引发重绘**，因为得重新定义结构布局，然后渲染css样式

优化技巧：
- 不适应table布局，table布局的一个改动会造成整个table重新布局
- 读、写操作不放在同一个语句
- 不一条条修改dom样式（不如修改css class）
- 复杂动画的元素使用绝对定位，脱离文档流，不影响其他节点
- 使用虚拟dom
- 避免使用css表达式

## 使用css隐藏元素

- `visibility: hidden`：隐藏元素，继续在文档流中占位，仅触发重绘，隐藏后不能触发点击事件
- `display: none`：从页面中删除元素，触发重排，进而触发重绘。但是其在html源码中未实际删除
- `opacity: 0`：让元素变得透明，继续在文档流中占位，仅触发重绘，子元素会继承。
- `rgba(0,0,0,0)`：让元素变得透明，仅触发重绘，子元素不会继承

## 格式化上下文（formatting context）

**BFC**(Block formatting context)：块级格式化上下文
- 该特性的元素看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素
- 内部的box在垂直方向上一个接一个放置
- 内部的box在垂直方向的距离由其margin决定，相邻元素的相邻margin会发生合并（无内容、border的元素上下margin也会发生合并）
- bfc的区域不会和float box发生重叠

触发BFC的方式：
- body根元素
- float：left、right
- position：absolute、fixed
- diaplay：inline-block、flex、inline-flex、grid、inline-grid、table-cells、table-caption
- overflow：hidden（在父级元素设置，用于清除浮动造成的塌陷）、auto、scroll
- column-count、column-width：值不为auto，多列布局

**IFC**(inline formatting context)：行内格式化上下文
- box一个一个水平摆放，容器不够时换行，每一行称为一个行盒（line box）
- 会计算水平方向上的margin、border、padding、content的长度
- 垂直方向上，可使用vertical-align设置对齐方式

**ZFC**(z-index formatting context)：层叠上下文

**GFC**(grid formatting context)：网格元素格式化上下文
