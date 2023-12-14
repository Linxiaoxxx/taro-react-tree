export type OnCheckFun = (data: { key: React.Key; checked: boolean; level?: number }) => void

export interface TreeProps {
  checkable?: boolean
  treeData: any[]
  defaultExpandAll?: boolean
  checkedKeys?: React.Key[]
  onCheck?: OnCheckFun
}

export interface TreeContextProps {
  checkable?: boolean
  defaultExpandAll?: boolean
  checkedKeys?: React.Key[]
  checkedKeysState?: React.Key[]
  onChildCheck?: OnCheckFun
}

export interface TreeNodeItem {
  title: string
  key: React.Key
  disabled?: boolean
  children?: TreeNodeItem[]
}

export interface TreeNodeProps {
  data: any
  level: number
  onCheck: OnCheckFun
}
