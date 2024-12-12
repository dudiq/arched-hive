import { Container } from './container'

import type { Constructable } from '../core/constructable'

type InjectClassType<T> = {
  instance?: () => T
  instanceKey?: string
}

type TClass<T> = Constructable<T> & InjectClassType<T>

type TCache<T> = Record<string, T>

const cache: TCache<Constructable<unknown>> = {}

let id = 0
function genKey() {
  id++
  return String(id)
}

Container.addCleaner(() => {
  Object.keys(cache).forEach((key) => {
    delete cache[key]
  })
})

export function Inject<T>(ClassDefinition: TClass<T>): T {
  if (typeof ClassDefinition.instance === 'function') {
    return ClassDefinition.instance()
  }

  function instance(): T {
    if (!ClassDefinition.instanceKey) {
      ClassDefinition.instanceKey = genKey()
    }
    if (cache[ClassDefinition.instanceKey]) {
      return cache[ClassDefinition.instanceKey] as T
    }

    const instance = Container.getInstance(ClassDefinition)
    // @ts-expect-error
    cache[ClassDefinition.instanceKey] = instance
    return instance
  }

  ClassDefinition.instance = instance

  return ClassDefinition.instance()
}
