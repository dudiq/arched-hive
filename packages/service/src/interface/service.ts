function bindContext(context: Object, field: string) {
  if (field === 'constructor') return

  // @ts-ignore
  if (typeof context[field] === 'function') {
    // @ts-ignore
    context[field] = context[field].bind(context)
  }
}

function autoBind(context: Object) {
  for (const key in context) {
    bindContext(context, key)
  }

  // eslint-disable-next-line no-proto
  const proto = Object.getPrototypeOf(context.constructor.prototype)
  const names = Object.getOwnPropertyNames(proto)
  names.forEach((field) => {
    bindContext(context, field)
  })
}

export function Service() {
  return function extend<T extends { new (..._: any[]): {} }>(Context: T) {
    let instance: SubClass

    class SubClass extends Context {
      constructor(...args: any[]) {
        super(...args)
        autoBind(this)
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
