import Theme from 'vitepress/theme'
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
// import { 
//   NolebaseEnhancedReadabilitiesMenu, 
//   NolebaseEnhancedReadabilitiesScreenMenu, 
// } from '@nolebase/vitepress-plugin-enhanced-readabilities'
// import {  
//   NolebaseHighlightTargetedHeading,  
// } from '@nolebase/vitepress-plugin-highlight-targeted-heading'

import './custom.css'
import { install } from 'element-plus'
import 'element-plus/dist/index.css'
// import '@nolebase/vitepress-plugin-enhanced-readabilities/dist/style.css'
// import '@nolebase/vitepress-plugin-highlight-targeted-heading/dist/style.css'

export default {
  ...Theme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 为较宽的屏幕的导航栏添加阅读增强菜单
      // 'nav-bar-content-after': () => h(NolebaseEnhancedReadabilitiesMenu), 
      // 为较窄的屏幕（通常是小于 iPad Mini）添加阅读增强菜单
      // 'nav-screen-content-after': () => h(NolebaseEnhancedReadabilitiesScreenMenu), 
      // 'layout-top': () => [ 
      //   h(NolebaseHighlightTargetedHeading), 
      // ], 
    })
  },
  enhanceApp({app}) {
    install(app)
  }
}
