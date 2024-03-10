import type { DomainError, ErrorConstructable } from './types'


export function createErrorClass(
  key: string,
  message: string
): ErrorConstructable<DomainError> {
  return class ErrorClass implements DomainError {
    key: string
    message: string
    error?: ErrorClass | unknown
    stack?: string

    constructor(error?: any | ErrorClass) {
      this.stack = !error?.key ? new Error().stack : undefined
      this.error = error
      this.message = error?.message ? `${message}; ${error.message}` : message
      this.key = key
    }
  }
}
