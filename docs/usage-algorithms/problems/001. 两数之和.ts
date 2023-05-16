/**
    给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 **和为目标值** _`target`_  的那 **两个** 整数，并返回它们的数组下标。

    你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

    你可以按任意顺序返回答案。

    **示例 1：**

    ```
    输入：nums = [2,7,11,15], target = 9
    输出：[0,1]
    解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。

    ```

    **示例 2：**

    ```
    输入：nums = [3,2,4], target = 6
    输出：[1,2]

    ```

    **示例 3：**

    ```
    输入：nums = [3,3], target = 6
    输出：[0,1]

    ```

    **提示：**

    -   `2 <= nums.length <= 10<sup>4</sup>`
    -   `-10<sup>9</sup> <= nums[i] <= 10<sup>9</sup>`
    -   `-10<sup>9</sup> <= target <= 10<sup>9</sup>`
    -   **只会存在一个有效答案**
 */

// 使用暴力解法：for/forEach+for/forEach/(indexOf+includes+shift)
function twoSum (nums: number[], target: number): number[] {
  const len: number = nums.length
  if (len > 1) {
    for (let i = 0; i < len - 1; i++) {
      for (let j = i + 1; j < len; j++) {
        if (nums[i] + nums[j] === target) {
          return [i, j]
        }
      }
    }
  }
  return []
}

function twoSum1 (nums: number[], target: number): number[] {
  return (function (): number[] {
    for (let i = 0, len = nums.length; i < len - 1; i++) {
      if (len < 2) return []
      const diff = target - nums[i]
      if (nums.includes(diff, i + 1)) {
        // arr.of(...nums): 根据参数创建一个新的数组
        // arr.indexOf(search, fromIndex)：从fromIndex开始查找search
        return Array.of(i, nums.indexOf(diff, i + 1))
      }
    }
    return []
  })()
}

// 使用map结合for/forEach/数组方法
function twoSum2 (nums: number[], target: number): number[] {
  const map: Map<number, any> = new Map()

  return nums.map((num, index) => {
    if (map.has(target - num)) {
      return [map.get(target - num), index]
    }
    map.set(num, index)
  }).filter(n => n !== undefined).flat()
}

function twoSum3 (nums: number[], target: number): number[] {
  const map: Map<number, any> = new Map()

  for (let i = 0, length = nums.length; i < length; i++) {
    const diff = target - nums[i]
    if (map.has(diff)) {
      return [map.get(diff), i]
    }
    map.set(nums[i], i)
  }
  return []
}