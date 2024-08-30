# tailwindcss

注意，每个版本（大版本、次版本）间的用法有差异是正常的，当察觉到没有任何作用时，请先比较依赖中的版本是否和文档的版本一致，不一致可根据对比差异修改。

当文档给的案例不全时，一个好方法，就是根据仅有的代码关键词，去github、搜索引擎等搜索。

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

**可维护性问题**：管理经常重复的工具组合，可通过提取（比如封装成组件等），及使用编辑器的功能（[多光标同时编辑](https://code.visualstudio.com/docs/editor/codebasics#_multiple-selections-multicursor)、简单循环等）解决

vscode多光标编辑快捷键：

- `alt+click`：任何点击的地方同时启用多处编辑
- `ctrl+alt+down`：向下同时启用多处编辑
- `ctrl+alt+up`：向上同时启用多处编辑

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

**before and after**:

- before：设置元素内部最开始的`::before`样式，使用时，会自动添加属性`content: ''`（当禁用了preflight base styles时，需要手动添加），用法`<div class="before:block before:content-['*']">`
- after：设置元素内部最末尾的`::after`样式

大多数情况下，可以用真正的dom元素实现上述效果。只有当伪元素的内容不在dom中，且用户无法选择时，才需要使用伪元素实现。

**placeholder text**：使用`placeholder`修饰符设置任何输入/文本区域内占位符文本的样式，用法是：`<input class="placeholder:italic placeholder:text-slate-400" placeholder="请输入...">`

**file input buttons**：使用`file`修饰符设置`<input type="file">`的样式，包括按钮，字体排版等，比如`class="file:mr-3 file:rounded-full file:border-0 file:text-sm hover:file:bg-white"`

**list markers**：使用`marker`修饰符设置列表前项目符号的样式，比如`<ul class="marker:text-sky-400 list-disc">`，因为该修饰符是可继承的，所以可以直接设置在ul上。

**highlighted text**：使用`selection`修饰符设置文本选中的样式，比如`<div class="selection:bg-fuchsia-300 selection:text-fuchsia-900">`，该修饰符可继承，故而可以直接设置在父级元素上（比如直接在body上设置）。

**first-line and first-letter**：使用`first-line`和`first-letter`修饰符分别设置内容块第一行和第一个字的样式，比如`<p class="first-line:uppercase first-line:tracking-widest first-letter:text-7xl">`。

**dialog backdrops**：使用`backdrop`修饰符设置原生dialog元素的背景样式

### 媒体查询

**responsive breakpoints**：使用响应式修饰符（`sm`, `md`, `lg`, `xl`, `2xl`, `min-[...]`, `max-sm`, `max-[...]`等）在特定的浏览器窗口宽度下（specific breakpoint）设置元素的样式，例如`<div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">`分别在移动设备上渲染3列网格，中等屏幕宽度上渲染4列网格，大屏幕宽度下渲染6列网格。

**prefers color scheme**：使用`prefers-color-scheme`媒体查询符确认系统设置的主题深浅色，这个通常在系统级别进行配置（比如操作系统设置里面）。不待修饰符修饰浅色模式，`dark`修饰符修饰深色模式，例如`<div class="bg-white dark:bg-slate-900">`

**viewport orientation**：当屏幕视口属于特定方向时，使用`portrait`和`landscape`修饰符添加相应的样式，比如`<div class="landscape:hidden">`。

**print styles**：使用`print`修饰符设置在打印文档时的样式，比如`<div class="hidden print:block">`。

**supports rules**：使用`supports-[...]`修饰符判断浏览器是否支持某个功能，若支持，则设置相应样式，括号内可以是`属性:值`的形式，也可以是`属性`的形式，比如`class="supports-[display:grid]:grid"`，`class="supports-[backdrop-filter]:bg-black/25"`。

可以在tailwind.config.js的theme.supports中配置常用规则的快捷方式`grid: 'display:grid'`，之后使用`class="supports-grid:grid"`即可，相当于给方括号内容进行别名设置。

**prefers-reduced-motion**：使用`motion-reduce`和`motion-safe`修饰符实现`@media (prefers-reduced-motion) {}`。

**prefers contrast**：使用`contrast-more`和`contrast-less`修饰符实现`@media (prefers-contrast: more) {}`。

**forced colors mode**：使用`forced-colors`修饰符实现`@media (forced-colors: active) {}`。

### 属性选择器

**aria state**：使用`aria-*`修饰符根据aria属性的值设置样式，tailwind内置了部分aria属性（例如busy、checked、disabled、hidden等），可以在tailwind.config.js中的theme.extend.aria自定义aria属性，比如`class="bg-gray-600 aria-checked:bg-sky-700"`。

也可以使用一次性的属性，用法为`aria-sort="ascending" class="aria-[sort=ascending]:text-xl"`，这时不需要自定义配置。

可以使用`group-aria-*`，`peer-aria-*`修饰符根据父级元素和同级元素设置样式，用法为`aria-sort="ascending" class="group"`(父级)，`class="group-aria-[sort=ascending]:rotate-0"`（目标元素）。

**data attributes**：使用`data-*`修饰符根据data属性的值设置样式，用法为`data-size="large" class="data-[size=large]:text-xl"`，或者在tailwind配置文件下theme.data自定义`checked: 'ui~="checked"'`，后续使用`data-ui="checked active" class="data-checked:underline"`。

**RTL支持**：使用rtl（从右到左）和ltr设置字体方向

**open/closed state**：使用open或closed修饰details和dialog元素处于展开/打开时的样式

### 自定义修饰符

**using arbitrary variants**：就像在工具类中使用arbitrary values一样，也可以在html中使用arbitrary variants直接编写自定义选择器修饰符，用法为：

- `class="[&:nth-child(3)]:underline"`：仅当元素的第三个子元素时该样式才生效，&代表要修改的选择器
- `class="lg:[&:nth-child(3)]:hover:underline"`：可以和其他修饰符一起使用
- `class="[&_p]:mt-4"`：选择器需要空格时，用下划线代替，会给当前元素内部所有的p元素设置样式
- `class="flex [@supports(display:grid)]:grid"`：可以和at-rules（@media，@supports）一起使用，此时不需要&占位符
- `class="[@media(any-hover:hover){&:hover}]:opacity-100"`：可以在at-ruls后面的大括号内包含选择器，组合常规选择器一起使用

**创建插件**：当项目中多次使用相同的arbitrary modifier时，可以使用addVariant api将其提取到插件中，用法[1](https://tailwindcss.com/docs/hover-focus-and-other-states#creating-a-plugin)

### 自定义类

所有的内置修饰符都可以和自定义类一起使用，只需要在tailwind的某一层中定义它们即可：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .content-auto {
    content-visibility: auto;
  }
}
```

在html中使用：

```html
<div class="lg:content-auto"></div>
```

### 修饰符堆叠

当多个修饰符一起使用时，应用的顺序是从内到外应用的，效果如下：

```bash
# 修饰符堆叠
dark:group-hover:focus:opacity-100

# 效果等同于：
dark(groupHover(focus('opacity-100')))

# 例子1：
dark:group-hover:opacity-100
# 生成：
.dark .group:hover .dark\:group-hover\:opacity-100 { opacity: 1; }

# 例子2：
group-hover:dark:opacity-100
# 生成：
.group:hover .dark .group-hover\:dark\:opacity-100 { opacity: 1; }
```

## 响应式设计

可以使用响应式工具变量构建自适应的用户界面，tailwind中每个工具类都可以和不同的breakpoint一起使用，这可以无需离开html模板就可以构建复杂的响应式界面。

常用设备分别率对应的breakpoint：

- `sm`：`@media (min-width: 640px) {}`
- `md`: `@media (min-width: 768px) {}`
- `lg`: `@media (min-width: 1024px) {}`
- `xl`: `@media (min-width: 1280px) {}`
- `2xl`: `@media (min-width: 1536px) {}`

max-*修饰符：

- `max-sm`: `@media not all and (min-width: 640px) {}`
- `max-md`: `@media not all and (min-width: 768px) {}`
- `max-lg`: `@media not all and (min-width: 1024px) {}`
- `max-xl`: `@media not all and (min-width: 1280px)`
- `max-2xl`: `@media not all and (min-width: 1536px) {}`

响应式设计的第一步是添加viewport meta到head中：`<meta name="viewport" content="width=device-width, initial-scale=1.0">`

后续就是根据需求构建不同的响应式内容了，比如`<img class="w-16 md:w-32 lg:w-48" src="..">`

tailwind使用了移动端优先的breakpoint系统，意味着无前缀的工具类对所有屏幕尺寸都有效，带前缀的工具类仅在指定的breakpoint下有效。所以不需使用sm定位移动设备，而是使用覆盖的方式用（sm、md、...）定义其他尺寸下的样式。

若要在特定breakpoint范围内应用样式，需要和`max-*`修饰符一起使用，比如`md:max-xl:flex`表示的范围是`[md, xl]`

**自定义断点**：

- 在tailwind.config.js下theme.screens覆盖系统设置的断点，或继承新增断点，比如`theme.screens: { 'tablet': '640px' }`等同于`@media (min-width: 640px) {}`
- 使用一次性断点，比如`class="min-[320px]:text-center max-[600px]:bg-sky-300"`表示范围在`[320px, 600px]`之间。

## 深色模式

系统主题色设置：设置 -> 个性化 -> 颜色 -> 选择颜色[深色/浅色]。

默认情况下，dark模式使用的是css prefers-color-scheme媒体查询特性，不过也支持通过selector策略手动切换深浅色模式。

**手动切换深色模式**的设置如下：

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector'
}
```

在做完上述设置后，只要某元素的上级元素出现了`dark`class，该元素上就能够通过`dark:bg-black`class在深色模式下让该样式生效，比如：

```html
<div class="dark">
  <!-- 当前背景是黑色，而非白色 -->
  <div class="dark:bg-black bg-white"></div>
</div>
```

如果在tailwind配置中设置了样式前缀（比如jq），则要想使其生效，必须也要同步添加前缀，比如`jq-dark`。

class更新的常用方法是通过js进行dom更新，获取到之前存储的深色模式的值，或者通过`window.matchMedia`API，将根级元素的class设置为dark。

**自定义selector**设置如下：

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-mode="dark"]']
}
```

设置为上述内容后，tailwind会自动使用`:where`伪类包装自定义深色模式选择器，用法如下：

```html
<div data-mode="dark">
  <p>
    <!-- 当上级元素data-mode属性为dark时，下面样式生效 -->
    <div class="dark:underline"></div>
  </p>
</div>
```

上述元素最终转换的css代码如下：

```css
.dark\:underline:where([data-mode="dark"], [data-mode="dark"] *) {
  text-decoration-line: underline;
}
```

**自定义变量替换内置的dark变量**：将variant取代selector即可，第二个参数是class匹配符，此时需要自行使用js修改根部的class，让定义了`dark:xxx`的元素样式生效：

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['variant', '&:not(.light *)']
}
```

若有多种开启深色模式的方式，第二个参数应该用数组列出所有方式，如下：

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['variant', [
    '@media (prefers-color-scheme: dark) { &:not(.light *)}',
    '&:is(.dark *)'
  ]]
}
```

## 样式重用

样式重用的方式：

- 代码中使用循环（比如vue中的`v-for`，react中的`map`）
- 公共组件抽取
- 使用tailwind @apply提取频繁使用的类，但要考虑避免过早抽象

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    /* 使用apply */
    @apply py-2 px-5 bg-black text-white;
  }
}
```

使用：

```html
<button class="py-2 px-5 bg-black text-white"></button>

<!-- 等同于： -->
<button class="btn-primary"></button>
```

## 自定义样式

### 主题定制

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // 这里的会覆盖tailwind默认的配置
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px'
    },
    colors: {
      'blue': '#1fb6ff',
      'pink': '#ff49db'
    },
    // 这里面会在原有的基础上添加属性
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  }
}
```

### 任意值的使用

当需要一些特定的属性值，而非tailwind内置的属性值时，需要使用方括号的形式，比如`class="top-[117px] lg:top-[344px]"`。

方括号设值语法适用于tailwind的所有内容，甚至可以使用theme函数引用tailwind配置文件中的值，比如`class="grid grid-cols-[fit-content(theme(spacing.32))]"`。

当方括号内使用了css变量时，不需要包裹在`var()`中，只需要提供变量名即可，例如`class="bg-[--my-color]"`。

**任意属性用法**：可以使用方括号语法（`[属性名:属性值]`）表示不在tailwind内置类的css属性，比如`class="[mask-type:luminance] hover:[mask-type:alpha]"`。以及修改css变量，比如`class="[--scroll-offset:56px] lg:[--scroll-offset:44px]"`。

**任意变量用法**：就像使用`hover:xxx`的形式一样，可以自定义冒号前面的变量，比如`class="lg:[&nth-child(3)]:hover:undeline"`表示屏幕宽度lg下、该元素是第三个子元素时、鼠标hover状态下，内容加上下划线。

**空白符的处理**：空格默认使用下划线代替，tailwind会在构建时将其自动转为空格，比如`class="grid grid-cols-[1fr_500px_2fr]"`。

对于空格无效的情况下，tailwind不会将下划线转为空格，比如`class="bg-[url('/xx_xx_xx.png')]"`。

当需要使用下划线时，应该加上转义符，例如`class="before:content-['hello\_world']"`。在jsx中，由于反斜杠会从html中删除，所以需要使用`String.raw`让其不会删除className={String.raw`before:content-['hello\_world']`}。

**歧义处理**：tailwind中，很多属性都会共用一个变量，比如font-size和color共用text变量（分别是text-lg, text-black），对于明确类型的值，tailwind内部会自动处理。而当类型不明确（比如使用css变量时），需要手动指定类型：`class="text-[length:var(--my-var)]"`，`class="text-[color:var(--my-var)]"`。

### css和@layer的使用

最简单的自定义css的规则，就是直接将其添加到样式表中：

```css
/* 样式优先级：后来者居上 */

/* 应用于样式规则重置，以及设置默认样式 */
@tailwind base;
/* 希望能够使用到的类的样式，比如text:xxx */
@tailwind components;
/* 适用于小型、单一用途的类，应该始终优先于其他任何样式，所以放在末尾 */
@tailwind utilities;

.my-custom-style {
  /* ... */
}
```

但为了更多的功能，比如控制样式声明的顺序，避免样式被不可预期的替换不生效，可以在上述css中使用@layer指令增加一些样式：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  h1 {
    @apply text-2xl;
  }
}

/* 该层是为正在使用的任何第三方组件放在自定义样式的好地方 */
@layer components {
  .my-custom-style {
    padding: theme('spacing.6');
  }
}

@layer utilities {
  .content-auto {
    content-visibility: auto;
  }
}
```

vue和svelte等框架支持在每个组件文件中的style块中添加每个组件的样式，这时@layer等指令将报错且不起作用。因为中tailwind的底层，这些框架正在独立处理每一个style块，并针对每个块单独运行postcss插件，这意味着，如果有10个组件，tailwind将运行10次。解决此问题的方法是不要在组件style元素中使用@layer，或者直接在html/template中使用tailwind语法，而非在style中，或者使用下面的插件增加自定义样式。

### 编写插件

可以使用tailwind插件系统，给项目添加自定义样式：

```javascript
// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(function({ addBase, addComponents, addUtilities, theme })) {
      // 对应上面的@tailwind base;
      addBase({
        // 给h1标签设置字体大小为2xl
        'h1': {
          fontSize: theme('fontSize.2xl'),
        },
        'h2': {
          fontSize: theme('fontSize.xl')
        }
      }),
      addComponents({
        '.card': {
          backgroundColor: theme('colors.white'),
          padding: theme('spacing.6')
        }
      }),
      addUtilities({
        '.content-auto': {
          contentVisibility: 'auto'
        }
      })
    }
  ]
}
```

## 指令

指令是tailwind特定的自定义au-rules，可以在css中使用，为项目提供特殊功能

### @tailwind

该指令可将内置的base、components、utilities、variants样式插入到css中，用法如下：

```css
@tailwind base;
```

### @layer

该指令告诉tailwind，设置的自定义样式属于哪个bucket（比如base、components等），tailwind会自动将任何@layer指令中的css移动到相应的bucket中，而不必担心书写顺序造成的css混乱，用法如下：

```css
@tailwind utilities;

/* 属于上面的utilities */
@layer utilities {
  .filter-none {
    filter: none;
  }
}
```

### @apply

该指令将任何现有工具类内联到自定义的css中，当需要编写自定义css（比如覆盖第三方库的样式），但仍然希望使用自己的类时非常有用。

```css
.select2-dropdown {
  @apply rounded-b-lg shadow-md;
}
```

默认情况下，任何与@apply内联的包含`!important`的规则都会被删除：

```css
/* 输入 */
.foo {
  color: blue !important;
}

.bar {
  @apply foo;
}

.baz {
  /* 正确用法，保留important */
  @apply font-bold py-2 !important;

  /* 若使用scss，需要用插值语法 */
  @apply font-bold py-2 #{!important};
}

/* 输出 */
.foo {
  color: blue !important;
}

.bar {
  /* 这里删掉了important */
  color: blue;
}

.baz {
  font-weight: 700 !important;
  padding-top: .5rem !important;
  padding-bottom: .5rem !important;
}
```

### @config

该指令指定tailwind在编译时使用的配置文件，对于需要为不同css入口点应用不同配置文件的项目很有用，用法：

```css
@config "./tailwind.site.config.js";

@tailwind base;
```

该指令的路径相对于该css文件，且优先于postcss配置或tailwind cli定义的路径。

当使用了postcss-import时，import语句必须在最顶部，修改成下面的形式：

```css
@import "tailwindcss/base";
@import "./custom-base.css";

@config "./tailwind.admin.config.js";
```

## 函数

可以在css中使用这些函数访问tailwind特定的值，这些函数在构建时进行评估，最终将转为静态值。

### theme()

该函数可以通过点表示法访问tailwind.config.js中的值：

```css
.content-area {
  /* 访问的是配置文件中的theme.spacing.12(嵌套对象)的值 */
  height: calc(100vh - theme(spacing.12));

  /* 若访问的内容包含点，可以使用方括号语法 */
  height: calc(100vh - theme(spacing[2.5]));

  /* 使用blue-500是错误的 */
  background-color: theme(colors.blue.500);

  /* 不透明度，用斜杠分割 */
  background-color: theme(colors.blue.500 / 75%);
}
```

### screen()

该函数可以创建通过名称引用breakpoint的媒体查询，比如：

```css
@media screen(sm) {
  /* xxx */
}

/* 输出 */
@media (min-width: 640px) {
  /* xxx */
}
```
