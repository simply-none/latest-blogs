# vscode 技巧

## 快捷键设置

- 折叠所有代码块：`ctrl+k+0-9`，其中 0 是完全折叠
- 展开所有代码块：`ctrl+k+j`
- 展示当前窗口打开的 tab：`ctrl+shift+tab`
- 展示最近打开的文件：`ctrl+p`
  - 跳转到某一行：`ctrl+p` -> `:line`
  - 展示所有的函数、方法、变量、类、标题等等，且上下移动会自动切换到对应位置：`ctrl+p` -> `@`或`@fnName`
  - 分类展示所有的函数、方法、变量、类、标题等等，且上下移动会自动切换到对应位置：`ctrl+p` -> `@:`或`@fnName:`
  - 查看 ctrl+p 的所有功能建议：`ctrl+p` -> `?`
- 同时编辑多行内容：`ctrl+alt+up/down`
- 转到下一个错误/警告：`F8`或`Fn+F8`
- 转到上一个错误/警告：`shift+F8`或`shift+Fn+F8`
- 跳转到前一个打开的 tab：`alt+left`
- 跳转到后一个打开的 tab：`alt+right`

## 插件推荐

- koroFileHeader，自动生成代码文件头注释，函数注释
- Office Viewer：直接在 vscode 中展示 md 文件、word、excel、img、pdf、svg 的预览模式
- Data Preview：预览文件
- Live Server：将当前文件（夹）运行在本地网络环境中
- Polacode：代码图片
- CodeSnap：代码图片
- Insert Date String：插入日期
- Iconify IntelliSense：将项目中的图标代码直接展示成图标的形式
- Git History Diff：展示文件夹、文件（右击）、项目（左侧项目文件列空白处右击）的历史 git commit
- Git Graph：图形化展示 git commit（在左侧 tab source control 里面）
- local history：保存文件的本地历史记录
- TODO Tree：添加一个左侧 tab 入口，展示文件的所有 todo 列表
- project manager：管理多个项目
- VS Code Counter：统计项目代码行数
- Error Lens：更直观的展示文件的警告、错误
- Colorize：展示 css 颜色
- Color Picker：快速选择 css 颜色
- Postcode：直接在 vscode 中进行接口测试
- Duplicate Action：快捷的复制文件
- indent-rainbow：让缩进带有颜色
- koroFileHeader：生成文件注释、其他注释，需进行相关配置
- project-tree：生成项目结构
- Bookmarks：给文件代码行添加书签标记的功能，便于后续查找

给项目添加推荐插件，可以在第一次打开时自动安装这些插件：

```json
// .vscode/extensions.json
{
  "recommendations": [
    // 获取当前安装的vscode插件
    // 在cmd中输入code --list-extensions命令
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "Vue.volar"
  ]
}
```

## .vscode 目录

定义：存放工作区的项目配置和工具相关文件

目录文件：

- setting.json：会覆盖掉 vscode 编辑器的全局配置
- extensions.json：用来设置项目用到的插件推荐列表
- xxxxxxx.code-snippets：项目中共享的代码片段

::: code-group

```json [setting.json]
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },
  "stylelint.validate": ["css", "less", "scss", "vue"]
}
````

```json [extensions.json]
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "Vue.volar"
  ]
}
```

:::

## 其他VScode使用技巧

### json不能添加注释

点击右下角的文件类型文字【JSON】，选择【Configure File Association for '.json'，选择【JSON with Comments】即可

### vscode 代码图片

> polacode

### 创建运行任务

- 创建运行任务（ctrl+shift+B），会得到一个.vscode 文件夹，包含 tasks.json 和 launch.json 俩个文件

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "typescript",
      "tsconfig": "Typescript入门与实战-钟胜平/demos/demo1/tsconfig.json",
      "problemMatcher": ["$tsc"],
      "group": "build",
      "label": "tsc: 构建 - Typescript入门与实战-钟胜平/demos/demo1/tsconfig.json"
    }
  ]
}
```

### vscode 代码片段

代码片段：可直接键入相对应的名称（html:5）就生成一个原始代码

1. 在 file-preference-user snippet 中创建对应后缀的类型片段（类似一个模板，json 对象形式）
2. 在[generator snippet](https://snippet-generator.app)中可生成对应的 json 对象
3. 粘贴到 json 文件中

注意：若设置代码片段后，不生效，可在 setting.json 文件中进行相关配置，如下是对 md 文件的配置

```json
{
  "[markdown]": {
    "editor.quickSuggestions": {
      "other": true,
      "comments": true,
      "strings": true
    },
    "editor.acceptSuggestionOnEnter": "on"
  }
}
```

### vscode 代码格式化

#### 安装代码格式化插件

1. prettier
2. vetur

#### 格式化设置

- 第一种：搜索 vetur，然后将主要的后缀（js、vue）等的格式化设置成 prettier
- 第二种：直接在 setting.json 中进行设置
- 在项目根目录添加：`.prettierrc.json`文件

::: code-group

```json [setting.json]
{
  "editor.mouseWheelZoom": true,
  "vsicons.dontShowNewVersionMessage": true,
  "editor.wordWrap": "on",
  "sync.gist": "4b7976da83ce58b02de7f05e735028a8",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "terminal.integrated.rendererType": "dom",
  "workbench.colorCustomizations": {
    "activityBarBadge.background": "#00BCD4",
    "list.activeSelectionForeground": "#00BCD4",
    "list.inactiveSelectionForeground": "#00BCD4",
    "list.highlightForeground": "#00BCD4",
    "scrollbarSlider.activeBackground": "#00BCD450",
    "editorSuggestWidget.highlightForeground": "#00BCD4",
    "textLink.foreground": "#00BCD4",
    "progressBar.background": "#00BCD4",
    "pickerGroup.foreground": "#00BCD4",
    "tab.activeBorder": "#00BCD4",
    "notificationLink.foreground": "#00BCD4",
    "editorWidget.resizeBorder": "#00BCD4",
    "editorWidget.border": "#00BCD4",
    "settings.modifiedItemIndicator": "#00BCD4",
    "settings.headerForeground": "#00BCD4",
    "panelTitle.activeBorder": "#00BCD4",
    "breadcrumb.activeSelectionForeground": "#00BCD4",
    "menu.selectionForeground": "#00BCD4",
    "menubar.selectionForeground": "#00BCD4",
    "editor.findMatchBorder": "#00BCD4",
    "selection.background": "#00BCD440"
  },
  "materialTheme.accent": "Cyan",
  "editor.suggestSelection": "first",
  "vsintellicode.modify.editor.suggestSelection": "automaticallyOverrodeDefaultValue",
  "vscode_custom_css.imports": [
    "file:///P:/Apps/VSCode-win32-x64-1.39.2/synthwave84.css"
  ],
  "[markdown]": {
    "editor.defaultFormatter": "yzhang.markdown-all-in-one",
    "editor.quickSuggestions": true
  },
  // "[vue]": {
  //     "editor.defaultFormatter": "octref.vetur"
  // },
  "editor.tabSize": 2,
  // vscode默认启用了根据文件类型自动设置tabsize的选项
  "javascript.updateImportsOnFileMove.enabled": "always",
  "editor.quickSuggestions": {
    "strings": true
  },
  "[scss]": {
    "editor.defaultFormatter": "HookyQR.beautify"
  },
  "local-history.daysLimit": 10000,
  "local-history.maxDisplay": 10000,
  "[json]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "remote.SSH.remotePlatform": {
    "qiu_dev": "linux",
    "omg_new_origin": "linux",
    "omg_new_origin111": "linux"
  },
  "git.autofetch": true,
  "git.ignoreLegacyWarning": true,
  "workbench.startupEditor": "newUntitledFile",
  "workbench.iconTheme": "vscode-icons",
  "files.autoSave": "afterDelay",
  "leek-fund.stocks": [
    "sh000001",
    "sh000300",
    "sh000016",
    "sh000688",
    "hk03690",
    "hk00700",
    "usr_ixic",
    "usr_dji",
    "usr_inx",
    "sz002548",
    "sh601658",
    "sz000530",
    "sh601952",
    "sh600010",
    "sh600644",
    "sz002797"
  ],
  "leek-fund.statusBarStock": ["sh600010"],
  "git.enableSmartCommit": true,
  "terminal.integrated.tabs.enabled": true,
  // "[jsonc]": {
  //     "editor.defaultFormatter": "HookyQR.beautify"
  // },
  "update.mode": "none",
  "emmet.extensionsPath": [""],
  "emmet.includeLanguages": {
    "vue": "html",
    "vue-html": "html"
  },
  "diffEditor.ignoreTrimWhitespace": false,
  "workbench.colorTheme": "Visual Studio Light",
  "leek-fund.funds": [[]],
  "explorer.confirmDelete": false,
  "terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "icon": "terminal-powershell"
    },
    "Command Prompt": {
      "path": [
        "${env:windir}\\Sysnative\\cmd.exe",
        "${env:windir}\\System32\\cmd.exe"
      ],
      "args": [],
      "icon": "terminal-cmd"
    },
    "Git Bash": {
      "source": "Git Bash"
    },
    "bash": {
      "path": "C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"
    }
  },
  "gitlens.defaultDateFormat": null,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": "active",

  /* "editor.tokenColorCustomizations": {
        "comments": "#d69191", // 注释
        "keywords": "#0a0", // 关键字
        "variables": "#f00", // 变量名
        "strings": "#e2d75dbd", // 字符串
        "functions": "#5b99fcc9", // 函数名
        "numbers": "#AE81FF" // 数字
    },
    // 选中高亮的颜色
    "workbench.colorCustomizations": {
        "editor.selectionBackground": "#aa0000"
    } */

  // 界面配置路径 Text Editor
  "editor.insertSpaces": true, // 设置输入tab键时是否自动转为插入空格（默认ture，即自动转空格）,当editor.detectIndentation配置为 true 时，该配置项将被自动覆盖
  "editor.detectIndentation": false, // 设置是否自动检测对齐，控制打开文件时是否基于文件内容，自动检测editor.tabSize 和editor.insertSpaces

  //界面配置路径 Text Editor -> Files
  "files.enableTrash": true, // 设置删除文件、目录时是否允许删除到操作系统回收站，默认为true，即允许
  "files.encoding": "utf8", // 设置读写文件时所用编码 默认UTF-8，可针对每种语言进行设置
  "files.autoGuessEncoding": false, // 设置打开文件时，是否自动猜测字符编码，默认false，即不自动猜测，可针对每种语言进行设置
  // 界面配置路径 Text Editor -> Formatting
  "editor.formatOnPaste": true, // 设置黏贴内容时是否自动格式化，true表示自动格式化，需要配置格式化器(formatter)才可使用
  "editor.formatOnSave": true, // 设置保存文件时是否自动格式化，true表示自动格式化,需要配置格式化器(formatter)才可使用
  "editor.formatOnSaveMode": "modifications", // 设置保存文件时格式化整个文件还是仅被修改处。该配置项仅在 "editor.formatOnPaste" 为 true时生效
  "editor.formatOnType": true, // 设置输入完成后是否自动格式化当前行

  // 界面配置路径 Text Editor -> Minimap
  "editor.minimap.maxColumn": 120, // 设置minimap的宽度以设置可渲染的最大列数，默认120

  // Eslint插件配置
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": false // 设置保存时是否自动修复代码
  },
  // 界面配置路径 Extensiosn -> ESlint
  "eslint.alwaysShowStatus": true, // 设置状态栏是否一直显示ESlint图标项，true表示一直显示
  "eslint.format.enable": true, // 设置是否把ESlint作为一个格式化器，true表示启用

  // Prettier插件配置
  // 界面配置路径 Extensiosn -> Prettier
  "prettier.enable": true, // 设置是否开启prettier插件，默认为true，即开启
  "prettier.semi": false, // 设置是否在每行末尾添加分号，默认为 true
  "prettier.singleQuote": true, // 设置格式化时，保持单引号，如果设置为true，则单引号会自动变成双引号
  "prettier.tabWidth": 2, // 设置每个tab占用多少个空格
  "prettier.printWidth": 120, // 设置每行可容纳字符数
  "prettier.useTabs": false, // 设置是否使用tab键缩进行，默认为false，即不使用
  "prettier.bracketSpacing": true, // 在对象，括号与文字之间加空格 true - Example: { foo: bar }   false - Example: {foo: bar}， 默认为true
  "prettier.jsxBracketSameLine": true, // 设置在jsx中，是否把'>' 单独放一行，默认为false，即单独放一行
  // 设置各种代码的默认格式化器//以下为默认配置
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "HookyQR.beautify"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // Vetur插件配置
  "vetur.format.enable": true, // 设置是否禁用插件格式化功能 // 默认为true，即开启
  "vetur.format.defaultFormatter.css": "prettier", // 设置css代码(<style>包含的代码块）默认格式化器
  "vetur.format.defaultFormatter.sass": "sass-formatter",
  "vetur.format.defaultFormatter.postcss": "prettier",
  "vetur.format.defaultFormatter.scss": "prettier",
  "vetur.format.defaultFormatter.less": "prettier",
  "vetur.format.defaultFormatter.stylus": "stylus-supremacy", // 设置js代码<script>包含的代码块）默认格式化器
  "vetur.format.defaultFormatter.ts": "prettier", // 设置vetur默认使用 prettier格式化代码
  "vetur.format.options.tabSize": 1, // 设置tab键占用的空格数，该配置将被所有格式化器继承
  "vetur.format.options.useTabs": false,
  "php.validate.executablePath": "",
  "git.confirmSync": false,
  "vetur.completion.scaffoldSnippetSources": {
    "workspace": "💼",
    "user": "🗒️",
    "vetur": "✌"
  } // 设置是否使用tab键缩进 默认false，即不使用，该配置将被所有格式化器继承
  //"vetur.ignoreProjectWarning": true // 控制是否忽略关于vscode项目配置错误的告警，默认为false，即不忽略
}
```

```json [.prettierrc.json]
{
  "singleQuote": true,
  "semi": false
}
```

:::

#### 代码格式化操作

1. 设置默认格式化程序为 prettier
2. 全局格式化，可在 package.json 添加脚本：`"prettier": "prettier --config .prettierrc.json --write \"./**/*.{js,jsx,vue}\" "`，然后运行`npm run prettier`

#### 注意事项

1. 在 setting.json 设置为单引号，去除分号的设置无效，需在`.prettierrc.json`中设置

## setting.json 设置

> 参考：  
> https://code.visualstudio.com/docs/getstarted/settings  
> https://juejin.cn/post/7276628114981388349
