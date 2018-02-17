export let ToastServiceBus

export function installBus(_Vue) {
  if (!_Vue) {
    throw new Error('Vue is not installed')
  }

  ToastServiceBus = new _Vue()
  ToastServiceBus.subscribers = []
}
