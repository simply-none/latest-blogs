/**
 * 
    给定两个字符串 `_s_` 和 `_t_` ，编写一个函数来判断 `_t_` 是否是 `_s_` 的字母异位词。

    **注意：**若 `_s_` 和 `_t_` 中每个字符出现的次数都相同，则称 `_s_` 和 `_t_` 互为字母异位词。

    **示例 1:**

    ```
    输入: s = "anagram", t = "nagaram"
    输出: true

    ```

    **示例 2:**

    ```
    输入: s = "rat", t = "car"
    输出: false
    ```

    **提示:**

    -   `1 <= s.length, t.length <= 5 * 10<sup>4</sup>`
    -   `s` 和 `t` 仅包含小写字母
 */

// 题解：定义一个26字母的数组，和a的基准点code，通过与a相对的值存为索引，s索引+,t索引-，最后判断数组中是否每个值都是0，为0则是字母异位词
function isAnagram (s: string, t: string): boolean {
  if (s.length !== t.length) {
    return false
  }
  const codeArr = new Array(26).fill(0)
  const startCharCode = 'a'.charCodeAt(0)

  for (let i = 0, length = s.length; i < length; i++) {
    codeArr[s.charCodeAt(i) - startCharCode]++
    codeArr[t.charCodeAt(i) - startCharCode]--
  }
  return codeArr.every(code => code === 0)
}