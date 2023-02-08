# vue3知识汇览

## nextTick用法

```javascript
import { nextTick } from 'vue'
// 使用await形式
// nexttick之前代码（此时DOM未更新）
// ......
await nextTick()
// nexttick之后的代码（此时DOM已经更新，可以获取到新的dom）
// ......

// 和vue2一样的方式
nextTick(() => {
  // 获取更新后的dom
  // ......
})
```

