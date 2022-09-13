import { Inject, Adapter } from '@pv/di'
import { PouchEntity, PouchId } from '@pv/core/entities/pouch.entity'
import {
  PouchesErrors,
  PouchesErrorsInstances,
} from '@pv/modules/pouches/core/errors/pouches.errors'
import { guid } from '@pv/utils/guid'
import { isErr, PromiseResult, resultErr, resultOk } from '@pv/modules/result'
import { PouchesDataProvider } from './pouches.data-provider'

@Adapter()
export class PouchesAdapter {
  constructor(
    @Inject()
    private pouchesDataProvider: PouchesDataProvider,
  ) {}

  async getPouches(): PromiseResult<PouchEntity[], PouchesErrorsInstances> {
    try {
      const result = await this.pouchesDataProvider.getPouches()

      if (isErr(result)) return resultErr(new PouchesErrors.GetPouchesResponse(result.error))

      return resultOk(result.data)
    } catch (e) {
      return resultErr(new PouchesErrors.UnexpectedErrorGetPouches(e))
    }
  }

  async addPouch(title: string): PromiseResult<PouchId, PouchesErrorsInstances> {
    try {
      const pouch: PouchEntity = {
        id: guid(),
        name: title,
      }
      const result = await this.pouchesDataProvider.addPouch(pouch)
      if (isErr(result)) return resultErr(new PouchesErrors.AddPouchResponse(result.error))
      return resultOk(result.data)
    } catch (e) {
      return resultErr(new PouchesErrors.UnexpectedErrorAddPouch(e))
    }
  }

  async removePouch(pouchId: string): PromiseResult<boolean, PouchesErrorsInstances> {
    try {
      const result = await this.pouchesDataProvider.removePouch(pouchId)
      if (isErr(result)) return resultErr(new PouchesErrors.RemovePouchResponse(result.error))
      return resultOk(result.data)
    } catch (e) {
      return resultErr(new PouchesErrors.UnexpectedErrorRemovePouch(e))
    }
  }
}
