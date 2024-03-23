import { Action, Inject } from '@repo/service'

import { PouchService } from '../services/pouch.service'
import { PouchStore } from '../stores/pouch.store'

import type { PouchId } from '@pv/pouches/core/pouch.entity'

@Action()
export class PouchAction {
  constructor(
    private pouchStore = Inject(PouchStore),
    private pouchService = Inject(PouchService),
  ) {}

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
