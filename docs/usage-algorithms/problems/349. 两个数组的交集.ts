/**
 * 
  给定两个数组 `nums1` 和 `nums2` ，返回 _它们的交集_ 。输出结果中的每个元素一定是 **唯一** 的。我们可以 **不考虑输出结果的顺序** 。

  **示例 1：**

  ```
  输入：nums1 = [1,2,2,1], nums2 = [2,2]
  输出：[2]

  ```

  **示例 2：**

  ```
  输入：nums1 = [4,9,5], nums2 = [9,4,9,8,4]
  输出：[9,4]
  解释：[4,9] 也是可通过的

  ```

  **提示：**

  -   `1 <= nums1.length, nums2.length <= 1000`
  -   `0 <= nums1[i], nums2[i] <= 1000`
 */

// 解题思路：创建一个set存储一个数组的值，然后遍历另一个数组，判断是否在set中
function intersection (nums1: number[], nums2: number[]): number[] {
  if (nums1 < nums2) {
    const middle = nums1
    nums1 = nums2
    nums2 = middle
  }

  const nums1Set: Set<number> = new Set(nums1)
  const resultSet: Set<number> = new Set()

  for (let i = 0, length = nums2.length; i < length; i++) {
    if (nums1Set.has(nums2[i])) {
      resultSet.add(nums2[i])
    }
  }

  return Array.from(resultSet)
}

// 第二种方法
function intersection2 (nums1: number[], nums2: number[]): number[] {
  return Array.from(new Set(nums1.filter(num => nums2.includes(num))))
}