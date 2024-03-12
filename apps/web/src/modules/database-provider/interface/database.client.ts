import Dexie from 'dexie'

import type { CategoryEntity } from '@pv/categories/core/category.entity'
import type { ExpenseEntity } from '@pv/money-spending/core/expense.entity'
import type { PouchEntity } from '@pv/pouches/core/pouch.entity'
import type { Table } from 'dexie';

const DB_NAME = 'finansoDb'

export class FinansoDb extends Dexie {
  public pouch!: Table<PouchEntity, string>
  public category!: Table<CategoryEntity, string>
  public expense!: Table<ExpenseEntity, string>

  private static _instance: FinansoDb

  static instance() {
    if (!FinansoDb._instance) FinansoDb._instance = new FinansoDb();
    return FinansoDb._instance;
  }

  public constructor() {
    super(DB_NAME)
    this.version(1).stores({
      pouch: '&id,dateBegin,dateEnd,desc,name',
      category: 'id,catId,title,dateBegin,dateEnd',
      expense: '&id,catId,cost,dateBegin,dateEnd,desc,pouchId,state,time',
    })
  }
}
