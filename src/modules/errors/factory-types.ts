import type { ErrorClasses } from './types'

export type FactoryResult<T, Name extends string> = {
  [key in Name]: ErrorClasses<T>
}
