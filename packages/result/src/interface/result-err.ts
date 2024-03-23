import type { ResultErr } from '../core/types'

export function resultErr<T>(error: T): ResultErr<T> {
  return {
    error,
  }
}
