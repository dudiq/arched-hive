import { readdirSync } from 'fs'
import { defineConfig } from 'tsup'

const sourceFolder = './src'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getEntries() {
  const componentNames = readdirSync(sourceFolder)

  return componentNames.reduce(
    (acc, _) => {
      return acc
      // if (name === 'index.ts') return acc
      // return {
      //   ...acc,
      //   [name]: `./src/${name}/index.ts`,
      // }
    },
    {
      index: './src/index.ts',
    }
  )
}

export default defineConfig({
  entry: getEntries(),
  format: ['esm', 'cjs'],
  dts: true,
  external: ['react'],
  sourcemap: true,
})
