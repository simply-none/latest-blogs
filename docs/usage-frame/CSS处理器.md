# css预处理器

## SCSS

> 参考：https://juejin.cn/post/7055101823442485255

```SCSS
// 命令行scss -> css
npm install -g sass
sass --watch xxx.scss xxx.css

// 导入
@import "./global.scss";

// 使用@use导入
@use "./global.scss" as globalVars;
.main {
  color: globalVars.$color;
}

@use "./global.scss" as *;
.main {
  color: $color;
}

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
// 命令行less -> css
npm install -g less
lessc xxx.less xxx.css

// 导入
@import 'global.css';
@import url('global.less');

// 嵌套
// &-

// 变量
@primary-color: red;
@color: red, green, orange;
@pure-color: 'primary-color';

// 字符串插值
@name: banner;
background: url('./@{name}.png');

// 字符串原样输出: color: red;
color: ~"red";
font: ~"30px/1.5"   // 不进行运算，直接输出，不然此处会运算

// 可变变量，输出@primary-color -> red
color: @@pure-color;

// 变量混合，类似mixin
@pure-font: {
  font: 12px;
}

#main {
  @pure-font();
}

// 混入，参数可带可不带，类似mixin
// 不固定参数，使用.red(...) {},使用@arguments获取
.red (@color: red) {
  color: @color;
}
#main {
  background: red;
}

.main {
  .red;
  #main();
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
.generate(@n) {
  color: red;
}
.generate(@n, @i: 1) when (@i =< @n) {
  .column-@{i} {
    width: (@i * 100% / @n);
  }
  .generate(@n, (@i + 1));
}

// 使用，这里是mixin和when联合，div内有color
// 同时div .column-i { width }
div {
  .generate(4)
};
```

## stylus

特性：
- 冒号、分号、逗号、括号可有可无
- 语法可和css一样

```stylus
// 导入
@import 'reset.css'
#main
  @import './bar.styl'

// 变量，变量名称可以包含$
font-size = 14px
font-stack =  sans-serif, Arial
body
  font font-size font-stack

// 属性查找，无需额外定义变量
// 运算需要用括号阔起来，不然直接输出
#main
  width 50%
  height 50%
  margin-left (@width/2)
  margin-top -(@width/2)

// 变量列表
sizes = 12px 20px
#main 
  padding sizes[0]

// 包含对象形式的变量
list = foo {int: 1, str: 'jade'} {color: red}
#main
  color: list[2].color

// 变量@block扩展
foo = @block {
  width: 20px;
  height 30px
}
#main
  {foo}

// 选择器

// 实现逗号选择器
.div1
.div2
  color red
  &:hover
    color green

// 以$开头的选择器不会生成在css中，仍可当作选择器进行扩展extends
$foo
  color red
#main
  @extends $foo

// 函数
// 默认值
add(a, b = a)
  a+b
#main
  padding add(20px,30px)
  // 命名参数
  margin add(b: 30px, a: 45px)

// 函数返回值
list()
  12px 14px 16px
// 函数返回值是变量参数
args(a, b, c)
  (a b c)
#main
  margin list()[2]
  padding args(23px, 24px, 25px)[1]

// 剩余参数
list(first, params...)
  border params
  color first
#main
  list(red, 1px, solid, red)

// @extends，继承
.message
  padding 10px

.warning
  @extends .message

// 嵌套继承
.message
  .test
    padding 10px

.warning
  @extends .message .test

// 多重继承
.warning
  @extends .message, .message .test

// 条件表达式
box(x, y, margin = false)
  padding y x
  if margin
    margin x y
  else
    margin y
#main
  box(20px, 39px, true)

// 后置条件
pad(types = margin padding, n = 5px)
  padding n if padding in types
  margin n if margin in types

#main
  pad(margin padding, 10px)

// 循环for
// index可省略
// in后面可以是：
// 1 2 3
// (1..3)
fonts = Impact Arial sans-serif
body
  for font, index in fonts
    .box-{index}
      font font
```

## postcss

> 参考：https://github.com/postcss/postcss/blob/main/docs/README-cn.md

定义：
- 是一个允许使用js插件转换样式的工具
- 这些插件可以检查lint项目的css，支持编译尚未被浏览器广泛支持的css语法
- 利用自身的parser将css代码解析为AST抽象语法树，最终输出改写后的css

<!-- tabs:start -->

<!-- tab:移动端适配vue3+vite -->
```vue
// 对不同机型的宽高进行适配
// 将px转为rem
npm install postcss-pxtorem
// 可伸缩适配方案，根据设备宽高设置页面body的字体大小
npm install amfe-flexible

// main.ts
import 'amfe-flexible'

// vite.config.js
import postCssPxToRem from 'postcss-pxtorem'
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        postCssPxToRem({
          // 1rem的px大小
          rootValue: 16,
          // 需要转换的属性
          propList: ['*']
        })
      ]
    }
  }
})
```

<!-- tabs:end -->