import '@repo/environment'

import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import inspect from 'vite-plugin-inspect'
import { VitePWA } from 'vite-plugin-pwa'
// @ts-expect-error
import swcReact from 'vite-plugin-swc-react'

console.log('process.env.VITE_BASE_URL', process.env.VITE_BASE_URL)

export default ({ mode }: any) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  const swcConfContent = fs.readFileSync('.swcrc').toString()
  const swcConf = JSON.parse(swcConfContent)

  return defineConfig({
    // esbuild: false,
    cacheDir: './.cache',
    build: {
      outDir: '../../../docs',
      emptyOutDir: true,
    },
    clearScreen: false,
    base: process.env.VITE_BASE_URL,
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {},
      }),
      swcReact({
        reactFresh: false,
        swcOptions: swcConf,
      }),
      inspect(),
      react(),
    ],
    root: './src',
    resolve: {
      alias: {
        '@pv': path.resolve(__dirname, './src/modules'),
      },
    },
  })
}
