# css预处理器

## SCSS 知识点

> 参考：https://juejin.cn/post/7055101823442485255

```SCSS
// 导入
@import "./global.scss";

// 嵌套
.main {
  boder: 1px solid red {
    // border-left, border-top
    left: 0;
    top: 0;
  }
}

// 变量
$primary-color: #eee;
$border: 1px solid $primary-color;

.main {
  color: $primary-color;
  boder: $boder;
}

// mixin，相当于函数，参数可带可不带
@mixin setColor ($color, $bgColor) {
  color: $color;
  background: $bgColor;
}


// include，调用函数
.main {
  @include setColor($primary-color, #eee);
}

// function，自定义函数
@function getColor ($color) {
  @return $color;
}

div {
  color: getColor('red');
}

// extend，样式的继承和扩展
.pure {
  color: $primary-color;
}

.pure .child {
  background: #eee;
}

.main {
  // .main有.pure的样式，.main下的.child有.pure下的.child的样式
  @extend .pure;
  font-size: 24px;
}

// 插值
$custom-name: color;
.main {
  #{$custom-name}: red;
}

// 条件判断
// if...else
@if ($current > $old) {
  color: red;
} @else {
  color: green;
}

// for
@for $i from 1 to 100 {
  .div_#{$i} {
    color: red;
  }
}

// each
$list: red blue white;
@each $i in $list {
  .#{$i} {
    color: $i;
  }
}

// while
$count: 1;
@while $count < 5 {
  .div_#{$count} {
    color: red;
  }
  $count: $count+1
}

// 计算功能


// 颜色函数

.main {
  color: hsl(208, 90%, 72%);
  color: rgba(31, 23, 89);
}

















```








## less知识点

```less
// 导入
@import 'global.css';
@import url('global.less');

// 嵌套
// &-

// 变量
@primary-color: red;
@color: red, green, orange;

// 字符串插值
@name: banner;
background: url('./@{name}.png');

// 字符串原样输出: color: red;
color: ~"red";

// 混入，参数可带可不带，类似mixin
.red (@color=red) {
  color: @color;
}

.main {
  .red();
  background: white;
}

// 块，类似函数
@block: {
  color: red;
}

.main {
  @block();
}

// 继承，extend
.public {
  color: red;
}

.main {
  &:extend(.public);
}

// 条件控制
// if(条件，真值，假值)
margin: if((2 > 1), 10px, 20px);

// 循环函数，when，获取column-1到4的内容，generate是自定义名字，可为任何值
.generate(@n, @i: 1) when (@i =< @n) {
  .column-@{i} {
    width: (@i * 100% / @n);
  }
  .generate(@n, (@i + 1));
}

// 使用
.generate(4);












```