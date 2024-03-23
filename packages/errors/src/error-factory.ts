import { ErrorBlock } from './error-block'

import type { FactoryResult } from './factory-types'
import type { ErrorMessages } from './types'

export function errorFactory<T, Name extends string>(
  namespace: Name,
  errorRecord: ErrorMessages<T>
): FactoryResult<T, Name> {
  return {
    [namespace]: ErrorBlock.getErrors<T>(namespace, errorRecord),
  } as FactoryResult<T, Name>
}
