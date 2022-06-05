import { defaultLoggerTransport } from './safe-logger'

export const transport = {
  log: (...args: any[]) => {
    defaultLoggerTransport?.log(...args)
  },
  warn: (...args: any[]) => {
    defaultLoggerTransport?.warn(...args)
  },
  error: (...args: any[]) => {
    defaultLoggerTransport?.error(...args)
  },
}
