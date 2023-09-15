# vue实战技巧

## 组件封装

组件封装的三大利器：
- `$attrs`：对于二次封装的组件，可使用`$attrs`属性直接设置到需要的组件上，这样可以减少props和emits的定义
- 插槽
- `ref`：通过ref属性用于调用组件的属性或者方法（vue3需要通过expose暴露相关内容）

<!-- tabs:start -->

<!-- tab:attrs -->
```vue
<!-- my-custom.vue -->
<template>
  <el-input v-bind="$attrs"/>
</template>

<script>
export default {
  props: {
    // 这里就不用写很多props属性了
  }
}
</script>
```

<!-- tab:插槽 -->
```vue
<!-- my-custom.vue -->
<template>
  <div>
    <slot>xxx</slot>
    <slot name="main" :xxx='var1' :yyy="var2"></slot>
  </div>
</template>

<script>
export default {
  data () {
    return {
      var1: '',
      var2: ''
    }
  }
}
</script>
```

```vue
<!-- 对于二次封装的组件，my-custom.vue -->
<template>
  <el-input v-bind="$attrs" ref="elInput">
    <!-- 此处的slots是父组件即el-input传入的插槽对象 -->
    <template v-for="(value, name) in $slots" #[name]="scopeData">
      <slot :name="name" v-bind="scopeData || {}"/>
    </template>
  </el-input>
</template>

<script>
export default {
  data () {
    return {
      var1: '',
      var2: ''
    }
  }
}
</script>
```

<!-- tab:ref -->
```vue
<!-- my-custom.vue -->
<template>
  <div></div>
</template>

<script>
export default {
  data () {
    return {
      var1: '',
      var2: ''
    }
  },
  methods: {
    getVar1 () {}
  }
}
</script>
```

```vue
<!-- use my-custom -->
<template>
  <my-custom ref="mycustom"></my-custom>
</template>

<script>
export default {
  methods: {
    getMycustomData () {
      let mycustom = this.$refs.mycustom
      // 调用组件内部的方法
      mycustom.getVar1()
    }
  }
}
</script>
```

```vue
<!-- 对于二次封装的组件，my-custom.vue -->
<template>
  <el-input v-bind="$attrs" ref="elInput"/>
</template>

<script>
export default {
  methods: {
    getElInputData () {
      let elInput = this.$refs.elInput
      Object.entries(elInput).forEach([key, value] => {
        // 将el-input内部的属性和方法都放在本组件上，后续调用本组件时，也可以使用这些属性和方法
        this[key] = value
      })
    }
  }
}
</script>
```

<!-- tabs:end -->

## hooks

> 参考：    
> https://juejin.cn/post/7181712900094951483    


<!-- tabs:start -->

<!-- tab:封装下拉框hook -->
```typescript
// hook.ts
import { onMounted, reactive, ref } from 'vue'

export interface ISelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  key?: string;
}

interface IFetchSelectProps {
  // promise泛型参数是其返回值的类型
  apiFun: () => Promise<any[]>
}

export function useFetchSelect (props: FetchSelectProps) {
  const { apiFun } = props
  const options = ref<SelectOpitons[]>([])
  const loading = ref(false)

  const loadData = () => {
    // 在获取数据之前，初始化
    loading.value = true
    options.value = []

    return apiFun().then(data => {
      loading.value = false
      options.value = data
      return data
    }, err => {
      // 错误时的处理
      loading.value = false
      options.value = [
        {
          // 错误数据占位符
        }
      ]
      return Promise.reject(err)
    })
  }

  onMounted(() => {
    loadData()
  })

  return  reactive({
    loading,
    options
  })
}
```

```vue
<!-- 调用hooks -->
<script setup name="fetchSelectWrapper" lang="ts">
import { useFetchSelect } from './hooks'
import { getRemoteData } from '@/api/getData'

const selectBind = useFetchSelect({
  apiFun: getRemoteData
})
</script>

<template>
  <div>
    <!-- 这里使用ant-design-vue的组件 -->
    <a-select v-bind="selectBind"/>
  </div>
</template>
```


<!-- tab:封装下拉框hook2 -->
```typescript
// hook.ts
import { type Ref, ref } from 'vue'

type TAPIFun<TData, TParams extends Array<any>> = (...params: TParams) => Promise<TData>

interface TAutoRequestOptions {
  // 初始状态
  loading?: boolean;
  // 接口成功后的回调
  onSuccess?: (data: any) => void
}

type TAutoRequestResult<TData, TParams extends Array<any>> = [Ref<boolean>, TApiFun<TData, TParams>]

export function useAutoRequest<TData, TParams extends any[] = any[]> (fun: TApiFun<TData, TParams>, options?: TAutoRequestOptions): TAutoRequestResult<TData, TParams> {
  const { loading = false, onSuccess } = options || { loading: false }
  const requestLoading = ref(loading)

  const run: TApiFun<TData, TParams> = (...params) => {
    // 在获取数据之前，初始化
    requestLoading.value = true

    return fun(...params).then(data => {
      onSuccess && onSuccess(data)
      return data
    }).finally(() => {
      // 不管是成功还是失败，都要关闭加载状态
      requestLoading.value = false
    })
  }

  return [requestLoading, run]
}
```

```vue
<!-- 调用hooks -->
<script setup name="AutoRequestWrapper" lang="ts">
import { useAutoRequest } from './hooks'
import { submitApi } from '@/api/getData'
import { Button } from 'ant-design-vue'

const [loading, submit] = useAutoRequest(submitApi)

function onSubmit() {
  // 这里的reqData是传参到api中的
  submit(reqData).then(res => {
    // xxx
  })
}
</script>

<template>
  <div>
    <!-- 这里使用ant-design-vue的组件 -->
    <Button :loading="loading" @click="onSubmit">提交</Button>
  </div>
</template>
```

<!-- tab:封装下拉框hook3 -->
```typescript
// hook.ts
import { type Ref, ref } from 'vue'

type TAutoLoadingResult = [
  Ref<boolean>,
  <T>(requestPromise: Promise<T>) => Promise<T>
]

export function useAutoRequest(defaultLoading = false): TAutoLoadingResult {
  const loading = ref(defaultLoading)

  function run<T>(requestPromise: Promise<T>):Promise<T> {
    loading.value = true
    return requestPromise.finally(() => {
      loading.value = false
    })
  }

  return [loading, run]
}
```

```vue
<!-- 调用hooks -->
<script setup name="AutoRequestWrapper" lang="ts">
import { useAutoRequest } from './hooks'
import { submitApi, cancelApi } from '@/api/getData'
import { Button } from 'ant-design-vue'

const [loading, getApi] = useAutoRequest()

function onSubmit() {
  // 这里直接运行接口，然后链式调用
  getApi(submitApi(data)).then(res => {
    // xxx
  })
}

function onCancel () {
  getApi(cancelApi(data)).then(res => {
    // xxx
  })
}
</script>

<template>
  <div>
    <!-- 这里使用ant-design-vue的组件 -->
    <Button :loading="loading" @click="onSubmit">提交</Button>
    <Button :loading="loading" @click="onCancel">取消</Button>
  </div>
</template>
```




<!-- tabs:end -->


## 奇技淫巧

### vue组件内容替换

> 参考：    
> https://juejin.cn/post/7181712900094951483    

需求：将vue中使用的某种特定格式的内容，替换成另一种格式的内容

解决方案：使用打包插件（vite或者是webpack），在vue解析template之前替换即可

```ts
// 关键代码
export const viteHookBind = (options) => {
  // 处理options
  // xxx

  // 返回相关内容
  return {
    name: "插件名称",
    // 插件运行时刻节点
    enforce: "pre",
    transform: (code, id) => {
      // 截取相关代码内容
      let content = xxx

      // 通过某些方法进行内容的替换
      let newContent = xxx

      return newContent + "其他未处理的内容"
    }
  }
}

// vite.config.ts
import { viteHookBind } from 'npm-or-path'

export default {
  // 引入插件
  plugins: [vue(), vueJsx(), viteHookBind()]
}
```
