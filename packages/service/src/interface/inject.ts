import type { Constructable } from '../core/constructable'

export function Inject<T>(ClassDefinition: Constructable<T>): T {
  if (
    'instance' in ClassDefinition &&
    typeof ClassDefinition.instance === 'function'
  ) {
    return ClassDefinition.instance()
  }

  // eslint-disable-next-line eslint-comments/no-restricted-disable
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  ClassDefinition.instance = function () {
    if ('instanceLink' in ClassDefinition) {
      return ClassDefinition.instanceLink
    }
    // eslint-disable-next-line eslint-comments/no-restricted-disable
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    ClassDefinition.instanceLink = new ClassDefinition()
    // eslint-disable-next-line eslint-comments/no-restricted-disable
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return ClassDefinition.instanceLink
  }

  if (
    'instance' in ClassDefinition &&
    typeof ClassDefinition.instance === 'function'
  ) {
    return ClassDefinition.instance()
  }

  throw new Error('Class definition must be instantiated')
}
