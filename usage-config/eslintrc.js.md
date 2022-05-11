# eslintrc 配置

> 参考：    
> https://eslint.org/docs/user-guide/configuring    
> https://lehman.top/index.php/archives/111/    
> https://segmentfault.com/a/1190000020005105   

规则说明：
- "off"或0 -关闭规则
- "warn" 或1 - 开启规则, 使用警告 程序不会退出
- "error"或2 - 开启规则, 使用错误 程序退出

如果有多个配置 优先级如下：
1. `.eslintrc.js`
2. `.eslintrc.json`
3. `.eslintrc`
4. `package.json`

<!-- tabs:start -->

<!-- tab:.eslintrc.js -->
```js
module.exports = {

  //此项是用来告诉eslint找当前配置文件不能往父级查找
  root: true,

  //此项是用来指定eslint解析器的，解析器必须符合规则，babel-eslint解析器是对babel解析器的包装使其与ESLint解析
  parser: 'babel-eslint',

  //此项是用来指定javaScript语言类型和风格，sourceType用来指定js导入的方式，默认是script，此处设置为module，指某块导入方式
  parserOptions: {
    // 设置 script(默认) 或 module，如果代码是在ECMASCRIPT中的模块
    sourceType: 'module',
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "jsx": true
    }
  },

  // 此项指定环境的全局变量，下面的配置指定为浏览器环境
  env: {
    "browser": true,
    "node": true,
    "commonjs": true,
    "es6": true,
    "amd": true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  // 此项是用来配置标准的js风格，就是说写代码的时候要规范的写，如果你使用vs-code我觉得应该可以避免出错
  extends: 'vue',
  // 此项是用来提供插件的，插件名称省略了eslint-plugin-，下面这个配置是用来规范html的
  plugins: [
    'html',
    "flow-vars", 
    "react"
  ],
  /* 
   下面这些rules是用来设置从插件来的规范代码的规则，使用必须去掉前缀eslint-plugin-
    主要有如下的设置规则，可以设置字符串也可以设置数字，两者效果一致
    "off" -> 0 关闭规则
    "warn" -> 1 开启警告规则
    "error" -> 2 开启错误规则
  */
  rules: {
    // 不需要
    "space-before-function-paren": 0,  // 函数定义时括号前面要不要有空格
    "eol-last": 0,  // 文件以单一的换行符结束
    "no-extra-semi": 0, // 可以多余的冒号
    "semi": 0,  // 语句可以不需要分号结尾
    "eqeqeq": 0, // 必须使用全等
    "one-var": 0, // 连续声明
    "no-undef": 0, // 可以 有未定义的变量

    // 警告
    "no-extra-boolean-cast": 1, // 不必要的bool转换
    "no-extra-parens": 1, // 非必要的括号
    "no-empty": 1, // 块语句中的内容不能为空
    "no-use-before-define": [1, "nofunc"], // 未定义前不能使用
    "complexity": [1, 10], // 循环复杂度
    "no-unused-vars": 1, // 不能有声明后未被使用的变量或参数
    // vue
    "flow-vars/define-flow-type": 1,
    "flow-vars/use-flow-type": 1,

    // react
    "react/jsx-uses-react": 2,
    "react/jsx-uses-vars": 2,

    // 错误
    "comma-dangle": [2, "never"], // 对象字面量项尾不能有逗号
    "no-debugger": 2, // 禁止使用debugger
    "no-constant-condition": 2, // 禁止在条件中使用常量表达式 if(true) if(1)
    "no-dupe-args": 2, // 函数参数不能重复
    "no-dupe-keys": 2, // 在创建对象字面量时不允许键重复 {a:1,a:1}
    "no-duplicate-case": 2, // switch中的case标签不能重复
    "no-empty-character-class": 2, // 正则表达式中的[]内容不能为空
    "no-invalid-regexp": 2, // 禁止无效的正则表达式
    "no-func-assign": 2, // 禁止重复的函数声明
    "valid-typeof": 2,  // 必须使用合法的typeof的值
    "no-unreachable": 2, // 不能有无法执行的代码
    "no-unexpected-multiline": 2, // 避免多行表达式
    "no-sparse-arrays": 2, // 禁止稀疏数组， [1,,2]
    "no-shadow-restricted-names": 2, // 严格模式中规定的限制标识符不能作为声明时的变量名使用
    "no-cond-assign": 2, // 禁止在条件表达式中使用赋值语句
    "no-native-reassign": 2, // 不能重写native对象

    // 代码风格
    "no-else-return": 1, // 如果if语句里面有return,后面不能跟else语句
    "no-multi-spaces": 1, // 不能用多余的空格
    "key-spacing": [1, {  // 对象字面量中冒号的前后空格
      "beforeColon": false,
      "afterColon": true
    }],
    "block-scoped-var": 2, // 块语句中使用var
    "consistent-return": 2, // return 后面是否允许省略
    "accessor-pairs": 2, // 在对象中使用getter/setter
    "dot-location": [2, "property"], // 对象访问符的位置，换行的时候在行首还是行尾
    "no-lone-blocks": 2, // 禁止不必要的嵌套块
    "no-labels": 2, // 禁止标签声明
    "no-extend-native": 2, // 禁止扩展native对象
    "no-floating-decimal": 2, // 禁止省略浮点数中的0 .5 3.
    "no-loop-func": 2, // 禁止在循环中使用函数（如果没有引用外部变量不形成闭包就可以）
    "no-new-func": 2,  // 禁止使用new Function
    "no-self-compare": 2, // 不能比较自身
    "no-sequences": 2, // 禁止使用逗号运算符
    "no-throw-literal": 2, // 禁止抛出字面量错误 throw "error";
    "no-return-assign": [2, "always"], // return 语句中不能有赋值表达式
    "no-redeclare": [2, {   // 禁止重复声明变量
      "builtinGlobals": true
    }],
    "no-unused-expressions": [2, {  // 禁止无用的表达式
      "allowShortCircuit": true,
      "allowTernary": true
    }],
    "no-useless-call": 2, // 禁止不必要的call和apply
    "no-useless-concat": 2,
    "no-void": 2, // 禁用void操作符
    "no-with": 2, // 禁用with
    "space-infix-ops": 2, // 中缀操作符周围要不要有空格
    "valid-jsdoc": [2, { // jsdoc规则
      "requireParamDescription": true,
      "requireReturnDescription": true
    }],
    "no-warning-comments": [2, {  // 不能有警告备注
      "terms": ["todo", "fixme", "any other term"],
      "location": "anywhere"
    }],
    "curly": 1, // 必须使用 if(){} 中的{}

    // common js
    "no-duplicate-imports": 1
  }
}

```

<!-- tab:常用规则 -->

```js
'rules': {
  // vue/eslint
  // 根据官方风格指南，自定义组件名称应该由多单词构成，防止和html标签冲突，所以会报错
  "vue/multi-word-component-names":"off",
  // eslint
  "comma-dangle": ["error", "never"], //是否允许对象中出现结尾逗号
  "no-cond-assign": 2, //条件语句的条件中不允许出现赋值运算符
  "no-console": 2, //不允许出现console语句
  "no-constant-condition": 2, //条件语句的条件中不允许出现恒定不变的量
  "no-control-regex": 2, //正则表达式中不允许出现控制字符
  "no-debugger": 2, //不允许出现debugger语句
  "no-dupe-args": 2, //函数定义的时候不允许出现重复的参数
  "no-dupe-keys": 2, //对象中不允许出现重复的键
  "no-duplicate-case": 2, //switch语句中不允许出现重复的case标签
  "no-empty": 2, //不允许出现空的代码块
  "no-empty-character-class": 2, //正则表达式中不允许出现空的字符组
  "no-ex-assign": 2, //在try catch语句中不允许重新分配异常变量
  "no-extra-boolean-cast": 2, //不允许出现不必要的布尔值转换
  "no-extra-parens": 0, //不允许出现不必要的圆括号
  "no-extra-semi": 2, //不允许出现不必要的分号
  "no-func-assign": 2, //不允许重新分配函数声明
  "no-inner-declarations": ["error", "functions"], //不允许在嵌套代码块里声明函数
  "no-invalid-regexp": 2, //不允许在RegExp构造函数里出现无效的正则表达式
  "no-irregular-whitespace": 2, //不允许出现不规则的空格
  "no-negated-in-lhs": 2, //不允许在in表达式语句中对最左边的运算数使用取反操作
  "no-obj-calls": 2, //不允许把全局对象属性当做函数来调用
  "no-regex-spaces": 2, //正则表达式中不允许出现多个连续空格
  "quote-props": 2, //对象中的属性名是否需要用引号引起来
  "no-sparse-arrays": 2, //数组中不允许出现空位置
  "no-unreachable": 2, //在return，throw，continue，break语句后不允许出现不可能到达的语句
  "use-isnan": 2, //要求检查NaN的时候使用isNaN()
  "valid-jsdoc": ["error", {
      "requireReturn": false,
      "requireParamDescription": false,
      "requireReturnDescription": true
  }], //强制JSDoc注释
  "valid-typeof": ["error", {
      "requireStringLiterals": true
  }], //在使用typeof表达式比较的时候强制使用有效的字符串
  "block-scoped-var": 2, //将变量声明放在合适的代码块里
  "complexity": 0, //限制条件语句的复杂度
  "consistent-return": 2, //无论有没有返回值都强制要求return语句返回一个值
  "curly": ["error", "all"], //强制使用花括号的风格
  "default-case": 0, //在switch语句中需要有default语句
  "dot-notation": ["error", {"allowKeywords": false, "allowPattern": ""}], //获取对象属性的时候使用点号
  "eqeqeq": ["error", "smart"], //比较的时候使用严格等于
  "no-alert": 1, //不允许使用alert，confirm，prompt语句
  "no-caller": 2, //不允许使用arguments.callee和arguments.caller属性
  "guard-for-in": 0, //监视for in循环，防止出现不可预料的情况
  "no-div-regex": 2, //不能使用看起来像除法的正则表达式
  "no-else-return": 0, //如果if语句有return，else里的return不用放在else里
  "no-labels": ["error", {
      "allowLoop": false,
      "allowSwitch": false
  }], //不允许标签语句
  "no-eq-null": 2, //不允许对null用==或者!=
  "no-eval": 2, //不允许使用eval()
  "no-extend-native": 2, //不允许扩展原生对象
  "no-extra-bind": 2, //不允许不必要的函数绑定
  "no-fallthrough": 2, //不允许switch按顺序全部执行所有case
  "no-floating-decimal": 2, //不允许浮点数缺失数字
  "no-implied-eval": 2, //不允许使用隐式eval()
  "no-iterator": 2, //不允许使用__iterator__属性
  "no-lone-blocks": 2, //不允许不必要的嵌套代码块
  "no-loop-func": 2, //不允许在循环语句中进行函数声明
  "no-multi-spaces": 2, //不允许出现多余的空格
  "no-multi-str": 2, //不允许用\来让字符串换行
  "no-global-assign": 2, //不允许重新分配原生对象
  "no-new": 2, //不允许new一个实例后不赋值或者不比较
  "no-new-func": 2, //不允许使用new Function
  "no-new-wrappers": 2, //不允许使用new String，Number和Boolean对象
  "no-octal": 2, //不允许使用八进制字面值
  "no-octal-escape": 2, //不允许使用八进制转义序列
  "no-param-reassign": 0, //不允许重新分配函数参数"no-proto": 2, //不允许使用__proto__属性
  "no-redeclare": 2, //不允许变量重复声明
  "no-return-assign": 2, //不允许在return语句中使用分配语句
  "no-script-url": 2, //不允许使用javascript:void(0)
  "no-self-compare": 2, //不允许自己和自己比较
  "no-sequences": 2, //不允许使用逗号表达式
  "no-throw-literal": 2, //不允许抛出字面量错误 throw "error"
  "no-unused-expressions": 2, //不允许无用的表达式
  "no-void": 2, //不允许void操作符
  "no-warning-comments": [1, {"terms": ["todo", "fixme", "any other term"]}], //不允许警告备注
  "no-with": 2, //不允许使用with语句
  "radix": 1, //使用parseInt时强制使用基数来指定是十进制还是其他进制
  "vars-on-top": 0, //var必须放在作用域顶部
  "wrap-iife": [2, "any"], //立即执行表达式的括号风格
  "yoda": [2, "never", {"exceptRange": true}], //不允许在if条件中使用yoda条件
  "strict": [2, "function"], //使用严格模式
  "no-catch-shadow": 2, //不允许try catch语句接受的err变量与外部变量重名"no-delete-var": 2, //不允许使用delete操作符
  "no-label-var": 2, //不允许标签和变量同名
  "no-shadow": 2, //外部作用域中的变量不能与它所包含的作用域中的变量或参数同名
  "no-shadow-restricted-names": 2, //js关键字和保留字不能作为函数名或者变量名
  "no-undef": 2, //不允许未声明的变量
  "no-undef-init": 2, //不允许初始化变量时给变量赋值undefined
  "no-undefined": 2, //不允许把undefined当做标识符使用
  "no-unused-vars": [2, {"vars": "all", "args": "after-used"}], //不允许有声明后未使用的变量或者参数
  "no-use-before-define": [2, "nofunc"], //不允许在未定义之前就使用变量"indent": 2, //强制一致的缩进风格
  "brace-style": [2, "1tbs", { "allowSingleLine": false}], //大括号风格
  "camelcase": [2, {"properties": "never"}], //强制驼峰命名规则
  "comma-style": [2, "last"], //逗号风格
  "consistent-this": [0, "self"], //当获取当前环境的this是用一样的风格
  "eol-last": 2, //文件以换行符结束
  "func-names": 0, //函数表达式必须有名字
  "func-style": 0, //函数风格，规定只能使用函数声明或者函数表达式
  "key-spacing": [2, {"beforeColon": false, "afterColon": true}], //对象字面量中冒号的前后空格
  "max-nested-callbacks": 0, //回调嵌套深度
  "new-cap": [2, {"newIsCap": true, "capIsNew": false}], //构造函数名字首字母要大写
  "new-parens": 2, //new时构造函数必须有小括号
  "newline-after-var": 0, //变量声明后必须空一行
  "no-array-constructor": 2, //不允许使用数组构造器
  "no-inline-comments": 0, //不允许行内注释
  "no-lonely-if": 0, //不允许else语句内只有if语句
  "no-mixed-spaces-and-tabs": [2, "smart-tabs"], //不允许混用tab和空格
  "no-multiple-empty-lines": [2, {"max": 2}], //空行最多不能超过两行
  "no-nested-ternary": 2, //不允许使用嵌套的三目运算符
  "no-new-object": 2, //禁止使用new Object()
  "fun-call-spacing": 2, //函数调用时，函数名与()之间不能有空格
  "no-ternary": 0, //不允许使用三目运算符
  "no-trailing-spaces": 2, //一行最后不允许有空格
  "no-underscore-dangle": 2, //不允许标识符以下划线开头
  "no-extra-parens": 0, //不允许出现多余的括号
  "one-var": 0, //强制变量声明放在一起
  "operator-assignment": 0, //赋值运算符的风格
  "padded-blocks": [2, "never"], //块内行首行尾是否空行
  "quote-props": 0, //对象字面量中属性名加引号
  "quotes": [1, "single", "avoid-escape"], //引号风格
  "semi": [2, "always"], //强制语句分号结尾
  "semi-spacing": [2, {"before": false, "after": true}], //分后前后空格
  "sort-vars": 0, //变量声明时排序
  "space-before-blocks": [2, "always"], //块前的空格
  "space-before-function-paren": [2, {"anonymous": "always", "named": "never"}], //函数定义时括号前的空格
  "space-infix-ops": [2, {"int32Hint": true}], //操作符周围的空格
  "keyword-spacing": 2, //关键字前后的空格
  "space-unary-ops": [2, { "words": true, "nonwords": false}], //一元运算符前后不要加空格
  "wrap-regex": 2, //正则表达式字面量用括号括起来
  "no-var": 0, //使用let和const代替var
  "generator-star-spacing": [2, "both"], //生成器函数前后空格
  "max-depth": 0, //嵌套块深度
  "max-len": 0, //一行最大长度，单位为字符
  "max-params": 0, //函数最多能有多少个参数
  "max-statements": 0, //函数内最多有几个声明
  "no-bitwise": 0, //不允许使用位运算符
  "no-plusplus": 0 //不允许使用++ --运算符
 }
```

<!-- tabs:end -->