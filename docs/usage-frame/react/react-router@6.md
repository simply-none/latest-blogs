# react router

## example

```js
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>,
    children: [
      {
        path: 'contact',
        element: <Contact/>
      },
      {
        path: 'dashboard',
        element: <Dashboard/>,
        loader: ({request}) => {
          return fetch('/api/dashboard.json', {
            signal: request.signal
          })
        }
      },
      {
        element: <AuthLayout/>,
        children: [
          {
            path: 'login',
            element: <Login/>
            loader: redirectIfUser,
          },
          {
            path: 'logout',
            action: logoutUser
          }
        ]
      }
    ]
  },
  {
    path: 'about',
    element: <About/>
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
```

## 速记

react-router@6教程使用vite构建react项目

使用Outlet元素实现嵌套路由，即在需要后代路由的组件上的某个地方加上Outlet元素即可

使用loader属性（与path、element等同级）将数据导入到路由组件（比如Root）上，（在Root）使用useLoaderData方法访问导入的数据

使用errorElement属性（与path等同级）捕获路由错误，该属性值的组件可复用