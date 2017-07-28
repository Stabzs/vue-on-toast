import ToastService from '@/services/toastService'
import { ToastServiceBus } from '@/services/toastServiceBus'
import Constants from '@/utils/constants'

describe('toastService.js pop', () => {
  beforeEach(() => {
    ToastServiceBus.subscribers.push({})
  })

  it('should return the toast instance', () => {
    let toast = { toastId: 1, type: 'success' }
    let poppedToast = ToastService.pop(toast)

    expect(poppedToast).to.equal(toast)
  })

  it('should accept type, title, and string params instead of a toast object', () => {
    let poppedToast = ToastService.pop('success', 'title', 'body')
    expect(poppedToast.type).to.equal('success')
    expect(poppedToast.title).to.equal('title')
    expect(poppedToast.body).to.equal('body')
  })

  it('should throw if type is null', () => {
    expect(ToastService.pop.bind(ToastService, null)).to.throw('A toast type must be provided')
  })

  it('should throw if type is undefined', () => {
    expect(ToastService.pop.bind(ToastService, undefined)).to.throw('A toast type must be provided')
  })

  it('should throw if type is empty string', () => {
    expect(ToastService.pop.bind(ToastService, '')).to.throw('A toast type must be provided')
  })

  it('should throw if title is null', () => {
    ToastServiceBus.subscribers = []

    expect(ToastService.pop.bind(ToastService, 'success')).to.throw('No Toaster Containers have been initialized to receive toasts.')
  })
})

describe('toastService.js removeToast', () => {
  it('should emit REMOVE_TOAST event with toastId', () => {
    let emittedToastId = null

    ToastServiceBus.$on(Constants.REMOVE_TOAST, (toastId) => {
      emittedToastId = toastId
    })

    ToastService.remove(1)

    expect(emittedToastId).to.equal(1)
  })

  it('should emit REMOVE_TOAST event with toastId and toastContainerId', () => {
    let emittedToastId = null
    let emittedToastContainerId = null

    ToastServiceBus.$on(Constants.REMOVE_TOAST, (toastId, toastContainerId) => {
      emittedToastId = toastId
      emittedToastContainerId = toastContainerId
    })

    ToastService.remove(1, 1)

    expect(emittedToastId).to.equal(1)
    expect(emittedToastContainerId).to.equal(1)
  })
})
