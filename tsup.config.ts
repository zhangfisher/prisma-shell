import { defineConfig } from 'tsup'



export default defineConfig([{
  entry: ['src/index.ts'],
  format: ['cjs'],
  clean: true,
  dts: true,
  sourcemap: true,
  minify: true,
  target: 'node14',
  external: ['prisma'],
},{
  entry: {
    cli:'src/cli/index.ts'
  },
  format: ['cjs'],
  clean: true,
  sourcemap: true,
  minify: true,
  target: 'node14',
  external: ['prisma'],
}])