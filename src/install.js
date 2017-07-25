import ToastContainer from './components/ToastContainer.vue'
import {
  installBus
} from './services/toastServiceBus'

import ToastService from './services/toastService'

import Constants from './utils/constants'

export let _Vue

export function install(Vue) {
  if (install.installed) {
    return
  }

  install.installed = true

  _Vue = Vue

  installBus()

  Vue.component('ToastContainer', ToastContainer)

  Vue.prototype.$vue2toaster = {
    pop: ToastService.pop,
    remove: ToastService.remove,
    Constants
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install)
}
