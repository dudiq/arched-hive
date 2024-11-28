type THandle = () => void

const cleaners: THandle[] = []

export class Container {
  static addCleaner(handler: () => void) {
    cleaners.push(handler)
  }

  static clear() {
    cleaners.forEach((cleaner) => cleaner())
  }
}
