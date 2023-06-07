# 需求解析
 
1. 在📕【main.js】中
2. 调用keycloakjs，在ready函数中，拿到keycloak的内容存到全局属性this.$fre，同时启动vue实例
3. 获取当前组织所有的微应用对象，将其存到state.CurrentMicroApps中，同时通过qiankun的【setGlobalState】函数将该内容放在全局，可供微应用获取
4. 在📕【App.vue】中
5. 页面创建时，重定向到首页`/`
6. 调用创建微应用函数【createMicroApp】（传参：当前路由对象[page | route]，主要是path属性）
   1. 若传入了path属性
      1. 通过判断path是否是绝对路径（含http），相对路径（以/开头的）
      2. 绝对路径，则为外部应用，相对路径则为内部应用
      3. 若是外部应用，查找state.loadExternalApps，判断当前链接（pageUrl）是否已加载并保存到state中
      4. 如果不存在，则将当前path加载并保存到state.loadExternalApps中，此时中断函数执行[⛔]
   2. 若路由对象不存在path属性
      1. 对比当前page和当前组织的所有应用state.appsInOrg，若flag不为1，且非dev，则表示已储存该外部应用
      2. 如果已储存该外部应用，查找state.loadExternalApps，判断当前链接（通过pageUrl）是否已加载并保存到state中
         1. 如果不存在外部应用，则将当前path加载并保存到state.loadExternalApps中，此时中断函数执行[⛔]
      3. 如果未储存该外部应用，查看是否已激活微应用（对比state.currentMicroApps）同时dev属性是否存在，满足外部应用的条件则不处理[⛔]，接下来处理非外部应用（微应用）
      4. 获取一个纯粹的微应用属性对象
      5. 若微应用属性对象存在state.loadedMicroApps中，则不处理[⛔]，否则
      6. 通过qiankun的loadMicroApp函数，将相关对象传入到state.loadedMicroApps的属性中[func end]
7. 通过【onGlobalStateChange】函数监听qiankun主应用的状态变更（能够获取到initGlobalState(initialState)）
   1. 获取当前激活的微应用div节点
   2. 获取所有的微应用div节点，设置其display为none，同时，
   3. 若当前激活节点，则设置其display为initial
8. 在📕【NavPagePlugin.vue】中
9. 点击某个导航项，运行【openLink】函数，传入参数（page | route）
   1. 通过对比state.appsInOrg和page判断是否是微应用
   2. 若是微应用：
      1. 解析page的属性pageUrl，使其成为一个url对象（可获取pathname等属性），并设置为微应用的url6. 
   3. 调用创建微应用函数【createMicroApp】（传参：当前路由对象[page | route]，主要是path属性）
      1. 若传入了path属性
         1. 通过判断path是否是绝对路径（含http），相对路径（以/开头的）
         2. 绝对路径，则为外部应用，相对路径则为内部应用
         3. 若是外部应用，查找state.loadExternalApps，判断当前链接（pageUrl）是否已加载并保存到state中
         4. 如果不存在，则将当前path加载并保存到state.loadExternalApps中，此时中断函数执行[⛔]
      2. 若路由对象不存在path属性
         1. 对比当前page和当前组织的所有应用state.appsInOrg，若flag不为1，且非dev，则表示已储存该外部应用
         2. 如果已储存该外部应用，查找state.loadExternalApps，判断当前链接（通过pageUrl）是否已加载并保存到state中
            1. 如果不存在外部应用，则将当前path加载并保存到state.loadExternalApps中，此时中断函数执行[⛔]
         3. 如果未储存该外部应用，查看是否已激活微应用（对比state.currentMicroApps）同时dev属性是否存在，满足外部应用的条件则不处理[⛔]，接下来处理非外部应用（微应用）
         4. 获取一个纯粹的微应用属性对象
         5. 若微应用属性对象存在state.loadedMicroApps中，则不处理[⛔]，否则
         6. 通过qiankun的loadMicroApp函数，将相关对象传入到state.loadedMicroApps的属性中[func end]
   4. 在【createMicroApp】回调中：
      1. 调用tabs.openTab函数，打开tab页
         1. 判断当前路由页是否已在tabs中，存在则跳转到那个tab，同时遍历所有tabs，将其active设置为对应的Boolean属性
         2. 若tab不存在，则将其添加到tabs中
         3. 使用router.replace替换地址栏的url，之后在回调中：
            1. 设置tabs到state
      2. 获取当前激活的微应用div节点
      3. 获取所有的微应用div节点，设置其display为none，同时，
      4. 若当前激活节点，则设置其display为initial
      5. 调用setGlobalState函数
         