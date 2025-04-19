import {defineConfig} from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  // format: ['esm'/*,'cjs'*/],
  sourcemap: false,
  clean: true,
  terserOptions: {
    compress: true,
  },
  outExtension: (ctx) => {
    debugger
    // console.log('format-  ', format)

    return {
      js: `.${ctx.format}.min.js`,
    }
  },
})