# usage-vitepress

## 信息提示、块折叠、多tab

::: code-group

```bash [提示]
# ::: [info | tip | warning | danger | details] 标题名
info box
# :::
```

```bash [块折叠]
# ::: details 标题名
内部可以展示任何markdown语法
# :::
```

```bash [块折叠]
# ::: code-group

#```js [标题名]
<!-- code -->
#```

# :::
```

:::

## 引入其他文件

使用`<!--@include: file-path -->`即可

```typescript
// 引入的例子
<!--@include: ../../usage-algorithms/problems/001. 两数之和.ts -->
```

## 在md中使用vue组件

> 对于style预处理器，需要先安装，比如sass、less、stylus

**直接使用**：

可直接使用vue的`script`、`style`标签，而模板则不需要template标签包裹

**引入组件**：

先通过`script`标签import导入组件，然后直接使用该组件即可，和vue一样

## vitepress插件

- @nolebase/vitepress-plugin-enhanced-readabilities：阅读增强，可自由切换布局
- @nolebase/vitepress-plugin-highlight-targeted-heading：闪烁高亮当前的目标标题
