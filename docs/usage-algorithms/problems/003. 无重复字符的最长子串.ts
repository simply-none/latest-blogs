/**
    给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长子串** 的长度。

    **示例 1:**

    ```
    输入: s = "abcabcbb"
    输出: 3 
    解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。

    ```

    **示例 2:**

    ```
    输入: s = "bbbbb"
    输出: 1
    解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。

    ```

    **示例 3:**

    ```
    输入: s = "pwwkew"
    输出: 3
    解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
         请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。

    ```

    **提示：**

    -   `0 <= s.length <= 5 * 10<sup>4</sup>`
    -   `s` 由英文字母、数字、符号和空格组成
 */

// 
function lengthOfLongestSubstring (s: string): number {
  if (s === '') {
    return 0
  }

  let res = 1
  let left = 0
  let right = 1

  for (let i = 1; i < s.length; i++) {
    for (let j = left; j < right; j++) {
      if (s[i] === s[j]) {
        left = j + 1
        break
      }
    }
    right++
    res = Math.max(right - left, res)
  }
  return res
}

function lengthOfLongestSubstring1 (s: string): number {
  let res = 0
  let char = ''

  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    const index = char.indexOf(c)

    if (index > -1) {
      res = Math.max(char.length, res)
      char = char.substring(index + 1)
    }
    char += c
  }
  return Math.max(res, char.length)
}

function lengthOfLongestSubstring2 (s: string): number {
  let left = 0
  let right = 0
  let res = 0
  const map: Map<string, number> = new Map()

  while (right < s.length) {
    const c = s[right]
    if (map.has(c)) {
      left = Math.max(left, map.get(c)! + 1)
    }
    map.set(c, right)
    res = Math.max(res, right - left + 1)
    right++
  }
  return res
}
