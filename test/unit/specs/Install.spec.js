import Vue from 'vue'
import Vue2Toaster from '@/index'

describe('Install.js', () => {
  it('should install plugin once', () => {
    expect(Vue.options.components.ToastContainer).to.be.undefined
    expect(Object.keys(Vue.options.components).length).to.equal(3)

    Vue.use(Vue2Toaster)

    expect(Vue.options.components.ToastContainer).to.be.defined
    expect(Object.keys(Vue.options.components).length).to.equal(4)
    expect(Vue2Toaster.installed).to.equal(true)

    Vue2Toaster.install(Vue)
    expect(Object.keys(Vue.options.components).length).to.equal(4)
  })
})
