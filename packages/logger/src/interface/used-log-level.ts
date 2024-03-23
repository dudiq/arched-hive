import { LOG_LEVEL } from './log-level'

export const usedLogLevel: LOG_LEVEL = (() => {
  if (process.env['LOGGER_LOG_LEVEL']) {
    return Number(process.env['LOGGER_LOG_LEVEL'])
  }

  const nodeEnv = process.env['NODE_ENV']

  switch (true) {
    case nodeEnv === 'production':
      return LOG_LEVEL.ERROR
    default:
      return LOG_LEVEL.INFO
  }
})()

const logLevelTitleMap: Record<LOG_LEVEL, string> = {
  [LOG_LEVEL.INFO]: 'info',
  [LOG_LEVEL.ERROR]: 'error',
  [LOG_LEVEL.WARN]: 'warn',
  [LOG_LEVEL.DEBUG]: 'debug',
  [LOG_LEVEL.TRACE]: 'trace',
}

console.log('[log level info]', logLevelTitleMap[usedLogLevel], usedLogLevel)
