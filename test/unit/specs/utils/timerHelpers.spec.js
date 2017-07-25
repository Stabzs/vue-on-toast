import Constants from '@/utils/constants'
import TimerHelpers from '@/utils/timerHelpers'
import { ToastServiceBus } from '@/services/toastServiceBus'

describe('timerHelpers.js', () => {
  it('should set timeout to numeric value if passed numeric value', () => {
    let toast = { timeout: 1 }

    expect(toast.timeoutId).to.be.undefined

    TimerHelpers.configureTimer(toast)

    expect(toast.timeoutId).to.be.defined
    expect(toast.timeoutId).to.be.above(0)
  })

  it('should fallback to toast.toastConfig if toast.timeout is undefined', () => {
    let toast = { toastConfig: { timeout: 1 } }

    expect(toast.timeout).to.be.undefined
    expect(toast.timeoutId).to.be.undefined

    TimerHelpers.configureTimer(toast)

    expect(toast.timeoutId).to.be.defined
    expect(toast.timeoutId).to.be.above(0)
  })

  it('should fallback to toast.toastConfig if toast.timeout is function', () => {
    let toast = { timeout: () => {}, toastConfig: { timeout: 1 } }

    expect(toast.timeout).to.be.function
    expect(toast.timeoutId).to.be.undefined

    TimerHelpers.configureTimer(toast)

    expect(toast.timeoutId).to.be.defined
    expect(toast.timeoutId).to.be.above(0)
  })

  it('should fallback to toast.toastConfig if toast.timeout is string', () => {
    let toast = { timeout: '', toastConfig: { timeout: 1 } }

    expect(toast.timeout).to.be.string
    expect(toast.timeoutId).to.be.undefined

    TimerHelpers.configureTimer(toast)

    expect(toast.timeoutId).to.be.defined
    expect(toast.timeoutId).to.be.above(0)
  })

  it('should not set timeout if toast.timeout and toast.toastConfig.timeout are undefined', () => {
    let toast = { toastConfig: {} }

    expect(toast.timeout).to.be.undefined
    expect(toast.toastConfig.timeout).to.be.undefined

    TimerHelpers.configureTimer(toast)

    expect(toast.timeoutId).to.be.undefined
  })

  it('should use toast.toastConfig.timeout by type when object', () => {
    let toast = {
      type: 'success',
      toastConfig: {
        timeout: { 'success': 1, 'info': 2 }
      }
    }

    TimerHelpers.configureTimer(toast)

    expect(toast.timeoutId).to.be.defined
    expect(toast.timeoutId).to.be.above(0)
  })

  it('should not toast.toastConfig.timeout by type when object property is not found', () => {
    let toast = {
      type: 'error',
      toastConfig: {
        timeout: { 'success': 1, 'info': 2 }
      }
    }

    TimerHelpers.configureTimer(toast)

    expect(toast.timeoutId).to.be.undefined
  })

  it('should emit remove toast when timer expires', done => {
    let toast = { toastId: 1, timeout: 1 }

    expect(toast.timeoutId).to.be.undefined

    ToastServiceBus.$on(Constants.REMOVE_TOAST, (toastId) => {
      delete toast.timeoutId
    })

    TimerHelpers.configureTimer(toast)

    expect(toast.timeoutId).to.be.defined
    expect(toast.timeoutId).to.be.above(0)

    window.waitForUpdate(() => {})
      .end(() => {
        expect(toast.timeoutId)
        done()
      })
  })
})
