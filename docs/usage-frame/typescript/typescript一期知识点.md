# TypeScript 知识点（第一期）

> 参考文档：      
> http://www.patrickzhong.com/TypeScript/       
> https://juejin.cn/post/7018805943710253086      
> https://juejin.cn/post/7058868160706904078      

## 变量声明

var、let、const比较：

- var声明可以在包含他的函数、模块、命名空间、全局作用域中的任何位置被访问到，可以多次使用var声明同一个变量，属于函数作用域或var作用域
- let声明：只能在包含他们的块内访问（比如大括号括起的，又比如同一个文件内），声明之前不能被读写（暂时性死区），只能声明一次（又，不能对函数参数使用let重新声明，除非在函数内一个明显的块内（用大括号括起的）），属于词法作用域或块作用域
- const声明：赋值后不能再改变，拥有与let相同的作用域规则

::: code-group

```typescript [作用域举例1]
// 此处由于setTimeout是微任务，在所有宏任务执行完毕后再执行，此时i为10
// 然后执行微任务，由于i是一个全局变量，所以每一条语句的i的值都为10
for (var i = 0; i < 10; i++) {
  setTimeout(function() { console.log(i); }, 100 * i);
}
// 解决方法之一：使用立即执行表达式捕获i的值
for (var i = 0; i < 10; i++) {
  // 这里传入了i，所以下次执行微任务时这里面的i就固定住了
  (function(i) {
      setTimeout(function() { console.log(i); }, 100 * i);
  })(i);
}

```

```typescript [作用域举例2]
// 报错
function f(x: number) {
  let x = 100
}
// 正确
function f(x: number) {
  if (Date.now() > 0) {
    let x = 100
  }
}

```

:::

## 解构

### 数组解构

```typescript
// 解构数组
let input = [1, 2]
let [first, second] = input;
// 上面的分号不能省略，或者这里的开头添加分号，不然会变成input[first, second]的情形
[first, second] = [second, first]
console.log(first, second)
```

## 基础知识

1. 脚本编译 ts 文件，使用命令 `tsc xxx.ts xxx.js`
2. 初始化tsconfig文件，使用命令 `tsc --init`
3. 使用创造函数 new 创建的对象 `new Boolean()`，是对象类型 `Boolean`，而非某些特定的原始类型 `boolean`

### 声明文件

> 参考文档：https://zhuanlan.zhihu.com/p/542379032

定义：

- 声明文件以 `.d.ts`结尾

要点：

- ts编译器会根据tsconfig.json中的file、include、exclude三个字段去处理过滤后包含的所有的ts、tsx、d.ts文件，默认情况下是加载和tsconfig同级目录下的所有上述文件
- d.ts声明文件禁止定义具体的实现
- 当使用第三方库时，需引用对应的声明文件，才能获得对应的代码补全、接口提示等功能
- declare用来告诉编译器，某个类型是存在的，可以在当前文件中使用

::: code-group

```typescript [类型声明]
declare var Xxx;
declare function () {}
declare class {}
declare enum {}
declare namespace {}
interface A {}
type A = {}

// 声明模块
// a.ts
export interface A {
  x: number;
}

// b.ts
import { A } from './a'

declare module './a' {
  interface A {
    y: number;
  }
}

const a: A = { x: 0, y: 0 };
```

```typescript [加载模块类型]
// 加载图片：
// 定义图片声明：image.d.ts
declare module '*.png' {
  const src: string;
  export default src;
}
// 加载
import logo from './assets/logo.png'
```

:::

## 基础类型概述

### `unknown`

定义：表示一个当前时刻还不知道类型的变量，可以将任何类型赋值给该类型，可以使用任意类型方法/属性（编译不报错）。

使用：

- 若想缩小改类型的范围（类型收窄），可以使用条件语句+逻辑判断（typeof、比较符、类型检查、类型断言），之后就只能使用该范围内的类型方法/属性

注意：

- unknown只能赋值给unknown和any

### `any`

定义：表示一个当前时刻不清楚类型的变量，可以将任何类型赋值给该类型，可以使用任意类型方法/属性（编译不报错）。

使用：

- 对于不想进行类型检查的变量，可以标记为any类型
- 用于旧项目迁移到typescript项目

注意：

- 声明且没对变量赋值，若未指定类型，会被识别为 any 类型，但是不能调用该值没有的方法或属性。比如它的类型可能是undefined，故在赋值之前不能调用某些方法，比如toString。

```typescript
let a;
// 不能调用该值没有的方法/属性，否则报错：Object is possibly 'undefined'.
a.concat([])
```

### `void`

定义：表示没有任何类型，与any相反

场景：

- 当函数无返回值或显式返回undefined时，此时可以给函数返回值设置为void类型，而非undefined类型（只有显式返回undefined才可设置undefined）

赋值：

- null
- undefined

### `null`

定义：表示它本身

使用：

- 是所有类型的子类型，可以赋值给任何类型的变量
- 指定了 **--strictNullChecks** 之后，只能赋值给any和它本身

### `undefined`

定义：表示它本身

使用：

- 是所有类型的子类型，可以赋值给任何类型的变量
- 指定了 **--strictNullChecks** 之后，只能赋值给any、void和它本身

注意：

- 在指定了 **--strictNullChecks** 之后，*函数的可选参数*以及*类的可选属性*的类型会被自动的加上 `| undefined`

### `never`

定义：表示永远不存在的值的类型

场景：

- 用于表示抛出异常的函数的函数返回值类型
- 用于无返回值（连undefined都没有的那种）的函数（表达式）的函数返回值类型，比如函数执行过程中，出现了死循环

使用：

- never类型是任何类型的子类型，可以赋值给任何类型的变量
- **只有never类型才能赋值给never类型**

### `boolean`

### `number`

### `bigint`

- 后缀以n结尾，环境必须是es2020+

### `string`

语法：

```typescript
const str: string = `这是一个模板字符串，当前时间：${new Date()}`;
```

### `array`

数组类型的定义方式，如下：

```typescript
// 类型 + 方括号
let a: (number | string)[] = [1, "2"];
// 数组泛型，此处是一个包装类型，类似泛型，支持传递参数，用于内容约束
let b: Array<number | string> = [1, "2"];
// 接口
let c: {
  [index: number]: string | number;
} = [1, "2"];

// 只读数组：
// 只读数组不能赋值给常规数组，毕竟常规数组有的方法/属性，只读数组没有，在调用的时候就可能报错
let d: ReadonlyArray<string> = ['a', 'b', 'c']
```

常用的类数组类型都有自己的接口定义，分别有 `IArguments`, `NodeList`, `HTMLCollection`等，其中

```typescript
// IArguments的接口类型如下
interface IArguments {
  // [index: number]: any;
  length: number;
  callee: Function;
}
```

### `tuple`

定义：元组表示一个**已知数量和类型**的数组

表示形式如下：

```typescript
// 非具名元素，可选参数
const tuple: [string, number, boolean?] = ['1', 1, true]
// 非具名元素，可选参数，剩余参数
const tuple1: [string, number?, ...any[]] = ['1', 1, 2, {}]
// 具名元素，可选参数
const tuple2: [a: string, b: number, c?: boolean] = ['1', 1, true]
// 只读元素，不能修改元素的值
const tuple3: readonly [...any[]] = [1, 2, 3]

// 解构元组: a: '1', b: 1, c: [2, {}]
const [a, b, ...c] = tuple1
```

**注意**：

- 解构元组时，超过元组定义时的索引范围（元组的总长度，包括可选的）会报错，若含剩余参数，则不会报错（值为undefined）
- 当无具名元素名称时，若可选，则在类型后面加上?，比如 `boolean?`（这个只有所有的元素都是非具名的时候才行）

### `enum`

定义：

- 枚举类型表示可以有特殊名字的一组值
- 枚举成员分为常量成员(字面量枚举表达式、对先前枚举成员的引用、带括号的常量枚举表达式、应用于常量枚举表达式的一元运算符`+`, `-`, `~`之一、二进制操作符`+`, `-`, `*`, `/`, `%`, `<<`, `>>`, `>>>`, `&`, `|`, `^`)和计算成员(除常量枚举表达式情形下的其他情形，且值必须是数值，不然报错)
- 字面量
- 字面量枚举成员类型：指不带初始值的常量枚举成员、值被初始化为字符串字面量、数字字面量的成员。
- 当所有枚举成员都有字面量枚举值时，他们就成为了字面量枚举成员类型。而枚举类型也是枚举成员类型的联合类型
- 常量枚举通过修饰符const定义，只能使用常量枚举表达式（无计算成员等），且会在编译阶段进行删除
- 没有初始值设置项的枚举要么排在前面，要么排在用数字常量或其他常量枚举成员初始化的数值枚举之后
- 外部枚举（环境枚举），使用修饰符declare定义，描述已经存在的枚举类型的形状。和常规枚举相比，没有初始值设定项的环境枚举成员始终是计算的（而非常量的）
- 引用枚举成员作为值时，可以说，该值的类型就是枚举类型。所以若枚举类型和变量的类型不一致时，会报错
- 在现代typescript中，一个`as const`的对象(`const obj = { up: 0 } as const`)足以代替枚举
- 枚举和数值是互相兼容的，但是不同枚举之间是不兼容的

::: code-group

```typescript
// 定义
enum Color { Red = 1, Blue, Green }

// 使用，其中c的类型是Color，c的值为1
const c: Color = Color.Red

// s的类型是string，s的值是'Red'
const s: string = Color[1]

type enumChildType = Color.Red
// enumChildType的类型是1，故而该类型的值，只能是1或Color.Blue，不能是其他值
// Type 'Color.Blue' is not assignable to type 'Color.Red'.
let a: enumChildType = Color.Blue
// Type '23' is not assignable to type 'Color.Red'.
let a: enumChildType = 23

// 常量成员和计算成员
enum FileAccess {
  // 常量成员
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  // 计算成员，例如
  G = '123'.length,
}

// 未初始化枚举成员不能像下面这样
const getSomeValue = () => 23

enum Error {
  A = getSomeValue(),
  // Error: Enum member must have initializer.
  B,
}

// 枚举类型的引用，值的类型和变量类型不匹配
enum Color {
  Red = 1,
  Blue = '2',
}

interface IColor {
  Red: Color.Red;
  Blue: string;
}

let c: IColor = {
  Red: 1,
  // Error: Type 'Color' is not assignable to type 'string'.
  // 此处值Color.Blue为Color类型（包括字符串和数字），此处变量Blue为string（仅是字符串），所以两者不兼容，故而报错
  Blue: Color.Blue
}

interface JColor {
  Red: Color.Red;
  Blue: Color.Blue;
}

let d: JColor = {
  Red: 1,
  // Error: Type '"2"' is not assignable to type 'Color.Blue'.
  // 当变量Blue类型是Color.Blue（类型是字符串）时，值为字符串时，报错
  // 而当变量Blue类型是Color.Blue（类型是数值）时，值为数值时，正确
  Blue: '2'
}

```

:::

使用场景：

- 枚举若未初始化，第一个值为0
- 枚举成员可以使用常量枚举表达式（表达式字面量、对前面枚举成员的引用、一元运算符、二元运算符、计算值等）初始化
- 若枚举常量表达式的结果为NaN或infinite，则会在编译阶段出错；直接赋值NaN或infinite不会出错
- 枚举是一个在运行时真正存在的对象，故而在兼容的情况下，枚举可以赋值给对象
- 可以使用 `keyof typeof enumVal`获取enumVal里面所有枚举成员的键的字符串字面量的类型联合
- 数字枚举成员具有反向映射，例如 `enum A { a }; let aa = A.a;// a的key为A[aa]; let nameOfa = A[aa];`，字符串枚举成员则不会生成反向映射

```typescript
// 关于keyof和typeof解释
enum Color { Red = 1, Blue, Green }

// 类型为：{Red: 1, Blue: 2, Green: 3}
// 顾名思义，typeof即获取右侧值的类型
type ColorType = typeof Color
// 故而赋值时，值和类型是相等的，不能多也不能少
let c: ColorType = {Red: 1, Blue: 2, Green: 3}

// 而keyof即获取值或类型的属性的字面量集合，即：'Red' | 'Blue' | 'Green'
type ColorKeyType = keyof ColorType
let k: ColorKeyType = 'Red'
```

### `object`

定义：

- 非原始类型，表示除了number、string、boolean、bigint、symbol、null、undefined之外的类型
- 类型定义使用接口或类型别名均可

**object vs Object vs {}**：

- 只有非原始类型（null、undefined、boolean、number、string、symbol、bigint）才能赋给object类型
- 所有类型都能够赋值给Object和{}类型，undefined和null除外
- Object是object的父类型，也是object的子类型

### 构造函数类型

定义：使用大写字母开头，与相对应的小写版本类型一致

值：

- Number
- String
- Boolean
- Symbol
- Object

使用：

- 用于创造函数 new 创建的对象。比如 `new Boolean()`，是对象类型 `Boolean`，而非某些特定的原始类型 `boolean`
- 不属于基本类型，避免在任何时候用作一个类型

```typescript
let str: String  = new String()
let str: String = Object.create({})
```

```typescript
// string
const str: string = 'Bob'
// boolean
const bol: boolean = true
// number
const num: number = 23
// bigint
const bint: bigint = 100n
// unknown
let unk: unknown = 4
unk = 'str'
// any
let ann: any = 'a'
a.concat([])
// any[]
let annarr: any[] = [1, true, '1']
// void
const voi: void = undefined
// never
function nev (): never {
  // 下面的条件只能为 true ，若是其他比较符(比如：1， 1 > 0等)，或者使用变量的形式（比如a = true, while(a)），会报错：
  // A function returning 'never' cannot have a reachable end point.
  while(true) {}
}
```

## Creating Types from Types

### 条件类型

定义：

- `type Cond = SomeType extends OtherType ? TrueType : FalseType;`
- 有助于描述输入和输出类型之间的关系
- 类似JavaScript的条件表达式

```typescript
// 1
interface IdLabel {
  id: number;
}
interface NameLabel {
  name: string;
}
// 此处对T进行了约束，只能是string和number类型
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;

function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | name): IdLabel | NameLabel;
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw 'unimplemented';
}
// NameLabel
let a = createLabel('typescript');
// IdLabel
let b = createLabel(2.8)
// NameLabel | IdLabel
let c = createLabel(Math.random() ? 'hello' : 42)

// 2：条件类型约束
// 此处由于T使用了类型约束，故才能使用等号右侧的形式，不然会报错：
// Type '"message"' cannot be used to index type 'T'.
// type MessageOf<T extends { message: unknown }> = T['message']
type MessageOf<T> = T extends { message: unknown; } ? T['message'] : never;

interface Email {
  message: string;
}
// string
type EmailMessageContents = MessageOf<Email>

interface Dog {
  bark(): void;
}
// never
type DogMessageContents = MessageOf<Dog>

// 3: 条件类型约束
// 此处，若T是数组类型，则返回数组元素的类型，否则返回其本身
type Flatten<T> = T extends any[] ? T[number] : T;
// string
type Str = Flatten<string[]>
// number
type Num = Flatten<number>

// 4：结合infer一起使用
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return ? Return : never;
// number
type Num = GetReturnType<() => number>
// string
type Str = GetReturnType<(x: string) => string>
// boolean[]
type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;

// 若此处的Type是一个重载函数这样了的具有多个调用签名的类型，则会返回最宽松的类型
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;
// string | number
type T1 = ReturnType<typeof stringOrNum>;

// 5:条件类型分配
type ToArray<Type> = Type extends any ? Type[] : never;
// string[] | number[]
type StrArrOrNumArr = ToArray<string | number>

// 若想得到: (string | number)[]，则应该将extends两侧的内容用[]括起来
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;
// (string | number)[]
type ArrOfStrOrNum = ToArrayNonDist<string | number>;
```

### 字面量类型

定义：字面量类型是类型（字符串、数字、布尔值）的一种更为具体的子类型

字面量收窄：从无穷多可能的例子到确切数量的例子的过程

字符串字面量类型：`'a' | 'b' | 'c'`，他的值只能是列出的值的某个值，不能是除此之外的其他值

数字字面量类型：常用来定义配置的值

布尔值字面量类型：用来约束属性之间互有关联的对象

```typescript
interface ValidationSuccess {
  isValid: true;
  reason: null;
};

interface ValidationFailure {
  isValid: false;
  reason: string;
};

// 注意此处，这里第一个|之前可以为空
type ValidationResult =
  | ValidationSuccess
  | ValidationFailure;
```

注意：

- 在实际应用中，字面量类型可以与联合类型、类型守卫、类型别名结合使用
- 字符串字面量类型还可用于区分函数重载，和普通函数重载一致

### 模板字面量类型

定义：模板字面量类型以字符串字面量类型为基础，且可以展开为多个字符串类型的联合类型

语法：

- 与JavaScript的模板字面量一致，只不过它是作用于类型上
- 该类型的值，本质上来说，是一个字符串类型
- 适用于数量较少的情况

```typescript
type EmailLocaleIDs = 'welcome_email' | 'email_heading'
type FooterLocaleIDs = 'footer_title' | 'footer_sendoff'
type Lang = 'en' | 'cn'

// "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`
// "en_welcome_email_id" | "en_email_heading_id" | "en_footer_title_id" | "en_footer_sendoff_id" | "cn_welcome_email_id" | "cn_email_heading_id" | "cn_footer_title_id" | "cn_footer_sendoff_id"
type LocaleMsg = `${Lang}_${AllLocaleIDs}`
```

**类型中的字符串联合类型**：模板字面量的强大之处是能够基于给定的字符串来创建新的字符串

```typescript
// javascript常见的模式是基于现有的对象属性进行扩展，比如定义一个函数类型on，监听值的变化
type PropEventSource<Type> {
  on(
    // 这里注释下面这行，不然排版会出问题
    // eventName: `${string & keyof Type}Changed`,
    callback: (newValue: any) => void
  ): void
}
// 此处的返回值类型是T & PropEventSource<T> => T & { on: (...) => void }，即给T增加了一个对象方法on
declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>

const person = makeWatchedObject({
  firstName: 'Sao',
  lastName: 'Ron',
  age: 26
})
// 正常，因为eventName的值，是string & keyof Person => `${'firstName' | 'lastName' | 'age'}Changed`
person.on('firstNameChanged', () => {})

// 错误，因为不存在firstName
person.on('firstName', () => {})
```

**模板字面量类型推断**：模板字面量类型能够从替换字符串的位置推断出类型，即person.on的第一个参数

```typescript
type PropEventSource<Type> {
  on<Key extends string & keyof Type>(
    // 这里注释下面这行，不然排版会出问题
    // eventName: `${Key}Changed`,
    callback: (newValue: Type[Key]) => void
  ): void
}
// 此处的返回值类型是T & PropEventSource<T> => T & { on: (...) => void }，即给T增加了一个对象方法on
declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>

const person = makeWatchedObject({
  firstName: 'Sao',
  lastName: 'Ron',
  age: 26
})

person.on('firstNameChanged', (newName) => {
  // 此处能够自动推断出，newName的类型是peson[firstName]，即字符串字面量类型，所以下面的调用toUpperCase方法不会报错
  console.log(`new name is ${newName.toUpperCase}`)
})
person.on('ageChanged', (newAge) => {
  // 此处能够自动推断出，newAge的类型是person[age]，即数字字面量类型，所以下面的条件判断不会报错
  if (newAge < 0) {
    console.warn('warning!')
  }
})
```

### symbol类型

通过 `Symbol('desc')`创建的值是不可改变且唯一的；

用途：

- 用作对象属性的键
- 与计算出的属性名声明相结合来声明对象的属性和类成员
- 表示唯一文本，可用`unique symbol`作用于`Symbol()`、`Symbol.for()`上，该变量仅允许使用const或readonly static属性，同时为了引用该文本，必须使用typeof运算符。同时由于每种unique symbol类型都是完全独立的，所以该类型之间不可通过比较运算符进行比较

```typescript
// 用过对象的键
const sym = Symbol()
let obj = {
  [sym]: 123
}
console.log(obj[sym])

// 用作类成员
const getClassNameSymbol = Symbol()
class C {
  [getClassNameSymbol] () {
    return 'c'
  }
}
let c = new C()
console.log(c[getClassNameSymbol](), 'get c')

// 唯一文本
declare const sym1: unique symbol;

let sym2: typeof sym1 = sym1;

// Error: A variable whose type is a 'unique symbol' type must be 'const'.
// 此处应该用const代替let
let sym3: unique symbol = Symbol()

// 正常工作
const sym4: unique symbol = Symbol()
class C {
  static readonly StaticSymbol: unique symbol = Symbol();
}

// 不可比较
// Error: This comparison appears to be unintentional because the types 'typeof sym2' and 'typeof sym1' have no overlap.
if (sym1 === sym3) {}

// 正常
if (sym1 === sym2) {}
```

内置的symbols😢😢😢

### 交叉类型

通俗理解：交叉类型，将多个类型合并为一个类型，包含了所有类型的特性（属性），同时拥有所有类型的成员（属性）

定义：使用 `&`分隔类型，一般用于联合类型、接口交叉，若两者之间无交集，则该值为never类型

使用：

- 交叉类型**常用来定义公共的部分**
- 原子类型合并成交叉类型，得到的类型是never，因为不能同时满足这些原子类型
- 交叉类型常用于将多个接口类型合并为一个类型，等同于接口继承（合并接口类型）
- 🔴若接口交叉时，属性相同，属性类型不相同，则合并的接口类型可以是never（原始值属性合并），也可以是相同属性为never类型的对象类型（对象属性合并）；比如类型分别为string和boolean的属性x，交叉合并后，则合并的类型是never类型（这里是原始值属性），若属性x是一个对象，对象下分别包含类型为string和boolean的属性d，则合并后的类型是never或{ x: never }（这里是对象属性）

```typescript
// 普通类型交叉，无交集，类型为never
type a = number & string
// Type 'number' is not assignable to type 'never'.
let k: a = 89

// 联合类型交叉，交集为共有的值
type UnionA = 'px' | 'em' | 'rem' | '%';
type UnionB = 'vh' | 'em' | 'rem' | 'pt';
type IntersectionUnion = UnionA & UnionB;
// Type '"px"' is not assignable to type '"em" | "rem"'.
let m: IntersectionUnion = 'px'

// 接口交叉，若有相同属性值，则返回该属性值的交叉类型
interface X {
  c: string;
  d: string;
}

interface Y {
  c: number;
  e: string
}

// 交叉类型结果为：{ c: string & number, d: string, e: string }
// 即{ c: never, d: string, e: string }
type XY = X & Y;
// Type 'number' is not assignable to type 'never'.
let p: XY = { c: 6, d: "d", e: "e" };

// 接口交叉，原始值属性合并
// 此处AB的类型：never
type AB = { x: string } & { x: number }


// 接口交叉，相同属性值的对象属性，则直接合并
interface D { d: boolean; }
interface E { e: string; }
interface F { f: number; }

interface A { x: D; }
interface B { x: E; }
interface C { x: F; }
// 交叉类型结果为：{ x: { d: boolean, e: string, f: number } }
/**
 * 若改成下面类型：则结果为：{ x: never } 或 never，（这里对象值属性，所有有2种情形）
 * 解释：
 *      对象obj某个属性x的类型为never，则该对象obj可以是never类型，或该对象obj的属性x类型为never类型
  * interface D { d: boolean; }
  * interface E { d: string; }
  * interface F { f: number; }
 */

type ABC = A & B & C;

let abc: ABC = {
    x: {
      d: true,
      e: 'semlinker',
      f: 666
    }
};

```

### 联合类型

通俗理解：联合类型，即 `存异`，可以是某种类型，也可以是另一种类型；是多个类型中的某一个（可以只满足一种类型即可），只能访问所有类型的共有属性

定义：union，使用 `|`分隔类型 `string | number`，其值可以是声明类型的某一种 `string`或者 `number`。

使用：

- 当不能（用类型推断）确定联合类型属于某一具体类型时，只能访问所有类型共有方法/属性。
- 只有确定具体类型 `if (typeof xxx === 'number') { xxx.toFixed() }`之后（比如使用条件语句、类型推断），才能访问特定类型的方法/属性

```typescript
// 对于变量的联合
type A = string | number;
// 这里的a可以是字符串，也可以是数字
let a: A = 1

// 对于接口的联合
interface X {
  a: string;
  b: number;
}

interface Y {
  c: string;
}

type XY = X | Y;
// 这里的xy，只需要满足X，或者满足Y即可
let xy: XY = {
  a: '1',
  b: 1
}
```

类型缩减：typescript会把字面量类型和枚举成员类型缩减掉，只剩下原始类型和枚举类型

```typescript
// A的类型是string，因为string包括了'a'字面量类型的所有字面量
type A = 'a' | string;

enum U {
  A,
  B
}
// UU的类型是U，因为U包括了枚举成员类型U.A
type UU = U.A | U

```

#### 交叉类型 vs 联合类型

```typescript
type A = {
  x: number;
  y: string;
}

type B = {
  x: string;
  y: string;
}
// 交叉类型，每个属性之间都进行交叉，若属性交叉后为never，则可以说整个类型都是never
type AandB = A & B;

// 联合类型，只要满足A或B即可
type AorB = A | B;

let a: AandB = {
  x: 1,
  y: '1'
} as never

let b: AorB = {
  x: '1',
  y: '1'
}

```

#### 可辨识联合

定义：同时使用单例类型、联合类型、类型守卫、类型别名这些语法概念，然后创建一个可辨识联合的高级模式，也叫做标签联合或代数数据联合

特征（3要素）：

- 具有普通的单例类型属性，即可辨识的特征
- 一个类型别名包含了那些类型的联合，即联合
- 此属性上的类型守卫

```typescript
// 下面三个接口，都具备了属性kind，并且属性值不一样，此时称kind为可辨识的特征（标签）
interface Square {
  kind: 'square'
  size: number
}
interface Rectangle {
  kind: 'rectangle'
  width: number
  height: number
}
interface Circle {
  kind: 'circle'
  radius: number
}
// 联合
type Shape = Square | Reatangle | Circle
// 可辨识联合
// 完整性检查：当未涵盖所有可辨识的联合变化时，想让编译器通知
// 完整性检查方法1：启用--strictNullChecks，并指定函数的返回类型
function area (s: Shape) {
  switch (s.kind) {
    case 'square': return s.size * s.size
    case 'rectangle': return s.height * s.width
    case 'circle': return Math.PI * s.radius ** 2
    // 完整性检查方法2：使用never类型，用其表示除去所有可能情况的剩下的类型
    default: return assertNever(s)
  }
}
function assertNever (x: never): never {
  throw new Error('unexpected object: ' + x)
}
```

### 🟢索引类型（index types）

定义：使用索引类型后，编译器就能够检查使用了动态属性名（即属性不确定的类对象）的代码

索引类型查询操作符：

- 使用方式：`keyof T`，其结果为T上已知的公共*属性名*（键名）的联合（若含有索引签名时，则表示索引签名的类型的联合），当T的属性自动增减时，其结果也会自动增减

索引访问操作符：

- 使用方式：`T[K]`或者 `T[K1 | K2]`，表示T的属性K的值的类型
- 其中需满足 `K extends keyof T`，并且K是一个类型（比如可以是：`type K = 'age'`），而非一个值（不能是：`const K = 'age'`）
- 若K是T中不存在的键，则会报相关的错误

```typescript
// 1
type Person = { age: number; name: string; alive: boolean; };
// number，这里的'age'是一个字符串字面量类型
type Age = Person["age"]

// 2
// string | number，这里的'age'，'name'是一个字符串字面量类型
type I1 = Person["age" | "name"];
// number | string | boolean
type I2 = Person[keyof Person];
type AliveOrName = 'alive' | 'name'
// string | boolean
type I3 = Person[AliveOrName];

// 3
const MyArray = [
  { name: 'alice', age: 15 },
  { name: 'bob', age: 23 },
  { name: 'eve', age: 38 }
];
// 这里是获取数组的项的类型，即：{ name: string; age: number; }
type Person = typeof MyArray[number];
// 这里是获取数组的项内部的age属性的类型，即：number
type Age = typeof MyArray[number]['age']
```

索引签名：

- 指的是类似接口中的属性名，但是其属性名不是确切的，使用方式为 `[key: string]: T`，当类型不正确时，报错An index signature parameter type must be 'string', 'number', 'symbol', or a template literal type.
- 用于声明尚未提前声明的属性类型

::: code-group

```typescript
// 索引类型查询即keyof T，它的值为T的所有键名，k继承了T的所有键名（但是k的值只能是T中有的各种集合，无自身的值）
// 索引访问即T[K]，他为😊一个类型 ，类型值为T[K]，若T[K]是反正某一种类型，则T[K]就是该种类型
function pluck <T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
  return propertyNames.map(n => o[n])
}
interface Car {
  manufacturer: string
  model: string
  year: number
}
let taxi: Car = {
  manufacturer: 'toyota',
  model: 'camry',
  year: 2014
}
// 值为'manufacturer' | 'model' | 'year'
let carProps: keyof Car
// 其中，['manufacturer', 'model']位置的数据必须是taxi中已有的属性的集合，否则报错
// 这里的T[K]指的是Car[manufacturer]和Car[model]而非taxi[manufacturer]，是Car，所以T[K]的类型为string
let makeAndModel: string[] = pluck(taxi, ['manufacturer', 'model'])
```

```typescript
function getValue(o: object, k: string) {
  // Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.
  // No index signature with a parameter of type 'string' was found on type '{}'.
  // 我们的期望是获取元素存在的键的值，而不是随便的键，毕竟对象上可能不存在该键
  return o[k]
}

// 优化
function getValue<T extends object, K extends keyof T>(o: T, k: K) {
  return o[k]
}
```

```typescript
interface Dictionary<T> {
  // 字符串索引签名的类型
  [key: string]: T
}
// 值为string | number,这个特性和js一致，因为对象可以通过字符串引用，也能通过数字引用，效果一致；当同时出现相同的字符串和数字时会报错的
let key: keyof Dictionary<number>
// 这里面Dictionary<number>其实是{ [key: string]: number }，而['foo']是属性[key: string]的一个表示，合起来就是值的类型，即number
let value: Dictionary<number>['foo']
```

```typescript
interface Dictionary<T> {
  // 数字索引签名的类型
  [key: number]: T
}
// 值只能是number
let key: keyof Dictionary<number>
// 此处报错，因为Dictionary<T>的属性key只能是number类型，不存在字符串foo
let value: Dictionary<number>['foo']
// 此处值为number
let value: Disctionary<number>[42]
```

:::

### 映射类型

定义：

- 从旧类型中创建新类型的一种方式，新类型以相同的方式去转换旧类型里的每个属性，内置类型就是映射类型来的
- 映射类型是一种泛型类型，使用（通常是通过keyof创建的）键的联合，从而遍历键创建一个新类型
- 映射类型类似一个函数，将一个类型，通过该函数（映射类型）转换成新的类型
- 映射类型基于索引签名 `[ xxx ]: type;`
- 映射修饰符：`readonly`、`?`，可配合 `+`(默认), `-`使用
- 可通过as重新映射类型中的键

注意：

- 若想给映射类型添加新成员，需要结合交叉类型一起使用
- 对于同态转换（Readonly、Partial、Pick，指的是需要输入类型来拷贝属性，类似下面示例中的 `T[P]`，Record不是，因为他不需要输入类型），编译器知道在添加任何新属性之前拷贝所有存在的属性修饰符

::: code-group

```typescript
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};

type CreateMutable<Type> = {
  // 此处表示将只读变成可读写
  -readonly [Property in Keyof Type]: Type[Property];
}

type Concrete<Type> = {
  // 此处表示将可选变成必填
  [Property in keyof Type]-?: Type[Property];
}

type Features = {
  darkMode: () => void;
  newUserProfile: () => void;
};
// { darkMode: boolean; newUserProfile: boolean; }
type FeatureOptions = OptionsFlags<Features>;
```

```typescript
type MappedTypeWithNewProperties<Type> = {
  // 将Properties重新映射为NewKeyType
  [Properties in keyof Type as NewKeyType]: Type[Properties];
}

// 1
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property];
};

interface Person {
  name: string;
  age: number;
  location: string;
}

// { getName: () => string; getAge: () => number; getLocation: () => string; }
type LazyPerson = Getters<Person>;

// 2
type RemoveKindField<Type> = {
  [Property in keyof Type as Exclude<Property, 'kind'>]: Type[Property];
};

interface Circle {
  kind: 'circle';
  radius: number;
}

// { radius: number; }
type KindlessCircle = RemoveKindField<Circle>;

// 3: 映射任意并集，不仅仅是string | number | symbol，不过最终还是要映射成这三种之一
type EventConfig<Events extends { kind: string }> = {
  // 此处，若单纯是[E in Events]，则会报错：
  // Type 'Events' is not assignable to type 'string | number | symbol'.
  // 是因为对象的键必须是上面这三种类型之一
  // 但是使用as进行映射成三种类型之一，就不会报错
  // 这里是最终将E映射成了E['kind']
  [E in Events as E['kind']]: (event: E) => void;
};

type SquareEvent = { kind: 'square', x: number, y: number };
type CircleEvent = { kind: 'circle', radius: number };
// { square: (event: SquareEvent) => void; circle: (event: CircleEvent) => void; }
type Config = EventConfig<SquareEvent | CircleEvent>;

// 4: 和条件类型使用
type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } : true ? false;
};

type DBFields = {
  id: { format: 'incrementing' };
  name: { type: string; pii: true };
};

// { id: false, name: true }
type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
```

```typescript
// 内置类型的例子：
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
type Partial<T> = {
  [P in keyof T]?: T[P]
}
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
type Record<K extends keyof any, T> = {
  [P in K]: T
}
```

:::

## 内置工具类

1. `Partial<Type>`：表一部分，构造一个所有属性均为可选的类型Type
2. `Required<Type>`：表必须，构造一个所有属性均必填的类型Type
3. `Readonly<Type>`：表只读，构造一个所有属性均为只读的类型Type
4. `Record<Keys, Type>`：构造一个类型，他的属性名为联合类型Keys（一般是字符串字面量类型的联合，其中类型string也可看做所有字符串的联合类型）的因子类型K（`keyof Keys`），属性值的类型为Type
5. `Pick<Type, Keys>`：表挑选，从类型Type中挑选只存在于联合类型Keys（一般是字符串字面量类型的联合）的属性名，构造一个新的类型
6. `Omit<Type, keys>`：表剔除，从类型Type(一般是对象接口类型)中剔除存在于联合类型Keys（一般是字符串字面量类型的联合）的属性名，构造一个新的类型
7. `Exclude<Type, ExcludedUnion>`：表排斥，从联合类型Type中剔除能够赋值给联合类型ExcludedUnion的因子类型T后，构造一个新的类型
8. `Extract<Type, Union>`：表提取，从联合类型Type中提取能够赋值给联合类型Union的因子类型T，构造一个新的类型
9. `NonNullable<Type>`：从类型Type中剔除null和undefined后，构造一个新的类型
10. `Parameters<Type>`：从函数类型Type的参数类型构造出一个新的元组类型
11. `ConstructorParameters<>`：从构造函数类型Type的参数类型来构造出一个元组类型，若Type非构造参数类型，返回never😢😢😢
12. `ReturnType<Type>`：从函数类型Type的返回值类型中构造一个新的类型
13. `InstanceType<Type>`：从构造函数类型Type的实例类型 来构造一个类型
14. `ThisParameterType<Type>`：从函数类型Type中提取this参数的类型，若函数类型不包含this参数，返回unknown类型😢😢😢
15. `OmitThisParameter<Type>`：从类型Type中剔除this参数，若未声明this参数，结果类型为Type，否则构建一个不带this参数的类型。泛型会被忽略，且只有最后的重载签名会被采用😢😢😢
16. `ThisType<Type>`：不会返回一个转换后的类型，仅作为上下文this类型的一个标记。若使用该类型，需启用 `--noImplicitThis`😢😢😢
17. `Uppercase<StringType>`：将字符串中的每个字符转为大写字母
18. `Lowercase<StringType>`：将字符串的每个字符转为小写字母
19. `Capitalize<StringType>`：将字符串的首字母转换为大写字母
20. `Uncapitalize<StringType>`：将字符串的首字母转为小写字母
21. `Awaited<Type>`: 用于await async函数、Promise的then方法，同时可以递归解包Promise（即 `Promise(Promise(...))`这种形式）

注意：

- `[P in keyof T]-? : T[P]`，其中的 `-?`表示移除可选标识符，表示必填；同样 `+?`表示加上可选标识符，表示可选

::: code-group

```typescript [内置类型]
// partial:可选
type Partial<T> = {
  [K in keyof T]?: T[K];
}

// required: 必填
type Required<T> = {
  [K in keyof T]-?: T[K];
}

// Readonly：只读
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
}

// pick：挑选
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
}

// omit: 忽略，忽略t中和u类型一样的属性，返回筛选后的t
type Omit<T, U extends keyof any> = Pick<T, Exclude<keyof T, U>> = {
  [P in Exclude<keyof T, U>]: T[P];
} = {
  [P in (keyof T extends U ? never : T)]: T[P];
}

// record: 录制，将T类型赋值给K中的每个键
type Record<K extends keyof any, T> = {
  [P in K]: T;
}

// returnType: 返回值类型
type ReturnType<T extends (...args: any[]) => any> = T extends ( ...args: any[] ) => infer R ? R : any;

// Parameters： 参数类型
type Parameters<T extends (...args: any[]) => any> = T extends (...args: infer R) => any ? R : any;

// exclude: 排除，排除t中和u一样的类型，返回筛选后的T
type Exclude<T, U> = T extends U ? never : T;

// extract：提取，提取t中和u一样的类型，返回筛选后的t
type Extract<T, U> = T extends U ? T: never;

// NonNullable：非空类型
type NonNullable<T> = T extends null | undefined ? never : T;
```

```typescript [Partial]
interface Todo {
  title: string
  description: string
}

let p: Partial<Todo> = {
  title: 'hello'
}
```

```typescript [Required]
interface Todo {
  title: string
  description: string
}

let p: Required<Todo> = {
  title: 'hello',
  description: 'desc'
}
```

```typescript [Readonly]
interface Todo {
  title: string
  description: string
}

let p: Readonly<Todo> = {
  title: 'hello',
  description: 'desc'
}
// Cannot assign to 'title' because it is a read-only property.
p.title = 'edit title'
```

```typescript [Record]
interface Todo {
  title: string
  description: string
}
type Page = 'home' | 'about' | 'body'

let p: Record<Page, Todo> = {
  home: { title: 'a', description: 'desc' },
  about: { title: 'a', description: 'desc' },
  body: { title: 'a', description: 'desc' }
}
```

```typescript [Pick]
interface Todo {
  title: string
  description: string
  footer: string
}
type Page = 'title' | 'footer'

let p: Pick<Todo, Page> = {
  title: 'a',
  footer: 'b'
}
```

```typescript [Omit]
interface Todo {
  title: string
  description: string
  footer: string
}
type Page = 'title' | 'footer'

let p: Omit<Todo, Page> = {
  description: 'a'
}
```

```typescript [Exclude]
// 'b' | 'c'
type T0 = Exclude<'a' | 'b' | 'c', 'a'>
// string | number
type T2 = Exclude<string | number | (() => void), Function>
```

```typescript [Extract]
// 'a'
type T0 = Extract<'a' | 'b' | 'c', 'a'>
// () => void
type T2 = Extract<string | number | (() => void), Function>
```

```typescript [NonNullable]
// string | number
type T = NonNullable<string | number | null | undefined>
```

```typescript [Parameters]
declare function f1 (arg: { a: number, b: string }): void
// []
type T0 = Parameters<() => string>
// [s: string]
type T1 = Parameters<(s: string) => void>
// [arg: unknown]
type T2 = Parameters<<T>(arg: T) => T>
// 对于函数，使用typeof😊😊😊，[arg: { a: number; b: string }]
type T3 = Parameters<typeof f1>

// never:
type T4 = Parameters<never>
// 下面2个，报错，Type 'string' does not satisfy the constraint '(...args: any) => any'.
type T5 = Parameters<string>
type T6 = Parameters<Function>

// unknown[]
type T7 = Parameters<any>
```

```typescript [ConstructorParameters]
// [message?: string | undefined]
type T0 = ConstructorParameters<ErrorConstructor>
// 报错，Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
type T1 = ConstructorParameters<Function>
```

```typescript [ReturnType]
// string
type T0 = ReturnType<() => string>
// unknown
type T1 = ReturnType<(<T>()) => T>
// 报错：Type 'string' does not satisfy the constraint '(...args: any) => any'.
type T2 = ReturnType<string>
type T3 = ReturnType<Function>
```

```typescript [Uppercase]
type Greeting = 'hello'
// HELLO
type TitleGreeting = Uppercase<Greeting>
```

```typescript [Lowercase]
type Greeting = 'HeLlo'
// hello
type TitleGreeting = Lowercase<Greeting>
```

```typescript [Capitalize]
type Greeting = 'heLlo'
// HeLlo
type TitleGreeting = Capitalize<Greeting>
```

```typescript [Uncapitalize]
type Greeting = 'HeLlo'
// heLlo
type TitleGreeting = Uncapitalize<Greeting>
```

```typescript [Awaited]
// v4.5+
// string
type A = Awaited<Promise<string>>

// number
type B = Awaited<Promise<Promise<number>>>

// number | boolean
type C = Awaited<boolean | Promise<number>>
```

:::

## 类型相关

### 基础知识

**typeof**:

定义：

- 获取右侧标识符（变量或属性值）的类型
- 对于获取有些表达式、函数调用、类型的类型会报错，即不能使用typeof XXX的形式

语法：

```typescript
// 报错，获取dom元素div的类型（右侧不能是函数调用）
type DivType = typeof document.createElement('div')

// 获取接口类型
interface Person {
  name: string;
  age: number;
}
// 报错，右侧不能是类型，应该是具体的值或变量
type PersonType = typeof Person

let p: Person = {
  name: 'jade',
  age: 27
}
// 此次是正确的
type pType = typeof p
```

**keyof**：

定义：

- 生成对象类型的键的string、number字面量类型的联合

```typescript
// 1
type Point = { x: number, y: number }
// 'x' || 'y'
type P = keyof Point;

// 2
type Arrayish = { [n: number]: unknown };
// number
type A = keyof Arrayish;

// 3：此处包含number，是因为JavaScript对象的键会被强制转为string
type Mapish = { [k: string]: boolean };
// string | number
type M = keyof Mapish;

```

**in**：

用法：

- 用在索引签名中：`{ [Key in StrUnion]: string }`, `{ [Key in keyof Obj]: string}`
- 用在类型守卫中（函数内部），之后就能够使用对应的方法和属性了：`if ('age' in Person) { console.log(Person.age)}`
- 用在类型守卫中（函数返回值类型）：`function isFish(pet: Fish | Bird): pet is Fish { return (pet as Fish).swim !== undefind }`

**infer**：

> 参考：https://www.jianshu.com/p/707a304d7752

定义：用于条件语句中，获取推断的类型，基本类似 `T extends U ? X : Y`，其中：

- infer只能在条件类型的extends字句中使用
- infer得到的类型只能在true（即X）语句中使用

```typescript
// 推断数组/元组的类型，在下列类型别名中，(infer U)[]可知其为某种类型的数组
// infer U推断出U的类型 就是 数组的元素类型联合
type InferArray<T> = T extends (infer U)[] ? U : never;
// 在使用上述类型获取新类型时，I0的类型就是上述的U，即(infer U)[]当中的(infer U)，肉眼可知其类型为[number, string]
type I0 = InferArray<[number, string]>; // infer U 或者说 I0: string | number;

// 推断第一个元素的类型，反过来就是推断最后一个元素类型
// 在下列类型可知，[infer P, ...infer _]是一个不定长度的数组，其中infer P推断出P的类型是第一个数组元素类型，infer _是一个元组类型(有限长度的数组)
type InferFirst<T extends unknown[]> = T extends [infer P, ...infer _] ? P : never;
type I1 = InferFirst<[3, 2, 1]> // infer P 或者说 I1: 3

// 推断函数类型的参数(元组类型)
// (...args: infer R) => any即函数类型，而infer R可知R是元组类型
type InferParam<T extends Function> = T extends (...args: infer R) => any ? R : never
type I2 = InferParam<((string, number) => any)>;  // infer R 或者说 I2: [string, number]

// 推断函数类型的返回值
// (...args: any) => infer R即函数类型，而infer R可知R是函数的返回值类型
type InferReturn<T extends Function> = T extends (...args: any) => infer R ? R : never;
type I3 = InferReturn<((string, number) => string)>;  // infer R 或者说 I3: string

// 推断Promise成功值的类型
// Promise<infer U>是一个promise类型，而infer U可知U是promise的返回值类型
type InferPromise<T> = T extends Promise<infer U> ? U: never;
type I4 = InferPromise<Promise<string>>;  // infer U 或者说 I4: string

// 推断字符串字面量类型的第一个字符对应的字面量类型
// `${infer First}${infer _}`是一个模板字面量类型，而infer First可知First是字面量第一个元素类型
type InferString<T extends string> = T extends `${infer First}${infer _}` ? First : [];
type I5 = InferString<'Hello, jade'>; // infer First 或者说 I5: 'H'
```

**extends**：

定义：用于添加泛型约束

语法：`T extends Itf`，表示T的类型必须符合接口Itf中定义的字段

### 类型注释

作用：在鼠标悬浮在使用该类型的变量的时候，会显示出该类型的描述信息

语法：在类型之前使用 `/** */`形式的注释

```typescript
/** User包括name和age两个属性 */
type User = { name: string, age: number }
```

### 类型声明

定义：只能够将大的结构类型赋值给小的结构类型。比如只能将子类赋值给父类，因为子类有父类所有方法/属性，能够被调用；反之不可，因为父类可能没有子类的某个方法，调用时会报错。

### 类型推断

定义：typescript 会在无明确类型（比如初始化赋值、有默认值的函数参数、函数返回值的类型）时按照类型推断规则推测出该值的类型，以帮助我们保持代码精简和高可读性

上下文归类：类型推断的反方向，通常会在包含函数的参数、赋值表达式右侧、类型断言、对象成员和数组字面量、返回值语句中用到

### 类型断言

定义：手动指定一个值的类型，就可以调用该类型的方法而不在编译时报错（但在运行时该报错还是会报错）

语法：

- `value as type`
- `<type>value`
- `value!`：后缀表达式操作符 `!`，用于：排除该值可能是null、undefined，以及表明value会被明确的赋值
- `value as Type1 as OtherType`：双重断言，先将value断言为type1（比如any或unknown，因为any可以断言为任何类型，同时任何类型都可以断言为any），然后又将type1的类型断言为OtherType

```typescript
// 第一种方式：<type>value
let someValue: any = "this is a string"
// any类型断言成了string类型
let strLength: number = (<string>someValue).length

// 第二种方式：value as type(**推荐**，jsx语法特有)
// any类型断言成了string类型
let strLength: number = (someValue as string).length

// 其他形式的断言，对值进行断言，而非操作的对象；当然这个也可以看作是对操作的对象进行断言
// 下面的内容在设置了非空检查为false时不许断言也不会报错
const greaterThan2: number = arrayNumber.find(num => num > 2) as number
```

场景（常用类型断言）：

- 联合类型可以被断言为其中的一个类型
- 父类可以被断言为子类
- 任何类型都可以被断言为 any
- any 可以被断言为任何类型
- 若想 A 能够被断言为 B，只需 A 兼容 B，或 B 兼容 A；兼容指的是结构兼容。若 A 兼容 B，那么 A 可以被断言为 B，B 也可以被断言为 A，举例，因为子类结构兼容父类，所以子类可以被断言为父类，父类也可以被断言为子类
- 非上述场景进行类型断言时，首先需要先断言成any/unknown，再断言为其他类型，即`value as unknown as number`

使用：

- typescript 类型之间的对比只会比较他们最终的结构，而忽略他们定义时的关系。

```typescript
interface Bird {
  fly();
  layEggs();
}
interface Fish {
  swim();
  layEggs();
}

function getSmallPet (): Fish | Bird {}
let pet = getSmallPet()
// 使用类型断言
if ((pet as Fish).swim) {
  (pet as Fish).swim()
} else if ((pet as Bird).fly) {
  (pet as Bird).fly()
}
```

**扩展**：

- 类型拓宽：在var、let定义的变量中，若未显式声明类型，该变量的类型会被自动推断并拓宽，比如 `let a = 1`，则a的类型会扩宽为number，同时值为null/undefined，会被拓宽为any（即使是严格空值模式下，可能有些老浏览器不支持）。将这种未显式声明类型的变量（或者是更宽泛的类型）赋值给某些具体的类型时，会发生错误（比如扩宽为string的变量，就不能赋值给具体类型 `'1' | '2'`的变量。反之可以将具体的类型赋值给符合条件的更宽泛的类型。
- 类型缩小：使用类型守卫、`===`、其他控制流语句（if、三目运算符、switch）将宽泛的类型收敛为更具体的类型

```typescript
// 类型拓宽
// Type is { x: number; y: number; }
const obj1 = { 
  x: 1, 
  y: 2 
}; 

// Type is { x: 1; y: number; }
const obj2 = {
  x: 1 as const,
  y: 2,
}; 

// Type is { readonly x: 1; readonly y: 2; }
const obj3 = {
  x: 1, 
  y: 2 
} as const;
```

### 类型兼容

定义：由于typescript使用的是结构类型的系统，当比较两种不同的类型时，并不在乎他们从何而来，只会比较他们的结构是否兼容（包含或被包含），若两者之间所有成员的类型都是兼容的，则他们也是兼容的

- 对于**值**来说，当前有两个结构x和y，若想x兼容y（例如将y类型赋值给x类型的变量），则必须保证y类型必须包含（多于）x类型的结构（只能多，但不能少），即结构多的赋值给结构少的
- 对于**函数**来说，当前有两个函数x和y，他们除函数参数外其余都相等，若想x兼容y，必须保证y的函数参数被包含（小于）x的函数参数，即参数少的，可以赋值给参数多的，*相当于调用的时候，可以省略参数*
- 对于**函数**来说，当前有两个函数x和y，他们除返回值外其余都相等，若想x兼容y，和值兼容类似，则必须保证y类型必须包含（多余）x类型的结构（只能多，不能少），即结构多的赋值给结构少的
- 当成员的修饰符为private、protected时，只有他们来自同一处声明时（实例的继承链都继承自同一个对象、都是某个对象的实例），他们的类型才是兼容的

函数参数的双向协变：定义一个函数，该函数含有一个函数类型的参数，且该参数是非具体的（泛的），当调用时，却传入了一个具体的函数类型的参数，它是不稳定的，这就叫做函数的双向协变。可以启用 `strictFunctionTypes`选项，让typescript在这种情形下报错。

可选参数和剩余参数：比较函数兼容性时，可选参数和必须参数是可互换的，源类型（调用的）上有额外的可选参数不是错误，目标类型（参照，原函数）的可选参数在源类型没有对应的参数也不是错误，缺少时，相当于该值是undefined

函数重载：对于有重载的函数，源函数的每个重载都要在目标函数上找到对应的函数前面，确保了目标函数可以在所有原函数可调用的地方调用

枚举类型和数字类型互相兼容，但是不同枚举类型之间是互不兼容的

对于类之间的兼容性：

- 只会比较类的实例成员，静态函数和构造函数不在比较的范围内
- 类的私有成员和保护成员会影响兼容性，当目标类型（比如父类）包含一个私有成员，则源类型（比如子类）则必须包含来自同一个类的这个私有成员（只有继承关系才会来自同一个类）。这表明子类可以赋值给父类，但是不能赋值给其他和父类同结构的类

对于泛型之间的兼容性：

- 泛型中的类型参数，若是结构中的内容与类型参数无关，只要两个泛型结构兼容，则类型参数的类型不会影响两者兼容性
- 泛型的表示不同，只要结构类型都相同，也是不影响兼容的，比如泛型T和泛型U

子类型和赋值：typescript有两者兼容性的方式，就是子类型和赋值

- 赋值扩展了子类型的兼容性，增加了一些规则，允许和any来回赋值，以及enum和number来回赋值
- 类型兼容性实际上是由赋值兼容性控制，即使是在implements和extends语句中😢😢😢

类型兼容性：

|  | any | unknown | object | void | undefined | null | never |
| --- | --- | --- | --- | --- | --- | --- | --- |
| any → |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✕ |
| unknown → | ✓ |  | ✕ | ✕ | ✕ | ✕ | ✕ |
| object → | ✓ | ✓ |  | ✕ | ✕ | ✕ | ✕ |
| void → | ✓ | ✓ | ✕ |  | ✕ | ✕ | ✕ |
| undefined → | ✓ | ✓ | ✓ | ✓ |  | ✓ | ✕ |
| null → | ✓ | ✓ | ✓ | ✓ | ✓ |  | ✕ |
| never → | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  |

::: code-group

```typescript
interface Named {
  name: string
}
let x: Named
let y = { name: 'alice', location: 'beijing' }
// x能够兼容y，因为y的结构包含x的结构，对于对象，可以多不能少
x = y
```

```typescript
let x = (a: number) => 0
let y = (a: number, s: string) => 0
// 兼容，对于函数参数，可以少不能多
y = x
// 不兼容
x = y
```

```typescript
let x = (a: number) => ({ name: 'alice' })
let y = (a: number) => ({ name: 'alice', location: 'beijing' })
// 兼容，对于返回值，可以多不能少
x = y
// 不兼容
y = x
```

```typescript
interface Event { timestamp: number }
interface MouseEvent extends Event { x: number, y: number }
interface KeyEvent extends Event { keyCode: number }
// 这里定义的参数的函数参数类型为Event，是不精确的
function listenEvent(eventType: string, handler: (n: Event) => void) {}
// 使用它，在启用`strictFunctionTypes`选项时会报错
// 这里调用它使用了精确的函数参数类型MouseEvent，未启用选项不报错
listenEvent('Mouse', (e: MouseEvent) => cosole.log(e.x))
// 其他正确的写法
listenEvent('Mouse', (e: Event) => console.log((e as MouseEvent).x))
listenEvent('Mouse', ((e: MouseEvent) => console.log(e.x)) as (e: Event) => void)
```

```typescript
// 目标函数
function invoke(callback: (...args: any[]) => void) { callback() }
// 源函数有可选参数，不会报错，当未传入时，值为undefined
invoke((x?, y?) => console.log(x + ',' + y))

// 目标函数有可选参数，不会报错
function invoke(callback: (x: any, y?: any, z?: any) => void) {
    callback(1, 2, 4)
}
invoke((x, y) => console.log(x + ',' + y))
```

```typescript
// 泛型参数对泛型兼容性的影响1
interface Empty<T> {
  name: string
}
let x: Empty<number> = { name: '' }
let y: Empty<string> = { name: '' }
// 下面互相兼容
x = y;
y = x;

// 泛型参数对泛型兼容性的影响2
interface Empty<T> {
  name: Array<T>
}
let x: Empty<number> = { name: [0] }
let y: Empty<string> = { name: [''] }
// 下面互不兼容
x = y;
y = x;

```

:::

### 类型守卫

前景：

- 联合类型中，若要访问非共同拥有的成员，每次调用都需要使用类型断言才会工作

定义：

- 类型守卫机制可以避免多次断言的问题，当通过类型检查之后，该代码块下的所有该变量就会判定为该类型（类型兼容）
- 类型守卫是一些表达式，会在运行时检查，以确保在某个作用域下的类型

类型守卫使用方式：

- 类型判定：定义一个函数，返回值类型是一个类型谓词(`parameterName is Type`)，返回值符合类型Type（这里Type是parameterName设定的类型中的某一个类型）的boolean值
- in操作符：用法为 `n in x`，其中n是一个字符串字面量或字符串字面量类型，x是一个联合类型，用于遍历可枚举类型的属性，生成对象的key，常用于对象的索引签名中（对象的键不确定的情况）；也可以表条件，条件为真表示有一个可选的或必须的属性n，条件为假表示有一个可选的或不存在的属性n
- typeof类型守卫：typescript会将 `typeof v === 'typename'`和 `typeof v !== 'typename'`自动识别为类型守卫，且typename的值必须是number、string、boolean、symbol类型，其他类型会当成一个普通的表达式而已（不会当初类型守卫）
- instanceof类型守卫：通过构造函数来细化类型的一种方式，用法为 `n instanceof x`，其中x必须是一个构造函数（类名）；typescript将细化为构造函数x的prototype属性的类型（非any类型），构造签名返回的类型的联合

注意事项：

- 对于包含null的参数联合类型，需要使用类型守卫去除null；方法包括：条件语句 `if (sn === null) {}`, 短路运算符 `return sn || 'default'`
- 若编译器不能自动去除null或undefined，需要手动使用类型断言去除，方式是在变量后面添加 `!`，例如 `name!.charAt(0)`

::: code-group

```typescript [类型谓词]
// 定义类型判定函数
function isFish (pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined
}
// 使用类型判定
if (isFish(pet)) {
  pet.swim()
} else {
  // 自动识别该分支下非Fish类型
  pet.fly()
}
```

```typescript [in操作符]
function move (pet: Fish | Bird) {
  if ('swim' in pet) {
    return pet.swim()
  }
  return pet.fly()
}
```

```typescript [instanceof操作符]
function getRandomPadder () {
  return Math.random() < 0.5 ? new SpaceRepeatingPadder(4) : new StringPadder(' ')
}
let padder: Padder = getRandomPadder()
if (padder instanceof SpaceRepeatingPadder) {
  // 该条件语句下的类型细化为SpaceRepeatingPadder
  padder;
}
if (padder instanceof StringPadder) {
  // 该条件语句下的类型细化为StringPadder
  padder;
}
```

:::

### 类型别名

定义：类型别名会给一个类型起一个新名字（来引用那个类型），有时和接口很像，除此之外，他还可以用于原始值、联合类型、元组、以及其他手写类型

用法：`type typeName = typexxx`

注意：

- 类型别名可以是泛型，可以添加类型参数并且在别名声明的右侧typexxx传入泛型参数
- 可以在右侧typexxx中的属性里面引用自身，但类型别名不能出现在声明右侧的任何地方（属性除外）
- 和交叉类型 `&`一起使用时，可以创建一些古怪的类型

```typescript
// 使用泛型
type Container<T> = { value: T }
// 在属性引用自身
type Tree<T> = {
  value: T
  left: Tree<T>
  right: Tree<T>
}
// 与交叉类型使用，LinkedList是一个具有无限嵌套属性next的类对象结构
type LinkedList<T> = T & { next: LinkedList<T> }
// 🈲，类型别名不能直接出现在右侧（官方web演练场未报错， v4.7.4）
type Yikes = Array<Yikes>
```

**类型别名 vs 接口**：

- 两者都能描述对象/函数的类型：
  - 接口：`interface Itf = { (n: number): void }`
  - 类型别名：`type Itf = (n: number) => void`
- 接口无法描述一个原始值、联合类型、元组类型，但类型别名可以
- 接口可以定义多次并自动合并为单个接口，类型别名不可以
- 两者都能进行扩展，且能相互扩展，比如 `interface Itf {x: number }`：
  - 接口的扩展是继承：通过extends实现，`interface Itf2 extends Itf { y: number}`
  - 类型别名的扩展是交叉类型，通过&实现，`type Itf2 = Itf & {y: number}`
- 接口创建了一个新的名字，可以在其他任何地方使用；而类型别名并非创建一个新名字，且错误信息不会使用别名
- 由于软件中的对象应该对于扩展是开放的，对于修改是封闭的，应该尽量使用接口代替类型别名

### satisfies

定义：

- 让typescript确保值和设置的类型（宽类型）匹配，但能为值推导出更精确的类型（窄类型）用来类型推导而不报错

```typescript
type Colors = 'red' | 'green' | 'blue'
type RGB = [red: number, green: number, blue: number]

const palette: Record<Colors, string | RGB> = {
  red: [255, 0, 0],
  green: '#00ff00',
  blue: [0, 0, 255]
}

// type green: string | RGB
const green = palette.green
// 由于green是联合类型（虽然说值是字符串），故而只能使用共有的属性/方法
// error：
// Property 'toUpperCase' does not exist on type 'string | RGB'.
// Property 'toUpperCase' does not exist on type 'RGB'.
const greenNormalized = palette.green.toUpperCase()

// 解决方法1，使用类型守卫
if (typeof palette.green === 'string') {
  const greenNormalized = palette.green.toUpperCase()
}

// 解决方法2，使用类型断言
const greenNormalized = (palette.green as string).toUpperCase()

// 解决方法3，使用类型断言as const，固定类型，注意，删除了类上的Record类型
// 注意，此时会让palette变为只读类型，不能进行复制操作
// 注意，若as const和变量标注const palette: Record<>同时存在，变量标注会覆盖as const让其发挥不了作用
const palette = {
  // ...
} as const

// 解决方法4，使用satisfies，注意，删除了类上的Record类型
// satisfies可以和as const一起使用，这时变量是readonly的，用法：as const satisfies Type
const palette = {
  // ...
} satisfies Record<Colors, string | RGB>
```

### 多态的this类型

定义：表示某个包含类或接口的子类型，称为F-bounded多态性，能够很容易的表现连贯接口间的继承；同时继承他的新类也能使用之前的方法

```typescript
class BasicCalculator {
  public constructor(protected value: number = 0) { }
  public currentValue(): number {
    return this.value;
  }
  public add(operand: number): this {
    this.value += operand;
    return this;
  }
  public multiply(operand: number): this {
    this.value *= operand;
    return this;
  }
  // ... other operations go here ...
}

class ScientificCalculator extends BasicCalculator {
  public constructor(value = 0) {
    super(value);
  }
  public sin() {
    this.value = Math.sin(this.value);
    return this;
  }
  // ... other operations go here ...
}
// 这里的this指向ScientificCalculator
let v = new ScientificCalculator(2)
        .multiply(5)
        .sin()
        .add(1)
        .currentValue();
```

## 接口

定义：

- ts的核心原则之一是对值具有的结构进行类型检查（鸭式辩型法/结构性子类型化），接口的作用是为这些类型命名或定义契约

使用：

- 接口 interface 可用于定义对象的类型，且对象的属性个数必须完全和接口的属性个数相同（不能增加、减少属性），除非：
  1. 接口属性是可选属性 `name?:string;`（减少）。
  2. 若接口包括一个任意类型的属性 `[propName: string]: string | number;`，则对象属性可以有无限多个（增加），此时接口中与任意类型属性的 key `propName`同类型 `string`的属性，必须是那个任意类型 `string | number`的子类型 `string`或 `number`
  3. 特例，使用变量的方式，将变量传给参数，而不是直接在参数定义一个变量字面量（对象字面量）
- 接口可用于描述JavaScript各种类型，不管是普通的对象，也可以是函数

::: code-group

```typescript
interface Int {
  // 普通属性，这些都不会报错，因为propName`『接口的key可以是任意类型』`是一个number，所以不会进行匹配
  name: string;
  age: number;
  // 任意类型属性, propName可为其他值，一个指代符罢了
  [ propName: number ]: string;
  // 此时 1 会报错，因为 1 和任意类型的属性key: propName是同一个类型number。故1所对应值的类型，必须是string的子类型
  1: true;
}
```

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): any {
  // ...
}

// 声明一个变量，然后将该变量传递给函数调用参数，不会报错，因为squareOptions不会经过额外的属性检查（通过类型推论、类型兼容绕开检查）
// 类型推论：
// 即：let squareOptions: { colour: string, width: number } = { colour: 'red', width：100 }
// 类型兼容：因为squareOptions具备config的最小结构（即{}， { width}等），所以它能够赋值给config
// 前提是：
// 变量squareOptions的结构，要符合接口SquareConfig的最小结构即可（鸭子辩型法），可以有多余的参数
// 毕竟SquareConfig的结构可以是：{}，{color}，{width}，{color，width}；如果是空值，则不能有多余的参数
// 但是：
// 不能够直接将变量对应的值写在参数中，这样会报类型错误，比如直接createSquare({colour: 'red', width: 100})，这个会报错
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
```

:::

**鸭子辩型法**：像鸭子一样走路，并且嘎嘎叫的就是鸭子，即具有鸭子特征（具备最小结构）的认为它就是鸭子

**绕过类型检查的方式**：

- 鸭子辨型法
- 类型断言 `obj as SquareConfig`
- 索引签名 `[key: string]: any`

### 可选属性

场景：用于只有在某些条件下存在，或者根本不存在的属性

语法：`width?: number;`

使用：

- 可选属性可以对可能存在的属性进行预定义
- 🔴可以捕获引用了不存在的属性时的错误。当明确了该类型是某个接口时，只能引用该接口已有的属性

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare (config: SquareConfig): { color: string; area: number} {
  let newSquare = { color: 'white', area: 100 }
  // 此处使用了不存在的属性，报错Property 'clor' does not exist on type 'SquareConfig'. Did you mean 'color'?
  // 若想此处不报错，需要在SquareConfig中加上`[s: string]: any;`
  // 这样就能使用任何未提前声明的属性了
  if (config.clor) {
    newSquare.color = config.clor
  }
  return newSquare
}

// 如果参数config含有squareConfig未声明的属性，会报以下错误
// Object literal may only specify known properties, and 'abc' does not exist in type 'SquareConfig'.
createSquare({ abc: 'red', width: 100 })

// 解决方法1：使用类型断言
createSquare({ abc: 'red', width: 100} as SquareConfig)

// 解决方法2：给squareConfig接口添加
// [s: string]: any;

// 解决方法3：将对象分配给另一个变量，然后使用该变量（下面两种都是ok的）
// 由于赋值不会进行多余的属性检查，因此编译器不会给出错误
// 此方法仅作用于config和接口SquareConfig具有重叠的属性，无则报错
let config = { abc: 'red', width: 100 }
createSquare(config)
let s: SquareConfig = config

let config2 = { abc: 'red' }
// 报错：Type '{ abc: string; }' has no properties in common with type 'SquareConfig'.
let s: SquareConfig = config2

```

### 只读属性

定义：一些对象属性只能在创建的时候被赋值，不能修改，若该属性还是可选的，则仅能在对象创建时赋值，其他地方不能操作

语法：`readonly name:string;`

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}

let p: Point = { x: 10, y: 20 }
// Cannot assign to 'x' because it is a read-only property.
p.x = 20
```

引申：`ReadonlyArray<T>`类型，只读数组类型，和上面定义类似，只能读取，且不能赋值给 `Array<T>`类型

```typescript
let a: number[] = [1, 2, 3]
let ra: ReadonlyArray<number> = a
// Index signature in type 'readonly number[]' only permits reading.
ra[0] = 12
// The type 'readonly number[]' is 'readonly' and cannot be assigned to the mutable type 'number[]'.
a = ra
```

### 接口描述函数类型

语法：类似一个只有参数列表和返回值类型的函数定义，如下：

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}

// 使用
let mySearch: SearchFunc
// 其中，函数参数，可以不需要和接口定义的一致，只要相对应的位置上的类型兼容就行，同时函数参数也可不指定类型，会自动推断出来
mySearch = function (src: string, sub: string) {
  // 返回值类型是类型推断出来的
  return src.srarch(sub) > -1
}
```

### 接口描述具有索引的对象类型（数组、map等）

前置描述：

- typescript支持两种索引签名，字符串和数字
- 同一个接口中，每种类型的索引，只能存在一次，不然会报错：Duplicate index signature for type 'number'.
- 当两种索引签名同时存在时，数字索引的值 必须是 字符串索引的值的子类型，因为当引用时，a[0]等同于a['0']
- 当存在了一种类型的索引签名时，其他具体的对象属性的key若和该种索引类型一致，则对应的值，必须是该种索引（子）类型
- 设置只读索引，在语句前面，加上关键字readonly

::: code-group

```typescript [数字索引]
interface StringArray {
  // 下面这个是数字索引签名，索引签名，就是`[index: number]`这部分
  [index: number]: string;
}

let myArr: StringArray
myArr = ['bob']

let str: string = myArr[0]
```

```typescript [混合索引]
class Animal {
  name: string;
}
class Dog extends Animal {
  breed: string;
}

// 错误：使用数值型的字符串索引，有时会得到完全不同的Animal!
interface NotOkay {
  [x: number]: Animal;
  [x: string]: Dog;
}
// ✅正确用法，数字索引签名的值，必须是字符串索引签名的值的子类型
// 因为Dog是Animal的子类，所以Animal必须是字符串索引
interface Okay {
  [x: string]: Animal;
  [x: number]: Dog;
}

```

```typescript [只读索引]
interface ReadonlyStringArray {
  readonly [index: number]: string;
}

let myArr: ReadonlyStringArray = ['bob']
// Index signature in type 'ReadonlyStringArray' only permits reading.
myArr[0] = 'tom'
```

:::

### 接口描述类类型

使用：

- 接口描述了类的公共部分，不会检查类是否具有私有成员
- 可以在接口中描述一个方法，然后在类中来实现
- 类实现接口时，只会对类的实例进行类型检查，constructor存在于类的静态部分，所以不会进行检查

实现：
::: code-group

```typescript
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
  tick(): void;
}

function createClock(
  ctor: ClockConstructor,
  hour: number,
  minute: number
): ClockInterface {
  return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
}
class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("tick tock");
  }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);

```

```typescript
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}

interface ClockInterface {
  tick(): void;
}

const Clock: ClockConstructor = class Clock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
};

```

:::

### 接口继承

定义：接口可以相互继承，即能够从一个接口复制成员到另一个接口，从而更灵活将接口分割到可重用的模块中

语法如下：

```typescript
interface Shape {
  color: string;
}

interface PenStroke {
  penWidth: number;
}

interface Square extends Shape, PenStroke {
  sideLength: number
}

let square = {} as Square
square.color = 'red'
square.penWidth = 10
square.sideLength = 20
```

### 接口实现混合类型

定义：接口能够描述JavaScript中丰富的类型，比如一个对象可以同时作为函数、对象使用，并拥有额外的方法/属性

语法：

```typescript
interface Counter {
  // 定义一个函数
  (start: number): string;
  // 定义一个对象属性
  interval: number;
  // 定义一个对象方法
  reset(): void;
}

function getCounter(): Counter {
  let counter = function(start: number) {} as Counter;
  counter.interval = 123;
  counter.reset = function() {};
  return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

### 接口继承类

使用

- 接口继承类时，会继承类的成员（包括private和protected），但是不包括其具体的实现
- 当一个接口继承了拥有private/protected成员的类时，该接口只能被该类或该类的子类所实现

```typescript
class Control {
  private state: any;
}

// 接口继承了一个包含私有属性的类，所以只能被该类或其子类实现
interface SelectableControl extends Control {
  select(): void;
}

class Button extends Control implements SelectableControl {
  select() {}
}

class TextBox extends Control {
  select() {}
}

// 下面的私有属性， 是该类自身带的，而非继承的
class ImageControl implements SelectableControl {
// Error: Class 'ImageControl' incorrectly implements interface 'SelectableControl'.
//  Types have separate declarations of a private property 'state'.
  private state: any;
  select() {}
}
```

## 函数

定义：

::: code-group

```typescript [函数声明]
// 1
// 普通函数声明
function sum(x: number, y: number): number {
  return x + y;
}

// 2
// 函数表达式，左边的是函数的定义 (参数类型) => 返回值类型
// 左边参数的名字，不需要和右边参数的名字一一对应，只要参数类型一致即可
// 函数的参数类型不一定是必须的，ts编译器可以自动推断出对应类型（上下文归类）
let mySum: (x: number, y: number) => number = function (
  x: number,
  y: number
): number {
  return x + y;
};

// 3
// 接口
interface MySum {
  // 和函数表达式类似，对等号左边的类型进行限制
  (x: number, y: number): number;
}
let mySum: MySum = function (x: number, y: number): number {
  return x + y;
};

// 4
// 类型别名
type MySumT = (x: number, y: number) => number;

// 5
// 对象方法
interface AddT {
  add: (x: number, y: number) => number
}
const obj: AddT = {
  add (x: number, y: number): number {
    return x + y
  }
}

// 6
// 声明具有属性的函数：使用call signatures
type DescribableFunction =  {
  // 函数属性声明
  description: string;
  // 函数类型声明
  (someArg: nubmer): boolean;
}

function myFunc(someArg: number) {
  return someArg > 3;
}
myFunc.description = 'default description';

function doSomething (fn: describableFunction) {
  console.log(fn.description + " returned " + fn(6));
}
doSomething(myFunc);

// 7
// 构造函数签名，表明该函数是构造函数，可通过new 进行调用生成对象
type SomeConstructor = {
  new (s: string): SomeObject;
};

function fn(ctor: SomeConstructor) {
  return new ctor('hello')
}

// 8
// 同时包含构造函数和普通函数调用
interface CallOrConstruct {
  (n?: number): string;
  new (s: string): Date;
}

// 9
// 在函数中声明this
interface User {
  id: number;
  admin: boolean;
}
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}
declare const getDB: () => DB;

const db = getDB()
// 这里filterUsers的参数 不能使用箭头函数
const admin = db.filterUsers(function (this: User) {
  return this.admin
})


```

```typescript [用法1]
// 1
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
// number
type Num = ReturnType<typeof firstElement<number>>

// 2：type inference
function maps<Input, Output>(arr: Input[], func: (arg: Input): Output[] => Output) {
  return arr.map(func)
}

// 此处的parsed会自动被推断为number[]类型
const parsed = maps(['1', '2', '3'], (n) => parseInt(n))

// 3：type constraint
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a
  } else {
    return b
  }
}
// error: Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
// 因为number类型没有length属性，而Type限制了参数的类型
const notOk = longest(10, 100);

// 4：working with constrained values
function minimumLength<Type extends { length: number }> (
  obj: Type,
  minimum: number
): Type {
  if (obj.length > minimum) {
    return obj
  } else {
    // 报错：
    // Type '{ length: number; }' is not assignable to type 'Type'.
    // '{ length: number; }' is assignable to the constraint of type 'Type', but 'Type' could be instantiated with a different subtype of constraint '{ length: number; }'.
    // 此处报错的原因是：{ length: minimum }仅仅是符合Type的类型约束{ length: number }
    // 而实际上，函数的返回值类型，和类型约束可能毫无关联，比如Type是Array类型
    // 函数的返回值类型是Type，即Array类型，但代码中 { length: minimum }明显不是Array类型
    return { length: minimum }
  }
}
```

```typescript [用法2]
// 1: push type parameters down
function firstElementGood<Type>(arr: Type[]) {
  return arr[0]
}

function firstElementBad<Type extends and[]>(arr: Type) {
  return arr[0]
}

// number
const good = firstElementGood([1, 2, 3])
// any
const bad = firstElementBad([1, 2, 3])

// 2: use fewer type parameters
function filterGood<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func)
}

function filterBad<Type, Func extends (arg: Type) => boolean>(
  arr: Type[],
  func: Func
): Type[] {
  return arr.filter(func)
}

// 3： type parameters should appear twice
function greetGood<Str extends string>(s: Str) {
  // 这里虽然代码中只使用了一次Str，但是由于该函数的返回值和参数类型一致
  // 所以还是相当于使用了2次的
  return s
}

// 如果函数参数类型是未知的，则还是应该使用泛型；参数类型是具体的，则应该使用对应的具体类型
function greetBetter(s: string) {
  // 只使用一次，不应该用泛型
  console.log(s)
}

function greetBad<Str extends string>(s: Str) {
  console.log(s)
}
```

:::

场景：

- 用于实现抽象类、模拟类、信息隐藏、模块
- 虽然ts中支持类、命名空间、模块，然而函数仍然是主要定义行为的方式

使用：

- 函数传入的参数类型必须是和定义时一致
- 函数的可选参数，必须在必传参数后面 `(x: number, y?: number)`
- 函数无返回值，或者 `return ;`时，其返回值类型为 `void`
- 函数参数的默认值 `(x: number = 1, y: number)`，出现位置无特殊要求，但是，若不想传某些值，必须用 `undefined`作为占位，这样就会跳过对应的值，后面的值就能够传过去了。在必须参数后面的带默认值的参数都是可选的（其他位置要传），可不传任何值。
- 函数定义中参数也可用剩余参数，必须在参数的最后一个 `(x: number, ...y: any[])`，用于获取剩下的传入参数。其中在函数内调用时，y 是一个数组
- 函数重载，允许一个函数接受不同数量或类型的参数，并进行不同的处理；ts 会优先从最前面的函数定义开始匹配，*若多个函数定义有包含关系，需要把更精确的函数定义写在前面*
- 异步函数的返回值，用 `Promise<T>`定义，这个适用于promise和async...await，其中T是resolve的返回值类型
- 具有较少参数的函数，可以赋值给较多参数的函数类型
- 具有较多返回值的函数，可以赋值给较少返回值的函数类型

::: code-group

```typescript
// 函数签名（不限个数）
function makeDate(timestamp: number): Date;
function makeDate(timestamp: string): Date;
function makeDate(m: number, d: number, y: number): Date;

// 函数的实现（函数主体，兼容函数签名的函数类型）：函数重载中，最后一个出现的必须是函数的实现
// 此时需要把可能涉及到的参数类型都写出来，用于匹配之前的同名函数参数
function makeDate(mOrTimestamp: number | string, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined && typeof mOrTimestamp === 'number') {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}

// 🟨注意：只能调用 符合【函数签名】的例子
// No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.（参数只能1个或3个）
const d3 = makeDate(1, 3); 
// No overload matches this call.
// 是否符合第一个重载
// Overload 1 of 3, '(timestamp: number): Date', gave the following error.
//    Argument of type '"hello" | number[]' is not assignable to parameter of type 'number'.
//    Type 'string' is not assignable to type 'number'.
//    从实际类型的第一个类型（'hello'即string）来判断是否符合
// 是否符合第二个重载
// Overload 2 of 3, '(timestamp: string): Date', gave the following error.
//    Argument of type '"hello" | number[]' is not assignable to parameter of type 'string'.
//    Type 'number[]' is not assignable to type 'string'.
//    第一个类型符合，则判断第二个类型（[0]即number[]是否符合）
const d4 = makeDate(Math.random() > 0.5 ? 'hello' : [0])

```

```typescript
interface Card {
    suit: string;
    card: number;
}
interface Deck {
    suits: string[];
    cards: number[];
    createCardPicker(this: Deck): () => Card;
}
let deck: Deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    // NOTE: The function now explicitly specifies that its callee must be of type Deck
    createCardPicker: function(this: Deck) {
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);

```

```typescript
// 此例不能编译成功
interface UIElement {
  addClickListener(onclick: (this: void, e: Event) => void): void;
}

class Handler {
    info: string;
    onClickGood = (e: Event) => { this.info = e.message }
}
let h = new Handler();
uiElement.addClickListener(h.onClickGood);

```

```typescript
// 若没有返回数据，则使用`Promise<void>`
function queryData(): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('hello, Jade!')
    }, 1000)
  })
}
queryData().then(data => console.log(data))
```

```typescript [参数和返回值个数]
// 参数个数的通俗理解
type Fn1 = (x: number) => void;
type Fn2 = (x: number, y: number) => void

// 由于Fn1仅有一个参数，所以必然报错，毕竟根本没有第二个参数y
let fn1: Fn1 = (x: number, y: number) => {
  console.log(x, y)
}

// 注意，由于Fn1的参数个数只有一个，所以只能传入一个参数
fn1(1)

// 正确用法
let fn2: Fn2 = (x: number) => {
  console.log(x)
}
// 即使右侧表达式只使用了一个参数，但是调用时必须传入2个参数，以符合Fn2的类型定义
fn(1, 2)

// 返回值个数和常规变量赋值一致，只能多的赋值给少的
```

:::

## 类

### 类的修饰符

修饰符类型：

- public：可以自由的访问，若未具体声明，则默认为public类型🥨
- private：只能在类内部访问，不能在被声明的类的外部和继承的类中访问，不能通过实例点运算符访问（但可通过方括号进行访问不报错`const s = new S(); s['a']`）；
- protected：能够在类和继承的类的内部被访问，不能通过类的实例(new XXX)访问🍠，不能在其他类的内部进行访问🍧；当构造函数是protected时，则不能被实例化，只能被继承，然后被继承的类实例化🍚；同时protected的成员可以被子类public🍣
- readonly：只读属性，只能在声明时或通过构造函数进行初始化
- 修饰符警告仅在类型检查时发生，在js运行时会忽略这些警告，然后执行代码

```typescript
// protected
class A {
  protected age = 10
  protected sex = 'man'
  protected getName () {
    return 'jade'
  }

  wel () {
    // 🍠：可以在类内部访问
    console.log(this.getName())
  }
}

class AA extends A {
  protected sex = 'man'
  // 🍣：protected => public，此时就能够被自由读写不受限制了
  age = 20
  // 🥨：未声明，默认为public
  welcome () {
    // 🍠：可以在被继承的类内部访问
    console.log('welcome, ' + this.getName())
  }
}

class AB extends A {
  f1(other: AA) {
    // 🍧：此处sex是protected型的，只能在AA类的内部被访问，但此处却位于AB类中，会报错
    other.sex = 'man'
  }

  f2(other: AB) {
    other.sex = 'man'
  }
}

const aa = new AA()
// 🍠：不能被类的实例访问，会报错
g.welcome()
```

### 静态属性

定义：

- 关键字static
- 存在于类本身，而非类的实例上，直接通过类名来访问
- static可以和public、protected、private一起使用，使用注意事项是两者的综合
- static不能作用于name、length、call等特殊的名称上
- static可以用于块中，此处编写的变量不会被泄漏，并且可以完全访问类内部的结构，可编写功能的初始化代码，该块内容，在构造函数之前执行

```typescript
class A {
  // 私有变量
  static #count = 0

  get count() {
    return Foo.#count;
  }

  // 静态块的代码
  static {
    console.log('count: ' + Foo.#count)
  }
}

// 此时会运行上面静态块中的代码
new A()
```

### 存取器（get、set）

定义：截取控制对对象成员的访问，返回截取后的内容

注意：只带有get，没有set的存取器自动推断为readonly属性

```typescript
const fullNameMaxLength = 10;

class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (newName && newName.length > fullNameMaxLength) {
            throw new Error("fullName has a max length of " + fullNameMaxLength);
        }

        this._fullName = newName;
    }
}
// 截取对属性fullName的访问
let employee = new Employee();
// 存值
employee.fullName = "Bob Smith";
// 取值
if (employee.fullName) {
    alert(employee.fullName);
}
```

### 类的继承

解释：

- 关键字：extends
- 一个类若从另一个类继承了属性和方法，则该类称为子类/派生类，另一个类成为基类/超类/父类
- 在类的继承中，子类的属性声明必须是父类对应的属性声明的子类型，而不能由其扩展新的类型；对于父类没有的属性，子类是可以新增扩展类型的

场景：

```typescript
class Animal {
    name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Horse extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}

// tom类型为父类类型，而右侧的类型为子类的类型，tom只能调用【父类存在】的方法，若子类重写了，则会调用子类的
let tom: Animal = new Horse("Tommy the Palomino");
// 由于子类重写了父类的move方法，此时会直接调用子类的move
tom.move(34);

```

### 类的初始化顺序

1. 初始化基类字段
2. 运行基类构造函数
3. 初始化子类字段
4. 运行子类构造函数

```typescript
class Base {
  name = 'base'
  constructor() {
    // 根据初始化顺序，此处打印的值是base，而非sub
    // 因为在基类构造函数中，它读取到的值就是基类的name，此时子类字段尚未初始化
    console.log(this.name)
  }
}

class Sub extends Base {
  name = 'sub'
}

const d = new Sub()
```

### 类的实现

解释：

- 关键字：implements
- 类若implements一个接口，则类中的属性的类型声明必须是接口对应的属性的类型声明的子类型🍂。
- 类若implements一个接口，必须对接口中的属性进行显式的类型声明，因为implements不会隐式让类继承接口中的类型🧃
- 类implements一个接口，对于同一个属性类型声明，类不能进行类型扩展；对于接口中未声明的属性，类才能对该属性进行新增扩展🌷
- 类可以继承多个接口`class C implements A, B {}`

```typescript
interface Pingable {
  ping(): void;
  pong(): boolean;
  kong(s: string): string;
}

class Ball implements Pingable {
  // 🍂Ball类中，必须实现ping，由于无ping，会报错

  // 🍂Ball类中，pong的类型必须是接口的pong的类型的子类才行，由于pong的类型是(a: string) => boolean，不能分配给Pingable的pong：() => boolean，会报错
  pong(a: string){
    return !!a
  }

  // 🧃Ball类中，kong的类型必须和Pingable中的一致，且显式声明出来，也就是`s: string`必须写出来才行
  // Parameter 's' implicitly has an 'any' type.
  kong(s) {
    return s.toString()
  }

  // 🌷Pingable没有的属性，Ball可以进行新增扩展
  down() {}
}
```

### 抽象类

定义：用关键字 `abstract`定义抽象类和抽象类内的抽象方法，一般作为类的基类使用，一般不会直接被实例化（即不能使用new）

使用：

- 抽象类可以有抽象函数，也可以包括具体实现的函数
- 抽象类的抽象方法（必须用abstract修饰）可以包含修饰符（不能是private），且必须在继承类中实现其具体细节
- 抽象类内的方法，若无abstract修饰符，则必须有具体的实现

### 泛型类

解释：

- 类和接口一样，也可以使用泛型，可以使用和接口一样的泛型约束和默认值
- 当泛型类被实例化时，类型参数的推断方式和函数调用相同
- 泛型类的static静态成员不能使用泛型类的类型参数🥦

```typescript
class A<Type>{
  contents: Type;
  // 🥦：此处会报错
  // Static members cannot reference class type parameters.
  static name: Type;

  constructor(value: Type) {
    this.contents = value
  }
}

// 此处a的类型：A<string>
const a = new A('jade')
```

### 构造函数的使用

```typescript
class Greeter {
    static standardGreeting = "Hello, there";
    greeting: string;
    greet() {
        if (this.greeting) {
            return "Hello, " + this.greeting;
        }
        else {
            return Greeter.standardGreeting;
        }
    }
}

let greeter1: Greeter;
greeter1 = new Greeter();
console.log(greeter1.greet());

// typeof Greeter，即取Greeter的类型，然后将Greeter赋值给greeterMaker，此时greeterMaker就是类Greeter，拥有构造函数和静态成员
let greeterMaker: typeof Greeter = Greeter;
// 所以可以访问静态属性
greeterMaker.standardGreeting = "Hey there!";
// 所以可以通过new调用
let greeter2: Greeter = new greeterMaker();
console.log(greeter2.greet());
```

### 构造函数的参数属性

解释：

- 在构造函数的参数上加上public、protected、private、readonly修饰符之后，即参数属性可以在一个地方同时定义并初始化类的成员属性，将声明和赋值合并到一处
- 参数属性通过给构造函数添加的修饰符不能省略

```typescript
class A {
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ) {
    // 不做任何事
  }

  // 上面会自动给class A添加 如下内容：
  public readonly x: number;
  protected y: number;
  private z: number;
}
```

### 获取类的实例类型

```typescript
class A {
  x: number = 3
}

// 获取类的实例类型
type AInstance = InstanceType<typeof A>

function getX(a: AInstance) {
  console.log(a.x)
}

const a = new A()
getX(a)
```

### 抽象类的构造函数类型

```typescript
abstract class B {}
class BB extends B {}

// 对于抽象类B：
type BInstance = new () => B

// 不能是：Cannot create an instance of an abstract class.
// 不过普通函数可以使用
type BInstance = typeof B

```

### 把类当作接口使用

场景：由于类的定义会创建类型（类的实例类型和构造函数），所以在可以使用接口的地方也可以使用类

```typescript
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```

### this

解释：

- 普通函数内部的this值取决于函数调用的地方，而非函数定义的地方。除非使用箭头函数代替
- 普通函数的this参数，在ts中具有特殊含义，在编译为js时，该参数会被移除
- 类中的this，指代类本身
- 可以给函数/方法的参数标注为this类型

```typescript
// this参数
function fn(this: SomeType, x: number) {}

// 编译后：
function fn(x) {}

// 给函数添加this参数，强制ts正确调用该方法
class A {
  name = 'a';
  getName(this: A) {
    return this.name
  }
}

const a = new A()
// 正确调用
a.getName()

// 错误调用，会报错
// The 'this' context of type 'void' is not assignable to method's 'this' of type 'A'.
const e = a.getName
console.log(e())

// 给函数参数标为this类型
class B {
  content: string = ''
  // 此处的other的类型，只能是B的子类的实例，否则会报错
  sameAs(other: this) {
    return other.content === this.content;
  }
}

class BB extends B {
  otherContent: string = ''
}

const b = new B()
const bb = new BB()
// 报错：因为b不是bb的子类的实例
bb.sameAs(b)

// this配合实现类型收窄
class C {
  isD(): this is D {
    return this instanceof D
  }
  isE(): this is E {
    return this instanceof E
  }
  isF(): this is F & this {
    return this.f
  }
  constructor(public a: string, private f: boolean) {}
}

class D extends C {
  constructor(a: string, public d: string) {
    super(a, false)
  }
}

class E extends C {
  children: C[];
}

interface F {
  host: string;
}

// type: F & C
class FF extends C implements F {
  host = ''
}

const c: C = new F('jade', true);

if (c.isD()) {
  // type: D
  c.d;
} else if (c.isE()) {
  // type: E
  c.children;
} else if (c.isF()) {
  // type: F & C
  c.host()
}
```

### 类间的关系(类的兼容性)

解释：

- 多数情况下，ts的类是在结构上进行比较的。换句话说，如果两个类的结构相同，就可以进行赋值
- 对于一个空类，所有的类型都可以替代他
- 比较类类型的两个对象时，仅比较实例成员（包括私有成员和受保护的成员），静态成员和构造函数不会影响其兼容性

```typescript
class A {
  x = 0
}

class B {
  x = 0
}

class C {
  x = 2
  y = 2
}

// ok
const a: A = new B()
const a: A = new C()

// error：少的不能赋值给多的
const c: C = new A()

// 空类
class E {}

// ok
let e: E = ''
```

## Minxins

```typescript
// 1. minxin定义
class Sprite {
  name = '';
  x = 0;
  y = 0;
  constructor(name: string) {
    this.name = name;
  }
}

type Constructor = new (...args: any[]) => {};

// 工厂函数
function Scale<TBase extends Constructor>(Base: TBase) {
  return class Scaling extends Base {
    _scale = 1

    setScale(scale: number) {
      this._scale = scale;
    }

    get scale(): number {
      return this._scale;
    }
  }
}

// 创建一个类表示应用了mixins的基类
const EightBitSprite = Scale(Sprite);
const flappySprite = new EightBitSprite('bird');
flappySprite.setScale(0.8);
console.log(flappySprite.scale);

// 2. constrained mixins：通过泛型进行约束
type GConstructor<T = {}> = new (...args: any[]) => T;

type Positionable = GConstructor<{ setPos: (x: number, y: number) => void }>;

function Jumpable<TBase extends Positionable>(Base: TBase) {
  return class Jumpable extends Base {
    jump(){
      // 由于继承了基类Positionable，故而可以调用该方法
      this.setPos(0, 20)
    }
  }
}

// 3. 包含静态属性的mixins
function Base<T>(){
  class Base {
    static prop: T;
  }
  return Base;
}

function derived<T>(){
  class Derived extends base<T>(){
    static anotherProp: T;
  }
  return Derived;
}

class Spec extends derived<string>() {}

// string
Spec.prop;
// string
Spec.anotherProp;

```

## 泛型

> 参考：    
> <https://zhuanlan.zhihu.com/p/149767010>    
> <https://zhuanlan.zhihu.com/p/141887346>    

定义：

- 使用泛型来定义可重用的组件，一个组件可以支持多个类型的数据（不仅是目前的，还可能是未来的），这样用户就可以以自己的数据类型来使用组件
- 泛型，即类型的函数（使用类似函数的用法，比如接收多个类型变量作为参数），声明一个类型变量，在类型函数代码中使用这个类型变量。
- 只有在泛型调用的时候，才给定该泛型实际的类型
- 泛型的兼容性，只有当泛型使用到了具体的地方时，才会影响其兼容性，不然是互相兼容的，例如`type A<T> = {}`, `A<number>`和`A<string>`是互相兼容的，因为A的结构体并没有用到泛型T

类型变量：是一种特殊的变量，只用于表示类型，而不是值（比如下面的T）

匿名函数泛型：和匿名函数类似

泛型分类：

- 函数泛型
- 接口泛型
- 类泛型
- 类型别名泛型

::: code-group

```typescript
// 类型变量的使用
// 给identity添加了类型变量T，T帮助捕获用户传入的类型，后面就能够使用这个类型了，这个identity函数就是泛型
function identity <T> (args: T): T {
  return args
}

```

```typescript
// 1. 显式声明
let output = identity<string>('mystring')
// 2. 类型推断，若不能自动推断类型，必须显式声明
let output = identity('mystring')
```

```typescript
// 即不使用接口或者类型别名的形式定义，而是直接定义
// 比如：<T>(val: T[]) => T[]
let getVal: <T>(val: T[]) => T[] = info => {
  return info
}

// 该种形式可使用接口形式定义
interface GetVal<T> {
  (val: T[]): T[];
}

// 或使用类型别名的形式定义
type GetVal<T> = (val: T[]) => T[]
```

:::

泛型变量：使用泛型创建泛型函数等时，必须在函数体内正确使用这个通用的泛型，即把这些参数当作任意类型或所有类型，不能访问不存在的方法/属性

泛型类型：泛型函数的类型和非泛型函数的类型基本类似，只是加了一个类型参数；可以把泛型参数当作整个接口的一个参数，这样可以清楚知道具体是哪个泛型类型，并且锁定了内部使用的泛型类型

使用：

- 泛型类型可以定义泛型类和泛型接口，无法定义泛型枚举和泛型命名空间

泛型类：和泛型接口类似，泛型变量跟在类名后面

使用：

- 泛型类指的是实例部分的类型，因为构造函数传入的值，只能在实例中使用，通过类名调用静态成员获取不到这个类型

::: code-group

```typescript
// 错误的使用
function identity <T> (args: T): T {
  // Property 'length' does not exist on type 'T'.
  // 报错原因：T理论上可以是任何类型（但又和any不一样），故而只能调用所有类型的共有方法，此处需要将其进行类型约束到特定的范围，去使用该范围内的方法
  console.log(args.length)
  return args
}

// 正确的使用：将泛型变量T当作类型的一部分使用，而非整个类型，增加了灵活性
function identity <T> (args: T[]): T[] {
  console.log(args.length)
  return args
}
function identity <T> (args: Array<T>): Array<T> {
  console.log(args.length)
  return args
}
```

```typescript
// 泛型参数名可以使用任意的标识，只要数量上和使用方式上对应即可
function identity <U> (args: U[]): U[] {
  return args
}

let myIdentity: <T>(args: T[]) => T[] = identity
// 上面这可以用接口定义泛型函数
interface GeneraticIdentityFn {
  <T>(args: T[]): T[];
}
let myIdentity: GeneraticIdentityFn = identity
```

```typescript
interface GeneraticIdentityFn <T> {
  (args: T[]): T[];
}

function identity <U> (args: U[]): U[] {
  return args
}

// 这时锁定了泛型为number类型，之后整个函数内部都是number类型的T
let myIdentity: GeneraticIdentityFn<number> = identity
```

```typescript
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}
// 定义的时候传入泛型T，构造实例的时候传入具体的类型，比如number；之后凡是涉及泛型的地方，只能使用number类型的值
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

:::

泛型约束：定义一个接口来描述约束条件，让泛型继承（使用关键字extends）这个接口实现约束。在定义了约束的泛型之后，传入的值（以及泛型参数的默认类型）必须要兼容这个约束类型

在泛型约束中使用类型参数：声明一个类型参数，其被另一个类型参数所约束

泛型约束的使用场景：

- 确保是否存在某属性，例如 `T extends string[]`，之后就能够使用数组类型的方法（属性）了
- 检查对象是否存在某key，例如 `T extends keyof Person`，这时T的类型就是Person类型的属性key的联合类型

泛型参数默认类型：可以为泛型的类型参数指定默认类型，当使用时未直接指定类型参数或者说从实际值无法推导类型时，默认类型就会起作用。默认类型的设置和普通函数的默认值相似，即 `<T = Type>`

- 有默认类型的类型参数是可选的，即在设置成实际类型时不必传入类型参数，比如泛型 `B<T = string>`，使用时，可以直接使用 `B`，也可使用其他类型，比如 `B<number>`
- 必选的类型参数必须在可选类型参数之前
- 默认类型比如满足类型参数的约束

泛型条件类型：`T extends U ? X : Y`，尽管使用了extends，但是不一定要满足继承关系，只需要满足条件即可，通常会结合infer一起使用

在泛型中使用类类型：类类型语法为 `new (x: number) => Point`等同于 `{ new (x: number): Point }`，表示返回一个包含类型为Point的构造函数的对象类型，默认类的构造函数类型为其本身

::: code-group

```typescript
interface Lengthwise {
    length: number;
}

// 泛型T继承了接口lengthwise，此时泛型T具备了属性length
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
// 必须包含约定的属性才行
loggingIdentity({length: 10, value: 3});
```

```typescript
// 泛型K继承了泛型T的key的类型
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // okay
getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
```

```typescript
function createInstance<A extends Animal>(c: new () => A): A {
  return new c()
}
class Animal {
}
class Bee extends Animal {
  Keeper: BeeKeeper = new BeeKeeper()
}
class BeeKeeper {
  hasMask: boolean = false
}

createInstance(Bee).Keeper.hasMask
```

```typescript
// 类实现接口时，应该分别定义接口的属性和构造函数类型（两者不能放在一个接口中）
// 定义接口属性
interface Point {
  x: number;
  y: number;

  // 下面这行放在这是错的，需注释掉
  // new (x: number, y: number): Point;
}
// 定义构造函数
interface PointConstructor {
  new (x: number, y: number): Point;
}

// 类实现接口
class Point2D implements Point {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

// 传入子类生成一个父类
function newPoint (
  pointConstructor: PointConstructor,
  x: number,
  y: number
): Point {
  return new pointConstructor(x, y)
}

let point: Point = newPoint(Point2D, 1, 2)
```

```typescript
// 泛型T不能用作值new T()，下面这个是错的
class GenericCreator<T> {
  create() : T {
    return new T();
  }
}

// 正确用法
class GenericCreator<T> {
  create<T>(c: { new (): T }): T {
    return new c()
  }
  // 若有参数
  create<T>(c: { new (a: number): T }, num: number): T {
    return new c(num)
  }
}

class FirstClass {
  id: number | undefined;
}

let creator = new GenericCreator<FirstClass>()
let firstClass: FirstClass = creator.create(FirstClass)

```

:::

注意事项：

::: code-group

```typescript
type A<T = {}> = {
  name: T;
}

// 错误赋值
type B = A;
// 正确赋值
type B<T> = A<T>

// Type 'B' is not generic.
let a: B;
```

```typescript
type FC<p = {}> = FunctionComponent<P>

interface FunctionComponent<P = {}> = {
  // 表明FunctionComponent是一个函数类型
  (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
  // 定义了一个静态类属性
  displayName?: string;
}
```

```typescript
type A<Tuple extends any[]> = B<C<D<Tuple>>>
```

```typescript
// 单链表
type ListNode<T> = {
  data: T;
  next: ListNode<T> | null;
}

// HTMLElement的递归声明
declare var HTMLElement: {
  prototype: HTMLElement;
  new(): HTMLElement;
}
```

```typescript
// 将对象所有（包括嵌套）属性变为可选
type DeepPartial<T> = T extends Function
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

type PartialWindow = DeepPartial<Window>
```

:::

## 生成器和迭代器

可迭代对象：实现了属性Symbol.iterator，比如Array、Map、Set、String、Int32Array、Unit32Array、arguments等

```typescript
function toArray<X>(xs: Iterable<X>): X[] {
  return [...xs]
}
```

### for...of和for...in

- for...of：遍历可迭代对象，调用对象上的Symbol.iterator方法
- for...in：以任意顺序迭代一个对象除Symbol以外的可枚举的属性，包括继承的属性

```typescript
// 区别一：数组
let list = [4, 5, 6]

for(let i of list) {
  // 获取对象的属性的值：4, 5, 6
  console.log(i)
}

for (let i in list) {
  // 获取对象的可枚举属性的键：0, 1, 2
  console.log(i)
}

// 区别二：Set
let pets = new Set(['cat', 'dog', 'hamster'])
pets['species'] = 'mammals'

for (let pet of pets) {
  // 'cat', 'dog', 'hamster'
  console.log(pet)
}

for (let pet in pets) {
  // 'species'
  console.log(pet)
}
```
