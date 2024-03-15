import type { ExtendClass } from '../core/extend-class'

export function declareClass<T extends ExtendClass>(
  Context: T,
  name: string,
): T {
  class InstanceClass extends Context {
    static instanceLink: InstanceClass

    static instance(): InstanceClass {
      if (!InstanceClass.instanceLink)
        InstanceClass.instanceLink = new InstanceClass()
      return InstanceClass.instanceLink
    }
  }

  Object.defineProperty(InstanceClass, 'name', { value: name })
  return InstanceClass
}
