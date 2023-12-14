import { View, Text, Image } from '@tarojs/components'
import { useContext, useEffect, useState } from 'react'
import '@/style/Tree.scss'
import { TreeContext } from './index'
import { OnCheckFun, TreeNodeItem, TreeNodeProps } from './type'

const TreeNode = (props: TreeNodeProps) => {
  const { data, level, onCheck } = props

  // 缩进单位
  const indentArr = Array.from({ length: level }, (_, i) => i + 1)
  const { checkable, checkedKeys, checkedKeysState, defaultExpandAll } = useContext(TreeContext)
  const [isOpen, setIsOpen] = useState(defaultExpandAll)
  const [isChecked, setIsChecked] = useState(checkedKeys?.includes(data.key) ?? false)
  const [childCheckedKeys, setChildCheckedKeys] = useState<React.Key[]>([])

  const handleChange = (e: any, checked: boolean) => {
    e.stopPropagation()
    setIsChecked(checked)
    // 通知祖先组件
    onCheck({ key: data.key, checked: checked, level })
    // 父节点全选或全不选中，更新子节点选中状态
    updateChildNodes(data.children, checked, level + 1)
  }

  const updateChildNodes = (children: TreeNodeItem[] | undefined, checked: boolean, childLevel: number) => {
    if (children) {
      const childCheckedKeysArr: React.Key[] = []
      children.forEach((child) => {
        onCheck({ key: child.key, checked, level: childLevel })
        checked && childCheckedKeysArr.push(child.key)
        if (child.children) {
          // 递归子节点选中状态
          updateChildNodes(child.children, checked, childLevel + 1)
        }
      })
      setChildCheckedKeys(childCheckedKeysArr)
    }
  }

  const handleChildCheck: OnCheckFun = (checkData) => {
    // 监听子节点选中
    const { key: childKey, checked: childChecked, level: childLevel } = checkData
    onCheck(checkData)
    if (childLevel && childLevel - 1 === level) {
      // 避免跨层级判断
      const cloneChildCheck = childChecked
        ? !childCheckedKeys.includes(childKey)
          ? [...childCheckedKeys, childKey]
          : childCheckedKeys
        : childCheckedKeys.filter((k) => k !== childKey)
      setChildCheckedKeys(cloneChildCheck)
      if (cloneChildCheck.length === data.children?.length) {
        setIsChecked(true)
        onCheck({ key: data.key, checked: true, level })
      } else if (cloneChildCheck.length === 0) {
        setIsChecked(false)
        onCheck({ key: data.key, checked: false, level })
      } else {
        setIsChecked(false)
        onCheck({ key: data.key, checked: false, level })
      }
    }
  }

  const getCheckboxClass = () => {
    // 是否半选中状态
    const isHalf = data.children && data.children.length > 0 && childCheckedKeys.length > 0 && childCheckedKeys.length < data.children.length
    // 是否禁用
    const isDisabled = data.disabled || false
    return `tree-checkbox ${isChecked ? 'checked' : isHalf ? 'half' : ''} ${isDisabled ? 'disabled' : ''}`
  }

  // 监听选中数据
  useEffect(() => {
    setIsChecked(checkedKeys?.includes(data.key) || checkedKeysState?.includes(data.key) || false)
  }, [checkedKeys, checkedKeysState])

  return (
    <>
      <View key={data.key} className='treenode' onClick={() => setIsOpen(!isOpen)}>
        <View className='tree-indent'>
          {indentArr.map((item) => (
            <Text key={item} className='tree-indent-unit'></Text>
          ))}
        </View>
        <View className='tree-switcher'>
          {data.children &&
            data.children.length > 0 &&
            (isOpen ? (
              <Image src={require('@/assets/images/arrow-down.png')} className='tree-switcher-icon' />
            ) : (
              <Image src={require('@/assets/images/arrow-right.png')} className='tree-switcher-icon' />
            ))}
        </View>
        <View className='tree-title'>
          {checkable && (
            <View className={getCheckboxClass()} onClick={(e) => handleChange(e, !isChecked)}>
              {/* <CheckboxGroup onChange={handleChange}>
                <Checkbox value={data.key} checked={isChecked} disabled={data.disabled ?? false} className='tree-checkbox' onClick={(e) => e.stopPropagation()} />
              </CheckboxGroup> */}
            </View>
          )}
          {data.title}
        </View>
      </View>
      {data.children && data.children.length > 0 && isOpen && (
        <View className='tree-children'>
          {data.children.map((child: any) => (
            <TreeNode key={child.key} data={child} level={level + 1} onCheck={handleChildCheck} />
          ))}
        </View>
      )}
    </>
  )
}

export default TreeNode
