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

## grid布局

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

## 样式风暴

1. 当某个输入框/选择框不能进行操作时，赋予其disabled属性，为了避免该项表单颜色过于异常，在鼠标覆盖后，赋予其对应的样式即可，比如，赋予和输入框在readonly一样的样式。