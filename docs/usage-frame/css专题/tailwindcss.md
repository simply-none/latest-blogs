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
