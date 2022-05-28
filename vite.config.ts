// @ts-ignore
import path from 'path'
import { defineConfig } from 'vite'
import swcReact from 'vite-plugin-swc-react'
import inspect from 'vite-plugin-inspect'
import preact from '@preact/preset-vite'
import VitePluginLinaria from 'vite-plugin-linaria'

export default defineConfig({
  esbuild: false,
  cacheDir: '../.cache',
  build: {
    outDir: '../dist',
  },
  plugins: [
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
