import type { ErrorConstructable, DomainError } from './types'

export function createErrorClass(key: string, message: string): ErrorConstructable<DomainError> {
  return class ErrorClass implements DomainError {
    key: string
    message: string
    error?: unknown
    stack?: string

    constructor(error?: any) {
      this.stack = new Error().stack
      this.message = error?.message ? `${message} | ${error.message}` : message
      this.error = error
      this.key = key
    }
  }
}
