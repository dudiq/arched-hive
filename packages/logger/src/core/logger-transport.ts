import type {LogParams} from "./log-params";

export type LoggerTransport = {
  name: string
  info: (params: LogParams) => void
  log: (params: LogParams) => void
  error: (params: LogParams) => void
  warn: (params: LogParams) => void
}
