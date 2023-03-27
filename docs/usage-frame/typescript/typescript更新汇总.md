# TypeScript 更新汇总

## TS4.9

1. `satisfies`（使满足）运算符：验证表达式是否匹配某种类型，但是不会改变表达式自身的类型，重在验证
2. `in`运算符：该版本能够细化并未列出其属性的对象类型，语法为`propertyName in obj`，即表明了obj是对象类型后，使用in运算符后，即使propertyName并未先在obj中列出来，也能够使用propertyName，不会报错
3. 引入类中的自动存取器功能：自动存取器声明如同定义一个类的属性，只不过是需要使用accessor关键字
4. typescript中若直接使用相等操作符与NaN进行比较会直接报错，同时提示用`Number.isNaN`代替
5. 监视文件功能（即watch）使用文件系统事件（只对某些文件变动进行处理）代替原先的轮询（轮询所有的，定期检查），该功能是可配置的

<!-- tabs:start -->

<!-- tab:satisfies运算符 -->
```typescript
type Colors = 'red' | 'green' | 'blue'
type RGB = [red: number, green: number, blue: number]

const palette = {
  red: [255, 0, 0],
  green: '00ff00',
  // 此处会捕获错误
  bleu: [0, 0, 255]
  // 此处验证该对象是否满足一种类型（即键名是Colors类型，键值是string | RGB类型的对象）
} satisfies Record<Colors, string | RGB>

// 在编译目标不满足ecmascript对应版本时，at是不能使用的，需要改编译目标版本，比如es2015，esnext等
const redComponent = palette.red.at(0)
```

<!-- tab:自动存取器 -->
```typescript
class Person {
  // 声明自动存取器
  accessor name: string;
  // 等同于
  #__name: string
  get name () {
    return this.#__name
  }
  set name (value: string) {
    this.#__name = name
  }

  // 构造函数
  constructor (name: string) {
    this.name = name
  }
}
```
<!-- tabs:end -->