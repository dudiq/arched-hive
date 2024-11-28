export type StorageInterface = {
  onStorage(cb: (event: StorageEvent) => void): void
  offStorage(cb: (event: StorageEvent) => void): void
  setItem(key: string, value: string): void
  getItem(key: string): string | null
  removeItem(key: string): void
}
