import {
  _Vue
} from '../install'

export let ToastServiceBus

export function installBus() {
  if (!_Vue) {
    throw new Error('Vue is not installed')
  }

  ToastServiceBus = new _Vue()
  ToastServiceBus.subscribers = []
}
