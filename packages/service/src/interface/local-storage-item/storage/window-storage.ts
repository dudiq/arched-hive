import type { StorageInterface } from './storage-interface'

export class WindowStorage implements StorageInterface {
  onStorage(cb: (event: StorageEvent) => void): void {
    window.addEventListener('storage', cb)
  }
  offStorage(cb: (event: StorageEvent) => void): void {
    window.removeEventListener('storage', cb)
  }
  getItem(key: string): string | null {
    return window.localStorage.getItem(key)
  }
  removeItem(key: string): void {
    window.localStorage.removeItem(key)
  }
  setItem(key: string, value: string): void {
    window.localStorage.setItem(key, value)
  }
}
