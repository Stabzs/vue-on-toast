import ToastContainer from './components/ToastContainer.vue'
import ToastService from './services/toastService'
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

  installBus(_Vue)

  Vue.component('ToastContainer', ToastContainer)

  Vue.prototype.$vueOnToast = {
    pop: ToastService.pop,
    remove: ToastService.remove
  }
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install)
}
