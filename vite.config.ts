// @ts-ignore
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import swcReact from 'vite-plugin-swc-react'
import inspect from 'vite-plugin-inspect'
import preact from '@preact/preset-vite'
// @ts-ignore
import VitePluginLinaria from 'vite-plugin-linaria'
import { VitePWA } from 'vite-plugin-pwa'

export default ({ mode }: any) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    esbuild: false,
    cacheDir: '../.cache',
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
    base: process.env.VITE_BASE_URL,
    plugins: [
      VitePWA({ registerType: 'autoUpdate' }),
      swcReact({
        reactFresh: false,
        swcOptions: {
          sourceMaps: true,
          jsc: {
            target: 'es2015',
            keepClassNames: true,
            parser: {
              syntax: 'typescript',
              tsx: true,
              dynamicImport: true,
              decorators: true,
            },
            transform: {
              legacyDecorator: true,
              decoratorMetadata: true,
              react: {
                pragma: 'h',
                pragmaFrag: 'Fragment',
                runtime: 'automatic',
                throwIfNamespace: true,
              },
            },
          },
        },
      }),
      inspect(),
      VitePluginLinaria(),
      preact(),
    ],
    root: './src',
    resolve: {
      alias: {
        '@pv': path.resolve(__dirname, './src'),
      },
    },
  })
}
