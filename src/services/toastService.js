import {
  ToastServiceBus
} from './toastServiceBus'
import { ADD_TOAST, REMOVE_TOAST, REMOVE_TOAST_BY_TYPE } from '../utils/constants'

export default {
  /**
   * Synchronously create and show a new toast instance.
   *
   * @param {(string | Toast)} type The type of the toast, or a Toast object.
   * @param {string=} title The toast title.
   * @param {string=} body The toast body.
   * @returns {Toast}
   *    The newly created Toast instance with a randomly generated GUID Id.
   */
  pop(type, title, body) {
    let toast = typeof type === 'string' ? {
      type: type,
      title: title,
      body: body
    } : type

    if (!toast || !toast.type || !toast.type.length) {
      throw new Error('A toast type must be provided')
    }

    if (ToastServiceBus.subscribers.length < 1) {
      throw new Error(
        'No Toaster Containers have been initialized to receive toasts.')
    }

    toast.toastId = Guid.newGuid()

    ToastServiceBus.$emit(ADD_TOAST, toast)

    return toast
  },

  /**
   * Removes a toast by toastId and/or toastContainerId.
   *
   * @param {string} toastId The toastId of the toast to remove.
   * @param {number=} toastContainerId
   *        The toastContainerId of the container to remove toasts from.
   */
  remove(toastId, toastContainerId) {
    ToastServiceBus.$emit(REMOVE_TOAST, toastId, toastContainerId)
  },

  /**
   * Removes all toasts by type
   *
   * @param {string} type The toast type to remove.
   */
  removeByType(type) {
    ToastServiceBus.$emit(REMOVE_TOAST_BY_TYPE, type)
  }
}

// http://stackoverflow.com/questions/26501688/a-typescript-guid-class
class Guid {
  static newGuid() {
    function match(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, match)
  }
}
