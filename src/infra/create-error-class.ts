import type { DomainError } from '../core/errors/domain.error'

export function createErrorClass(message: string) {
  return class ErrorClass implements DomainError {
    message: string
    error?: unknown
    stack?: string

    constructor(error: any) {
      this.stack = new Error().stack
      this.message = message
      this.error = error
    }
  }
}
