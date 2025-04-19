import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [importMetaUrlPlugin]
    }
  },
  worker: {
    format: 'es'
  }
})
