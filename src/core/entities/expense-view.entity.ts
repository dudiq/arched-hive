export type ExpenseViewEntity = {
  id: string
  catId: string
  cost: number
  pouchId: string
  time: number
  state: number
  catTitle: string
  catParentTitle: string
  catParentId?: string
  dateBegin?: number
  dateEnd?: number
  desc?: string
}
