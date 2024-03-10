import './export-csv.langs'

import { t } from '@pv/interface/services/i18n'
import { ExpenseViewListService } from '@pv/modules/view-list'

import { Inject, Service } from '@repo/service'

import type { ExpenseViewEntity } from '@pv/modules/money-spending/core/expense-view.entity'
import type { ImportDataValueObject } from '@pv/modules/settings/core/value-object/import-data.value-object'

type PouchSheetItem = {
  id: string | null
  name: string
  rows: ExpenseViewEntity[]
}

const SEPARATOR = '\t'

@Service()
export class SheetsService {
  constructor(
    private expenseViewListService= Inject(ExpenseViewListService),
  ) {}

  private static getFullNum(num: number) {
    return num < 10 ? `0${num}` : num
  }

  private getPouchesSheetsMap(data: ImportDataValueObject) {
    const pouchMap: Record<string, PouchSheetItem> = {
      null: {
        id: null,
        name: t('export.pouchMain'),
        rows: [],
      },
    }
    data.pouch.forEach((item) => {
      if (!item.id) return
      pouchMap[item.id] = {
        id: item.id,
        name: item.name,
        rows: [],
      }
    })

    const expenseViewList = this.expenseViewListService.mapExpenseToExpenseViewEntityList(
      data.expense,
      data.category,
    )
    expenseViewList.forEach((item) => {
      const pouchId = item.pouchId
      const list = pouchId ? pouchMap[pouchId] : null
      if (list) {
        list.rows.push(item)
      } else {
        // doh
      }
    })
    return pouchMap
  }

  private getExpenseRows(rows: ExpenseViewEntity[]) {
    return rows.map((item) => {
      const cost = item.cost
      const realCost = item.cost / 100
      const mainCost = Math.floor(realCost)
      const subCost = `${cost - mainCost * 100}`

      const titleCost = `${mainCost},${subCost}`
      const time = new Date(item.time)
      const month = SheetsService.getFullNum(time.getMonth() + 1)
      const day = SheetsService.getFullNum(time.getDate())
      const mins = SheetsService.getFullNum(time.getMinutes())
      const secs = SheetsService.getFullNum(time.getSeconds())

      const timeVal = `${time.getFullYear()}-${month}-${day} ${time.getHours()}:${mins}:${secs},000`
      // yyyy-MM-dd hh:mm:ss.000
      const row = [item.catParentTitle, item.catTitle, timeVal, item.desc, titleCost]
      return row.join(SEPARATOR)
    })
  }

  getSheets(data: ImportDataValueObject): Array<{ sheet: string; name: string }> {
    const pouchesSheetMap = this.getPouchesSheetsMap(data)
    const sheets = []

    for (const key in pouchesSheetMap) {
      const pouch = pouchesSheetMap[key]
      const name = pouch.name
      const pouchRow = this.getExpenseRows(pouch.rows)
      const firstRow = [
        t('export.headers.rootCat'),
        t('export.headers.cat'),
        t('export.headers.date'),
        t('export.headers.desc'),
        t('export.headers.cost'),
      ].join(SEPARATOR)
      pouchRow.push(firstRow)
      pouchRow.reverse()

      sheets.push({
        name,
        sheet: pouchRow.join('\n'),
      })
    }

    return sheets
  }
}
