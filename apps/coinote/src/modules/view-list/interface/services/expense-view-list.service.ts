import { Service } from '@repo/service'

import type { CategoryEntity } from '@pv/modules/categories/core/category.entity'
import type { ExpenseEntity } from '@pv/modules/money-spending/core/expense.entity'
import type { ExpenseViewEntity } from '@pv/modules/money-spending/core/expense-view.entity'

@Service()
export class ExpenseViewListService {
  mapExpenseToExpenseViewEntityList(
    expenseList: ExpenseEntity[],
    categoryList: CategoryEntity[],
  ): ExpenseViewEntity[] {
    const categoryMap: Record<string, CategoryEntity> = {}

    categoryList.forEach((item) => {
      categoryMap[item.id] = item
    })

    return expenseList.map((expenseItem) => {
      const catId = expenseItem.catId
      const cat = categoryMap[catId]
      const parentCat = cat?.catId ? categoryMap[cat.catId] : null
      return {
        id: expenseItem.id,
        catId: expenseItem.catId,
        cost: expenseItem.cost,
        pouchId: expenseItem.pouchId,
        time: expenseItem.time,
        state: expenseItem.state,
        dateBegin: expenseItem.dateBegin,
        dateEnd: expenseItem.dateEnd,
        desc: expenseItem.desc,
        catParentTitle: parentCat ? parentCat.title : '',
        catParentId: parentCat?.id,
        catTitle: cat ? cat.title : '',
      }
    })
  }
}
