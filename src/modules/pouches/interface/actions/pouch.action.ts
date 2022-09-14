import { Action, Inject } from '@pv/di'
import { PouchId } from '@pv/core/entities/pouch.entity'
import { PouchStore } from '../stores/pouch.store'
import { PouchService } from '../services/pouch.service'

@Action()
export class PouchAction {
  constructor(
    @Inject()
    private pouchStore: PouchStore,
    @Inject()
    private pouchService: PouchService,
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

    await this.pouchService.loadPouches()

    if (isSame) {
      await this.handleSelect(null)
    }
  }

  async handleAdd() {
    const newPouchId = await this.pouchService.addPouch()
    if (!newPouchId) return

    await this.pouchService.loadPouches()
    await this.handleSelect(newPouchId)
  }

  async handleSelect(pouchId: PouchId) {
    await this.pouchService.selectPouch(pouchId)
  }
}
