describe('toastServiceBus.js', () => {
  it('should throw error if _Vue is undefined', () => {
    let install = require('@/install')

    expect(install._Vue).to.be.defined

    delete install._Vue

    expect(install._Vue).to.be.undefined

    let toastServiceBus = require('@/services/toastServiceBus')
    let hasError = false

    try {
      toastServiceBus.installBus()
    } catch (ex) {
      hasError = true
    }

    expect(hasError).to.equal(true)
  })
})
