# 阅读文档时的一些记录

## 类

## 装饰器

类装饰器重载构造函数时
应用于类的构造函数，其参数为constructor，
当重载时，返回一个类，继承自constructor，会影响实例化时（new）的返回结果


## 声明合并

声明分类：命名空间、类型、值

接口合并，后者优先级更高（展示顺序居前，若函数成员参数签名有单一的字符串字面量类型时，会提升至最前面）。相同的非函数成员须有相同类型，否则报错；同名函数成员会成为函数的重载。

## 泛型

根据类型创建类型：type，keyof，typeof，条件类型，索引访问类型，

条件类型：结合泛型使用，可避免过多的函数重载操作

```typescript
// 条件类型
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel

function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw ''
}
```