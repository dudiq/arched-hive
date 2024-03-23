#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const v8 = require('node:v8')
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand').expand

const productionPaths = ['.env', '.env.local']
const testPaths = ['.env.test', '.env.test.local']

const devPaths = [
  '.env.development.local',
  '.env.development',
  '.env.local',
  '.env',
]

const defaultPaths = getPaths()

const MAX_LEVELS = 10

const currentCwd = process.cwd()

const heapSizeLimit = v8.getHeapStatistics().heap_size_limit / (1024 * 1024)

function getPaths() {
  if (process.env.NODE_ENV === 'production') {
    return productionPaths
  }
  if (process.env.NODE_ENV === 'test') {
    return testPaths
  }
  return devPaths
}

function getEnvFolderLocation(level = 0) {
  if (level > MAX_LEVELS) return '.'
  const parentFolder = new Array(level).fill('../').join('')
  const fullFolderPath = path.join(currentCwd, parentFolder)
  const checkPaths = defaultPaths.map((filePath) =>
    path.join(fullFolderPath, filePath)
  )
  const isFounded = checkPaths.find((filePath) => fs.existsSync(filePath))
  if (isFounded) return fullFolderPath
  return getEnvFolderLocation(level + 1)
}

const envFolder = getEnvFolderLocation()

defaultPaths.forEach(function (envPath) {
  const pathFile = path.resolve(`${envFolder}${envPath}`)
  dotenvExpand(dotenv.config({ path: pathFile }))
})

function showLogs() {
  console.log(`[env] -----------------`)
  console.log(`[env] using NODE_ENV: ${process.env.NODE_ENV}`)
  console.log(`[env] using folder: ${path.resolve(envFolder)}`)
  console.log('[env] heapSizeLimit :', heapSizeLimit)
  console.log(`[env] -----------------`)
}

module.exports = {
  showLogs,
}
