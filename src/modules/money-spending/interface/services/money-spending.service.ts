import { Inject, Service } from '@pv/di'
import { MoneySpendingAdapter } from '@pv/modules/money-spending/infra/money-spending.adapter'
import { MoneySpendingStore } from '@pv/modules/money-spending/interface/stores/money-spending.store'
import { PouchesAdapter } from '@pv/modules/pouches'

const LIMIT_DEFAULT = 50

@Service()
export class MoneySpendingService {
  constructor(
    @Inject()
    private moneySpendingStore: MoneySpendingStore,
    @Inject()
    private moneySpendingAdapter: MoneySpendingAdapter,
    @Inject()
    private pouchesAdapter: PouchesAdapter,
  ) {}

  async initialLoadData() {
    this.moneySpendingStore.setExpenses([])

    const [categoriesResult, pouchesResult] = await Promise.all([
      this.moneySpendingAdapter.getCategories(),
      this.pouchesAdapter.getPouches(),
    ])

    if (categoriesResult.isErr()) {
      // TODO: add error processing
      return
    }
    if (pouchesResult.isErr()) {
      // TODO: add error processing
      return
    }
    this.moneySpendingStore.setPouches(pouchesResult.getValue())
    this.moneySpendingStore.setCategories(categoriesResult.getValue())

    await this.loadExpenses(0)
  }

  async loadExpenses(offset: number) {
    const currentPouchId = this.moneySpendingStore.currentPouch?.id

    const result = await this.moneySpendingAdapter.getExpenses({
      offset,
      pouchId: currentPouchId,
      limit: LIMIT_DEFAULT,
    })

    if (result.isErr()) {
      // TODO: add error
      return
    }

    this.moneySpendingStore.setOffset(offset + LIMIT_DEFAULT)
    const nextExpenses = result.getValue()
    this.moneySpendingStore.addExpenses(nextExpenses)
  }
}
