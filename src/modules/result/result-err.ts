import type { ResultErr } from './types'

export function resultErr<T>(error: T): ResultErr<T> {
  return {
    error,
  }
}
