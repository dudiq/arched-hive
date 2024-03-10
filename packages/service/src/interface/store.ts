import { $mobx, isObservable, makeObservable } from 'mobx'

const annotationsSymbol = Symbol('annotationsSymbol')
const objectPrototype = Object.prototype

// see details in https://github.com/mobxjs/mobx/discussions/2850
function makeSimpleAutoObservable(target: any): void {
  // These could be params but we hard-code them
  const overrides = {} as any
  const options = {}

  // Make sure nobody called makeObservable/etc. previously (eg in parent constructor)
  if (isObservable(target)) {
    throw new Error('Target must not be observable')
  }

  let annotations = target[annotationsSymbol]
  if (!annotations) {
    annotations = {}
    let current = target
    while (current && current !== objectPrototype) {
      Reflect.ownKeys(current).forEach((key) => {
        if (key === $mobx || key === 'constructor') return
        annotations[key] = !overrides ? true : key in overrides ? overrides[key] : true
      })
      current = Object.getPrototypeOf(current)
    }
    // Cache if class
    const proto = Object.getPrototypeOf(target)
    if (proto && proto !== objectPrototype) {
      Object.defineProperty(proto, annotationsSymbol, { value: annotations })
    }
  }

  return makeObservable(target, annotations, options)
}

export function Store() {
  return function extend<T extends { new (...args: any[]): {} }>(Context: T) {
    let instance: SubClass

    class SubClass extends Context {
      constructor(...args: any[]) {
        super(...args)
        makeSimpleAutoObservable(this)
      }

      static instance(): SubClass {
        if (!instance) instance = new SubClass();
        return instance;
      }
    }

    Object.defineProperty(SubClass, 'name', { value: Context.name })

    return SubClass
  }
}
