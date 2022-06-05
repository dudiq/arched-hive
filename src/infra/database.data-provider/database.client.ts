import Dexie, { Table } from 'dexie'
import { PouchEntity } from '@pv/core/entities/pouch.entity'
import { CategoryEntity } from '@pv/core/entities/category.entity'
import { ExpenseEntity } from '@pv/core/entities/expense.entity'

export class FinansoDb extends Dexie {
  public pouch!: Table<PouchEntity, string>
  public category!: Table<CategoryEntity, string>
  public expense!: Table<ExpenseEntity, string>

  public constructor() {
    super('finansoDb')
    this.version(1).stores({
      pouch: '&id,dateBegin,dateEnd,desc,name',
      category: 'id,catId,title,dateBegin,dateEnd',
      expense: '&id,catId,cost,dateBegin,dateEnd,desc,pouchId,state,time',
    })
  }
}

export const databaseClient = new FinansoDb()
