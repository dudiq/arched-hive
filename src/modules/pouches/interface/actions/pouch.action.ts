import { Action, Inject } from '@pv/di'
import { PouchId } from '@pv/core/entities/pouch.entity'
import { MoneySpendingService } from '@pv/modules/money-spending/interface/services/money-spending.service'
import { MoneySpendingStore } from '@pv/modules/money-spending/interface/stores/money-spending.store'
import { PouchStore } from '../stores/pouch.store'
import { PouchService } from '../services/pouch.service'

@Action()
export class PouchAction {
  constructor(
    @Inject()
    private pouchStore: PouchStore,
    @Inject()
    private pouchService: PouchService,
    @Inject()
    private moneySpendingService: MoneySpendingService,
    @Inject()
    private moneySpendingStore: MoneySpendingStore,
  ) {}

  handleOpenPouchesList() {
    this.pouchStore.setModalVisible(true)
  }

  handleClosePouchesList() {
    this.pouchStore.setModalVisible(false)
  }

  async handleRemove(pouchId: PouchId) {
    const isSame = pouchId === this.pouchStore.currentPouchId
    const isRemoved = await this.pouchService.removePouch(pouchId)
    if (!isRemoved) return

    this.moneySpendingStore.setIsLoading(true)
    await this.pouchService.loadPouches()
    this.moneySpendingStore.setIsLoading(false)

    if (isSame) {
      await this.handleSelect(null)
    }
  }

  async handleAdd() {
    const newPouchId = await this.pouchService.addPouch()
    if (!newPouchId) return

    this.moneySpendingStore.setIsLoading(true)
    await this.pouchService.loadPouches()
    await this.handleSelect(newPouchId)
    this.moneySpendingStore.setIsLoading(false)
  }

  async handleSelect(pouchId: PouchId) {
    this.moneySpendingStore.setIsLoading(true)
    await this.pouchService.selectPouch(pouchId)
    await this.moneySpendingService.reloadExpenses()
    this.moneySpendingStore.setIsLoading(false)
  }
}
