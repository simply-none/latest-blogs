# 速记

## 速记（简要）

### 通用

1. 后端项目接口总地址获取，比如`https://xxx.xxx.xxx/sub-menu/v2/api-docs，一般接口总地址是版本（v2）前面的地址`https://xxx.xxx.xxx`

### vue、ts、vite相关

1. 写代码的思路：默认导出所有对象、导出一个返回对象的函数
2. ts添加类型：谁使用了该类型的值，该类型就属于使用者所在的库里面，比如`createApp()`的类型是`App<Element>`，故而类型`App`需要通过`import type { App } from 'vue'`从vue中导入进来
3. ts中，当不知道类型的时候，首先用unknown
4. ts中，类型报错时，设置类型时，先鼠标放上报错的地方查看原先的类型，然后结合（比如）返回值去设置该类型报错的地方
5. 调用组件上的方法，首先要获取到这个组件对象才行（通过ref属性）
6. ts能自动推导类型，就没必要写
7. 

## 知识点汇总（详细）

接口请求get formdata传参（axios、fetch）

> 参考：https://blog.csdn.net/zz00008888/article/details/113933885

## 代码汇总（详细）

element-plus调取表单校验规则函数

```vue
<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'

// 创建组件状态变量
const state = reactive({
  form: {
    username: '',
    password: ''
  }
})

// 解构form，且保持响应性
const form = toRefs(state)

// 表单组件变量
let formRef = ref(null)

// 校验规则
const formRules = reactive({
  username: [
    { require: true, message: '用户名不能为空', trigger: 'blur'}
  ],
  password: [
    { validator: validatorPasswordFn, trigger: 'blur' }
  ]
})

// 校验函数
function validatorPasswordFn (rule: unknown, value: string | undefined, cb: (msg?: string) => void) {
  if (!value) {
    cb('密码不能为空')
  } else {
    cb()
  }
}

function login () {
  // 验证函数，接收一个回调函数，或者返回一个promise，这里使用promise方式
  formRef.value.validate().then(() => {
    console.log('验证成功')
  }).catch(() => {
    console.log('验证失败')
  })
}
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="formRules">
    <el-form-item prop="username">
      <el-input v-model="form.username" type="text"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="form.password" type="password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="login">登录</el-button>
    </el-form-item>
  </el-form>
</template>
```