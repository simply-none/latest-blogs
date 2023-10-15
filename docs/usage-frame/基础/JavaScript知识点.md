# JavaScript知识点

## 运算符

逗号运算符：对他的每一个操作数从左往右求值，然后返回最后一个操作数的值

## 方法

arr.reduce语法如下：
```javascript
// 返回数组所有元素计算后的结果
const result = arr.reduce((previousValue, currentValue) => {
  // 这里的返回值是下一次计算的previousValue
  return xxx
}, initialValue)
```