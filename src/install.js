import ToastContainer from './components/ToastContainer.vue'
import ToastService from './services/toastService'
import Constants from './utils/constants'
import {
  installBus
} from './services/toastServiceBus'

export let _Vue

export function install(Vue) {
  if (install.installed) {
    return
  }

  install.installed = true

  _Vue = Vue

  installBus()

  Vue.component('ToastContainer', ToastContainer)

  Vue.prototype.$vueOnToast = {
    pop: ToastService.pop,
    remove: ToastService.remove,
    Constants
  }
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install)
}
