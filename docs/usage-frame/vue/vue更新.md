# vue更新内容

## vue 3.5

### props支持解构

```javascript
const { name } = defineProps({
  name: String
})

console.log(name)
```

## 新增onEffectCleanup、onWatcherCleanup函数

该函数的用途是可以在watchEffect、watch函数内部清除掉该函数内部使用到的一些副作用（比如定时器），以前是统一在beforeUnmount清理。

```javascript
import { ref, watch, watchEffect, onEffectCleanup, onWatcherCleanup } from 'vue'

// onEffectCleanup
const flag = ref(false)
watchEffect(() => {
  if (flag.value) {
    const timer = setInterval(() => {
      // do something
    }, 1000)

    // 在组件卸载时，会自动调用该函数清除定时器
    onEffectCleanup(() => {
      clearInterval(timer)
    })
  }
})

// onWatcherCleanup
watch(flag, () => {
  if (flag.value) {
    const timer = setInterval(() => {
      // do something
    }, 1000)

    onWatcherCleanup(() => {
      clearInterval(timer)
    })
  }
})
```

## 新增pause和resume方法

该方法可以暂停和恢复执行watch或watchEffect中的回调

```vue
<template>
  <button @click="count++">count++</button>
  <button @click="runner.pause()">暂停</button>
  <button @click="runner.resume()">恢复</button>
</template>

<script setup>
import { watchEffect } from 'vue'

const count = ref(0)

// 调用runner的pause、resume对回调函数中断和继续执行
const runner = watchEffect(() => {
  if (count.value > 0) {
    // do something
  }
})
</script>
```

## watch的deep选项支持数字

该功能表示监听对象的深度，超过该深度不进行监听，即不会调用watch的回调。

```javascript
import { ref, watch } from 'vue'

const obj = ref({
  a: {
    b: {
      c1: 2
      c: {
        d1: 1
        d: {
          e: 3
        }
      }
    }
  }
})

function change () {
  // 触发回调
  obj.value.a.b.c1 = 3

  // 不触发回调（超过3层）
  obj.value.a.b.c.d1 = 10
}

watch(obj, () => {
  // do something
})
```

## Teleport组件新增defer属性

该属性的作用是to属性可以是Teleport组件后面的dom元素

```vue
<template>
  <Teleport defer to="target">被传送的内容</Teleport>
  <!-- to属性的值可以在组件之后 -->
  <div id="target"></div>
</template>
```

## 新增useTemplateRef函数

该函数的作用是让ref属性更加明确，不令人迷惑。

```vue
<template>
  <input type='text' ref='inputRef' />
  <button @click="setInputVal">赋值</button>
</template>

<script setup>
import { useTemplateRef } from 'vue'

const inputEl = useTemplateRef('inputRef')

function setInputVal () {
  if (inputEl.value) {
    inputEl.value.value = 'hello world'
  }
}
</script>
```

## SSR渲染修改

新增useId函数、lazy hydration懒加载水合、data-allow-mismatch（允许控制台错误）