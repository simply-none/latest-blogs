// ==UserScript==
// @name         react中文文档目录补全-dev
// @version      0.0.5
// @description  展示react中文文档右侧目录，支持2、3、4级目录
// @author       jade qiu
// @match        https://zh-hans.reactjs.org/docs/*
// @match        https://react.docschina.org/docs/*
// @icon         https://zh-hans.reactjs.org/favicon.ico
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.3/moment.min.js
// @license      MIT
// @namespace    https://greasyfork.org/users/909394
// ==/UserScript==

;(function () {
  'use strict'

  const style = `
          .custom-ul {
              padding: 10px 0 10px 20px;
              font-size: 10px;
              
              background: #dadada;
          }
          .custom-li {
            font-family: source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace;
            font-size: 14px;
            font-weight: 100;
            min-width: 36em;
            padding-top: 3px;
          }
          .custom-li-h3 {
            padding-left: 20px;
          }
          .custom-li-h4 {
            padding-left: 20px;
          }
          .custom-li:hover {
            backgound-color: #61dafb;
          }
          .custom-li:first-child {
            padding-top: 0;
          }
          `

  GM_addStyle(style)

  let timer = null

  const render = function () {
    let a = 0
    timer = setInterval(() => {
      a++
      if (a === 5) {
        clearInterval(timer)
        return false
      }
      const currentPageTitle = document.querySelector('article header h1')
      const allPageTitle = Array.from(document.querySelectorAll('ul[id^="section_"] a'))
      const currentPageSecondLevelTitle = Array.from(
        document.querySelectorAll('article>div>div>h2,article>div>div>h3,article>div>div>h4')
      )
      allPageTitle.map((page) => {
        const pageInnerText = page.innerText.replace(/^[0-9]\.\s/, '')
        let run = undefined
        if (pageInnerText === 'React' && currentPageTitle.innerText === 'React 顶层 API') {
          run = true
        } else if (pageInnerText === currentPageTitle.innerText) {
          run = true
        }
        if (run) {
          const ul = document.createElement('ul')
          ul.classList.add('custom-ul')
          currentPageSecondLevelTitle.map((second) => {
            const co = second.cloneNode(true)
            co.classList.add('custom-li', 'custom-li-' + co.nodeName.toLowerCase())
            ul.appendChild(co)
          })
          if (page.parentNode.children.length >= 2) {
            page.parentNode.removeChild(page.parentNode.childNodes[1])
          }
          page.parentNode.appendChild(ul)
        }
      })
    }, 1000)
  }

  // 监听浏览器的返回上一页事件
  window.addEventListener('popstate', function () {
    clearInterval(timer)
    render()
  })

  window.addEventListener('load', function () {
    clearInterval(timer)
    render()
  })

  window.addEventListener('click', (e, a) => {
    const isA = e.path.find((path) => path.nodeName === 'A')
    if (!isA) {
      return true
    }
    clearInterval(timer)
    render()
  })
})()
