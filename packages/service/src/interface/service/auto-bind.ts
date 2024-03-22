import { getAllMethodNames } from './get-all-method-names'

function bindContext(context: Object, field: string): void {
  // @ts-expect-error
  if (typeof context[field] === 'function') {
    // @ts-expect-error
    context[field] = context[field].bind(context)
  }
}

export function autoBind(context: Object): void {
  const allMethods = getAllMethodNames(context)

  // console.log('allMethods', context.constructor.name, allMethods)

  allMethods.forEach((method: string) => {
    bindContext(context, method)
  })
}
