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

`version`字段必须可被[node-semver]([)](https://github.com/npm/node-semver)解析，node-semver作为一个依赖和npm绑定在一起（使用它：`npm install semver`）

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