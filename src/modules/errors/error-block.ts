import type { ErrorClasses, ErrorMessages } from './types'
import { createErrorClass } from './create-error-class'

export class ErrorBlock<T> {
  errors: ErrorClasses<T>

  constructor(namespace: string, readonly errorRecord: ErrorMessages<T>) {
    const keys = Object.keys(errorRecord) as Array<keyof T>

    // @ts-ignore
    this.errors = keys.reduce<T>((acc, key) => {
      const message = errorRecord[key]
      const fullKey = `${namespace}.${String(key)}`
      // @ts-ignore
      acc[key] = createErrorClass(fullKey, message)
      return acc
      // @ts-ignore
    }, {} as ErrorClasses<T>)
  }
}
