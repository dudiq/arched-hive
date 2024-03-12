import {guid} from '@pv/modules/app/interface/guid'
import {PouchesErrors} from '@pv/modules/pouches/core/errors/pouches.errors'

import {isErr, resultErr, resultOk} from '@repo/result'
import {Adapter, Inject} from '@repo/service'

import {PouchesDataProvider} from './pouches.data-provider'

import type {PouchEntity} from '@pv/modules/pouches/core/pouch.entity'

export class PouchesAdapter {
  constructor(
    private pouchesDataProvider = Inject(PouchesDataProvider),
  ) {
  }

  getPouches = Adapter(async () => {
    const result = await this.pouchesDataProvider.getPouches()
    if (isErr(result)) return resultErr(new PouchesErrors.GetPouchesResponse(result.error))
    return resultOk(result.data)
  })

  addPouch = Adapter(async (title: string) => {
    const pouch: PouchEntity = {
      id: guid(),
      name: title,
    }
    const result = await this.pouchesDataProvider.addPouch(pouch)
    if (isErr(result)) return resultErr(new PouchesErrors.AddPouchResponse(result.error))
    return resultOk(result.data)
  })

  removePouch = Adapter(async (pouchId: string) => {
    const result = await this.pouchesDataProvider.removePouch(pouchId)
    if (isErr(result)) return resultErr(new PouchesErrors.RemovePouchResponse(result.error))
    return resultOk(result.data)
  })
}
