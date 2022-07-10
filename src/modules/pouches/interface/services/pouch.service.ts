import { Inject, Service } from '@pv/di'
import { PouchesAdapter } from '@pv/modules/pouches/infra/pouches.adapter'
import { PouchStore } from '@pv/modules/pouches/interface/stores/pouch.store'
import { PouchId } from '@pv/core/entities/pouch.entity'
import { t } from '@pv/interface/services/i18n'
import { MessageBoxService } from '@pv/modules/message-box'

@Service()
export class PouchService {
  constructor(
    @Inject()
    private pouchesAdapter: PouchesAdapter,
    @Inject()
    private pouchStore: PouchStore,
    @Inject()
    private messageBoxService: MessageBoxService,
  ) {}

  async loadPouches() {
    this.pouchStore.setPouches([])
    const result = await this.pouchesAdapter.getPouches()

    if (result.isErr()) {
      // TODO: add error processing
      return
    }

    this.pouchStore.setPouches(result.getValue())
  }

  async addPouch() {
    const { isApplied, data } = await this.messageBoxService.prompt(t('pouchBlock.removeAsk'), '')
    if (!isApplied) return

    const result = await this.pouchesAdapter.addPouch(data)
    if (result.isErr()) return
    return result.getValue()
  }

  async removePouch(pouchId: PouchId) {
    if (!pouchId) return false
    const isConfirmed = await this.messageBoxService.confirm(t('pouchBlock.removeAsk'))
    if (!isConfirmed) return false
    const result = await this.pouchesAdapter.removePouch(pouchId)
    if (result.isErr()) return false
    return true
  }

  async selectPouch(pouchId: PouchId) {
    this.pouchStore.setCurrentPouch(pouchId)
  }
}
