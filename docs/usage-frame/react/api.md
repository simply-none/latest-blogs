# api

## dom元素

标签属性：
- className：class
- htmlFor: for，比如label标签上的for
- selected：无效标签，若想在多个选项中默认选中某个option，应该在select标签上将value的值设置成该option对应的value
- checked：设置选中的值
- value：input、select、textarea支持的属性
- style：接受采用驼峰命名属性的js对象，不接受字符串，不会自动补齐不同浏览器的前缀
- onChange：表单字段变化时触发该事件属性