import { getAllMethodNames } from './get-all-method-names'

function bindContext(context: object, field: string): void {
  // @ts-expect-error
  if (typeof context[field] === 'function') {
    // @ts-expect-error
    context[field] = context[field].bind(context)
  }
}

export function autoBind<T extends object>(context: T): void {
  const allMethods = getAllMethodNames(context)

  allMethods.forEach((method: string) => {
    bindContext(context, method)
  })
}
