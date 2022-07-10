import { Action, Inject } from '@pv/di'
import { PouchId } from '@pv/core/entities/pouch.entity'
import { MoneySpendingService } from '@pv/modules/money-spending/interface/services/money-spending.service'
import { PouchStore } from '../stores/pouch.store'
// import { PouchService } from '../services/pouch.service'

@Action()
export class PouchAction {
  constructor(
    @Inject()
    private pouchStore: PouchStore, // @Inject() // private pouchService: PouchService,
    @Inject()
    private moneySpendingService: MoneySpendingService,
  ) {}

  handleOpenPouchesList() {
    this.pouchStore.setModalVisible(true)
  }

  handleClosePouchesList() {
    this.pouchStore.setModalVisible(false)
  }

  handleRemove(pouchId: PouchId) {
    // eslint-disable-next-line
    console.log('pouchId', pouchId)
  }

  handleSelect(pouchId: PouchId) {
    this.pouchStore.setCurrentPouch(pouchId)
    this.moneySpendingService.reloadExpenses()
  }
}
