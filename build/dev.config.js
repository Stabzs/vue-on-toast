const babel = require('rollup-plugin-babel')
const buble = require('rollup-plugin-buble')
const flow = require('rollup-plugin-flow-no-whitespace')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const vue = require('rollup-plugin-vue')
const stylus = require('rollup-plugin-stylus')

module.exports = {
  entry: 'src/index.js',
  dest: 'dist/vue2-toaster.js',
  format: 'umd',
  moduleName: 'Vue2Toaster',
  plugins: [
    replace({'process.env.NODE_ENV': '"development"'}), 
    flow(), 
    node(), 
    cjs(),
    vue({compileTemplate: true}),
    stylus({
      output: 'toaster.css'
    }),
    // babel({
    //   exclude: ['examples/**', 'dist/**', 'node_modules/**'],
    // }),
    //buble()
  ]
}
