import { rimraf } from 'rimraf'
import fs from 'fs'

const DIR_FOLDER = './dist'

async function copyTailwind() {
  const baseFile = `${DIR_FOLDER}/tailwind.base.css`
  await rimraf(baseFile)
  fs.copyFileSync('./src/tailwind.base.css', baseFile)
}

async function copyCss() {
  if (!fs.existsSync(DIR_FOLDER)) {
    fs.mkdirSync(DIR_FOLDER)
  }

  await copyTailwind()
}

copyCss()
