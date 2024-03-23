import { createTransport } from './transport/console'
import { LOG_LEVEL } from './log-level'
import { usedLogLevel } from './used-log-level'

import type {
  Details,
  LogParams,
} from '../core/log-params'
import type {LoggerTransport} from '../core/logger-transport'
import type {LoggerOptions} from '../core/logger-options'


export class Logger {
  readonly name: string = ''
  readonly section?: string = ''
  private readonly transport: LoggerTransport[] = []
  private readonly logLevel = usedLogLevel

  constructor(name: string, options?: LoggerOptions) {
    const { transport, section, logLevel } = options || {}
    this.name = name
    this.section = section
    this.logLevel = logLevel || usedLogLevel
    const consoleTransport = createTransport()
    this.transport = [consoleTransport]
    if (transport && transport.name !== 'console') {
      this.transport.push(transport)
    }
  }

  getArgs(message: string, details?: Details): LogParams {
    const prefix = this.section ? `${this.name} in ${this.section}` : this.name

    return {
      message: `[${prefix}] ${message}`.trim(),
      details,
    }
  }

  private iterateTransport(
    handle: (transport: LoggerTransport, params: LogParams) => void,
    message: string,
    details?: Details
  ): void {
    const params = this.getArgs(message, details)
    this.transport.forEach((transport) => handle(transport, params))
  }

  info(message: string, details?: Details): void {
    if (this.logLevel < LOG_LEVEL.INFO) return

    this.iterateTransport(
      (transport, params) => {
        transport.info(params)
      },
      message,
      details
    )
  }

  warn(message: string, details?: Details): void {
    if (this.logLevel < LOG_LEVEL.WARN) return

    this.iterateTransport(
      (transport, params) => {
        transport.warn(params)
      },
      message,
      details
    )
  }

  error(message: string, details?: Details): void {
    this.iterateTransport(
      (transport, params) => {
        transport.error(params)
      },
      message,
      details
    )
  }

  log(message: string, details?: Details): void {
    if (this.logLevel < LOG_LEVEL.DEBUG) return

    this.iterateTransport(
      (transport, params) => {
        transport.log(params)
      },
      message,
      details
    )
  }
}
