import { PouchId } from '@pv/core/entities/pouch.entity'

export type ExpenseViewEntity = {
  id: string
  catId: string
  cost: number
  pouchId: PouchId
  time: number
  state: number
  catTitle: string
  catParentTitle: string
  catParentId?: string
  dateBegin?: number
  dateEnd?: number
  desc?: string
}
