import Vue from 'vue'
import Install from '@/index'
import Toast from '@/components/Toast'
import Constants from '@/utils/constants'
import ToastConfig from '@/utils/toastConfig'
import BodyOutputType from '@/utils/bodyOutputType'
import { ToastServiceBus } from '@/services/toastServiceBus'

describe('Toast.vue', () => {
  it('should create component if toast prop exists', () => {
    Vue.use(Install)

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast: { toastConfig: new ToastConfig() } }
    }).$mount()

    expect(vm).to.not.be.null
  })

  it('should render TrustedHtml if bodyOutputType.TrustedHtml', () => {
    Vue.use(Install)

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: {
        toast: {
          type: 'success',
          body: '<b>bold text</b>',
          bodyOutputType: BodyOutputType.TrustedHtml,
          toastConfig: new ToastConfig()
        }
      }
    }).$mount()

    expect(vm.$el.querySelector('.vot-body b').innerHTML)
      .to.equal('bold text')
  })

  it('should not render TrustedHtml if bodyOutputType.TrustedHtml is false', () => {
    Vue.use(Install)

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: {
        toast: {
          type: 'success',
          body: '<b>bold text</b>',
          toastConfig: new ToastConfig()
        }
      }
    }).$mount()

    expect(vm.toast.bodyOutputType).to.be.undefined
    expect(vm.$el.querySelector('.vot-body b')).to.be.null
    expect(vm.$el.querySelector('.vot-body div').innerText)
      .to.equal('<b>bold text</b>')
  })

  it('should render Component if bodyOutputType.Component', () => {
    Vue.use(Install)

    let comp = Vue.component('test-component', {
      render: (h) => {
        return h('div', 'component body')
      }
    })

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: {
        toast: {
          type: 'success',
          body: comp,
          bodyOutputType: BodyOutputType.Component,
          toastConfig: new ToastConfig()
        }
      }
    }).$mount()

    expect(vm.$el.querySelector('.vot-body div').innerHTML)
      .to.equal('component body')
    expect(vm.$el.querySelector('.vot-body div').outerHTML)
      .to.equal('<div>component body</div>')
  })

  it('should throw error if attempting to render Component and bodyOutputType.Component is false', () => {
    Vue.use(Install)

    let comp = Vue.component('test-component', {
      render: (h) => {
        return h('div', 'component body')
      }
    })

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: {
        toast: {
          type: 'success',
          body: comp,
          toastConfig: new ToastConfig()
        }
      }
    }).$mount()

    expect(vm.toast.bodyOutputType).to.be.undefined
    expect(vm.$el.querySelector('.vot-body div')).to.be.null
  })
})

describe('Toast.vue onClick', () => {
  it('should trigger handler', done => {
    Vue.use(Install)

    let toast = { type: 'success', toastId: 1, toastConfig: new ToastConfig() }

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast }
    }).$mount()

    let removedToastId = null

    ToastServiceBus.$on(Constants.REMOVE_TOAST, (toastId) => {
      removedToastId = toastId
    })

    vm.$el.click()

    window.waitForUpdate(() => {
      expect(removedToastId).to.equal(toast.toastId)
    }).end(done)
  })

  it('should attempt handler if toastConfig.tapToDimiss is false and toast.showCloseButton is true and the close button was clicked', done => {
    Vue.use(Install)

    let toast = {
      type: 'success',
      toastId: 1,
      showCloseButton: true,
      toastConfig: new ToastConfig()
    }

    toast.toastConfig.tapToDismiss = false

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast }
    }).$mount()

    let removedToastId = null

    ToastServiceBus.$on(Constants.REMOVE_TOAST, (toastId) => {
      removedToastId = toastId
    })

    vm.$el.querySelector('div .toast-close-button').click()

    window.waitForUpdate(() => {
      expect(removedToastId).to.equal(toast.toastId)
    }).end(done)
  })

  it('should invoke clickHandler and remove toast if handler returns true', done => {
    Vue.use(Install)

    let clickHandler = () => { return true }
    let clickHandlerSpy = sinon.spy(clickHandler)

    let toast = {
      type: 'success',
      toastId: 1,
      clickHandler: clickHandlerSpy,
      toastConfig: new ToastConfig()
    }

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast }
    }).$mount()

    let removedToastId = null

    ToastServiceBus.$on(Constants.REMOVE_TOAST, (toastId) => {
      removedToastId = toastId
    })

    vm.$el.click()

    window.waitForUpdate(() => {
      expect(clickHandlerSpy.getCalls().calledOnce)
      expect(removedToastId).to.equal(toast.toastId)
    }).end(done)
  })

  it('should invoke clickHandler and not remove toast clickHandler returns false', done => {
    Vue.use(Install)

    let clickHandler = () => { return false }
    let clickHandlerSpy = sinon.spy(clickHandler)

    let toast = {
      type: 'success',
      toastId: 1,
      clickHandler: clickHandlerSpy,
      toastConfig: new ToastConfig()
    }

    toast.toastConfig.tapToDismiss = true

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast }
    }).$mount()

    let removedToastId = null

    ToastServiceBus.$on(Constants.REMOVE_TOAST, (toastId) => {
      removedToastId = toastId
    })

    vm.$el.click()

    window.waitForUpdate(() => {
      expect(clickHandlerSpy.getCalls().calledOnce)
      expect(removedToastId).to.be.null
    }).end(done)
  })

  it('should invoke clickHandler and not remove toast if tapToDismiss and showCloseButton are false', done => {
    Vue.use(Install)

    let toast = {
      type: 'success',
      toastId: 1,
      showCloseButton: true,
      toastConfig: new ToastConfig()
    }

    toast.toastConfig.tapToDismiss = false

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast }
    }).$mount()

    let removedToastId = null

    ToastServiceBus.$on(Constants.REMOVE_TOAST, (toastId) => {
      removedToastId = toastId
    })

    vm.$el.click()

    window.waitForUpdate(() => {
      expect(removedToastId).to.be.null
    }).end(done)
  })

  it('should invoke clickHandler and log error if clickHandler is not a function', done => {
    Vue.use(Install)

    let consoleSpy = sinon.spy(console, 'log')

    let toast = {
      type: 'success',
      toastId: 1,
      clickHandler: {},
      toastConfig: new ToastConfig()
    }

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast }
    }).$mount()

    let removedToastId = null

    ToastServiceBus.$on(Constants.REMOVE_TOAST, (toastId) => {
      removedToastId = toastId
    })

    vm.$el.click()

    window.waitForUpdate(() => {
      expect(consoleSpy.getCalls()[0].calledWith('The toast click handler is not a callable function.'))
      expect(removedToastId).to.be.null
    }).end(done)
  })
})

describe('Toast.vue stop', () => {
  it('should clear timeoutId if toastConfig.mouseoverTimerStop is true', () => {
    Vue.use(Install)

    let toast = { type: 'success', toastId: 1, timeoutId: 1, toastConfig: new ToastConfig() }
    toast.toastConfig.mouseoverTimerStop = true

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast }
    }).$mount()

    expect(vm.toast.timeoutId).to.equal(1)

    vm.stopTimer(vm.toast)

    expect(vm.toast.timeoutId).to.be.null
  })

  it('should not clear timeoutId if toastConfig.mouseoverTimerStop is false', () => {
    Vue.use(Install)

    let toast = { type: 'success', toastId: 1, timeoutId: 1, toastConfig: new ToastConfig() }
    toast.toastConfig.mouseoverTimerStop = false

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast }
    }).$mount()

    expect(vm.toast.timeoutId).to.equal(1)

    vm.stopTimer(vm.toast)

    expect(vm.toast.timeoutId).to.equal(1)
  })

  it('should not clear timeoutId if toastConfig.mouseoverTimerStop is null', () => {
    Vue.use(Install)

    let toast = { type: 'success', toastId: 1, timeoutId: 1, toastConfig: new ToastConfig() }
    toast.toastConfig.mouseoverTimerStop = null

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast }
    }).$mount()

    expect(vm.toast.timeoutId).to.equal(1)

    vm.stopTimer(vm.toast)

    expect(vm.toast.timeoutId).to.equal(1)
  })

  it('should not clear timeoutId if toastConfig.mouseoverTimerStop is undefined', () => {
    Vue.use(Install)

    let toast = { type: 'success', toastId: 1, timeoutId: 1, toastConfig: new ToastConfig() }
    toast.toastConfig.mouseoverTimerStop = undefined

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast }
    }).$mount()

    expect(vm.toast.timeoutId).to.equal(1)

    vm.stopTimer(vm.toast)

    expect(vm.toast.timeoutId).to.equal(1)
  })

  it('should not clear timeoutId if toastConfig.mouseoverTimerStop is true and timeoutId is undefined', () => {
    Vue.use(Install)

    let toast = { type: 'success', toastId: 1, timeoutId: undefined, toastConfig: new ToastConfig() }
    toast.toastConfig.mouseoverTimerStop = true

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast }
    }).$mount()

    expect(vm.toast.timeoutId).to.be.undefined

    vm.stopTimer(vm.toast)

    expect(vm.toast.timeoutId).to.be.undefined
  })

  it('should not clear timeoutId if toastConfig.mouseoverTimerStop is true and timeoutId is zero', () => {
    Vue.use(Install)

    let toast = { type: 'success', toastId: 1, timeoutId: 0, toastConfig: new ToastConfig() }
    toast.toastConfig.mouseoverTimerStop = true

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast }
    }).$mount()

    expect(vm.toast.timeoutId).to.equal(0)

    vm.stopTimer(vm.toast)

    expect(vm.toast.timeoutId).to.equal(0)
  })
})

describe('Toast.vue restartTimer', () => {
  it('should reset timeoutId if toastConfig.mouseoverTimerStop is true, timeout is greater than zero, and timeoutId is null', () => {
    Vue.use(Install)

    let toast = { type: 'success', toastId: 1, timeout: 5, timeoutId: null, toastConfig: new ToastConfig() }
    toast.toastConfig.mouseoverTimerStop = true

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast }
    }).$mount()

    expect(vm.toast.timeoutId).to.be.null
    expect(vm.toast.timeout).to.equal(5)

    vm.restartTimer(vm.toast)

    expect(vm.toast.timeoutId).to.be.above(0)
    expect(vm.toast.timeout).to.equal(5)
  })

  it('should not reset timeoutId if toastConfig.mouseoverTimerStop is false', () => {
    Vue.use(Install)

    let toast = { type: 'success', toastId: 1, timeout: 5, timeoutId: null, toastConfig: new ToastConfig() }
    toast.toastConfig.mouseoverTimerStop = false

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast }
    }).$mount()

    expect(vm.toast.timeoutId).to.be.null
    expect(vm.toast.timeout).to.equal(5)

    vm.restartTimer(vm.toast)

    expect(vm.toast.timeoutId).to.be.null
    expect(vm.toast.timeout).to.equal(5)
  })

  it('should not reset timeoutId if toastConfig.mouseoverTimerStop is true and timeoutId is greater than zero', () => {
    Vue.use(Install)

    let toast = { type: 'success', toastId: 1, timeout: 5, timeoutId: 2, toastConfig: new ToastConfig() }
    toast.toastConfig.mouseoverTimerStop = true

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast }
    }).$mount()

    expect(vm.toast.timeoutId).to.equal(2)
    expect(vm.toast.timeout).to.equal(5)

    vm.restartTimer(vm.toast)

    expect(vm.toast.timeoutId).to.equal(2)
    expect(vm.toast.timeout).to.equal(5)
  })

  it('should remove toast if toastConfig.mouseoverTimerStop is false and timeoutId is null', () => {
    Vue.use(Install)

    let toast = { type: 'success', toastId: 1, timeout: 5, timeoutId: null, toastConfig: new ToastConfig() }
    toast.toastConfig.mouseoverTimerStop = false

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast }
    }).$mount()

    let removedToastId = null

    ToastServiceBus.$on(Constants.REMOVE_TOAST, (toastId) => {
      removedToastId = toastId
    })

    expect(vm.toast.timeoutId).to.be.null
    expect(vm.toast.timeout).to.equal(5)
    expect(removedToastId).to.be.null

    vm.restartTimer(vm.toast)

    expect(vm.toast.timeoutId).to.be.null
    expect(vm.toast.timeout).to.equal(5)
    expect(removedToastId).to.equal(1)
  })

  it('should not remove toast if toastConfig.mouseoverTimerStop is false and timeoutId is defined', () => {
    Vue.use(Install)

    let toast = { type: 'success', toastId: 1, timeout: 5, timeoutId: 2, toastConfig: new ToastConfig() }
    toast.toastConfig.mouseoverTimerStop = false

    const Constructor = Vue.extend(Toast)
    const vm = new Constructor({
      propsData: { toast }
    }).$mount()

    let removedToastId = null

    ToastServiceBus.$on(Constants.REMOVE_TOAST, (toastId) => {
      removedToastId = toastId
    })

    expect(vm.toast.timeoutId).to.equal(2)
    expect(vm.toast.timeout).to.equal(5)
    expect(removedToastId).to.be.null

    vm.restartTimer(vm.toast)

    expect(vm.toast.timeoutId).to.equal(2)
    expect(vm.toast.timeout).to.equal(5)
    expect(removedToastId).to.be.null
  })
})
