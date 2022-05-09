# TypeScript知识点（第一期）

## 基础知识

1. 脚本编译ts文件，使用命令`tsc xxx.ts xxx.js`
2. typescript中的类型判断，使用的是小写字符`string`，和vue props的类型判断`String`不一致
3. 使用创造函数new创建的对象`new Boolean()`，是对象类型`Boolean`，而非某些特定的原始类型`boolean`
4. 模板字符串形式如下：
   ```ts
   const str: string = `这是一个模板字符串，当前时间：${new Date()}`
   ```
5. 可以用void表示一个没有返回值的函数类型；声明一个void类型的变量，它的值只能是undefined和null（只有--strictNullCheck为false才有效）
6. null和undefined是所有类型的子类型
7. any类型，允许赋值为任意类型，允许访问任意属性，允许调用任意方法，且返回的内容类型也是any类型；声明且没对变量赋值，若未指定类型，会被识别为any类型，但是不能调用该值没有的方法或属性
8. 类型推断：typescript会在无明确类型时按照类型推断规则推测出该值的类型
9. 联合类型union，使用`|`分隔类型`string | number`，其值可以是声明类型的某一种`string`或者`number`。当不能（用类型推断）确定联合类型的具体类型时，只能访问所有类型共有方法/属性。除非使用条件语句指定具体类型`if (typeof xxx === 'number') { xxx.toFixed() }`，才能访问特定类型的方法/属性
10. 接口interface可用于定义对象的类型，且对象的属性个数必须完全和接口的属性个数相同（不能增加、减少属性），除非：
    1.  接口属性是可选属性`name?:string;`（减少）。
    2.  若接口包括一个任意类型的属性`[propName: string]: string | number;`，则对象属性可以有无限多个（增加），此时接口中与任意类型属性的key`propName`同类型`string`的属性，必须是那个任意类型的子类型`string`或`number`
    ```ts
    interface Int {
      // 普通属性，这些都不会报错，因为任意类型的属性key：propName是一个number，所以不会进行匹配
      name: string;
      age: number;
      // 任意类型属性, propName可为其他值，一个指代符罢了，markdown会报错，先注释一下
      // [ propName: number ]: string;
      // 此时 1 会报错，因为 1 和任意类型的属性key: propName是同一个类型number。故1的类型，必须是string的子类型
      1: true
    }
    ```
11. 接口还能定义只读属性`readonly name:string;`，该属性只能在创建的时候被赋值，不能修改，若该属性还是可选的，则仅能在对象创建时赋值，其他地方不能操作
12. 数组类型的定义方式，如下：
    ```ts
    // 类型 + 方括号
    let a : (number| string)[] = [1, '2']
    // 数组泛型
    let b : Array<number | string> = [1, '2']
    // 接口
    let c : {
        [index: number]: string | number
    } = [1, '2']
    ```
13. 常用的类数组类型都有自己的接口定义，分别有`IArguments`, `NodeList`, `HTMLCollection`等，其中
    ```ts
    // IArguments的接口类型如下
    interface IArguments {
      // [index: number]: any;
      length: number;
      callee: Function;
    }
    ```
14. 函数
    1.  函数传入的参数必须是和定义时一致
    2.  函数的可选参数，必须在必须参数后面`(x: number, y?: number)`
    3.  函数参数的默认值`(x: number = 1, y: number)`，出现位置无特殊要求，但是，若不想传某些值，必须用`undefined`作为占位，这样就会跳过对应的值，后面的值就能够传过去了
    4.  函数定义中参数也可用剩余参数，必须在参数的最后一个`(x: number, ...y: any[])`，用于获取剩下的参数，其中y是一个数组
    5.  函数重载，允许一个函数接受不同数量或类型的参数，并进行不同的处理；ts会优先从最前面的函数定义开始匹配，若多个函数定义有包含关系，需要把精确的函数定义写在前面
    ```ts
    function reverse(x: number): number;
    function reverse(x: string): string;
    function reverse(x: number | string): number | string | void {
        if (typeof x === 'number') {
            return Number(x.toString().split('').reverse().join(''));
        } else if (typeof x === 'string') {
            return x.split('').reverse().join('');
        }
    }
    ```
    6.  函数的定义方式，如下：
    ```ts
    // 函数声明
    function sum (x: number, y: number): number {
      return x + y
    }
    // 函数表达式，左边的是函数的定义 (参数类型) => 返回值类型    
    let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
      return x + y
    }
    // 接口   
    interface MySum {
      // 和函数表达式类似，对等号左边的类型进行限制   
      (x: number, y: number): number;
    }
    let mySum: MySum = function (x: number, y: number): number {
      return x + y
    }
    ```
15. 类型断言：手动指定一个值的类型，就可以调用该类型的方法而不在编译时报错（但在运行时该报错还是会报错），语法`value as type`或`<type>value`
    1.  typescript类型之间的对比只会比较他们最终的结构，而忽略他们定义时的关系。
    2.  常用类型断言：
        1.  联合类型可以被断言为其中的一个类型
        2.  父类可以被断言为子类
        3.  任何类型都可以被断言为any
        4.  any可以被断言为任何类型
        5.  若想A能够被断言为B，只需A兼容B，或B兼容A；兼容指的是结构兼容。若A兼容B，那么A可以被断言为B，B也可以被断言为A，举例，因为子类结构兼容父类，所以子类可以被断言为父类，父类也可以被断言为子类
16. 类型声明：只能够将大的结构类型赋值给小的结构类型。比如只能将子类赋值给父类，反之不可。因为子类有父类所有方法/属性，能够被调用
17. 声明文件：当使用第三方库时，需引用对应的声明文件，才能获得对应的代码补全、接口提示等功能