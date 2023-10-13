import Theme from 'vitepress/theme'
import './custom.css'
import { install } from 'element-plus'
import 'element-plus/dist/index.css'

export default {
  ...Theme,
  enhanceApp({app}) {
    install(app)
  }
}
