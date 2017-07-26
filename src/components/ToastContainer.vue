<script>
import { ToastServiceBus } from '../services/toastServiceBus'
import TimerHelpers from '../utils/timerHelpers'
import ToastConfig from '../utils/toastConfig'
import Constants from '../utils/constants'
import Toast from './Toast.vue'

export default {
  name: 'toast-container',

  data: () => ({
    toasts: []
  }),

  components: {
    'toast': Toast
  },

  props: ['toastConfig'],

  methods: {
    addToast(toast, toastConfig) {
      toast.toastConfig = toastConfig

      if (toast.toastContainerId && toastConfig.toastContainerId &&
        toast.toastContainerId !== toastConfig.toastContainerId) {
        return
      }

      if (!toast.type) {
        toast.type = toastConfig.defaultTypeClass
      }

      if (toastConfig.preventDuplicates && this.toasts.length > 0) {
        if (toast.toastId &&
          this.toasts.some(t => t.toastId === toast.toastId)) {
          return
        } else if (this.toasts.some(t => t.body === toast.body)) {
          return
        }
      }

      this.setCloseOptions(toast, toastConfig)

      toast.bodyOutputType = toast.bodyOutputType || toastConfig.bodyOutputType

      TimerHelpers.configureTimer(toast)

      if (toastConfig.newestOnTop) {
        this.toasts.unshift(toast)
        if (this.isLimitExceeded(toastConfig)) {
          this.toasts.pop()
        }
      } else {
        this.toasts.push(toast)
        if (this.isLimitExceeded(toastConfig)) {
          this.toasts.shift()
        }
      }

      if (toast.onShowCallback) {
        toast.onShowCallback(toast)
      }
    },

    setCloseOptions(toast, toastConfig) {
      if (toast.showCloseButton === null ||
        typeof toast.showCloseButton === 'undefined') {
        if (typeof toastConfig.showCloseButton === 'object') {
          toast.showCloseButton = toastConfig.showCloseButton[toast.type]
        } else if (typeof toastConfig.showCloseButton === 'boolean') {
          toast.showCloseButton = toastConfig.showCloseButton
        }
      }

      if (toast.showCloseButton) {
        toast.closeHtml = toast.closeHtml || toastConfig.closeHtml
      }
    },

    isLimitExceeded(toastConfig) {
      return toastConfig.limit && this.toasts.length > toastConfig.limit
    },

    removeToast(toast) {
      if (toast === null || typeof toast === 'undefined') return
      var index = this.toasts.findIndex(t => t.toastId === toast.toastId)
      if (index < 0) { return }

      this.toasts.splice(index, 1)

      if (toast.timeoutId) {
        clearTimeout(toast.timeoutId)
        toast.timeoutId = null
      }

      if (toast.onHideCallback) {
        toast.onHideCallback(toast)
      }
    },

    removeToasts(toastId, toastContainerId) {
      if (toastContainerId === null ||
        typeof toastContainerId === 'undefined' ||
        toastContainerId === this._toastConfig.toastContainerId) {
        if (toastId) {
          this.removeToast(this.toasts.filter(t => t.toastId === toastId)[0])
        } else {
          this.removeAllToasts()
        }
      }
    },

    removeAllToasts() {
      for (let i = this.toasts.length - 1; i >= 0; i--) {
        this.removeToast(this.toasts[i])
      }
    }
  },

  computed: {
    _toastConfig() {
      return new ToastConfig(this.toastConfig)
    }
  },

  created() {
    ToastServiceBus.subscribers.push(this)

    ToastServiceBus.$on(Constants.ADD_TOAST, (toast) => {
      this.addToast(toast, this._toastConfig)
    })

    ToastServiceBus.$on(Constants.REMOVE_TOAST,
      (toastId, toastContainerId) => {
        this.removeToasts(toastId, toastContainerId)
      })
  },

  render(h) {
    return h(
      'transition-group', {
        name: 'toast-container',
        tag: 'div',
        'class': ['toast-container', this._toastConfig.positionClass],
        props: {
          name: this._toastConfig.animation
        }
      }, this.toasts.map((toast) => (h('toast', {
        'class': 'toast',
        props: {
          toast: toast
        },
        key: toast
      })))
    )
  }
}
</script>

<<style lang="stylus">
$v = '.vue-on-toast'

.toast-container
  position fixed
  z-index 999999
  pointer-events auto

#toast-container *
  -moz-box-sizing border-box
  -webkit-box-sizing border-box
  box-sizing border-box

.toast-container > div
    margin 0 0 6px
    padding 15px 15px 15px 10px
    width 300px
    -moz-border-radius 3px 3px 3px 3px
    -webkit-border-radius 3px 3px 3px 3px
    border-radius 3px 3px 3px 3px
    -moz-box-shadow 0 0 12px #999999
    -webkit-box-shadow 0 0 12px #999999
    box-shadow 0 0 12px #999999
    color #ffffff

.toast-container > :hover
  -moz-box-shadow 0 0 12px #000000
  -webkit-box-shadow 0 0 12px #000000
  box-shadow 0 0 12px #000000
  cursor pointer

.toast-container.toast-center,
.toast-container.toast-top-center,
.toast-container.toast-bottom-center
  width 100%
  pointer-events none
  left 0
  right 0

.toast-container.toast-center > div,
.toast-container.toast-top-center > div,
.toast-container.toast-bottom-center > div
  margin 6px auto
  pointer-events auto

.toast-container.toast-center > button,
.toast-container.toast-top-center > button,
.toast-container.toast-bottom-center > button
  pointer-events auto


{$v}-top-full-width
  top 0
  right 0
  width 100%

{$v}-bottom-full-width
  bottom 0
  right 0
  width 100%

{$v}-top-left 
  top 12px
  left 12px

{$v}-top-center 
  top 12px

{$v}-top-right
  top 12px
  right 12px

{$v}-bottom-right
  right 12px
  bottom 12px

{$v}-bottom-center
  bottom 12px

{$v}-bottom-left
  bottom 12px
  left 12px

{$v}-center
  top 45%

.ease-out-right-enter
  opacity 0
  transform translateX(200%)

.ease-out-right-enter-to
  transition all 0.5s
  transform translateX(0%)

.ease-out-right-leave-to
  opacity 0
  transition all 0.5s
  transform translateX(100%)

.ease-out-left-enter
  opacity 0
  transform translateX(-200%)

.ease-out-left-enter-to
  transition all 0.5s
  transform translateX(0%)

.ease-out-left-leave-to
  opacity 0
  transition all 0.5s
  transform translateX(-100%)

.ease-out-right-leave-active, .ease-out-left-leave-active
  position absolute

.ease-out-right-move, .ease-out-left-move
  transition all 0.5s

.fade-enter-active, .fade-leave-active
  transition all 0.5s linear

.fade-leave-active
  position absolute

.fade-enter, .fade-leave-to
  opacity 0
  transform translateX(0px)

.fade-move
  transition all 0.5s

</style>
