import { rimraf } from 'rimraf'
import fs from 'fs'
import path from 'path'

const DIR_FOLDER = './dist'

function getFilePath(fileName) {
  const localPath = path.resolve(fileName)
  const rootPath = path.resolve(path.join('../../'), fileName)
  if (fs.existsSync(localPath)) {
    return localPath
  }

  if (fs.existsSync(rootPath)) {
    return rootPath
  }

  return fileName
}

async function prepareTailwindBase() {
  const baseFile = `${DIR_FOLDER}/tailwind.base.css`
  await rimraf(baseFile)
  fs.copyFileSync('./src/tailwind.base.css', baseFile)
}

async function prepareCss() {
  if (!fs.existsSync(DIR_FOLDER)) {
    fs.mkdirSync(DIR_FOLDER)
  }

  await prepareTailwindBase()
}

prepareCss()
