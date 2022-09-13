import { Service } from '@pv/di'
import { ExpenseEntity } from '@pv/core/entities/expense.entity'
import { CategoryEntity } from '@pv/core/entities/category.entity'
import { ExpenseViewEntity } from '@pv/core/entities/expense-view.entity'

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
      const parentCat = cat && cat.catId ? categoryMap[cat.catId] : null
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
