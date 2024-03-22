import { declareClass } from '../declare-class'

import { autoBind } from './auto-bind'

import type { ExtendClass } from '../../core/extend-class'

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
