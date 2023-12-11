import Tree from '@/components/Tree'
import { View } from '@tarojs/components'
import { useState } from 'react'

const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-1',
        key: '0-0-1',
        disabled: true,
        children: [
          {
            title: '0-0-1-1',
            key: '0-0-1-1'
          },
          {
            title: '0-0-1-2',
            key: '0-0-1-2'
          }
        ]
      },
      {
        title: '0-0-2',
        key: '0-0-2',
        children: [{ title: '0-0-2-1', key: '0-0-2-1' }]
      }
    ]
  },
  {
    title: '0-1',
    key: '0-1'
  }
]

const TreeDemo = () => {
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])

  const handleCheck = (data) => {
    const { key, checked } = data
    setCheckedKeys((prev) => {
      return checked ? (!prev.includes(key) ? [...prev, key] : prev) : prev.filter((k) => k !== key)
    })
  }

  return (
    <View className='p-4'>
      <View className='mb-4'>已选择：{checkedKeys.join(',')}</View>
      <Tree treeData={treeData} checkable checkedKeys={checkedKeys} defaultExpandAll onCheck={handleCheck} />
    </View>
  )
}

export default TreeDemo

