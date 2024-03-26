# TypeScript 知识点（第二期）

> 参考文档：http://www.patrickzhong.com/TypeScript/
> 注意：可能有些过时内容
> 😢😢😢表示文中不明白的，未记录的内容

## 声明合并

定义：声明合并是指编译器将针对同一个名字的多个独立声明合并为一个单一声明，合并后的声明同时拥有原先多个声明的特性

声明定义：声明会创建三种实体的组合，分别是命名空间、类型或值，如下所示：

| Declaration Type | Namespace | Type | Value |
| ---------------- | --------- | ---- | ----- |
| Namespace        | ✔        |      | ✔    |
| Class            |           | ✔   | ✔    |
| Enum             |           | ✔   | ✔    |
| Interface        |           | ✔   |       |
| Type Alias       |           | ✔   |       |
| Function         |           |      | ✔    |
| Variable         |           |      | ✔    |

声明合并分类：

1. 接口合并：把双方的成员放到一个同名的接口里

注意：

- 接口的非函数成员若不唯一，他们必须要是相同的类型，否则报错
- 接口的函数成员若有多个，则会当成该函数的重载
- 接口合并时，后者优先级更高（后者的成员放在合并接口的前面）
- 若同名函数有多个，并且包含有单一的字符串字面量的参数类型，则该函数会提升到重载列表的顶端，并按照后来者居上原则排序

2. 命名空间合并：同名的命名空间也会合并其成员，命名空间会创建出命名空间和值

注意：

- 命名空间内模块导出的同名接口会进行合并
- 后面的命名空间的导出成员会加到第一个命名空间里面
- 命名空间的非导出成员仅在原有的命名空间内可见，其他命名空间合并过来的成员无法访问

3. 命名空间可以和类、函数、枚举类型合并，只要命名空间的定义符合将要合并类型的定义，合并结果包含两者的声明类型（可以使用这个实现JavaScript的设计模式）
4. 命名空间与类合并：合并结果是一个类带有一个内部类，可以使用命名空间为类增加静态属性，类只能访问已导出的命名空间成员
5. 命名空间与函数合并：可以给函数添加一些属性，保证类型安全
6. 命名空间与枚举类型合并：扩展枚举类型，这里的扩展，更多的是对枚举类型的应用罢了

::: code-group

```typescript
interface Document {
  createElement (tagName: any): Element
}
interface Document {
  createElement (tagName: "div"): HTMLDivElement
  createElement (tagName: "span"): HTMLSpanElement
}
interface Document {
  createElement (tagName: string): HTMLDivElement
  createElement (tagName: "canvas"): HTMLCanvasElement
}
// 合并后
interface Document {
  createElement(tagName: "canvas"): HTMLCanvasElement;
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
  createElement(tagName: string): HTMLElement;
  createElement(tagName: any): Element;
}

```

```typescript
class Album {
  // 使用命名空间中的类
  label: Album.AlbumLabel
}
namespace Album {
  export class AlbumLabel {}
}
```

```typescript
function buildLabel (name: string): string {
  // 使用命名空间中的属性
  return buildLabel.prefix + name + buildLabel.suffix
}
namespace buildLabel {
  export let suffix = ''
  export let prefix = 'hello, '
}
console.log(buildLabel('sam smith'))
```

```typescript
enum Color {
  red = 1,
  green = 2
}
namespace Color {
  export function mixColor (colorName: string) {
    if (colorName === 'yellow') {
      return Color.red + Color.green
    }
    return Color.red
  }
}
// 使用，得出一个新的值罢了（所谓的扩展？😢😢😢）
console.log(Color.mixColor('yellow'))
```

:::

**声明合并注意事项**：

- 类不能与其他类或变量合并

## 混入mixins

多继承的弊端：

- 在支持多继承的环境下，若一个子类所继承的多个父类都拥有一个同名方法，子类在调用该方法时，不知道调用哪一个父类的该方法

混入定义：有的时候，声明一个同时继承两个或多个类的类是一个好的想法，思路有2种：

- 定义两个基类，然后定义一个子类implements两个基类，然后定义一个函数，将基类的原型prototype的方法实现/复制到子类的原型prototype中
- 定义两个基类，然后定义一个子类，并定义一个同名子类的接口extendds两个基类，然后定义一个函数，将基类的原型prototype的方法实现/复制到子类的原型prototype中

::: code-group

```typescript
class Basic1 {
  isBasic1: boolean
  setBasic1 () {
    this.isBasic1 = true
  }
}
class Basic2 {
  isBasic2: boolean
  setBasic2 () {
    this.isBasic2 = true
  }
}
class Child {}
interface Child extends Basic1, Basic2 {}
// 将基类的属性，复制到目标类中
function mixins (child: any, basics: any[]) {
  basics.forEach(basic => {
    Object.getOwnPropertyNames(basic.prototype).forEach(name => {
      const nameDescptor = Object.getOwnPropertyDescriptor(basic.prototype, name)
      if (!nameDescptor) {
          return
      }
      Object.defineProperty(child.prototype, name, nameDescptor);
    })
  })
}

mixins(Child, [Basic2, Basic1])
```

```typescript
class Basic1 {
  isBasic1: boolean
  setBasic1 () {
    this.isBasic1 = true
  }
}
class Basic2 {
  isBasic2: boolean
  setBasic2 () {
    this.isBasic2 = true
  }
}
// 此处只是占坑
class Child implements Basic1, Basic2 {
  isBasic1: boolean
  isBasic2: boolean
  setBasic1: () => void
  setBasic2: () => void
}

function mixins (child: any, basics: any[]) {
  basics.forEach(basic => {
    Object.getOwnPropertyNames(basic.prototype).forEach(name => {
      if (name !== 'constructor') {
        child.prototype[name] = basic.prototype[name]
      }
    })
  })
}

mixins(Child, [Basic2, Basic1])
```

:::

注意事项：

- 若多个基类包含了同名方法，只会继承传入*复制函数*里最后一个基类赋值的该方法

### implements与extends的区别

类的声明：既可以当成一个*类*来使用，同时也能当成一个*类类型*来使用；因为类可以作为一个接口使用，同时类实现了接口，所以有以下关系:

- 类只能继承类
- 接口能继承类和接口
- 类能实现接口和类，因为接口不包含具体实现，所以只能在类上实现
- 接口不能实现接口或类

implements：一个新的类，从父类或接口实现所有的属性和方法，同时可以重写属性和方法，还可以新增一些属性和方法

extends：一个新的接口或类，从父类或者接口继承所有的属性和方法，不能重写属性，可以重写方法

::: code-group

```typescript
// 声明类Point，同时也声明了一个类类型Point
class Point {
  x: number
  y: number
  constructor (x: number, y: number) {
    this.x = x
    this.y = y
  }
}

// 同时声明了一个类类型Point（隐式的，偷偷呈现的）
interface Point {
  x: number
  y: number
}

// 作为类使用
let p: Point = new Point(2, 3)

// 作为类类型使用
function printPoint (p: Point) {
  console.log(p.x, p.y)
}
printPoint(new Point(2, 3))


```

:::

## 三斜线指令

定义：

- 三斜线指令是包含单个XML标签的单行注释，注释的内容会被作为编译器指令使用
- 仅可放在包含它的文件的最顶端，其前面只能出现单行、多行注释（包括三斜线指令）；放在其他的地方只会被当作普通单行注释

分类：

1. 三斜线引用 `/// <reference path="..." />`：

- 用于声明文件间的依赖，告诉编译器在编译过程中要引入的额外的文件；
- 在一个文件加入到 `file`字段列表里时，它包含的所有三斜线引用都要被处理，以他们在文件里出现的顺序，使用深度优先的方式进行解析
- 三斜线引用的路径path是相对于包含它的文件的
- 引入不存在的path或自身会报错
- 当使用了 `--noResolve`时，三斜线引用会被忽略

2. 三斜线类型引用 `/// <reference types="..." />`

- 用于声明对某个包的依赖，对这些包名的解析与在import语句里对模块名的解析类似，可以看成是import声明的包

3. `/// <reference no-default-lib="true" />`：

- 将当前文件标记为一个默认库，告诉编译器在编译过程中不要包含这个默认库，与在命令行中使用--noLib类似
- 当传递了--skipDefaultLibCheck时，编译器指挥忽略检查带有该标记的文件

4. `/// <amd-module name="NamedModule" />`：

- 默认情况下生成的amd模块是匿名的，该指令允许给编译器传入一个可选的模块名
- 这会将NamedModule传入到amd define函数里面

## 模块

> 内部模块称为命名空间；外部模块称为模块；

定义：

- 模块在自身的作用域（而非全局）内执行
- 模块内的变量、函数、类仅在模块内使用，除非使用export等形式进行导出操作
- 模块是自声明的，两模块之间的关系使用import和export建立
- 模块使用 `模块加载器`去导入其他的模块

模块加载器：在执行此模块代码前去查找并执行这个模块的所有依赖，其分类有：

- 作用于commonjs模块的nodejs加载器
- 作用域amd模块的requirejs加载器

### 导出

声明的导出：任何（变量、函数、类、类型别名、接口）*声明*都能够通过添加export关键字来导出

```typescript
// 变量声明
const numberRegexp = /^[0-9]+$/
// 变量声明的导出，在声明之前加上export关键字（其他声明的导出也同理）
export const numberRegexp = /^[0-9]+$/

// 类声明
class ZipCodeValidator implements StringValidator {
  isAcceptable (s: string) {
    return s.length === 5 && numberRegexp.test(s)
  }
}
// 类声明**直接导出**
export { ZipCodeValidator }
// 类声明**重命名导出**
export { ZipCodeValidator as mainValidator }

// **重新导出**：不会在当前模块导入该模块或定义一个新的局部变量，而是直接就导出
export { ZipCodeValidator as RegexpBasedZipCodeValidator } from './ZipCodeValidator'

// 导出一个模块中的所有内容：包括该模块导入的其他模块
export * from 'module-path'
```

### 导入

```typescript
// 导入一个模块中的某个导出内容
import { ZipCodeValidator } from './ZipCodeValidator'

// 导入一个模块中的某个导出内容并重命名
import { ZipCodeValidator as ZCV } from './ZipCodeValidator'

// 将整个模块导入到一个变量，通过该变量访问模块的导出部分
import * as validator from './ZipCodeValidator'

// 模块的直接导入：该模块可能没有任何的导出或用户根本不关注他的导出
import './module-path'
```

### 默认导入导出

默认导出定义：

- 默认导出的语法为 `export default xxx`
- 一个模块只能够有一个default导出，且导入默认导出的方式也和普通导出不一样
- 类和函数的声明可以直接被标记为默认导出，此时他们的名字可省略
- 默认导出部分xxx也可以是一个值

```typescript
// 默认导出是一个类声明
export default class {
  static numberRegexp = /^[0-9]+$/
}

// 默认导出是一个值
export default 123

// 导入默认导出，与普通导入相比，没有大括号
import vclass from 'modult-path'
```

### 生成模块代码

编译器会根据编译时指定的模块目标参数，生成相应的供NodeJS（commonjs）、requireJS（amd）、umd、systemJS、ECMAScript2015 native module（es6）模块加载系统使用的代码；生成代码中define、require、register含义可参考相关模块加载器文档；😢😢😢

使用命令行生成相关模块代码：`tsc --module [commonjs | amd ] test.ts`

### 模块的动态加载

定义：

- 语法：`import id = require('xxx')`
- 只想在某种条件下才加载某个模块，可直接调用模块加载器并保证类型完全
- 模块加载器会通过requie被动态调用，只在被需要时加载
- 为了确保类型安全，可以使用typeof在表示类型的地方使用，用于表示模块的类型

::: code-group

```typescript
declare function require (moduleName: string): any
import { Zip } from './zip'
if (xxx) {
  let validator: typeof Zip = require('./zip')
}
```

```typescript
declare function require (moduleNames: string[], onLoad: (...args: any[]) => void): void
import * as Zip from './zip'
if (xxx) {
  require(['./zip'], (zip: typeof Zip) => {
    let validator = new Zip.ZipCodeValidator()
  })
}
```

```typescript
declare const System: any
import { Zip } from './zip'
if (xxx) {
  System.import('./zip').then((zip: typeof Zip) => {
    let validator = new Zip()
  })
}
```

:::

### JavaScript库的使用

定义：

- 若想描述非typescript编写的类库的类型，需要声明类库所暴露出的API（即在.d.ts文件中定义）
- 为模块定义一个.d.ts文件，使用module关键字并把模块的名字括起来，方便后面使用 `/// <reference> node.d.ts`以及导入语句加载模块
- 若不想在使用新模块之前去写该模块的声明，可以采用声明的简写形式以便快速使用该模块

模块声明通配符：

- 某些模块（systemjs、amd）支持导入非JavaScript内容，通常会使用一个前缀、后缀来表示特殊的加载语法，这时可以通过通配符表示这些情况

umd模块：

- 有些模块被设计成兼容多个模块加载器或者不适应模块加载器，这些模块可以通过导入或全局变量的形式访问

```typescript
// 模块的声明
declare module 'path' {
  export function normalize (p: string): string
  export function join (...paths: any[]): string
  export let sep: string
}
// 使用该模块
/// <reference path="node.d.ts" />
import * as URL from 'url'

// 外部模块的简写
declare module 'hot-new-module'
import x, { y } from 'hot-new-module'

// 模块声明通配符:匹配以!test结尾的内容
declare module '*!test' {
  const content: string
  export default content
}
import fileContent from './xyz.txt!text'

// umd模块
export function isPrime(x: number): boolean
export as namespace mathLib
// 在模块中使用，只能使用isPrime，不能使用mathLib调用isPrime
import {isPrime } from 'math-lib'
// error
mathLib.isPrime(2)
// 在无导入导出的文件中使用，通过全局变量的方式使用，可以使用mathLib
mathLib.isPrime(2)
```

### 模块导出注意事项

1. 尽可能在顶层导出内容，而不是嵌套过多的层次，比如不要在模块中导出一个命名空间（多余）、不要导出类的静态方法（类本身就增加了嵌套）
2. 若模块的功能明确，就是导出特定内容，应该设置一个默认导出export default
3. 当要导出大量内容的时候，导入时，可以使用通配符结合别名导入所有内容
4. 当扩展模块的功能时，不应该改变原来的对象，而是导出一个新的实体（例如继承）提供新的功能
5. 模块中不应该使用命名空间导出，比如 `export namespace Foo {}`
6. 对于模块的引用应当使用import，而非使用 `///<reference>`

```typescript
// 模块扩展
// cal.ts
export class Cal {
  // xxx
}
export function test (c: Cal, input: string) {
  // xxx
}

// 扩展模块cal.ts
// extendCal.ts
import { Cal } from './cal.ts'
calss extendCal extends Cal {
  // xxx
}
export { test } from './cal.ts'
```

### 模块扩展和全局扩展

定义：顾名思义，即扩展模块，给模块增加新的特性或功能

注意事项：

- 仅可以对模块中已经存在的声明进行扩展
- 不能扩展模块的默认导出

::: code-group

```typescript
// obse.ts
export class Obse<T> {}

// map.ts
import { Obse } from './obse.ts'
declare module './obse.ts' {
  interface Obse<T> {
    // 对原有的声明扩展出一个新的方法声明
    map<U>(f: (x: T) => U): Obse<U>
  }
}
Obse.prototype.map = function (f) {}

// 在com.ts中使用
import { Obse } from './obse.ts'
import './map.ts'
let o: Obse<number>
o.map(x => x.toFixed())
```

```typescript
// obse.ts
export class Obse<T> {}
declare global {
  interface Array<T> {
    // 给全局对象中的Array扩展一个新的实例方法toObse
    toObse: Obse<T>
  }
}
Array.property.toObse = function () {}
```

:::

## 模块解析

定义：

- 指编译器在查找导入模块内容时所遵循的流程
- 编译器需要准确的知道它表示什么，并且需要检查它的定义
- 编译器会使用某种策略（classic、node）定位表示导入模块的文件，当解析失败且模块名是非相对的，编译器会尝试定位一个外部模块声明，否则会记录一个错误

### 模块解析策略

**classic**：typescript以前的默认解析策略，当前主要用向后兼容

对于相对导入的模块，查找流程为：相对路径，且查找顺序是先 `.ts`, 后 `.d.ts`；对于非相对导入的模块，查找流程为：从包含导入文件的目录依次向上级目录遍历，且查找顺序是先 `.ts`, 后 `.d.ts`

**node**：运行时模仿nodejs模块的解析机制

对于相对路径导入的，例如 `require('./moduleb')`，解析顺序为，直到有一个匹配上为止：

1. 检查 `/root/src/moduleb.js`是否存在
2. 检查 `/root/src/moduleb/package.json`是否存在，且该文件是否指定了main模块，若有，则会引用该main模块
3. 检查 `/root/src/moduleb/index.js`是否存在

对于非相对模块名的解析，例如 `require('moduleb')`会在node_modules查找该模块，从包含导入文件的模块依次向上级目录遍历，直到有一个匹配上为止：

1. `/root/src/node_modules/moduleb.js`
2. `/root/src/mode_modules/moduleb/package.json`，若有main属性的话
3. `/root/src/node_modules/moduleb/index.js`
4. 然后是root目录，重复1-3，然后是根目录 `/`

**typescript模块解析策略**：在上面两种类型（.ts, .d.ts）的基础上，增加了typescript源文件的扩展类型（.ts, .tsx, .d.ts），其解析顺序为：

1. `moduleb.ts`,
2. `moduleb.tsx`,
3. `moduleb.d.ts`,
4. `moduleb/package.json`,
5. `@types/moduleb.d.ts`(这个是针对非相对导入的模块)
6. `moduleb/index.ts`,
7. `moduleb/index.tsx`,
8. `moduleb/index.d.ts`

### 附加的模块解析标记

编译器*有一些额外的标记*用来通知编译器在源码编译成最终输出的过程中都发生了哪个转换

**baseUrl**：

- 要求在运行时模块都被放到了一个文件夹里，这些模块的源码可以在不同的目录下，但是构建脚本会将他们集中到一起
- 设置baseUrl告诉编译器到哪里查找模块，所有非相对模块导入都会被当作相对于baseUrl

baseUrl的值（只对非相对模块的导入有效）：

- 命令行中baseUrl的值，若给定的路径是相对的，则将相对于当前路径进行计算
- tsconfig.json的baseUrl，若给定的路径是相对的，则相对于该文件进行计算

**路径映射**：

- 加载器使用映射配置将模块名映射到运行时的文件
- 通过使用tsconfig.json的paths支持这样的声明映射
- paths可以指定复杂的映射，包括指定多个回退位置（比如将多处位置的合并集中到一处）

```typescript
{
  "compilerOptions: {
    // 若有paths，则必须指定
    "baseUrl": ".",
    "paths": {
      // 此处是相对于baseUrl的路径，即`./node_modules/jquery/dist/jquery`
      "jquery": ["node_modules/jquery/dist/jquery"]
    }

    // 将多处合并到一处，告诉编译器所有匹配*模式的模块导入会在*和generated/*两个位置查找
    "paths": {
      "*": [
        // 表示名字不发生改变，映射成：moduleName => baseurl/modulename
        "*",
        // 映射成：modulename => baseurl/generated/modulename
        "generated/*"
      ]
    }
  }
}
```

**利用rootDirs指定虚拟目录**：

- 使用整个字段，可以告诉编译器生成整个虚拟目录的roots，因此编译器可以在虚拟目录下解析相对模块导入，就好像他们被合并在一起一样
- 当编译器在某一rootDirs的子目录下发现了相对模块导入时，会尝试从每一个rootDirs中导入，不论其是否存在

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "rootDirs": [
      "src/views",
      // 在generated/templates/views中导入上面目录的文件，直接`'./xxx'`就行
      "generated/templates/views"
    ]
  }
}
```

**跟踪模块解析：**

定义：

- 编译器在解析模块时可能访问当前文件夹外的文件，会导致很难诊断模块为什么没有被解析或者解析到了错误位置
- 通过 `--traceResolution`启用编译器的模块解析跟踪，会告诉我们在模块解析过程中发生了什么

输出结果：

```bash
# 导入的名字typescript，位置src/app.ts
======== Resolving module 'typescript' from 'src/app.ts'. ========
# 编译器使用的策略Nodejs
Module resolution kind is not specified, using 'NodeJs'.
Loading module 'typescript' from 'node_modules' folder.
File 'src/node_modules/typescript.ts' does not exist.
File 'src/node_modules/typescript.tsx' does not exist.
File 'src/node_modules/typescript.d.ts' does not exist.
File 'src/node_modules/typescript/package.json' does not exist.
File 'node_modules/typescript.ts' does not exist.
File 'node_modules/typescript.tsx' does not exist.
File 'node_modules/typescript.d.ts' does not exist.
Found 'package.json' at 'node_modules/typescript/package.json'.
# 从npm加载types
'package.json' has 'types' field './lib/typescript.d.ts' that references 'node_modules/typescript/lib/typescript.d.ts'.
File 'node_modules/typescript/lib/typescript.d.ts' exist - use it as a module resolution result.
# 最终结果successfully resolved
======== Module name 'typescript' was successfully resolved to 'node_modules/typescript/lib/typescript.d.ts'. ========
```

编译器选项：`--noResolve`，告诉编译器不要添加任何不是在命令行上传入的文件到编译列表，但编译器仍然会解析模块，若命令行未指定该模块，则该模块不会包含在内

编译器字段：`exclude`，若编译器识别出一个文件是模块导入目标，她就会被加到编译列表里，无论是否在exclude中被排除；若要想彻底排除该文件，则需要排除所有对它进行import或使用了reference三斜线指令的文件

## 命名空间

定义：

- 需要一种手段来组织代码，便于在记录他们类型的同时还不用担心与其他对象产生命名冲突，这时可以使用命名空间，将这些代码放在该命名空间下
- 主要是用于提供逻辑分组和避免命名冲突

用法：`namespace namespaceName { export let a = 1 }`，使用 `let kk = namespaceName.a`

命名空间的分离：

- 当应用越来越大时，需要将代码分离到不同的文件中进行维护
- 虽然处于不同的文件，但是仍然属于同一个命名空间（命名空间名一样），在使用的时候就像在一个文件中定义的一样，只不过需要使用 `引用标签`告诉编译器文件之间的关联

命名空间的别名：

- 简化命名空间操作的方法是使用 `import q = namespaceName.exportVar`的方式给命名空间内部的变量起一个短的名字
- 这个操作是创建一个别名，且q会生成与原始符号namespaceName.exportVar不同的引用，两者之间互不影响

```typescript
// validation.ts
namespace Validation {
  export interface StringValidator {
    isAcceptable (s: string): boolean
  }
}

// other.ts
/// <reference path="validation.ts" />
namespace Validation {
  export class Letter implements StringValidator {
    isAcceptable (s: string) {
      return true
    }
  }
}

// othertwo.ts
/// <reference path="validation.ts" />
namespace Validation {
  export class Upper implements StringValidator {
    isAcceptable (s: string) {
      return false
    }
  }
}

// test.ts
/// <reference path="validation.ts" />
/// <reference path="other.ts" />
/// <reference path="othertwo.ts" />
let a = new Letter()
let b = new Upper()
```
