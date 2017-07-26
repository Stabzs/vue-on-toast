import Vue from 'vue'
import Install from '@/index'
import ToastConfig from '@/utils/toastConfig'
import ToastContainer from '@/components/ToastContainer'
import Constants from '@/utils/constants'
import { ToastServiceBus } from '@/services/toastServiceBus'

let successToast = {}

describe('ToastContainer.vue', () => {
  beforeEach(() => {
    successToast = {
      'type': 'success',
      title: 'test',
      body: 'test body',
      toastConfig: new ToastConfig(),
      toastId: 1
    }
  })

  it('should create instance', () => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor().$mount()

    expect(vm).to.not.be.null

    let hasClass = vm.$el.classList.contains('toast-container')

    expect(hasClass).to.equal(true)
  })

  it('should render toasts if present when container is mounted', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor()
    vm._data.toasts.push(successToast)

    vm.$mount()

    expect(vm).to.not.be.null
    expect(vm._data.toasts[0]).to.equal(successToast)
    expect(vm.$el.children[0].classList.contains('vue-on-toast-success'))

    done()
  })

  it('should subscribe to ADD_TOAST and REMOVE_TOAST when mounted', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor().$mount()

    expect(vm.toasts.length).to.equal(0)

    ToastServiceBus.$emit(Constants.ADD_TOAST, successToast)

    window.waitForUpdate(() => {
      expect(vm.toasts.length).to.equal(1)
      ToastServiceBus.$emit(Constants.REMOVE_TOAST, successToast.toastId)
    }).then(() => {
      expect(vm.toasts.length).to.equal(0)
    }).end(done)
  })
})

describe('ToastContainer.Vue addToast', () => {
  beforeEach(() => {
    successToast = {
      'type': 'success',
      title: 'test',
      body: 'test body',
      toastConfig: new ToastConfig(),
      toastId: 1
    }
  })

  it('should add toast', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor().$mount()

    vm.addToast(successToast, new ToastConfig())

    expect(vm._data.toasts[0]).to.equal(successToast)

    window.waitForUpdate(() => {
      expect(vm.$el.children[0].classList.contains('vue-on-toast-success'))
    }).end(done)
  })

  it('should not add toast if containerId is not null and does not match the container id', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor({
      propsData: { toastConfig: { toastContainerId: 1 } }
    }).$mount()

    successToast.toastContainerId = 2

    // add the container's config, as if invoked from
    // the ADD_TOAST subscription
    vm.addToast(successToast, vm._toastConfig)

    window.waitForUpdate(() => {
      expect(vm._data.toasts.length).to.equal(0)
    }).end(done)
  })

  it('should set toast type to default if not declared', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor().$mount()

    delete successToast.type

    expect(successToast.type).to.be.undefined

    vm.addToast(successToast, new ToastConfig())

    window.waitForUpdate(() => {
      expect(vm.toasts[0].type).to.equal(vm._toastConfig.defaultTypeClass)
    }).end(done)
  })

  it('should not add toast if preventDuplicates and toastId exists', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor({
      propsData: { toastConfig: { preventDuplicates: true } }
    }).$mount()

    successToast.toastId = 1

    // add the container's config, as if invoked from
    // the ADD_TOAST subscription
    vm.addToast(successToast, vm._toastConfig)

    window.waitForUpdate(() => {
      expect(vm._data.toasts.length).to.equal(1)
      expect(vm.toasts[0].toastId).to.equal(1)
      vm.addToast(successToast, vm._toastConfig)
    }).then(() => {
      expect(vm._data.toasts.length).to.equal(1)
    }).end(done)
  })

  it('should not add toast if preventDuplicates and body exists', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor({
      propsData: { toastConfig: { preventDuplicates: true } }
    }).$mount()

    successToast.toastId = 1

    // add the container's config, as if invoked from
    // the ADD_TOAST subscription
    vm.addToast(successToast, vm._toastConfig)

    window.waitForUpdate(() => {
      expect(vm._data.toasts.length).to.equal(1)
      expect(vm.toasts[0].body).to.equal('test body')

      let clonedToast = JSON.parse(JSON.stringify(successToast))
      clonedToast.toastId = 2

      vm.addToast(clonedToast, vm._toastConfig)
    }).then(() => {
      expect(vm._data.toasts.length).to.equal(1)
    }).end(done)
  })

  it('should add toast if preventDuplicates and toastId and body do not exist', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor({
      propsData: { toastConfig: { preventDuplicates: true } }
    }).$mount()

    successToast.toastId = 1

    // add the container's config, as if invoked from
    // the ADD_TOAST subscription
    vm.addToast(successToast, vm._toastConfig)

    window.waitForUpdate(() => {
      expect(vm._data.toasts.length).to.equal(1)

      let clonedToast = JSON.parse(JSON.stringify(successToast))
      clonedToast.toastId = 2
      clonedToast.body = 'test body 2'

      vm.addToast(clonedToast, vm._toastConfig)
    }).then(() => {
      expect(vm._data.toasts.length).to.equal(2)
    }).end(done)
  })

  it('should unshift and pop if newestOnTop and limit is exceeded', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor({
      propsData: { toastConfig: { limit: 2 } }
    }).$mount()

    expect(vm._toastConfig.newestOnTop).to.be.true

    successToast.tosatId = 1

    // add the container's config, as if invoked from
    // the ADD_TOAST subscription
    vm.addToast(successToast, vm._toastConfig)

    window.waitForUpdate(() => {
      expect(vm._data.toasts.length).to.equal(1)

      let clonedToast = JSON.parse(JSON.stringify(successToast))
      clonedToast.toastId = 2

      vm.addToast(clonedToast, vm._toastConfig)
    }).then(() => {
      expect(vm._data.toasts.length).to.equal(2)

      let clonedToast = JSON.parse(JSON.stringify(successToast))
      clonedToast.toastId = 3

      vm.addToast(clonedToast, vm._toastConfig)
    }).then(() => {
      expect(vm._data.toasts.length).to.equal(2)
      expect(vm.toasts[0].toastId).to.equal(3)
      expect(vm.toasts[1].toastId).to.equal(2)
    }).end(done)
  })

  it('should push and shift if newestOnTop and limit is exceeded', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor({
      propsData: { toastConfig: { newestOnTop: false, limit: 2 } }
    }).$mount()

    expect(vm._toastConfig.newestOnTop).to.be.false

    successToast.tosatId = 1

    // add the container's config, as if invoked from
    // the ADD_TOAST subscription
    vm.addToast(successToast, vm._toastConfig)

    window.waitForUpdate(() => {
      expect(vm._data.toasts.length).to.equal(1)

      let clonedToast = JSON.parse(JSON.stringify(successToast))
      clonedToast.toastId = 2

      vm.addToast(clonedToast, vm._toastConfig)
    }).then(() => {
      expect(vm._data.toasts.length).to.equal(2)

      let clonedToast = JSON.parse(JSON.stringify(successToast))
      clonedToast.toastId = 3

      vm.addToast(clonedToast, vm._toastConfig)
    }).then(() => {
      expect(vm._data.toasts.length).to.equal(2)
      expect(vm.toasts[0].toastId).to.equal(2)
      expect(vm.toasts[1].toastId).to.equal(3)
    }).end(done)
  })

  it('should invoke onShowCallback if it exists', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor().$mount()

    let callback = sinon.spy()

    successToast.onShowCallback = callback

    vm.addToast(successToast, new ToastConfig())

    window.waitForUpdate(() => {
      expect(vm.toasts.length).to.equal(1)
      expect(callback.called).to.be.true
    }).end(done)
  })

  it('should set showCloseButton by toast type if toast.showCloseButton is not defined', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor({
      propsData: {
        toastConfig: {
          showCloseButton: {
            success: true,
            error: false
          }
        }
      }
    }).$mount()

    let _successToast = { type: 'success', toastId: 1 }
    vm.addToast(_successToast, vm._toastConfig)

    let _errorToast = { type: 'error', toastId: 2 }

    vm.addToast(_errorToast, vm._toastConfig)

    window.waitForUpdate(() => {
      expect(vm.toasts.length).to.equal(2)

      expect(vm.toasts[0].showCloseButton).to.be.false
      expect(vm.toasts[0].type).to.equal('error')
      expect(vm.toasts[0].closeHtml).to.be.undefined

      expect(vm.toasts[1].showCloseButton).to.be.true
      expect(vm.toasts[1].type).to.equal('success')
      expect(vm.toasts[1].closeHtml).to.equal(vm._toastConfig.closeHtml)
    }).end(done)
  })

  it('should fallback to toastConfig.showCloseButton if true', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor({
      propsData: {
        toastConfig: {
          showCloseButton: true
        }
      }
    }).$mount()

    let _successToast = { type: 'success', toastId: 1 }
    vm.addToast(_successToast, vm._toastConfig)

    let _errorToast = { type: 'error', toastId: 2 }

    vm.addToast(_errorToast, vm._toastConfig)

    window.waitForUpdate(() => {
      expect(vm.toasts.length).to.equal(2)

      expect(vm.toasts[0].showCloseButton).to.be.true
      expect(vm.toasts[0].type).to.equal('error')
      expect(vm.toasts[0].closeHtml).to.equal(vm._toastConfig.closeHtml)

      expect(vm.toasts[1].showCloseButton).to.be.true
      expect(vm.toasts[1].type).to.equal('success')
      expect(vm.toasts[1].closeHtml).to.equal(vm._toastConfig.closeHtml)
    }).end(done)
  })

  it('should fallback to toastConfig.showCloseButton if false', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor({
      propsData: {
        toastConfig: {
          showCloseButton: false
        }
      }
    }).$mount()

    let _successToast = { type: 'success', toastId: 1 }
    vm.addToast(_successToast, vm._toastConfig)

    let _errorToast = { type: 'error', toastId: 2 }

    vm.addToast(_errorToast, vm._toastConfig)

    window.waitForUpdate(() => {
      expect(vm.toasts.length).to.equal(2)

      expect(vm.toasts[0].showCloseButton).to.be.false
      expect(vm.toasts[0].type).to.equal('error')
      expect(vm.toasts[0].closeHtml).to.be.undefined

      expect(vm.toasts[1].showCloseButton).to.be.false
      expect(vm.toasts[1].type).to.equal('success')
      expect(vm.toasts[1].closeHtml).to.be.undefined
    }).end(done)
  })

  it('should not set toast.showCloseButton if toastConfig.showCloseButton undefined', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor({
      propsData: {
        toastConfig: {
          showCloseButton: undefined
        }
      }
    }).$mount()

    let _successToast = { type: 'success', toastId: 1 }
    vm.addToast(_successToast, vm._toastConfig)

    let _errorToast = { type: 'error', toastId: 2 }

    vm.addToast(_errorToast, vm._toastConfig)

    window.waitForUpdate(() => {
      expect(vm.toasts.length).to.equal(2)

      expect(vm.toasts[0].showCloseButton).to.be.undefined
      expect(vm.toasts[0].type).to.equal('error')
      expect(vm.toasts[0].closeHtml).to.be.undefined

      expect(vm.toasts[1].showCloseButton).to.be.undefined
      expect(vm.toasts[1].type).to.equal('success')
      expect(vm.toasts[1].closeHtml).to.be.undefined
    }).end(done)
  })
})

describe('ToastContainer.Vue removeToast', () => {
  beforeEach(() => {
    successToast = {
      'type': 'success',
      title: 'test',
      body: 'test body',
      toastConfig: new ToastConfig(),
      toastId: 1
    }
  })

  it('should not remove toast if toastId index < 0', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor().$mount()

    successToast.toastId = 1

    vm.addToast(successToast, new ToastConfig())

    window.waitForUpdate(() => {
      expect(vm.toasts.length).to.equal(1)
      vm.removeToast({ toastId: 2 })
    }).then(() => {
      expect(vm.toasts.length).to.equal(1)
    }).end(done)
  })

  it('should set timeoutId to null if toast.timeoutId is defined', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor().$mount()

    successToast.timeout = 10

    vm.addToast(successToast, new ToastConfig())

    window.waitForUpdate(() => {
      expect(vm.toasts.length).to.equal(1)
      expect(vm.toasts[0].timeoutId).to.be.above(0)
      expect(successToast.timeoutId).to.be.above(0)
      vm.removeToast(successToast)
    }).then(() => {
      expect(vm.toasts.length).to.equal(0)
      expect(successToast.timeoutId).to.be.null
    }).end(done)
  })

  it('should invoke onShowCallback if it exists', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor().$mount()

    let callback = sinon.spy()

    successToast.onHideCallback = callback

    vm.addToast(successToast, new ToastConfig())

    window.waitForUpdate(() => {
      expect(vm.toasts.length).to.equal(1)
      vm.removeToast(successToast)
    }).then(() => {
      expect(callback.called).to.be.true
      expect(vm.toasts.length).to.equal(0)
    }).end(done)
  })
})

describe('ToastContainer.Vue removeToasts', () => {
  it('should only remove toasts from the target toastContainerId if toastContainerId is defined', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm1 = new Constructor({
      propsData: { toastConfig: { toastContainerId: 1 } }
    }).$mount()

    const vm2 = new Constructor({
      propsData: { toastConfig: { toastContainerId: 2 } }
    }).$mount()

    let successToast = { type: 'success', body: 'success test', toastId: 1 }
    let errorToast = { type: 'error', body: 'error test', toastId: 2 }

    // add the container's config, as if invoked from
    // the ADD_TOAST subscription
    vm1.addToast(successToast, vm1._toastConfig)
    vm1.addToast(errorToast, vm2._toastConfig)
    vm2.addToast(successToast, vm1._toastConfig)
    vm2.addToast(errorToast, vm2._toastConfig)

    window.waitForUpdate(() => {
      expect(vm1.toasts.length).to.equal(2)
      expect(vm2.toasts.length).to.equal(2)

      vm1.removeToasts(null, 1)
    }).then(() => {
      expect(vm1.toasts.length).to.equal(0)
      expect(vm2.toasts.length).to.equal(2)
    }).end(done)
  })

  it('should remove toast by id from only the target toastContainerId if toastContainerId is defined', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm1 = new Constructor({
      propsData: { toastConfig: { toastContainerId: 1 } }
    }).$mount()

    const vm2 = new Constructor({
      propsData: { toastConfig: { toastContainerId: 2 } }
    }).$mount()

    let successToast = { toastId: 1, type: 'success', body: 'success test' }
    let errorToast = { toastId: 2, type: 'error', body: 'error test' }

    // add the container's config, as if invoked from
    // the ADD_TOAST subscription
    vm1.addToast(successToast, vm1._toastConfig)
    vm1.addToast(errorToast, vm2._toastConfig)
    vm2.addToast(successToast, vm1._toastConfig)
    vm2.addToast(errorToast, vm2._toastConfig)

    window.waitForUpdate(() => {
      expect(vm1.toasts.length).to.equal(2)
      expect(vm2.toasts.length).to.equal(2)

      vm1.removeToasts(1, 1)
    }).then(() => {
      expect(vm1.toasts.length).to.equal(1)
      expect(vm2.toasts.length).to.equal(2)
    }).end(done)
  })

  it('should not remove toasts from the target toastContainerId if toastContainerId does not match config', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm1 = new Constructor({
      propsData: { toastConfig: { toastContainerId: 1 } }
    }).$mount()

    const vm2 = new Constructor({
      propsData: { toastConfig: { toastContainerId: 2 } }
    }).$mount()

    let successToast = { type: 'success', body: 'success test', toastId: 1 }
    let errorToast = { type: 'error', body: 'error test', toastId: 2 }

    // add the container's config, as if invoked from
    // the ADD_TOAST subscription
    vm1.addToast(successToast, vm1._toastConfig)
    vm1.addToast(errorToast, vm2._toastConfig)
    vm2.addToast(successToast, vm1._toastConfig)
    vm2.addToast(errorToast, vm2._toastConfig)

    window.waitForUpdate(() => {
      expect(vm1.toasts.length).to.equal(2)
      expect(vm2.toasts.length).to.equal(2)

      vm1.removeToasts(null, 3)
    }).then(() => {
      expect(vm1.toasts.length).to.equal(2)
      expect(vm2.toasts.length).to.equal(2)
    }).end(done)
  })
})
