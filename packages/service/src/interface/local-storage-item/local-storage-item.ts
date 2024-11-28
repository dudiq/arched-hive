import { makeObservable, observable } from 'mobx'

import { Container } from '../container'

import { getStorage } from './storage/get-storage'

type OptionsType<T> = {
  initialValue: T
  prefix?: string
}

type Maybe<T> = T | undefined | null

const PREFIX = '@repo:'

const cache: Record<string, LocalStorageItem<unknown>> = {}

Container.addCleaner(() => {
  Object.keys(cache).forEach((key) => {
    cache[key].dispose()
    delete cache[key]
  })
})

const storage = getStorage()

export class LocalStorageItem<T> {
  value: Maybe<T>

  constructor(
    private readonly key: string,
    private readonly options?: OptionsType<T>,
  ) {
    if (cache[this.usedKey]) {
      throw new Error(
        `Cache key "${key}" is already in use for "LocalStorageItem"`,
      )
    }
    cache[this.usedKey] = this

    this.value = this.getValue()
    storage.onStorage(this.onStorage)

    makeObservable(this, {
      value: observable,
    })
  }

  private onStorage = (event: StorageEvent): void => {
    if (!event.key || event.key === this.usedKey) {
      this.value = this.getValue()
    }
  }

  get usedKey(): string {
    return `${this.options?.prefix || PREFIX}-${this.key}`
  }

  set(value: T): void {
    this.value = value
    try {
      const storedValue = JSON.stringify({ value })
      storage.setItem(this.usedKey, storedValue)
    } catch (e) {}
  }

  private getValue(): Maybe<T> {
    const storedValue = storage.getItem(this.usedKey)
    if (!storedValue) {
      return this.options?.initialValue
    }
    try {
      const result = JSON.parse(storedValue)
      if (!result) return this.options?.initialValue
      return result.value as unknown as Maybe<T>
    } catch (e) {}
  }

  remove(): void {
    return storage.removeItem(this.usedKey)
  }

  dispose(): void {
    storage.offStorage(this.onStorage)
  }
}
