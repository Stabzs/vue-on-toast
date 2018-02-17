import {
  ToastServiceBus
} from '../services/toastServiceBus'
import {
  REMOVE_TOAST
} from './constants'

export default {
  configureTimer(toast) {
    let timeout = (typeof toast.timeout === 'number')
      ? toast.timeout
      : toast.toastConfig.timeout

    if (typeof timeout === 'object') {
      timeout = timeout[toast.type]
    }

    if (timeout > 0) {
      toast.timeoutId = setTimeout(() => {
        ToastServiceBus.$emit(REMOVE_TOAST,
          toast.toastId, toast.toastContainerId)
      }, timeout)
    }
  }
}
