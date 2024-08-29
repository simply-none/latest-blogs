# tailwindcss

## 安装

在webpack、vite等构建工具中无缝集成tailwindcss的步骤如下：

::: details tailwindcss安装步骤

1，安装tailwindcss和postcss：

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

2，在postcss配置中添加tailwindcss：

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

3，配置tailwindcss：

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // 匹配的路径搜寻类名
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

4，引入tailwind基础样式：

```css
/* main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5，后续就可以在content匹配的文件中使用tailwindcss了。

:::

## 开发前配置

若使用vscode，可以安装tailwindcss intellisense插件，即可获得自动完成、语法突出显示、linting等功能。

tailwindcss不支持IE浏览器的任何版本。同时tailwindcss包含了一些尚未被所有浏览器支持的css特性（比如`:focus-visible`，`backdrop-filter`）。查看浏览器是否支持某个css特性，可以查看[caniuse](https://caniuse.com/)。

## 和CSS预处理器集成

tailwindcss官方不建议和sass、less等CSS预处理器一起使用，但仍然可以将它们集成在一起[1](https://tailwindcss.com/docs/using-with-preprocessors)。

如果是一个新项目，并不需要使用到任何的CSS预处理器，而是依赖其他的postcss插件添加相应的预处理器功能。这样做的好处是：更快的构建速度，以及更少的怪癖用法。

**postcss插件替代方案**：

1，postcss-import：构建时导入，将css组合起来。注意，该插件严格遵守css规范，不允许在最顶层之外使用@import规则。

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    // 构建时导入，放在第一个
    'postcss-import': {},
    // css嵌套
    'tailwindcss/nesting': {},
    // css嵌套，指定postcss-nesting版本
    'tailwindcss/nesting': 'postcss-nesting',
    // 如果项目使用了postcss-preset-env(将css处理为大多数浏览器支持的css)，应该保证禁用了嵌套，从而让nesting插件处理
    'postcss-preset-env': {
      features: {
        'nesting-rules': false,
      }
    },
    tailwindcss: {},
    // 浏览器前缀
    autoprefixer: {},
    // css压缩（cssnano，若使用框架可能会自动处理无需配置）
    // 减小代码体积，放在最后
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  }
}
```

在配置了该插件后，css的正确用法：

```css
/* 用法1： */
/* 将导入放在一个单独的公有文件中，而不是导入和样式混合 */
/* components.css */
@import './components/buttons.css';

/* components/buttons.css */
.btn {
  padding: theme('spacing.12') theme('spacing.6');
}

/* 用法2： */
/* @import必须在最开头 */
/* 所以应该用下面的代替：@tailwind base; */
@import 'tailwindcss/base';
@import './custom-bast-styles.css';

@import 'tailwindcss/components';
@import './custom-components.css';

@import 'tailwindcss/utilities';
@import './custom-utilities.css';
```

2，postcss-nested：允许在css中使用嵌套规则，推荐使用官方的`tailwindcss/nesting`。

3，变量，直接用css变量代替预处理器变量。语法为`--color-primary: #000`。同时，大多数变量都可以用tailwindcss的`theme`函数替换，在`tailwind.config.js`中定义的变量都可以通过该函数访问到。

4，浏览器前缀，推荐使用`autoprefixer`。

若实在需要使用预处理器，应该注意以下一些用法：

1，预处理器会在tailwindcss之前运行，这意味着无法将tailwindcss的输出作为输入，将其输入到预处理器中。比如`background-color: darken(theme('colors.blue'), 10%)`将不会生效。

2，tailwindcss和sass一起使用时，`!important`和`@apply`一起使用时，前者必须使用插值语法：`@apply bg-red-500 !important;`换为`@apply bg-red-500 #{!important};`。

3，tailwindcss和sass一起使用时，`screen()`必须使用括号括起来：`@media screen(md) { ... }`换为`@media (screen(md)) { ... }`。

## 核心概念

**css原子化的好处**：

- 无需花费精力给css类命名
- css文件大小将停止增长
- 更安全的变更：改变html标签的类无需担心其他内容会受影响，而改变css则不一定（全局的，可能会影响到其他地方）

**和内联样式相比的一些优点**：

- 有约束的设计：只从预定义的设计系统中选择样式
- 响应式设计：能够使用媒体查询
- 可以使用伪元素、伪类

**可维护性问题**：管理经常重复的工具组合，可通过提取（比如封装成组件等），及使用编辑器的功能（多光标同时编辑、简单循环等）解决

## 状态修饰符

tailwind的每个工具类都可以通过在类名开头添加一个修饰符进行有条件的应用，用于精确控制在不同状态下的行为方式，该修饰符描述了想要应用的目标状态/条件。

和传统的css相比，不同条件下的状态使用的是不同的class，比如默认状态和悬浮下的背景颜色类分别是`.bg-sky-500`, `.hover\:bg-sky-700:hover`，而传统的css则分别是`.btn-primary`, `.btn-primary:hover`。

不同的修饰符可以放在一起，以便于在一些目标更加明确的情形下使用，比如在黑暗模式下（dark）、在中等屏幕大小下（md）、鼠标悬浮时（hover）修改背景颜色，类名为`dark:md:hover:bg-red-600`。

### pseudo classes

**鼠标状态**：

- hover悬浮
- focus：聚焦，包括鼠标点击聚焦、tab键聚
- focus-visible：聚焦，同上，不同点是对于非输入框聚焦时，只有tab聚焦有相应的效果
- focus-within：当元素或后代元素聚焦时，该伪类将生效
- active：点击时
- visited：已经访问过的链接

**元素位置**：

- first：元素本身的第一个元素时匹配
- first-of-type：同一个标签类型元素的第一个元素匹配
- last：和上类似
- last-of-type：和上类似
- only：当元素是其父元素下唯一子元素（子元素包括文本，空格，标签节点）时匹配
- only-of-type：当元素是其父元素下某类型的唯一子元素（子元素包括文本，空格，标签节点）时匹配
- odd：元素当前位置是奇数时匹配
- even：和上类似
- empty：当元素没有任何子元素时匹配
- target：当元素id（`<p id="test">`）和当前url（`https:xxx.xx.xx/xx#test`）匹配时触发

**基于父元素的状态**：当需要根据父元素的状态设置元素样式时，应该使用`group`标记父元素，使用`group-*`给目标元素设置样式（比如`group-hover:stroke-white`）。

该模式适用于每个伪类修饰符，比如`group-focus`, `group-active`, `group-odd`。

当有多层级的嵌套group时，可以根据特定父级group（`group/{name}`）的状态设置样式，形式是`group-hover/{name}`（比如祖级元素group/item，父级元素group/edit，当前元素group-hover/edit:text-gray-700）

创建一次性的group-*修饰符，参考[1](https://tailwindcss.com/docs/hover-focus-and-other-states#arbitrary-groups)

**基于兄弟状态的样式**：当需要根据同级元素设置元素的样式时，应该使用`peer`标记同级，同时使用`peer-*`给目标元素设置样式（比如`peer-invalid:visible`）。

该模式适用于每个伪类修饰符。

注意`peer-*`只能在前面元素标记了`peer`时有效，出现顺序是：`peer` > `peer-*`。

当有多个peer时，可以使用`peer/{name}`给每个peer命名，后面的子元素可以根据前面特定命名的元素设置样式`peer-hover/{name}`（比如`peer/draft`, `peer-hover/draft:block`）

创建一次性的peer-*修饰符，参考[1](https://tailwindcss.com/docs/hover-focus-and-other-states#arbitrary-peers)

**设置直接子元素的样式**：当需要为无法控制的直接子元素设置样式时，可以使用`*`修饰符。注意，当使用了`*`修饰符设置了子元素样式后，然后在子元素设置覆盖样式将不会起作用。

**基于后代元素的状态**：若需要根据后代元素设置该元素的样式时，应使用`has-*`修饰符（比如`has-[:checked]:bg-indigo`）。

可以将`has-*`和伪类一起使用（`has-[:focus]`），以便根据后代的状态设置元素的样式。

可以将`has-*`和元素选择器一起使用（`has-[img]`），以便根据后代的内容设置元素的样式。

基于group的后代样式设置，应使用`group-has-*`修饰符对目标元素进行设置。

基于同级后代的样式设置，应使用`peer-has-*`修饰符对目标元素进行设置。

**表格状态**：

- required：当表单元素（input、select、textarea）设置了required属性时触发
- disabled：和上类似
- invalid：当表单元素（form、fieldset、input等）未通过验证时触发（`<input name="age" type="number" value="5" min="18">`）
- checked：处于选中状态的label/radio/checkbox/select-option等表单元素时生效
- readonly：当元素不可被用户编辑时（设置了readonly属性，或者contenteditable为false）触发
- indeterminate：当元素是当前状态不确定（该元素未赋值时）的表单元素时触发，比如设置了indeterminate属性为true的元素，属于某个fieldset且该组所有单选框按钮都未选中的单选按钮，不确定状态的progress元素[1](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:indeterminate)

### pseudo elements

### 媒体查询

### 属性选择器

### 自定义修饰符

### 高级主题
