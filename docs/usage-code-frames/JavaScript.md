# JavaScript 代码片段

## 扁平数组转树结构

```javascript
// 过滤对象数组中的重复项
function filterSameItemInObjArr (objArr = []) {
  return objArr.reduce((pre, cur) => {
    const alreadyAdd = pre.find(p => p.id === cur.id)
    if (!alreadyAdd) {
      pre.push(cur)
    }
    return pre
  }, [])
}

function list2tree({ data, children = 'children' }) {
  const root = { depth: -1, [children]: [] }
  const nodeMap = {}
  data.forEach(current => {
    const { id } = current
    nodeMap[current.id] = {
      ...current
    }
  })
  data.forEach(current => {
    const { id, pid } = current
    const parent = nodeMap[pid] ?? root
    const node = { ...current, depth: parent.depth + 1 }
    console.log(parent, parent.depth, 'depth')

    // 判断之前是否有该id
    if (nodeMap[id]) {
      const originChildren = nodeMap[id].children || []
      const currentChildren = current.children || []
      const currentConcatChildren = currentChildren.concat(originChildren)

      // 去除重复的children item
      const currentFilterChildren = filterSameItemInObjArr(currentConcatChildren)

      nodeMap[id] = {
        ...node,
        children: currentFilterChildren
      }
    } else {
      nodeMap[id] = node
    }
    parent.children ??= []
    const findChild = parent.children.find(child => child.id === id)
    if (!findChild) {
      parent.children.push(nodeMap[id])
    }
  })
  return root
}

```