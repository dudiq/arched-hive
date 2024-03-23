import tsconfigPaths from 'vite-tsconfig-paths'
import {
  configDefaults,
  defineConfig,
  mergeConfig,
  type UserConfig,
} from 'vitest/config'

const config = mergeConfig(
  {}, // Extending from an existing Vite configuration (`vite.config.ts` file)
  defineConfig({
    test: {
      ...configDefaults, // Extending Vitest's default options
    },
    // @ts-ignore
    plugins: [tsconfigPaths()],
  }) as UserConfig,
)

export default config
