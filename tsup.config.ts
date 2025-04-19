import {defineConfig} from 'tsup'

export default defineConfig({
  entry: ['./src/types.ts'],
  dts: true,
  // dtsconfig:[],
  format: ['esm'/*,'cjs'*/],
  // outDir: 'dist',
  splitting: false,
  sourcemap: true,
  clean: false,
})