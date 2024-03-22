export function getAllMethodNames(obj: any): string[] {
  const methods = new Set<string>()
  while ((obj = Reflect.getPrototypeOf(obj))) {
    if (obj.constructor === Object) return Array.from(methods)
    const keys = Reflect.ownKeys(obj)
    keys.forEach((name) => {
      if (typeof name !== 'string') return
      if (name === 'constructor') return
      if (typeof obj[name] !== 'function') return
      methods.add(name)
    })
  }
  return Array.from(methods)
}
