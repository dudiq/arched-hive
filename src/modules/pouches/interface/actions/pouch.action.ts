import { Action, Inject } from '@pv/di'
import { PouchStore } from '../stores/pouch.store'
// import { PouchService } from '../services/pouch.service'

@Action()
export class PouchAction {
  constructor(
    @Inject()
    private pouchStore: PouchStore, // @Inject()
  ) // private pouchService: PouchService,
  {}

  handleOpenPouchesList() {
    this.pouchStore.setModalVisible(true)
  }

  handleClosePouchesList() {
    this.pouchStore.setModalVisible(false)
  }
}
