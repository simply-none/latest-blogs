# react-toolkit@2

> <https://redux-toolkit.js.org/usage/usage-guide>

## 示例

::: details 基础用法

一. 安装redux-toolkit和react-redux

```bash
npm install @reduxjs/toolkit react-redux
```

二. 创建react store

```javascript
// app/store.js
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {}
})

```

三. 将react store添加到src/index.js根组件上

```javascript
// src/index.js
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { store } from './app/store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
)
```

四. 创建一个redux state slice

```javascript
// features/counter/counterSlice.js
import { createSlice, current } from '@reduxjs/toolkit'

const initialState = {
  value: 0
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    // reducer函数返回新的state值，
    // 如果不改变state，则不应该返回任意值
    // 如果改变state，则应该返回新的值（return），而非使用state = xxx的形式
    increment: (state) => {
      // 如果要获取当前state的值，应该使用current(state)，而非直接state
      console.log(current(state))
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    }
  }
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer

// 允许异步操作
export const incrementAsync = (amount) => (dispatch) => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount))
  }, 1000)
}

// 获取count的值，也可使用useSelector进行获取，见下💚
export const selectCount = (state) => state.counter.value
```

五. 把slice reducers添加到store上

```javascript
// app/store.js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'

export const state = configureState({
  reducer: {
    // 添加slice reducers
    counter: counterReducer
  }
})
```

六. 在组件上使用redux state和actions

```javascript
// features/counter/Counter.js
import React, { useStete } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment, incrementByAmount, incrementAsync, selectorCount } from './counterSlice'

export function Counter () {
  // 方式一：获取count的值，也可在./counterSlice导出，见上💚
  const count = useSelector((state) => state.counter.value)
  // 方式二：获取
  // const count1 = useSelector(selectorCount)
  const dispatch = useDispatch()
  const [incrementAmount, setIncrementAmount] = useState('2')

  return (
    <div>
      <div>
        <button aria-label='increment value' onClick={() => dispatch(increment())}>Increment</button>
        <span>{count}</span>
        <button aria-label="decrement value" onClick={() => dispatch(decrement())}>Decrement</button>
      </div>
      <div>
        <input aria-label='set increment amount' value={incrementAmount} onChange={e => setIncrementAmount(e.target.value)}/>
        <button onClick={() => dispatch(incrementByAmount(Number(incrementAmount) || 0))}>
          add amount
        </button>
        <button onClick={() => dispatch(incrementAsync(Number(incrementAmount) || 0)}>
          add async
        </button>
      </div>
    </div>
  )
}
```

:::

::: details RTK query用法

一. 创建api service

```javascript
// src/services/pokemon.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://pokeapi.co/api/v2/'
  }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query({
      query: name => `pokemon/${name}`
    })
  })
})

export const { useGetPokemonByNameQuery } = pokemonApi
```

二. 添加service到store中

```javascript
// src/store.js
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { pokemonApi } from './services/pokemon'

export const store = configureStore({
  reducer: {
    [pokemonApi.reducerPath]: pokemonApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(pokemonApi.middleware)
})

setupListeners(store.dispatch)
```

三. 在index.js上使用Provider包裹根组件

```JavaScript
// src/index.js
import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import { store } from './store'

const rootElement = document.getElementById('root')

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  rootElement
)
```

四. 使用RTK query

```javascript
// src/App.js
import * as React from 'react'
import { useGetPokemonByNameQuery } from './services/pokemon'

export default function App() {
  const { data, error, isLoading } = useGetPokemonByNameQuery('bulbasaur')

  return (
    <div>
      {
        error ? (
          <>Oh, no, there was an error</>
        ) : isLoading ? (
          <>Loading...</>
        ) : data ? (
          <>
            <h3>{data.species.name}</h3>
            <img src={data.sprites.front_shiny} alt={data.species.name}/>
          </>
        ) : null
      }
    </div>
  )
}
```

:::
