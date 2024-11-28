import { Container } from '../../container'

import type { StorageInterface } from './storage-interface'

const cache: Record<string, string> = {}

Container.addCleaner(() => {
  Object.keys(cache).forEach((key) => {
    delete cache[key]
  })
})

export class ObjectStorage implements StorageInterface {
  onStorage(_: (event: StorageEvent) => void): void {}
  offStorage(_: (event: StorageEvent) => void): void {}
  getItem(key: string): string | null {
    return cache[key] === undefined ? null : cache[key]
  }
  removeItem(key: string): void {
    delete cache[key]
  }
  setItem(key: string, value: string): void {
    cache[key] = value
  }
}
