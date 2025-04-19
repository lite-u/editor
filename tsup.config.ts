import {defineConfig} from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  // dtsconfig: './tsconfig.esm.json',
  format: ['esm'/*,'cjs'*/],
  splitting: true,
  sourcemap: true,
  clean: false,
})