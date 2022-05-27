import { Context, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { Container } from '@pv/di'
import type { Constructable } from '@pv/di/types'

type Fields<T> = {
  [P in keyof T]: Constructable<T[P]>
}

type ResultFields<T> = {
  [P in keyof T]: T[P]
}

type FactoryResult<T> = {
  useModuleContext: () => ResultFields<T>
}

export function hookContextFactory<T>(fields: Fields<T>): FactoryResult<T> {
  let cachedContext: Context<T> | null = null

  const useModuleContext = function useFactoryContext() {
    if (!cachedContext) {
      const keys = Object.keys(fields) as Array<keyof T>
      const instances = keys.reduce<T>((acc, fieldKey) => {
        const ClassName = fields[fieldKey]
        acc[fieldKey] = Container.get(ClassName)
        return acc
      }, {} as ResultFields<T>)

      cachedContext = createContext(instances)
    }

    return useContext(cachedContext)
  }

  return {
    useModuleContext,
  }
}
