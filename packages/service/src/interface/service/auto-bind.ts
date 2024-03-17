function bindContext(context: Object, field: string) {
  if (field === 'constructor') return

  // @ts-expect-error
  if (typeof context[field] === 'function') {
    // @ts-expect-error
    context[field] = context[field].bind(context)
  }
}

function getAllMethodNames(obj: any): Set<string> {
  const methods = new Set<string>()
  while ((obj = Reflect.getPrototypeOf(obj))) {
    if (obj.constructor === Object) return methods
    const keys = Reflect.ownKeys(obj)
    keys.forEach((k) => typeof k === 'string' && methods.add(k))
  }
  return methods
}

export function autoBind(context: Object) {
  const allMethods = Array.from(getAllMethodNames(context))
  // console.log('allMethods', allMethods)
  allMethods.forEach((method: string) => {
    bindContext(context, method)
  })

  // eslint-disable-next-line no-proto
  const proto = Object.getPrototypeOf(context.constructor.prototype)
  const names = Object.getOwnPropertyNames(proto)
  names.forEach((field) => {
    bindContext(context, field)
  })
}
