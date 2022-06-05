export enum LOG_LEVEL {
  TRACE = 5,
  DEBUG = 4,
  INFO = 3,
  WARN = 2,
  ERROR = 1,
}

const isWorker = typeof window === 'undefined'
// @ts-ignore
const isDev = process.env.NODE_ENV === 'development'

export const logLevel = isDev ? LOG_LEVEL.TRACE : LOG_LEVEL.ERROR
const loggerType = isWorker ? 'self' : 'window'

if (logLevel > LOG_LEVEL.ERROR) {
  // eslint-disable-next-line no-console
  console.log(`logger[${loggerType}]`, logLevel)
}
