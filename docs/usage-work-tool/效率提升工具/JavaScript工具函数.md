# javascript工具函数

## 对象去重

```javascript
// 对象去重：支持普通数组、对象数组；不支持混合数组（普通数组和对象数组一起）
function unique (arr, key) {
  if (!arr) return arr
  // 不传key，直接简易去重，对象引用，由于地址不一样，所有的对象都会直接返回
  if (key === undefined) return [...new Set(arr)]
  const map = {
    string: e => e[key],
    function: e => key(e)
  }
  const fn = map[typeof key]
  const obj = arr.reduce((o, e) => {
    // 这一步，实际上等同于：o[e[key]] = e
    // 就是将 e的值 赋值给 对象o的e[key]属性
    // 由于逗号运算符返回最后一个操作数的结果，所以最终返回o
    return o[fn(e)] = e, o
  }, {})
  return Object.values(obj)
}
```