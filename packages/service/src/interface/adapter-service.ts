import { getAllMethodNames } from './service/get-all-method-names'
import { Adapter } from './adapter'
import { declareClass } from './declare-class'

import type { ExtendClass } from '../core/extend-class'

type AdapterClass = Record<string, typeof Adapter>

export function AdapterService<T extends ExtendClass>(Context: T): T {
  // @ts-expect-error
  class SubClass extends Context implements AdapterClass {
    constructor(...args: any[]) {
      super(...args)
      const allMethods = getAllMethodNames(this)
      allMethods.forEach((method) => {
        // @ts-expect-error
        if (typeof this[method] === 'function') {
          // @ts-expect-error
          this[method] = Adapter(this[method].bind(this))
        }
      })
    }
  }
  return declareClass(SubClass, Context.name)
}
