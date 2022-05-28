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

function createContextByFields<T>(fields: Fields<T>): Context<T> {
  const keys = Object.keys(fields) as Array<keyof T>
  const instances = keys.reduce<T>((acc, fieldKey) => {
    const ClassName = fields[fieldKey]
    acc[fieldKey] = Container.get(ClassName)
    return acc
  }, {} as ResultFields<T>)

  // @ts-ignore
  return createContext.call(this, instances) as Context<T>
}

export function hookContextFactory<T>(fields: Fields<T>): FactoryResult<T> {
  let cachedContext: Context<T> | null = null

  const useModuleContext = () => {
    if (cachedContext === null) {
      cachedContext = createContextByFields(fields)
    }
    return useContext(cachedContext)
  }

  return {
    useModuleContext,
  }
}
