import { declareClass } from '../declare-class'

import { makeSimpleAutoObserv } from './make-simple-auto-observ'

import type { ExtendClass } from '../../core/extend-class'

export function Store() {
  return function extend<T extends ExtendClass>(Context: T) {
    class SubClass extends Context {
      constructor(...args: any[]) {
        super(...args)
        makeSimpleAutoObserv(this)
      }
    }

    return declareClass(SubClass, Context.name)
  }
}
