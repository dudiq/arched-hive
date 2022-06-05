export type LoggerTransport = {
  log: (...params: any[]) => void
  error: (...params: any[]) => void
  warn: (...params: any[]) => void
}

export type LoggerOptions = {
  transport: LoggerTransport
}
