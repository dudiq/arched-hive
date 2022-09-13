import type { ErrorMessages } from './types'
import type { FactoryResult } from './factory-types'
import { ErrorBlock } from './error-block'

export function errorFactory<T, Name extends string>(
  namespace: Name,
  errorRecord: ErrorMessages<T>,
): FactoryResult<T, Name> {
  const inst = new ErrorBlock(namespace, errorRecord)
  const errors = inst.errors
  return {
    [namespace]: errors,
  } as FactoryResult<T, Name>
}
