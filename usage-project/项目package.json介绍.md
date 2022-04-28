# 项目package.json介绍

> 文档地址：`https://docs.npmjs.com/cli/v8/configuring-npm/package-json`

## npm 字段

### `name`

若要发布npm包，必须包含`name`和`version`字段，这两个一起作为一个完整唯一的标识符；如果不发布，则两者是可选的  

`name`字段的一些规则：
1. 包名不能超过214个字符
2. 在`scoped packages`中可以以点号、下划线开头，在`scoped packages`中必须包含scope，例如`@vue/cli`
3. 新的包名禁止出现大写字符
4. 包名将成为URL`https://www.npmjs.com/package/vue`、命令行参数`npm i vue`、文件夹名`node_modules/vue`的一部分，所以不能包含不安全的URL字符

一些建议：
1. 包名不要使用和node module core一样的名称
2. 不要将`js`和`node`字样放在包名中，它会认为这是js，和上面的命令行参数类似，你可以使用`engines`字段指定引擎
3. 包名可传给`require()`作为参数，所以应该尽量短，但也要适当描述详尽
4. 在确定包名前，可在[npmjs](https://www.npmjs.com/)中查看是否已被人抢先命名了

### `version`

`version`字段必须可被[node-semver](https://github.com/npm/node-semver)解析，node-semver作为一个依赖和npm绑定在一起（使用它：`npm install semver`）

### `description`

`description`字段是一个字符串，在进行`npm search package_name`时，可帮助人们发现你的包

```bash
D:\个人文件\latest-blogs>npm search vue
NAME                      | DESCRIPTION          | AUTHOR          | DATE       | VERSION  | KEYWORDS
vue                       | The progressive…     | =yyx990803…     | 2022-04-14 | 3.2.33   | vue     
vue-router                | > This is the…       | =yyx990803…     | 2022-03-10 | 4.0.14   | 
vue-template-compiler     | template compiler…   | =posva…         | 2021-06-07 | 2.6.14   | vue compiler
bootstrap-vue             | With more than 85…   | =xanf…          | 2022-04-17 | 2.22.0   | Bootstrap Bootstrap v4 Bootstrap for Vue Vue Vue.js Vue v2 SSR Web Components Directives
eslint-plugin-vue         | Official ESLint…     | =yyx990803…     | 2022-04-06 | 8.6.0    | eslint eslint-plugin eslint-config vue vuejs rules
vue-resource              | The HTTP client for… | =yyx990803…     | 2021-06-14 | 1.5.3    | vue xhr http ajax
vuetify                   | Vue Material…        | =elijahkotyluk… | 2022-03-07 | 2.6.4    | vuetify ui framework component framework ui library component library material component
ant-design-vue            | An enterprise-class… | =tangjinzhou    | 2022-04-06 | 3.1.1    | vue vue3 ant design antd vueComponent component components ui framework frontend        
vue-style-loader          | Vue.js style loader… | =yyx990803…     | 2021-03-03 | 4.1.3    | 
vue-js-modal              | Modal Component for… | =euvl           | 2021-08-02 | 2.0.1    | front-end web vue vuejs vue-js dialog alert modal vue-js-modal vue-modal
vue-loader                | > webpack loader…    | =yyx990803…     | 2021-12-12 | 17.0.0   | 
@fortawesome/vue-fontawes | Official Vue…        | =devoto13…      | 2021-10-18 | 2.0.6    | 
ome                       |                      |                 |            |          | 
vue-shortkey              | A plugin for VueJS…  | =fagneraraujo…  | 2019-04-24 | 3.1.7    | vue vue-shortkey shortcut shortkey
element-ui                | A Component Library… | =island205…     | 2022-04-13 | 2.15.8   | eleme vue components
@vue/cli-service          | local service for…   | =akryum…        | 2022-03-22 | 5.0.4    | vue cli
sortablejs                | JavaScript library…  | =rubaxa =owenm  | 2022-03-20 | 1.15.0   | sortable reorder drag meteor angular ng-sortable react vue mixin        
@vue/cli                  | Command line…        | =akryum…        | 2022-03-22 | 5.0.4    | vue cli
buefy                     | Lightweight UI…      | =rafaelpimpa…   | 2022-04-17 | 0.9.20   | bulma vue vuejs vue-bulma components
generator-jhipster        | Spring Boot +…       | =jdubois…       | 2022-04-01 | 7.8.0    | yeoman-generator Java Spring Spring Boot Spring Security JPA Hibernate React Angular Vue
vue-numeric               | Input field…         | =kevinongko     | 2021-06-11 | 2.4.3    | component currency input text number numeric separator vue vue.js
```

### `keywords`

`keywords`字段是一个字符串数组，在进行`npm search package_name`时，可帮助人们发现你的包

### `homepage`

`homepage`字段是一个链接到项目主页是字符串url

### `bugs`

`bugs`字段是一个链接到项目issue的url，或者是一个记录issue的邮箱地址。可以提供一个或两个值（使用对象的方式），如果只提供一个值，则使用字符串的形式；如果提供了url，则在项目根目录下运行`npm bugs`会自动打开跳转到这个网址

```json
"bugs": {
  "url" : "https://github.com/owner/project/issues",
  "email" : "project@hostname.com"
}
```

### `license`

`license`字段指定了项目的使用授权许可，以及一些其他项目所有者设置的约束。下面是一些使用案例：

1. 使用一个[公共的许可证](https://spdx.org/licenses/)：
```json
{
  "license" : "BSD-3-Clause"
}
```
2. 使用多个公共的授权许可，可以使用一个包[SPDX license expression syntax version 2.0 string](https://www.npmjs.com/package/spdx)验证是否合法；
```json
{
  "license" : "(ISC OR GPL-3.0)"
}
```
3. 指定一个自定义的许可，使用字符串表示，这个自定义的许可必须包含一个文件，该文件放在根目录下；
```json
{
  "license" : "SEE LICENSE IN <filename>"
}
```
1. 若不想别人在其他项目中使用一个私有的和未发布的包，则赋值`UNLICENSED`字段即可，也可以使用`"private": true`阻止包的发布
```json
{
  "license": "UNLICENSED"
  // 或者
  "private": true
}
```

### people fileds

当作者是一个人时，可以使用一个包含name，以及可选的url和email字段的author对象表示，或者将他们缩短成一个字段放进author字段中，npm将会解析author字段
```json
{
  "name" : "Jade Qiu",
  "email" : "admin@jadeQ.com",
  "url" : "http://jadeQ.com/"
}
// 或者
{
  "author": "Jade Qiu <admin@jadeQ.com> (http://jadeQ.com/)"
}
```

当作者是一群人时，可以使用一个数组形式的maintainers字段，或者contributors字段表示，数组元素和上面的author对象相类似
```json
{
  "contributors": [
    {
      "name" : "Jade Qiu",
      "email" : "admin@jadeQ.com",
      "url" : "http://jadeQ.com/"
    }
  ]
}
```

### `funding`

`funding`可以指定一个有助于你开发的资助渠道的信息，可以是一个包含URL的对象，字符串，或者数组。可以使用`npm fund`列出项目中所有的依赖包的资助信息，也可以使用`npm fund <package_name>`的方式直接自动跳转到该依赖包的资助渠道网址（同时有多个，则将跳转第一个）

```json
{
  // 一个对象
  "funding": {
    "type" : "individual",
    "url" : "http://example.com/donate"
  },
  // 一个字符串
  "funding": "http://example.com/donate",
  // 一个数组
  "funding": [
    {
      "type" : "individual",
      "url" : "http://example.com/donate"
    },
    "http://example.com/donateAlso",
    {
      "type" : "patreon",
      "url" : "https://www.patreon.com/my-account"
    }
  ]
}
```

### `files`

可选的`files`字段是包被当作依赖安装时包含的一些文件（夹），文件匹配规则和`.gitignore`类似，但是功能相反。忽略这个字段，默认为`['*']`，意味着将包含所有文件。  

可以提供一个`.npmignore`文件（和`.gitignore`类似）放在根目录/子目录下，放在根目录不能覆盖`files`字段设置的值，放在子目录则可以，如果未设置该文件，默认是`.gitignore` ，包含在`files`字段下的文件不能被ignore排除

不管`files`字段如何描述，一些特殊的文件将被包含或排除：
1. 被包含的文件：`package.json`, `README`, `LICENSE`/`LICENCE`, 包含在`main`字段中的文件，其中`README`, `LICENSE`字段可以有任何的扩展
2. 被排除的文件：`.git`, `CVS`, `.svn`, `.hg`, `.lock-wscript`, `.wafpickle-N`, `.*.swp`, `.DS_Store`, `._*`, `npm-debug.log`, `.npmrc`, `node_modules`, `config.gypi`, `*.orig`, `package-lock.json`，若`package-lock.json`想被发布，可以用`npm-shrinkwrap.json`代替（使用[npm shrinkwrap](https://docs.npmjs.com/cli/v8/configuring-npm/npm-shrinkwrap-json)命令创建，内容和`package-lock.json`一致，但是可发布）


### `main`

`main`字段设置了一个包的入口地址，如果包被安装引入`require()`，将会返回该入口文件的默认导出对象。入口地址是一个相对于根目录的地址，若未设置，则默认是根目录下的`index.js`；该字段表示在服务器端使用

附：[browser，module，main 字段优先级](https://github.com/SunshowerC/blog/issues/8)

1. 如果 npm 包导出的是 ESM 规范的包，使用 module
2. 如果 npm 包只在 web 端使用，并且严禁在 server 端使用，使用 browser。
3. 如果 npm 包只在 server 端使用，使用 main
4. 如果 npm 包在 web 端和 server 端都允许使用，使用 browser 和 main

### `browser`

`browser`字段表示在客户端浏览器使用，这意味着可能会包含nodejs模块不可用的原始值，比如`window`

### `bin`

若想让包中的一些可执行脚本/程序安装在PATH中，可将这些脚本相对路径放在`bin`字段对象中

使用方法是，全局安装这个包，若是本地项目，全局安装方法：在项目根目录下，使用命令`npm install . -g`或者`npm link`，全局安装的包，会生成一个`bin`对象下的所有脚本（脚本文件的开头第一行必须是`#!/usr/bin/env node`）命令存放在nodejs安装全局包的地方
```json
{
  "bin": {
    "myapp": "./cli.js"
  }
}
```
如果只有一个可执行文件，并且脚本名字是包名，则提供一个字符串即可：
```json
{
  "name": "my-program",
  "version": "1.2.5",
  "bin": "./path/to/program"
}
```

### `man`

> 不明之处，可查看npm自身的[package.json](https://registry.npmjs.org/npm/latest)

`man`命令指定一个文件路径，或者一个文件路径数组，可通过命令`man xxx`找到，例如：
```json
{
  "name": "foo",
  "version": "1.2.3",
  "description": "A packaged foo fooer for fooing foos",
  "main": "foo.js",
  // 一个文件时，直接使用man foo（主文件名字，不管路径名是什么）
  "man": "./man/doc.1"
  // 多个文件时，必须以数字后缀结尾，压缩文件必须以gz结尾，使用man foo和man foo-bar
  "man": [
    "./man/foo.1",
    "./man/bar.1"
  ]
  // 也可以：man foo和man 2 foo
  "man": [
    "./man/foo.1",
    "./man/foo.2"
  ]
}
```

### `directories`

commonJS包规格使用`directories`表明包的结构，例如在[npm package.json](https://registry.npmjs.org/npm/latest)可看到它给doc、lib、man指定了路径

如果在directories.bin中指定了一个bin目录，则里面的所有文件将被添加，由于bin指令的工作方式，不能够同时设置字符串形式的bin字段和directories.bin字段，若指定单个文件，则用bin字段，指定所有存在于bin目录的字段，则用directories.bin字段

### `repository`

`repository`字段指定了代码存放的网络地址，如果他是一个github的仓库，可以在目录下运行npm docs命令会自动打开浏览器跳到该地址。但是这个url必须是公共可访问的。如果是GitHub，GitHub gist，bitbucket，gitlab，可以直接在安装的时候使用短命令
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/npm/cli.git"
  }
  // 短命令：
  "repository": "npm/npm",
  "repository": "github:user/repo",
  "repository": "gist:11081aaa281",
  "repository": "bitbucket:user/repo",
  "repository": "gitlab:user/repo"
}
```

如果包存放的地址并不在根目录，而是项目的一部分，则可以在`directory`字段中指定目录地址
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/facebook/react.git",
    "directory": "packages/react-dom"
  }
}
```

### `scripts`

`scripts`属性是一个包含各种脚本命令的字典，查看[详细信息](https://docs.npmjs.com/cli/v8/using-npm/scripts)

### `config`

`config`对象用于设置配置一个类环境变量参数，该参数可在程序代码中使用`npm_package_config_<name>`来引用

```js
// package.json
{
  "config": {
    "port": "8080"
  }
}

// vue.config.js
const currentPost = process.env.npm_package_config_port
```

### `dependencies`

该字段是一个包含了包名、包版本映射关系的对象，其中包版本可以是一个范围，也可以是一个可识别的包/git url。测试、转换、开发工具包应该放在`devDependencies`字段中

包版本规则如下[1](https://github.com/npm/node-semver#versions)：
- `version`：确切的版本号
- `>version`：必须大于该版本号才生效
- `>=version`, `<version`, `<=version`
- `~version`：
  - `~1.2.3` === `>=1.2.3 < 1.3.0-0`
  - `~1.2` === `>=1.2.0 < 1.3.0-0` === `1.2.x`
  - `~1` === `>=1.0.9 < 2.0.0-0` === `1.x`
- `^version`：小于第一个非0数字（可为具体数字或者泛指x）出现的`num + 1`的版本
  - `^1.2.3` === `>=1.2.3 < 2.0.0-0`
  - `^0.2.3` === `>=0.2.3 < 0.3.0-0`
  - `^0.0.3` === `>=0.0.3 < 0.0.4-0`
  - `^0.0` === `>=0.0.0 < 0.1.0-0`
- `1.2.x` === `>=1.2.0 < 1.3.0-0`
- `http://xxx`：一个url，url作为包版本时，这个包将被下载并安装在本地
- `*`, `""`：所有的版本号
- `version1 - version2` === `[version1, version2]`
- `range1 || range2`
- `git...`：git url，需符合`<protocol>://[<user>[:<password>]@]<hostname>[:<port>][:][/]<path>[#<commit-ish> | #semver:<semver>]`，其中协议可以是`git`, `git+ssh`, `git+http`, `git+https`, `git+file`，`commit-ish`是一个确切的提交，`<semver>`是指版本规则，可运用所有包的规则
- `user/repo`：GitHub url
- `tag`
- `path/path/path`：可以是本地路径

```json
// git url
"express": "git+ssh://git@github.com:npm/cli.git#v1.0.27"
"express": "git+ssh://git@github.com:npm/cli#semver:^5.0"
"express": "git+https://isaacs@github.com/npm/cli.git"
"express": "git://github.com/npm/cli.git#v1.0.27"

// github url
{
  "name": "foo",
  "version": "0.0.0",
  "dependencies": {
    "express": "expressjs/express",
    "mocha": "mochajs/mocha#4727d357ea",
    "module": "user/repo#feature\/branch"
  }
}

// local path
{
  "name": "baz",
  "dependencies": {
    "bar": "file:../foo/bar"
    "bar": "file:~/foo/bar"
    "bar": "file:./foo/bar"
    "bar": "file:/foo/bar"
  }
}

### `peerDependencies`

前提：插件运行的前提是核心依赖必须先下载安装，不能脱离核心单独引用

解释：该字段规则和dependencies类似，当依赖包和本项目都依赖一个包A时，若都放在dependencies中时，该依赖包A将被下载多次，若放在peerDependencies中，则将下载一次（放在根目录的node modules中）；若包版本不一致产生错误，需自行修复

### `override`

### `engines`

该字段指定了运行项目的环境，防止报错

```json
{
  "engines": {
    "node": ">=0.10.3 <15",
    "npm": "~1.0.20"
  }
}
```

### `os`

该字段指定了运行项目的环境，防止报错

```json
{
  "os": [
    "darwin",
    "linux",
    "!win32"
  ]
}
```

### `cpu`

该字段指定了运行项目的环境，防止报错

```json
{
  "cpu": [
    "x64",
    "ia32",
    "!arm",
    "!mips"
  ]
}
```

### `private`

`private`字段设置为true时，将组织项目发布到包存储组织（比如npm）

### `publishConfig`

### `workspaces`

