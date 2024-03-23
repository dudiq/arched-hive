import type { ResultOk } from '../core/types'

export function resultOk<T>(data: T): ResultOk<T> {
  return {
    data,
  }
}
