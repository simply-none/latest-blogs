# element ui常见问题汇总

## 表单验证
::: code-group

```javascript [验证单个字段]
// validateField方法
this.$refs.formContainer.validateField('filed1', errorInfo => {
  // 根据是否有errorInfo进行对应操作
})
```

```javascript [验证整个表单]
// validate方法
this.$refs.formContainer.validate(valid => {
  // 根据valid的布尔值判断
})
```

:::

## 事件

1. el-input回车事件用法

```javascript
<el-input @keyup.enter.native="handleEnter"/>
```

## 修饰符

`native`：若该组件（即使是element-ui组件）没有实现某个方法时，必须使用类似`@click.native`操作，这个事件才会生效
