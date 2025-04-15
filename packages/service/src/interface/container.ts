import type { Constructable } from '../core/constructable'

type THandle = () => void

const cleaners: THandle[] = []

const declarations: {
  isEnabled: boolean
  list: { base: unknown; replacer: unknown }[]
} = {
  isEnabled: false,
  list: [],
}

export class Container {
  static addCleaner(handler: THandle): void {
    cleaners.push(handler)
  }

  static clear(): void {
    cleaners.forEach((cleaner) => cleaner())
    declarations.isEnabled = false
    declarations.list = []
  }

  static replace<T>(base: Constructable<T>, replacer: Partial<T>): void {
    declarations.isEnabled = true
    declarations.list.push({
      base,
      replacer,
    })
  }

  static getInstance<T>(OriginClass: Constructable<T>): T {
    if (!declarations.isEnabled) return new OriginClass()
    if (declarations.list.length === 0) return new OriginClass()
    const declaration = declarations.list.find(
      ({ base }) => base === OriginClass,
    )
    if (declaration) return declaration.replacer as T
    return new OriginClass()
  }
}
