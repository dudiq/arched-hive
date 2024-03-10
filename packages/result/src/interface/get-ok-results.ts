import { isErr } from './is-err'

import type { Result, ResultOk } from '../core/types'

export function getOkResults<T>(
  instances: Result<T>[] | Result<T>
): ResultOk<T>[] {
  if (Array.isArray(instances)) {
    const successResults = instances.filter(
      (result) => !isErr(result)
    ) as ResultOk<T>[]
    return successResults
  }

  if (isErr(instances)) {
    return []
  }

  return [instances]
}
