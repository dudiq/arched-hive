/* eslint-disable no-console */
import { LOG_LEVEL, logLevel } from './get-log-level'
import type { LoggerOptions, LoggerTransport } from './types'

export const defaultLoggerTransport = (() => {
  try {
    return console
  } catch (e) {}
  return undefined
})()

export class SafeLogger {
  private readonly name: string = ''
  private readonly transport?: LoggerTransport

  constructor(name: string, options?: LoggerOptions) {
    const { transport } = options || {}
    this.name = name
    this.transport = transport || defaultLoggerTransport
  }

  warn(...args: unknown[]) {
    if (logLevel < LOG_LEVEL.WARN) return
    this.transport?.warn(`[${this.name}] `, ...args)
  }

  error(...args: unknown[]) {
    this.transport?.error(`[${this.name}] `, ...args)
  }

  log(...args: unknown[]) {
    if (logLevel < LOG_LEVEL.DEBUG) return
    this.transport?.log(`[${this.name}] `, ...args)
  }
}
