# zustand@4

> <https://docs.pmnd.rs/zustand/getting-started/introduction>

## 示例

::: details 基本用法

一. 安装

```bash
npm install zustand
```

二. 创建store

```javascript
// src/store.js
import { create } from 'zustand'

// 创建store，方法1：
export const useStoreBase = create((set) => ({
  bears: 0,
  // 此处函数的返回值，默认合并了其他的状态，即等同于：
  // ({ ...state, count: state.count + 1 })
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  // 若想强制替换，返回一个新的状态值，可将第二个参数设为true，即：
  // set((state) => newState, true)
  removeAllBears: () => set({ bears: 0 })
}))

// 创建store，方法2：
export const useStoreBase2 = create(() => ({
  bears: 0,
  text: 'hello'
}))

export const increasePopulation = () => useStoreBase2.setState((state) => ({
  bears: state.bears + 1
}))

export const setText = (text) => useStoreBase2.setState({ text })

// 若不想使用下列的🧡获取状态（而是直接获取），可创建一个createSelectors函数，然后导出
// react store创建
const createSelectors = (_store) => {
  let store = _store
  store.use = {}
  for (let k of Object.keys(store.getState())) {
    ;(store.use)[k] = () => store((s) => s[k])
  }
  return store
}
export const useStore = createSelectors(useStoreBase)

// vanilla store创建，在使用时同react store
import { useStore } from 'zustand'
const createSelectors = (_store) => {
  const store = _store
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    ;(store.use)[k] = () => useStore(_store, (s) => s[k])
  }
  return store
}
export const useStore = createSelectors(useStoreBase)
```

三. 使用

```javascript
// src/components/common.js
import { useStoreBase, useStore } from '../store'
function BearCounter() {
  // 使用🧡
  const bears = useStoreBase((state) => state.bears)
  // 创建createSelectors后，直接访问
  const bears2 = useStore.use.brars
  return <h1>{bears} around here...</h1>
}

function Controls () {
  // 使用🧡
  const increasePopulation = useStoreBase((state) => state.increasePopulation)
  // 创建createSelectors后，直接访问
  const increasePopulation2 = useStore.use.increasePopulation()
  return <button onClick={increasePopulation}>one up</button>
}
```

:::

::: details 嵌套对象
> 对于嵌套对象，可以结合immer、optics-ts、ramda使用，以简化操作

```javascript
import create from 'zustand'
import produce from 'immer'
import * as O from 'optics-ts'
import * as R from 'ramda'

const useStoreBase = create((set) => ({
  deep: {
    nested: {
      obj: {
        count: 0
      },
      arr: ['hello']
    }
  },
  // count加一
  normalInc: () => set((state) => ({
      ...state,
      deep: {
        ...state.deep,
        nested: {
          ...state.deep.nested,
          obj: {
            ...state.deep.nested.obj,
            count: state.deep.nested.obj.count + 1
          }
        }
      }
  })),
  immerInc: () => set(
    produce((state) => {
      ++state.deep.nested.obj.count
    })
  ),
  opticsInc: () => set(
    O.modify(O.optic().path('deep.nested.obj.count'))((c) => c + 1)
  ),
  ramdaInc: () => set(
    R.over(R.lensPath(['deep', 'nested', 'obj', 'count']), (c) => c + 1)
  ),
  // 设置text的值
  normalSetText: (s, i) => set((state) => ({
    ...state,
    deep: {
      ...state.deep,
      nested: {
        ...state.deep.nested,
        arr: [
          ...state.deep.nested.arr.slice(0, i),
          s,
          ...state.deep.nested.arr.slice(i + 1)
        ]
      }
    }
  })),
  immerSetText: (s, i) => set(
    produce((state) => {
      state.deep.nested.arr[i] = s
    })
  ),
  opticsSetText: (s, i) => set(
    O.set(O.optic().prop('deep').prop('nested').prop('arr').at(i))(s)
  ),
  ramdaSetText: (s, i) => set(
    R.set(R.lensPath(['deep', 'nested', 'arr', i]), s)
  )
}))

const App = () => {
  const state = useStoreBase()
  
  return (
    <div>
      <h3>normal</h3>
      <div>
        {state.deep.nested.obj.count}
        <button onClick={state.normalInc}>+1</button>
        <input value={state.deep.nested.arr[0]} onChange={(e) => state.normalSetText(e.target.value, 0)}/>
      </div>
      <h3>immer</h3>
      <div>
        {state.deep.nested.obj.count}
        <button onClick={state.immerInc}>+1</button>
        <input value={state.deep.nested.arr[0]} onChange={(e) => state.immerSetText(e.target.value, 0)}/>
      </div>
      <h3>Optics</h3>
      <div>
        {state.deep.nested.obj.count}
        <button onClick={state.opticsInc}>+1</button>
        <input value={state.deep.nested.arr[0]} onChange={(e) => state.opticsSetText(e.target.value, 0)}/>
      </div>
      <h3>ramda</h3>
      <div>
        {state.deep.nested.obj.count}
        <button onClick={state.ramdaInc}>+1</button>
        <input value={state.deep.nested.arr[0]} onChange={(e) => state.ramdaSetText(e.target.value, 0)}/>
      </div>
    </div>
  )
}
```

:::
