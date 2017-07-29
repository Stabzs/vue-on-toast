import {
  ToastServiceBus
} from '../services/toastServiceBus'
import Constants from './constants'

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
        ToastServiceBus.$emit(Constants.REMOVE_TOAST,
          toast.toastId, toast.toastContainerId)
      }, timeout)
    }
  }
}
