import Vue from 'vue'
import Install from '@/index'
import Toast from '@/components/Toast'
import ToastConfig from '@/utils/toastConfig'

describe('Toast.vue', () => {
  it('should create component if toast prop exists', () => {
    Vue.use(Install)

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast: { toastConfig: new ToastConfig() } }
    }).$mount()

    expect(vm).to.not.be.null
  })
})

describe('Toast.vue onClick', () => {
  it('should trigger handler', () => {
    Vue.use(Install)

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast: { toastConfig: new ToastConfig() } }
    }).$mount()

    vm.$el.click()
  })
})
