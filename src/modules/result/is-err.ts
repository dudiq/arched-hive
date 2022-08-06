import type { Result, ResultErr } from './types'

export function isErr<T, E>(result?: Result<T, E>): result is ResultErr<E> {
  if (!result) return false
  return 'error' in result
}
