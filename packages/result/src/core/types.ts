export type ResultOk<T> = { data: T }
export type ResultErr<E> = { error: E }
export type Result<T, E = unknown> = ResultOk<T> | ResultErr<E>
