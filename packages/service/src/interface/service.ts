import { autoBind } from './class/auto-bind'
import { declareClass } from './class/declare-class'

import type { ExtendClass } from '../core/extend-class'

export function Service() {
  return function extend<T extends ExtendClass>(Context: T) {
    class SubClass extends Context {
      constructor(...args: any[]) {
        super(...args)
        autoBind(this)
      }
    }

    return declareClass(SubClass, Context.name)
  }
}
