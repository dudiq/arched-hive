import type { ResultOk } from './types'

export function resultOk<T>(data: T): ResultOk<T> {
  return {
    data,
  }
}
