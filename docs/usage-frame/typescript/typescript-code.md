# typescript奇怪的代码

```typescript
// 1：赋值
interface StringValidator {
  isAcceptable (s: string): boolean;
}

class LettersOnlyValidator implements StringValidator {
  isAcceptable (s: string) {
    return /^[0-9]+$/.test(s)
  }
}

let validators: { [s: string]: StringValidator } = {}
validators['letters only'] = new LettersOnlyValidator()

for (let name in validators) {
  let isMatch = validators[name].isAcceptable('23456')
}

// 2. 泛型套娃
type OrNull<T> = T | null
type OneOrMany<T> = T | T[]
// 右侧类似于OrNull<T | T[]>，即T | T[] | null
type OneOrManyOrNull<T> = OrNull<OneOrMany<T>>

```