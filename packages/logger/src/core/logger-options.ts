import type { LOG_LEVEL } from '../interface/log-level'
import type {LoggerTransport} from "./logger-transport";

export type LoggerOptions = {
  transport?: LoggerTransport
  logLevel?: LOG_LEVEL
  section?: string
}
