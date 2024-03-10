import { createErrorClass } from './create-error-class'

import type { ErrorClasses, ErrorMessages } from './types'

export class ErrorBlock {

  static getErrors<T>(namespace: string, errorRecord: ErrorMessages<T>): ErrorClasses<T> {
    const keys = Object.keys(errorRecord) as Array<keyof T>

    return keys.reduce((acc, key) => {
      const message = errorRecord[key]
      const fullKey = `${namespace}.${String(key)}`
      acc[key] = createErrorClass(fullKey, message)
      return acc
    }, {} as ErrorClasses<T>)
  }
}
