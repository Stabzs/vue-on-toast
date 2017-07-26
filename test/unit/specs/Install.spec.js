import Vue from 'vue'
import install from '@/index'

describe('Install.js', () => {
  it('should install plugin once', () => {
    expect(Vue.options.components.ToastContainer).to.be.undefined
    expect(Object.keys(Vue.options.components).length).to.equal(3)

    Vue.use(install)

    expect(Vue.options.components.ToastContainer).to.be.defined
    expect(Object.keys(Vue.options.components).length).to.equal(4)
    expect(install.installed).to.equal(true)

    install.install(Vue)
    expect(Object.keys(Vue.options.components).length).to.equal(4)
  })
})
