import Vue from 'vue'
import Install from '@/index'
import ToastConfig from '@/utils/toastConfig'
import ToastContainer from '@/components/ToastContainer'

describe('ToastContainer.vue', () => {
  let successToast = {}
  beforeEach(() => {
    successToast = { 'type': 'success', title: 'test', body: 'test body', toastConfig: new ToastConfig() }
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

  it('should add toast', done => {
    Vue.use(Install)

    const Constructor = Vue.extend(ToastContainer)
    const vm = new Constructor()

    vm.$mount()

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

    Vue.nextTick(() => {
      expect(vm._data.toasts.length).to.equal(0)
      done()
    })
  })
})
