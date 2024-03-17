import type { Constructable } from '../core/constructable'

export function Inject<T>(ClassDefinition: Constructable<T>): T {
  if (
    'instance' in ClassDefinition &&
    typeof ClassDefinition.instance === 'function'
  ) {
    return ClassDefinition.instance()
  }

  debugger
  throw new Error('Class definition must be instantiated')
}
