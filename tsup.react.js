import { defineConfig } from 'tsup'

const entry = new URL('src/react/index.tsx', import.meta.url).pathname
const outDir = new URL('dist/react', import.meta.url).pathname

export default defineConfig({
  entry: [entry],
  splitting: false,
  sourcemap: true,
  minify: true,
  external: ['react'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  bundle: true,
  outDir
})
