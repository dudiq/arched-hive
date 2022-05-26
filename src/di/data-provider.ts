// eslint-disable-next-line no-restricted-imports
import { Service } from 'typedi'

export function DataProvider() {
  return function extend(Context: unknown) {
    const serviceFn = Service()
    return serviceFn(Context)
  }
}
