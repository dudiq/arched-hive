import { Result } from 'fnscript'
import { Inject, Adapter } from '@pv/di'
import { PromisedResult } from '@pv/di/types'
import { PouchEntity, PouchId } from '@pv/core/entities/pouch.entity'
import {
  PouchesErrors,
  PouchesErrorsInstances,
} from '@pv/modules/pouches/core/errors/pouches.errors'
import { guid } from '@pv/utils/guid'
import { PouchesDataProvider } from './pouches.data-provider'

@Adapter()
export class PouchesAdapter {
  constructor(
    @Inject()
    private pouchesDataProvider: PouchesDataProvider,
  ) {}

  async getPouches(): PromisedResult<PouchEntity[], PouchesErrorsInstances> {
    try {
      const { error, data } = await this.pouchesDataProvider.getPouches()

      if (error) return Result.Err(new PouchesErrors.GetPouchesResponse(error))

      return Result.Ok(data)
    } catch (e) {
      return Result.Err(new PouchesErrors.UnexpectedErrorGetPouches(e))
    }
  }

  async addPouch(title: string): PromisedResult<PouchId, PouchesErrorsInstances> {
    try {
      const pouch: PouchEntity = {
        id: guid(),
        name: title,
      }
      const { error, data } = await this.pouchesDataProvider.addPouch(pouch)
      if (error) return Result.Err(new PouchesErrors.AddPouchResponse(error))
      return Result.Ok(data)
    } catch (e) {
      return Result.Err(new PouchesErrors.UnexpectedErrorAddPouch(e))
    }
  }

  async removePouch(pouchId: string): PromisedResult<boolean, PouchesErrorsInstances> {
    try {
      const { error, data } = await this.pouchesDataProvider.removePouch(pouchId)
      if (error) return Result.Err(new PouchesErrors.RemovePouchResponse(error))
      return Result.Ok(data)
    } catch (e) {
      return Result.Err(new PouchesErrors.UnexpectedErrorRemovePouch(e))
    }
  }
}
