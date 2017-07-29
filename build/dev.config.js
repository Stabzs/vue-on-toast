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
  dest: 'dist/vue-on-toast.js',
  format: 'umd',
  moduleName: 'VueOnToast',
  plugins: [
    replace({'process.env.NODE_ENV': '"development"'}), 
    vue({compileTemplate: true}),
    flow(), 
    node(), 
    cjs(),
    buble()
  ]
}
