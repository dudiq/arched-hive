import type { ExtendClass } from '../../core/extend-class'

export function declareClass<T extends ExtendClass>(
  Context: T,
  name: string,
): T {
  Object.defineProperty(Context, 'name', { value: name })
  return Context
}
