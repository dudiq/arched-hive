import { guid } from '@pv/app/interface/guid'
import { PouchesErrors } from '@pv/pouches/core/errors/pouches.errors'

import { isErr, resultErr, resultOk } from '@repo/result'
import { AdapterService, Inject } from '@repo/service'

import { PouchesDataProvider } from './pouches.data-provider'

import type { PouchEntity } from '@pv/pouches/core/pouch.entity'

export const PouchesAdapter = AdapterService(
  class PouchesAdapter {
    constructor(private pouchesDataProvider = Inject(PouchesDataProvider)) {}

    async getPouches() {
      const result = await this.pouchesDataProvider.getPouches()
      if (isErr(result))
        return resultErr(new PouchesErrors.GetPouchesResponse(result.error))
      return resultOk(result.data)
    }

    async addPouch(title: string) {
      const pouch: PouchEntity = {
        id: guid(),
        name: title,
      }
      const result = await this.pouchesDataProvider.addPouch(pouch)
      if (isErr(result))
        return resultErr(new PouchesErrors.AddPouchResponse(result.error))
      return resultOk(result.data)
    }

    async removePouch(pouchId: string) {
      const result = await this.pouchesDataProvider.removePouch(pouchId)
      if (isErr(result))
        return resultErr(new PouchesErrors.RemovePouchResponse(result.error))
      return resultOk(result.data)
    }
  },
)
