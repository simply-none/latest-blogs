# vue3 api总结

## 全局通用API

**应用实例**：

- createApp()
- createSSRApp()
- app.mount()
- app.unmount()
- app.component()
- app.directive()
- app.use()
- app.mixin()
- app.provide()
- app.runWithContext()
- app.version
- app.config： 包含属性errorHandler、warnHandler、performance、compilerOptions、globalProperties、optionMergeStrategies

**常规API**：需从vue中导入

- version
- nextTick()
- defineComponent()
- defineAsyncComponent()
- defineCustomElement()

## 内置内容

**内置指令**：

- v-show
- v-if、v-else-if、v-else
- v-for
- v-on：`@`
- v-once
- v-bind：`:`
- v-model
- v-slot
- v-memo：用于性能之上场景的微小优化，很少使用，常用于渲染海量列表（v-for），`v-memo='[valA, valB]'`，当数组元素内的值和上一次渲染相同时，则跳过子树的渲染更新
- v-cloak：隐藏未完成编译的dom模板，只在无构建步骤的环境中使用
- v-text
- v-html
- v-pre

**内置组件**：

- Transition
- TransitionGroup
- KeepAlive
- Teleport
- Suspense

**内置特殊元素**：

- component：`<component is='xxx'></component>`
- slot：`<slot name='xxx' :text="xxx"></slot>`
- template

**内置特殊属性**：

- key
- ref
- is

## 组合式API

**组合式API**：

- setup():
  - `setup(props, context)`
  - `setup(props, { attrs, emit, expose, slots })`

**响应式核心**：

- ref()
- reactive()
- readonly()
- shallowRef()
- shallowReactive()
- shallowReadonly()
- computed()
- watch()
- watchEffect()
- watchPostEffect()
- watchSyncEffect()

**响应式工具函数**：

- isRef()：是否是ref
- isProxy()：是否是reactive、readonly及其浅层（shallow）表示创建的**代理**
- isReactive()：是否是reactive及其浅层（shallow）表示创建的代理
- isReadonly()：是否是readonly及其浅层（shallow）表示创建的代理
- triggerRef(shallowRef)：在对浅层表示的变量进行深度变更后使用，可强制触发该变更
- unref()：作用于ref和普通变量，返回`refVal.value | val`
- toValue()：和unref类似，还可作用于getter函数
- toRef()：创建一个与源保持同步更新的ref
- toRefs()：响应式对象 -> 包含ref属性的普通对象
- toRaw()：代理 -> 原始对象
- markRaw()：将对象标记为不可转为代理，返回其本身
- customRef()：自定义ref
- effectScope()：创建一个effect作用域，捕获其中所创建的响应式副作用（watch、computed）
- getCurrentScope()
- onScopeDispose()

**生命周期钩子**：

- onBeforeMount
- onMounted
- onBeforeUpdate
- onUpdated
- onBeforeUnmount
- onUnmounted
- onErrorCaptured
- onRenderTracked
- onRenderTriggered
- onActivated
- onDeactivated
- onServerPrefetch

**依赖注入**：

- provide()
- inject()
- hasInjectionContext()：如果inject可以指错误的地方（比如setup外部）被调用不触发警告，则返回true，用于lib中

## 选项式API

**状态选项**：

- data
- props
- computed
- methods
- watch
  - `a(val, old) => {}`
  - `c: { handler(val, old) {}, deep: true, ...}`
  - `'a.aa' : function (val, old) {}`
- emits
- expose
  - `['method1', 'method2', ...]`

**渲染选项**：

- template：字符串
- render
- compilerOptions
- slots：使用插槽时的辅助类型推断选项

**生命周期选项**：

- beforeCreate
- created
- beforeMount
- mountd
- beforeUpdate
- updated
- beforeUnmount
- unmounted
- errorCaptured
- renderTracked：dev
- renderTriggered：dev
- activated：keep-alive
- deactivated：keep-alive
- serverPrefetch：ssr

**组合选项**：

- provide
- inject
- mixins
- extends

**其他选项**：

- name：用于在组件自身引用自己时、用于keep-alive缓存组件、vue devtools显示、警告错误信息显示。单文件组件会根据文件名自动推导name
- inheritAttrs：是否启用默认的组件attribute透传，也可使用defineOptions宏
- components
- directives

**组件实例**：

- $data
- $props
- $el
- $options
- $parent
- $root
- $slots
- $refs
- $attrs
- $watch(source, callback, options)
- $emit(event, ...args)
- $forceUpdated()：强制组件重新渲染
- $nextTick(callback)
