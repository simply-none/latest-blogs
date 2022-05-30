# TypeScript 知识点（第一期）

## 基础知识

1. 脚本编译 ts 文件，使用命令`tsc xxx.ts xxx.js`
2. 初始化tsconfig文件，使用命令`tsc --init`
3. 使用创造函数 new 创建的对象`new Boolean()`，是对象类型`Boolean`，而非某些特定的原始类型`boolean`
4. 声明文件：当使用第三方库时，需引用对应的声明文件，才能获得对应的代码补全、接口提示等功能

## 基础类型概述

1. `unknown`类型
定义：表示一个当前时刻还不知道类型的变量，可以将任何类型赋值给该类型，可以使用任意类型方法/属性（编译不报错）。
使用：
- 若想缩小改类型的范围，可以使用条件语句+逻辑判断（typeof、比较符、类型检查），之后就只能使用范围下类型的方法/属性

2. `any`类型
定义：表示一个当前时刻不清楚类型的变量，可以将任何类型赋值给该类型，可以使用任意类型方法/属性（编译不报错）。
使用：
- 对于不想进行类型检查的变量，可以标记为any类型
- 用于旧项目迁移到typescript项目

注意：
- 声明且没对变量赋值，若未指定类型，会被识别为 any 类型，但是不能调用该值没有的方法或属性

```typescript
let a;
// 不能调用该值没有的方法/属性，否则报错：Object is possibly 'undefined'.
a.concat([])
```

3. `void`类型
定义：表示没有任何类型，与any相反

场景：
- 当函数无返回值时

赋值：
- null
- undefined

4. `null`类型
定义：表示它本身

使用：
- 是所有类型的子类型，可以赋值给任何类型的变量
- 指定了 **--strictNullChecks** 之后，只能赋值给any和它本身

5. `undefined`类型
定义：表示它本身

使用：
- 是所有类型的子类型，可以赋值给任何类型的变量
- 指定了 **--strictNullChecks** 之后，只能赋值给any、void和它本身

6. `never`类型
定义：表示永远不存在的值的类型

场景：
- 用于表示抛出异常的函数的函数返回值类型
- 用于无返回值的函数（表达式）的函数返回值类型，比如函数执行过程中，出现了死循环

使用：
- never类型是任何类型的子类型，可以赋值给任何类型的变量
- **只有never类型才能赋值给never类型**

7. `boolean`类型



8. `number`类型

9.  `bigint`类型

10. `string`类型

语法：
```ts
const str: string = `这是一个模板字符串，当前时间：${new Date()}`;
```

11.  `array`类型

数组类型的定义方式，如下：
```ts
// 类型 + 方括号
let a: (number | string)[] = [1, "2"];
// 数组泛型
let b: Array<number | string> = [1, "2"];
// 接口
let c: {
  [index: number]: string | number;
} = [1, "2"];
```

常用的类数组类型都有自己的接口定义，分别有`IArguments`, `NodeList`, `HTMLCollection`等，其中
```ts
// IArguments的接口类型如下
interface IArguments {
  // [index: number]: any;
  length: number;
  callee: Function;
}
```

12.  `tuple`类型

定义：元组表示一个**已知数量和类型**的数组

表示形式如下：
```typescript
const tuple: [string, number, boolean] = ['1', 1, true]
```

13. `enum`类型

定义：枚举类型表示可以有特殊名字的一组值，如下：
```typescript
// 定义
enum Color { Red = 1, Blue, Green }

// 使用，其中c的类型是Color，c的值为1
const c: Color = Color.Red

// s的类型是string，s的值是'Red'
const s: string = Color[1]
```

14. `object`类型
定义：非原始类型，表示除了number、string、boolean、bigint、symbol、null、undefined之外的类型

15. 构造函数类型

定义：使用大写字母开头，与相对应的小写版本类型一致

值：
- Number
- String
- Boolean
- Symbol
- Object

使用：
- 用于创造函数 new 创建的对象。比如`new Boolean()`，是对象类型`Boolean`，而非某些特定的原始类型`boolean`
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
  // 下面的条件只能为true，若是其他比较符，会报错：A function returning 'never' cannot have a reachable end point.
  while(true) {}
}
```

## 交叉类型

通俗理解：交叉类型，即`求同`，只能是各种类型的交集

定义：使用`&`分隔类型，一般用于联合类型、接口交叉，若两者之间无交集，则该值为never类型

使用：
- 交叉类型常用来定义公共的部分

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
type XY = X & Y;
// Type 'number' is not assignable to type 'never'.
let p: XY = { c: 6, d: "d", e: "e" };

// 接口交叉，相同属性值的对象属性，则直接合并
interface D { d: boolean; }
interface E { e: string; }
interface F { f: number; }

interface A { x: D; }
interface B { x: E; }
interface C { x: F; }
// 交叉类型结果为：{ x: { d: boolean, e: string, f: number } }
/**
 * 若改成下面类型：则结果为：{ x: { d: boolean & string } }😢😢😢
interface D { d: boolean; }
interface E { d: string; }
interface F { f: number; }
 * /
type ABC = A & B & C;

let abc: ABC = {
    x: {
      d: true,
      e: 'semlinker',
      f: 666
    }
};

```

## 联合类型

通俗理解：联合类型，即`存异`，可以是某种类型，也可以是另一种类型

定义：union，使用`|`分隔类型`string | number`，其值可以是声明类型的某一种`string`或者`number`。

使用：
- 当不能（用类型推断）确定联合类型属于某一具体类型时，只能访问所有类型共有方法/属性。
- 只有确定具体类型`if (typeof xxx === 'number') { xxx.toFixed() }`之后（比如使用条件语句、类型推断），才能访问特定类型的方法/属性

## 类型相关

1. 类型声明：
定义：只能够将大的结构类型赋值给小的结构类型。比如只能将子类赋值给父类，反之不可。因为子类有父类所有方法/属性，能够被调用

2. 类型推断：
定义：typescript 会在无明确类型时按照类型推断规则推测出该值的类型

3. 类型断言：
定义：手动指定一个值的类型，就可以调用该类型的方法而不在编译时报错（但在运行时该报错还是会报错）

语法：
- `value as type`
- `<type>value`

```typescript
// <type>value
let someValue: any = "this is a string"
// any类型断言成了string类型
let strLength: number = (<string>someValue).length

// value as type(**推荐**，jsx语法特有)
// any类型断言成了string类型
let strLength: number = (someValue as string).length
```

场景（常用类型断言）：
- 联合类型可以被断言为其中的一个类型
- 父类可以被断言为子类
- 任何类型都可以被断言为 any
- any 可以被断言为任何类型
- 若想 A 能够被断言为 B，只需 A 兼容 B，或 B 兼容 A；兼容指的是结构兼容。若 A 兼容 B，那么 A 可以被断言为 B，B 也可以被断言为 A，举例，因为子类结构兼容父类，所以子类可以被断言为父类，父类也可以被断言为子类

使用：
- typescript 类型之间的对比只会比较他们最终的结构，而忽略他们定义时的关系。

4. 类型兼容：

定义：
- 由于typescript使用的是结构类型的系统，当比较两种不同的类型时，并不在乎他们从何而来，若所有成员的类型都是兼容的，则他们也是兼容的；
- 当成员的修饰符为private、protected时，只有他们来自同一处声明时（实例的继承链都继承自同一个对象、都是某个对象的实例），他们的类型才是兼容的

使用
- 兼容的类型，可以进行赋值操作（只能是成员多的赋给成员少的或成员相同的，不能成员少的赋值给成员多的）

## 接口

定义：
- ts的核心原则之一是对值具有的结构进行类型检查（鸭式辩型法/结构性子类型化），接口的作用是为这些类型命名或定义契约

使用：
- 接口 interface 可用于定义对象的类型，且对象的属性个数必须完全和接口的属性个数相同（不能增加、减少属性），除非：
  1. 接口属性是可选属性`name?:string;`（减少）。
  2. 若接口包括一个任意类型的属性`[propName: string]: string | number;`，则对象属性可以有无限多个（增加），此时接口中与任意类型属性的 key`propName`同类型`string`的属性，必须是那个任意类型的子类型`string`或`number`
  3. 特例，使用变量的方式，将变量传给参数，而不是直接在参数定义一个变量字面量
- 接口可用于描述JavaScript各种类型，不管是普通的对象，也可以是函数

<!-- tabs:start -->
<!-- tab:任意个接口属性 -->
```ts
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
<!-- tab:特例 -->
```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): any {
  // ...
}

// 声明一个变量，然后将该变量传递给函数调用参数，不会报错，因为squareOptions不会经过额外的属性检查
// 前提是：
// 变量squareOptions的结构，要符合接口SquareConfig的最小结构即可，可以有多余的参数
// 毕竟SquareConfig的结构可以是：{}，{color}，{width}，{color，width}；如果是空值，则不能有多余的参数
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
```

<!-- tabs:end -->


### 内部结构解释

1. 可选属性

场景：用于只有在某些条件下存在，或者根本不存在的属性

语法：`width?: number;`

使用：
- 可选属性可以对可能存在的属性进行预定义
- 可以捕获引用了不存在的属性时的错误。当明确了改类型是某个接口时，只能引用该接口已有的属性

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare (config: SquareConfig): { color: string; area: number} {
  let newSquare = { color: 'white', area: 100 }
  // 此处使用了不存在的属性，报错Property 'clor' does not exist on type 'SquareConfig'. Did you mean 'color'?
  if (config.clor) {
    newSquare.color = config.clor
  }
  return newSquare
}
```

2. 只读属性

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

引申：ReadonlyArray<T>类型，只读数组类型，和上面定义类似，只能读取，且不能赋值给Array<T>类型

```typescript
let a: number[] = [1, 2, 3]
let ra: ReadonlyArray<number> = a
// Index signature in type 'readonly number[]' only permits reading.
ra[0] = 12
// The type 'readonly number[]' is 'readonly' and cannot be assigned to the mutable type 'number[]'.
a = ra
```

3. 接口描述函数类型

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

4. 接口描述具有索引的对象类型（数组、map等）

前置描述：
- typescript支持两种索引签名，字符串和数字
- 同一个接口中，每种类型的索引，只能存在一次，不然会报错：Duplicate index signature for type 'number'.
- 当两种索引签名同时存在时，数字索引的值 必须是 字符串索引的值的子类型，因为当引用时，a[0]等同于a['0']
- 当存在了一种类型的索引签名时，其他具体的对象属性的key若和该种索引类型一致，则对应的值，必须是该种索引（子）类型
- 设置只读索引，在语句前面，加上关键字readonly


<!-- tabs:start -->
<!-- tab:索引签名语法 -->
```typescript
interface StringArray {
  // 下面这个是数字索引签名，索引签名，就是`[index: number]`这部分
  [index: number]: string;
}

let myArr: StringArray
myArr = ['bob']

let str: string = myArr[0]
```

<!-- tab:两种索引签名同时存在的情形 -->
```typescript
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
// 正确用法，数字索引签名的值，必须是字符串索引签名的值的子类型
// 因为Dog是Animal的子类，所以Animal必须是字符串索引
interface Okay {
  [x: string]: Animal;
  [x: number]: Dog;
}

```
<!-- tab:只读索引 -->
```typescript
interface ReadonlyStringArray {
  readonly [index: number]: string;
}

let myArr: ReadonlyStringArray = ['bob']
// Index signature in type 'ReadonlyStringArray' only permits reading.
myArr[0] = 'tom'
```
<!-- tabs:end -->

5. <b class="puzzled">接口描述类类型</b>

使用：
- 接口描述了类的公共部分，不会检查类是否具有私有成员
- 可以在接口中描述一个方法，然后在类中来实现
- 类实现接口时，只会对类的实例进行类型检查，constructor存在于类的静态部分，所以不会进行检查

实现：
<!-- tabs:start -->
<!-- tab:第一种方式 -->
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

<!-- tab:第二种方式 -->
```typescript
interface ClockConstructor {
  new (hour: number, minute: number);
}

interface ClockInterface {
  tick();
}

const Clock: ClockConstructor = class Clock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
};

```
<!-- tabs:end -->

6. 接口继承

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

7. 接口实现混合类型

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

8. 接口继承类

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

定义：声明式和函数表达式形式，如下：
```typescript
// 函数声明
function sum(x: number, y: number): number {
  return x + y;
}

// 函数表达式，左边的是函数的定义 (参数类型) => 返回值类型
// 左边参数的名字，不需要和右边参数的名字一一对应，只要参数类型一致即可
// 函数的参数类型不一定是必须的，ts编译器可以自动推断出对应类型（上下文归类）
let mySum: (x: number, y: number) => number = function (
  x: number,
  y: number
): number {
  return x + y;
};

// 接口
interface MySum {
  // 和函数表达式类似，对等号左边的类型进行限制
  (x: number, y: number): number;
}
let mySum: MySum = function (x: number, y: number): number {
  return x + y;
};
```

场景：
- 用于实现抽象类、模拟类、信息隐藏、模块
- 虽然ts中支持类、命名空间、模块，然而函数仍然是主要定义行为的方式

使用：
- 函数传入的参数类型必须是和定义时一致
- 函数的可选参数，必须在必须参数后面`(x: number, y?: number)`
- 函数参数的默认值`(x: number = 1, y: number)`，出现位置无特殊要求，但是，若不想传某些值，必须用`undefined`作为占位，这样就会跳过对应的值，后面的值就能够传过去了。在必须参数后面的带默认值的参数都是可选的（其他位置要传），可不传任何值。
- 函数定义中参数也可用剩余参数，必须在参数的最后一个`(x: number, ...y: any[])`，用于获取剩下的传入参数。其中在函数内调用时，y 是一个数组
- 函数重载，允许一个函数接受不同数量或类型的参数，并进行不同的处理；ts 会优先从最前面的函数定义开始匹配，若多个函数定义有包含关系，需要把精确的函数定义写在前面

<!-- tabs:start -->
<!-- tab:函数重载 -->
```typescript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string | void {
  if (typeof x === "number") {
    return Number(x.toString().split("").reverse().join(""));
  } else if (typeof x === "string") {
    return x.split("").reverse().join("");
  }
}
```

<!-- tab:函数内的this -->
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

<!-- tab:回调参数的this -->
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
<!-- tabs:end -->

## 类

1. 类的修饰符

修饰符类型：
- public：可以自由的访问，若未具体声明，则默认为public类型
- private：不能在被声明的类的外部访问，不能通过实例访问
- protected：能够在继承的类内部被访问，不能通过类的实例访问；当构造函数是protected时，则不能被实例化，只能被继承，然后被继承的类实例化
- readonly：只读属性，只能在声明时或通过构造函数进行初始化

2. 参数属性

定义：
- 参数属性可以在一个地方同时定义并初始化成员属性，将声明和赋值合并到一处
- 参数属性通过给构造函数添加一个访问修饰符（public、private、protected）来声明，修饰符不能省略

```typescript
// 声明了一个私有属性name
class Animal {
    constructor(private name: string) { }
    move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

3. 静态属性

定义：存在于类本身，而非类的实例上，直接通过类名来访问

4. 存取器（get、set）

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

5. 类的继承

解释：一个类若从另一个类继承了属性和方法，则该类称为子类/派生类，另一个类成为基类/超类/父类

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

6. 抽象类

定义：用关键字`abstract`定义抽象类和抽象类内的抽象方法，一般作为类的基类使用，一般不会直接被实例化

使用：
- 抽象类可以有抽象函数，也可以包括具体实现的函数
- 抽象类的抽象方法（必须用abstract修饰）可以包含修饰符（不能是private），且必须在继承类中实现其具体细节
- 抽象类内的方法，若无abstract修饰符，则必须有具体的实现

7. 构造函数的使用

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

8. 把类当作接口使用

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