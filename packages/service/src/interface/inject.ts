import type { Constructable } from '../core/constructable'

type InjectClassType<T> = {
  instance?: () => T
  instanceLink?: T
}

type TClass<T> = Constructable<T> & InjectClassType<T>

export function Inject<T>(ClassDefinition: TClass<T>): T {
  if (typeof ClassDefinition.instance === 'function') {
    return ClassDefinition.instance()
  }

  function instance(): T {
    if (ClassDefinition.instanceLink) {
      return ClassDefinition.instanceLink
    }
    ClassDefinition.instanceLink = new ClassDefinition()
    return ClassDefinition.instanceLink
  }

  ClassDefinition.instance = instance

  return ClassDefinition.instance()
}
