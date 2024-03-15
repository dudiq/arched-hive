function bindContext(context: Object, field: string) {
  if (field === 'constructor') return

  // @ts-expect-error
  if (typeof context[field] === 'function') {
    // @ts-expect-error
    context[field] = context[field].bind(context)
  }
}

export function autoBind(context: Object) {
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
