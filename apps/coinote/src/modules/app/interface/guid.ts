import { LocalStorageItem } from '@pv/interface/services/local-storage-item'

const guidStore = new LocalStorageItem<string>('guid')

let machineId = guidStore.value
const lut: string[] = []

function init() {
  if (!machineId) {
    machineId = Math.abs((Math.random() * 0xff) | 0).toString(16)
    guidStore.set(machineId)
  }

  for (let i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + i.toString(16)
  }
}

init()

export function guid() {
  const timeObj = new Date().getTime()
  const s = Math.floor(timeObj / 1000)
  const ms = timeObj - s * 1000

  const d1 = (ms + Math.random() * 0xffff) | 0
  const d2 = (Math.random() * 0xffffffff) | 0
  const d3 = machineId // Math.random()*0xffffffff|0;
  const d4 = s.toString(16)
  return (
    d4 +
    // @ts-ignore
    lut[d3 & 0xff] +
    lut[d1 & 0xff] +
    lut[(d1 >> 8) & 0xff] +
    lut[((d1 >> 16) & 0x0f) | 0x40] +
    lut[(d2 & 0x3f) | 0x80] +
    lut[(d2 >> 8) & 0xff] +
    lut[(d2 >> 16) & 0xff] +
    lut[(d2 >> 24) & 0xff]
  )
}
