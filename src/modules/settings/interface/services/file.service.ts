import { Service } from '@pv/di'

@Service()
export class FileService {
  saveToFile(fileName: string, content: string) {
    const element = document.createElement('a')
    const header = `data:application/text;charset=utf-8,`
    element.setAttribute('href', header + encodeURIComponent(content))
    element.setAttribute('download', fileName)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  async readTextFile<T>(file: Blob): Promise<T> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = function (e) {
        reject && reject(e)
      }

      reader.onload = function (e) {
        const data = e.target?.result as unknown as T
        resolve(data)
      }

      reader.readAsText(file)
    })
  }
}
