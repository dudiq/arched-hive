import type { LogParams } from '../../core/log-params'
import type { LoggerTransport } from '../../core/logger-transport'

const logger = console

export const createTransport = (): LoggerTransport => {
  return {
    name: 'console',
    log(params: LogParams) {
      logger.debug(params.message, params.details)
    },
    info(params: LogParams) {
      logger.info(params.message, params.details)
    },
    error(params: LogParams) {
      logger.error(params.message, params.details)
    },
    warn(params: LogParams) {
      logger.warn(params.message, params.details)
    },
  }
}
