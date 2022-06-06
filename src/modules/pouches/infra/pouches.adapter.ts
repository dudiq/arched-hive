import { Result } from 'fnscript'
import { Inject, Adapter } from '@pv/di'
import { PromisedResult } from '@pv/di/types'
import { PouchEntity } from '@pv/core/entities/pouch.entity'
import {
  PouchesErrors,
  PouchesErrorsInstances,
} from '@pv/modules/pouches/core/errors/pouches.errors'
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
}
