import { Container } from '@pv/di'
import { SafeLogger } from './safe-logger'
import { transport } from './transport'

export class Logger extends SafeLogger {}

export function InjectLogger(loggerName: string) {
  return function (object: unknown, propertyName: string, index?: number) {
    const logger = new Logger(loggerName, { transport })
    // @ts-ignore
    // eslint-disable-next-line no-unused-vars
    Container.registerHandler({ object, index, propertyName, value: (_) => logger })
  }
}
