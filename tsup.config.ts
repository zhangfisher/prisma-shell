import { defineConfig } from 'tsup'



export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  clean: true,
  dts: true,
  sourcemap: true,
  splitting: true,
  minify: true,
  target: 'node14',
  external: ['prisma'],
})