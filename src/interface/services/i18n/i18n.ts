import { setLangs, translate, addBlock, getLang, setLang, getNumber } from 'jr-translate'

export const t = translate
export { addBlock, getLang, setLang, getNumber }

export function getMoney(val: number, precision = 2) {
  const view = (val - 0) / 100
  return getNumber(view, precision)
}

setLangs(['en', 'ru'])
