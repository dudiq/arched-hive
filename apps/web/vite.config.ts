import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import inspect from 'vite-plugin-inspect'
import { VitePWA } from 'vite-plugin-pwa'

export default ({ mode }: any) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    esbuild: false,
    cacheDir: './.cache',
    build: {
      outDir: './dist',
      emptyOutDir: true,
    },
    base: process.env.VITE_BASE_URL,
    plugins: [
      VitePWA({ registerType: 'autoUpdate' }),
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
