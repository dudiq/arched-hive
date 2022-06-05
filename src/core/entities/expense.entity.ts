export type ExpenseEntity = {
  id: string
  catId: string
  cost: number
  dateBegin?: number
  dateEnd?: number
  desc?: string
  pouchId: string
  time: number
  state: number
}
