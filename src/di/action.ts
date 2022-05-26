// eslint-disable-next-line no-restricted-imports
import { Service } from 'typedi'

function autoBind(context: Object) {
  for (const key in context) {
    if (key === 'constructor') continue

    // @ts-ignore
    if (typeof context[key] === 'function') {
      // @ts-ignore
      context[key] = context[key].bind(context)
    }
  }
}

export function Action() {
  return function extend<T extends { new (..._: any[]): {} }>(Context: T) {
    const serviceFn = Service({ id: Context })

    class SubClass extends Context {
      constructor(...args: any[]) {
        super(...args)
        autoBind(this)
      }
    }

    return serviceFn(SubClass)
  }
}
