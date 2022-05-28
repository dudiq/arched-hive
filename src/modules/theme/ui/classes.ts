export function getClassName(classNames: string, oldClass: string, newClass: string) {
  const names = classNames.split(' ').filter((value) => {
    const isExist = value.trim() === newClass || value.trim() === oldClass
    return !isExist
  })
  names.push(newClass)
  return names.join(' ').trim()
}

export function getClearedClass(classNames: string, clearClass: string) {
  return classNames.split(clearClass).join('')
}
