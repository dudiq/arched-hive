import type { Result } from 'fnscript'

export type Constructable<T> = new (...args: any[]) => T

export type PromisedResult<T, E> = Promise<Result<T, E>>
