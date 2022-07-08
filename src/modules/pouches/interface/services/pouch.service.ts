import { Inject, Service } from '@pv/di'
import { PouchesAdapter } from '@pv/modules/pouches/infra/pouches.adapter'
import { PouchStore } from '@pv/modules/pouches/interface/stores/pouch.store'

@Service()
export class PouchService {
  constructor(
    @Inject()
    private pouchesAdapter: PouchesAdapter,
    @Inject()
    private pouchStore: PouchStore,
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
}
