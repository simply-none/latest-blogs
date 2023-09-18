# CSS 知识点

## css api

### calc函数的补充

用法：calc(expression)

注意：
1. calc函数可进行加、减、乘、除运算
2. 针对的表达式因子包括：length、angle（角度）、time、percentage、number
   1. length: width、margin、padding、font-size、border-width、text-shadow
   2. angle：gradient、transform 
   3. time： s、ms
3. +、-运算符两边必须有空白符，*、/运算符不必须

## flex布局

```css
.box {
   display: flex | inline-flex;
   
   /* 子元素排列方向 */
   flex-direction: row | column | row-reverse;
   /* 子元素是否换行 */
   flex-wrap: wrap | nowrap;
   /* direction wrap合体 */
   flex-flow: row wrap;

   /* 主轴对齐方式，主轴由direction确定 */
   justify-content: center | flex-start | flex-end | space-around | space-between;
   /* 副轴对齐方式，副轴和主轴垂直 */
   align-items: center;
   /* 同时有主轴和副轴时的对齐方式，在能够wrap时有效 */
   align-content: center | flex-start | flex-end | space-around | space-between;
}

.item {
   /* 分配剩余空间的相对比例 */
   flex-grow: 0 | 0.6 | 3;
   /* 指定flex的收缩规则，在默认宽度之和大于容器时有效 */
   flex-shrink: 0 | 0.6 | 3;
   /* 指定flex元素在主轴方式的初始大小 */
   flex-basis: 3px | 2em | auto | fill | max-content | content | initial;
   /* grow shrink basis合体 */
   flex: 1 1 10px;

   /* 当前元素的排列顺序，增序排列，只影响视觉效果，不影响元素在代码中的位置 */
   order: -5 | 0 | 5;

   /* 当前元素的对齐方式，覆盖align-items */
   align-self: center | flex-start | flex-end | space-around | space-between;
}
```

## grid布局

```css
.box {
   display: grid | inline-grid;

   /* 设置列宽：每一项代表一列，repeat代表列宽重复多少次（列），fr代表可用空间的一等份 */
   grid-template-columns: 100px 100px 100px | 100px repeat(2, 100px) | 1fr 1fr 1fr | 100px 100px minmax(100px 3fr) | 100px auto 100px;
   /* 设置行高 */
   grid-template-rows: 100px 100px 100px | 100px repeat(2, 100px) | 1fr 1fr 1fr | 100px 100px minmax(100px 3fr) | 100px auto 100px;
   /* 定义内容块的区域，一个区域由多个单元格组成，该区域和实际代码位置无任何关联，下列的字母代表区域块所占领的单元格，通过给块类设置grid-area为该值即可 */
   grid-template-areas: none
      |"a b" /** 一行两列 */
      |"a b b"
       "a c d";  /** 两行三列 */
   /* 定义行列分区 */
   grid-template: none;
   grid-template: 100px 1fr / 50px 1fr; /** grid-template-rows / grid-template-columns */
   grid-template: [line1-name] 100px 1fr / [column1-name] 50px [column2-name] 1fr; /** 这里设置了每个单元格前面的那条线的名称 */
   grid-template: 
      [line11] "a b"  1fr [line12]  /**第一行：行开始名 字符串区域块 行大小 行结束名 */
      [line21] "a c"  50px [line22]
      / auto 1fr auto;  /** 列宽即grid-template-columns的值 */

   /* 行间距 */
   grid-row-gap: 10px;
   /* 列间距 */
   grid-column-gap: 30px;
   /* row column合并 */
   grid-gap: 10px 30px;

   /* 控制排列方向顺序，是先行后列、先列后行；dense表示尽可能占满表格，若当前单元格大于剩余宽度，会让后者先填上去 */
   grid-auto-flow: row| column | row dense;

   /* 多余网格的行高列宽设置，在grid-template-rows/columns设置的单元格数量小于实际的单元格数量时有效，用法同grid-template-* */
   /* fit-content(args) === min(max-content, max(auto, args)) */
   grid-auto-columns: min-content | 100px | 10% | 3fr | minmax(100px, auto) | fit-content(10%) | 1fr 1fr 1fr;
   grid-auto-rows: min-content | 100px | 10% | 3fr | minmax(100px, auto) | fit-content(10%) | 1fr 1fr 1fr;

   /* 整体内容的水平、垂直对齐方式，stretch：拉伸，伸长到空白区 */
   justify-content: start | end | center | stretch | space-around | space-between;
   align-content: start | end | center | stretch | space-around | space-between;

   /* 单元格自身的水平、垂直对齐方式，作用于所有单元格 */
   justify-items: start | end | center | stretch;
   align-items: start | end | center | stretch;
}

.item {
   /* 该项对应上述的区域a所占的单元格范围 */
   grid-area: a;

   /* 指定网格项目所在的四个边框所在索引，以1开始，若有冲突重叠，可使用z-index, 1代表索引，而span 1代表占据1个单元格 */
   grid-column-start: 1 | span 1;
   grid-column-end: 2;
   grid-column: 1 / span 1;
   grid-row-start: 1;
   grid-row-end: 1;
   grid-row: 1 / span 1;

   /* 设置水平、垂直对齐的样式，仅作用该单元格 */
   justify-self: start | end | center | stretch;
   align-self: start | end | center | stretch;
}
```

## 多列布局

定义：多列布局，就是一大块内容带到多个列中，类似报纸

多列布局属性：
- column-count：指定内容的列数
- column-width：指定理想的列宽，列数由浏览器决定，通常为(`Math.floor(totalWidth / columnWidth)`)
- column-rule：`column-rule-width column-rule-style column-rule-color`的简写，类似border属性
- column-gap：指定列与列之间的间隙，默认为1em
- column-span：让column多列布局内部的某个元素跨越所有的列，值为all

注意：
- 在使用多列布局时，其内容无法定位，也无法为单个列指定样式，所有列都将保持相同的大小。但可通过column-*相关的属性定义对应的规则

## position定位

> 参考：    
> https://developer.mozilla.org/zh-CN/docs/Web/CSS/position#%E8%AF%AD%E6%B3%95      
> https://juejin.cn/post/6844903973627887624    
> https://juejin.cn/post/6953145161895378951    

position属性：
- static：元素在文档常规流中当前的布局位置，是元素使用的正常布局行为，默认值
- relative：元素相对自身位置进行定位
- absolute：元素被移出正常文档流，通过指定元素相当于**最近的非static定位祖先元素**的偏移去确定元素的位置
- fixed：元素被移出正常文档流，通过指定元素相对于**屏幕视口**的位置来确定元素的位置
- sticky：粘性布局，根据正常文档流定位，相对它的最近滚动祖先和最近块级祖先，基于top、right、bottom、left的值进行偏移，然后固定在离他最近的一个拥有滚动机制的祖先元素上

注意：
- sticky的约束：
  - sticky最初处于正常文档流位置，然后慢慢的随着滚动而移动，直到移动到其定位后的位置（根据top、right、left、bottom确定）后进行固定，类似于先相对relative，后固定fixed。然后当粘性元素的父元素慢慢远离屏幕可视区域时，它的活动就由固定fixed，变成相对relative（因为父元素的视口可见高度不足以显示其定位高度了），然后随着父元素完全消失在视口，其也消失在视口区域
  - 当最近祖先元素的overflow属性为auto、scroll、overlay时，必须指定其高度，否则粘性布局失效
  - 多个粘性布局元素作用时，会发生重叠效果，可指定z-index确定上下层显示状态
- sticky的应用：
  - 列表锚点，固定列表分类的标题
  - 侧边栏固定，用于展示广告信息
  - 头部、尾部固定
  - 进度条...

<!-- tabs:start -->

<!-- tab:粘性布局sticky的应用 -->
```vue
<!-- 列表锚点 -->
<template>
   <div>
      <dl v-for="item in list" :key="item.id">
         <!-- 设置dt为粘性定位 -->
         <dt>{{ item.title }}</dt>
         <dd v-for="desc in item" :key="desc.id">{{ desc.name }}</dd>
      </dl>
   </div>
</template>

<style>
dl {
   margin: 0;
   padding: 24px 0 0 0;
}

dt {
   background: red;
   border-bottom: 1px solid;
   border-top: 1px solid;
   color: #fff;
   margin: 0;
   padding: 2px 0 0 12px;
   position: sticky;
   top: -1px;
}

dd {
   margin: 0;
   padding: 0 0 0 12px;
   white-space: nowrap;
}

dd + dd {
   border-top: 1px solid;
}
</style>
```


<!-- tabs:end -->


## 媒体查询

> 参考：    
> https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_media_queries/Using_media_queries     
> https://juejin.cn/post/7097213453768589320?searchId=202309181548321C9E4D9F178E08EB3779     

定义：

媒体类型：
- all：适用于所有设备，默认值
- print：适用于在打印预览模式下在屏幕上查看的分页材料和文档
- screen：适用于屏幕设备
- speech：适用于语音合成器

媒体特性：媒体类型的具体特征，有：
- height、max-height
- width、max-width
- ...

逻辑操作符：用于联合类型、特性构造复杂的媒体查询，有：
- and：当前后规则都为真时，才生效
- `,`或or：有一条规则为真时，就生效
- only：仅在所有规则都为真时，才生效
- not：不满足该规则时，就生效

```css
/* and */
@media screen and (min-width: 900px) {
   div {}
}

/* ,  */
@media screen, pring {
   div {}
}

/* only */
@media only screen and (min-width: 300px) and (max-width: 500px) and (resolution: 150dpi) {
   div {}
}

/* not：注意，not应该应用在一条完整的规则之上，即通过,或or分割，但是包含and */
/* 正确的表示 */
@media not all and (monochrome), print {
   div {}
}
@media not(all and (monochrome)), print {
   div {}
}
/* 错误的表示 */
@media (not all) and (monochrome) {
   div {}
}

/* 否定多个属性 */
@media (not(color) or (hover)) {
   div {}
}

/* 第四版新增 */
@media (height > 600px) {
   div {}
}
@media (400px <= width <= 700px) {
   div {}
}
```

## 小特性

### 单行省略

```css
overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
```

### css文字纵向排列

`writing-mode`：定义了文本在水平、垂直方向上的排列方式，有以下值：
- horizontal-tb：正常文本格式，水平方向，内容从左往右（左对齐，右对齐相反，horizontal），从上往下（top-bottom）
- vertical-lr：垂直方向，内容从上往下（vertical），从左往右（left-right）
- vertical-rl：垂直方向，内容从上往下（vertical），从右往左（right-left）

### 多列布局

多列布局：当下使用场景，菜单项从上到下、从左到右自适应布局，且每列之间需加一个分割线。
  
解决方案：

column-width：在包裹菜单项的父元素设置，定义每列的宽度
column-count: 在包裹菜单项的父元素设置，定义列的数量，默认为auto
column-rule：设置列之间的分割线，和border的值一致
columns: column-width column-count（方向相反也可）
column-gap：设置列与列之间的间隔，可为normal(1em)、长度单位、百分比

注意：使用多列布局时，应当给包裹菜单项的父元素设置最大高度

### 鼠标滚轮横向滚动页面

## 注意事项

- 尽量不要使用inline-block布局，该布局很难掌控，会发生一些意想不到的bug，请用其他布局代替

## 样式风暴

1. 当某个输入框/选择框不能进行操作时，赋予其disabled属性，为了避免该项表单颜色过于异常，在鼠标覆盖后，赋予其对应的样式即可，比如，赋予和输入框在readonly一样的样式。