import { View } from '@tarojs/components'
import React from 'react'
import '@/style/Tree.scss'
import TreeNode from './TreeNode'
import { TreeContextProps, TreeProps } from './type'

export const TreeContext = React.createContext<TreeContextProps>({})
const Tree = (props: TreeProps) => {
  const { treeData, checkable, defaultExpandAll, checkedKeys, onCheck } = props

  const [checkedKeysState, setCheckedKeysState] = React.useState<React.Key[]>([])
  const handleCheck = (data) => {
    // 单独存一个内部组件选中的状态，用于判断父子节点的联动关系
    const { key, checked } = data
    setCheckedKeysState((prev) => {
      return checked ? (!prev.includes(key) ? [...prev, key] : prev) : prev.filter((k) => k !== key)
    })
    onCheck && onCheck(data)
  }

  return (
    <View className='w-full'>
      {treeData.map((item) => (
        <TreeContext.Provider key={item.key} value={{ checkable, defaultExpandAll, checkedKeys, checkedKeysState }}>
          <TreeNode data={item} level={0} onCheck={handleCheck} />
        </TreeContext.Provider>
      ))}
    </View>
  )
}

export default Tree
