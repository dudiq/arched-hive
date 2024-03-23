import { isErr } from './is-err'

import type { Result, ResultErr } from '../core/types'

export function getErrorResults<T, E>(
  instances: Result<T, E>[] | Result<T, E>
): ResultErr<E>[] {
  if (Array.isArray(instances)) {
    const errors = instances.filter((result) => isErr(result)) as ResultErr<E>[]
    return errors
  }

  if (!isErr(instances)) return []

  return [instances]
}
