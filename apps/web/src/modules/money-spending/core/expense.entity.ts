import type { PouchId } from '@pv/pouches/core/pouch.entity'

export type ExpenseEntity = {
  id: string
  catId: string
  cost: number
  dateBegin?: number
  dateEnd?: number
  desc?: string
  pouchId: PouchId
  time: number
  state: number
}
