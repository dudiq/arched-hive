import { Logger } from './logger'

import type {LoggerTransport} from "../core/logger-transport";
import type { LOG_LEVEL } from './log-level'

export function loggerFactory({
  name,
  section,
  transport,
  logLevel,
}: {
  name: string
  section: string
  logLevel?: LOG_LEVEL
  transport?: LoggerTransport
}): Logger {

  return new Logger(name, {
    section,
    transport,
    logLevel,
  })
}
