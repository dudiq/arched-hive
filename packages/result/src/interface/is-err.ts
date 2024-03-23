import type { Result, ResultErr } from '../core/types'

type Arg<T, E> = Result<T, E>

function checkError<T, E>(result?: Arg<T, E>): result is ResultErr<E> {
  if (!result) return false
  return 'error' in result
}

export function isErr<T, E>(
  result?: Arg<T, E> | Arg<T, E>[]
): result is ResultErr<E> {
  if (!Array.isArray(result)) {
    return checkError<T, E>(result)
  }

  const findResult = result.find((item) => checkError(item))
  return !!findResult
}
