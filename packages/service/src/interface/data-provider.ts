import { declareClass } from './declare-class'

import type { ExtendClass } from '../core/extend-class'

export function DataProvider() {
  return function extend<T extends ExtendClass>(Context: T) {
    return declareClass(Context, Context.name)
  }
}
