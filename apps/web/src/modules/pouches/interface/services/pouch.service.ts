import { t } from '@pv/i18n'
import { MessageBoxService } from '@pv/message-box'
import { PouchesAdapter } from '@pv/pouches/infra/pouches.adapter'
import { PouchStore } from '@pv/pouches/interface/stores/pouch.store'

import { isErr } from '@repo/result'
import { Inject, Service } from '@repo/service'

import type { PouchId } from '@pv/pouches/core/pouch.entity'

@Service()
export class PouchService {
  constructor(
    private pouchesAdapter= Inject(PouchesAdapter),
    private pouchStore= Inject(PouchStore),
    private messageBoxService= Inject(MessageBoxService),
  ) {}

  async loadPouches() {
    this.pouchStore.setPouches([])
    const result = await this.pouchesAdapter.getPouches()

    if (isErr(result)) {
      // TODO: add error processing
      return
    }

    this.pouchStore.setPouches(result.data)
  }

  async addPouch() {
    const { isApplied, data } = await this.messageBoxService.prompt(t('pouchBlock.removeAsk'), '')
    if (!isApplied) return

    const result = await this.pouchesAdapter.addPouch(data)
    if (isErr(result)) return
    return result.data
  }

  async removePouch(pouchId: PouchId) {
    if (!pouchId) return false
    const isConfirmed = await this.messageBoxService.confirm(t('pouchBlock.removeAsk'))
    if (!isConfirmed) return false
    const result = await this.pouchesAdapter.removePouch(pouchId)
    if (isErr(result)) return false
    return true
  }

  async selectPouch(pouchId: PouchId) {
    this.pouchStore.setCurrentPouch(pouchId)
  }
}
