<template>
  <div v-on:click="onClick(toast, $event)" v-bind:class="['toast', classes.typeClass]"
    v-on:mouseover="stopTimer(toast)" v-on:mouseout="restartTimer(toast)">
    <i class="toaster-icon" v-bind:class="classes.iconClass"></i>
    <div class="toast-content">
      <div v-bind:class="classes.titleClass">{{toast.title}}</div>
      <div v-bind:class="classes.bodyClass">
        <component v-if="toast.bodyOutputType == bodyOutputType.Component" :is="toast.body"></component>
        <div v-else-if="toast.bodyOutputType == bodyOutputType.TrustedHtml" v-html="toast.body"></div>
        <div v-else-if="typeof toast.body === 'string'">{{toast.body}}</div>
      </div>
    </div>
    <div class="toast-close-button" v-if="toast.showCloseButton" v-on:click="onClick(toast, $event, true)"
      v-html="toast.toastConfig.closeHtml">
    </div>
  </div>
</template>


<script>
import Constants from '../utils/constants'
import BodyOutputType from '../utils/bodyOutputType'
import { ToastServiceBus } from '../services/toastServiceBus'
import Timer from '../utils/timer'

export default {
  name: 'toast',

  props: { toast: Object },

  computed: {
    classes() {
      return {
        typeClass: this.toast.toastConfig.typeClasses[this.toast.type],
        iconClass: this.toast.toastConfig.iconClasses[this.toast.type],
        titleClass: this.toast.toastConfig.titleClass,
        bodyClass: this.toast.toastConfig.bodyClass
      }
    },
    bodyOutputType() {
      return BodyOutputType
    }
  },

  methods: {
    onClick: function(toast, event, isCloseButton) {
      event.stopPropagation()

      if (toast.toastConfig.tapToDismiss ||
        (toast.showCloseButton && isCloseButton)) {
        let removeToast = true
        if (toast.clickHandler) {
          if (typeof toast.clickHandler === 'function') {
            removeToast = toast.clickHandler(toast, isCloseButton)
          } else {
            console.log('The toast click handler is not a callable function.')
            return false
          }
        }

        if (removeToast) {
          ToastServiceBus.$emit(Constants.REMOVE_TOAST, toast.toastId,
            toast.toastContainerId)
        }
      }
    },

    stopTimer: (toast) => {
      if (toast.toastConfig.mouseoverTimerStop) {
        if (toast.timeoutId) {
          window.clearTimeout(toast.timeoutId)
          toast.timeoutId = null
        }
      }
    },

    restartTimer: (toast) => {
      if (toast.toastConfig.mouseoverTimerStop) {
        if (!toast.timeoutId) {
          Timer.configureTimer(toast)
        }
      } else if (toast.timeoutId === null) {
        ToastServiceBus.$emit(Constants.REMOVE_TOAST,
          toast.toastId,
          toast.toastContainerId
        )
      }
    }
  }
}

</script>

<<style lang="stylus">
$v = '.vot'

.toast
  display -webkit-flex
  display flex
  -webkit-flex-direction: row
  flex-direction row
  -webkit-justify-content flex-start
  justify-content flex-start
  background-color #030303
  margin-right 10px

.toaster-icon
  font-weight normal
  color #ffffff

{$v}-title
  font-weight bold

{$v}-message 
  -ms-word-wrap break-word
  word-wrap break-word

{$v}-message a,
{$v}-message label 
  color #ffffff

{$v}-message a:hover 
  color #cccccc
  text-decoration none

.toast-close-button
  position relative
  right -0.2em
  top -0.2em
  float right
  font-size 20px
  font-weight bold
  color #ffffff
  -webkit-text-shadow 0 1px 0 #ffffff
  text-shadow 0 1px 0 #ffffff
  opacity 0.8
  z-index: 999

.toast-close-button:hover,
.toast-close-button:focus
  color #000000
  text-decoration none
  cursor pointer
  opacity 0.4

/*Additional properties for button version
 iOS requires the button element instead of an anchor tag.
 If you want the anchor version, it requires `href="#"`.*/
button.toast-close-button
  padding 0
  cursor pointer
  background transparent
  border 0
  -webkit-appearance none

.toast-content
  width 95%
  margin-left 10px


$icon-base 
    width 35px
    display flex
    background-repeat no-repeat
    background-position 100% 50%

{$v}-icon-info
    @extends $icon-base
    background-image url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=")

{$v}-icon-wait
    @extends $icon-base 
    background-size 29px 29px
    background-image url("data:image/gif;base64,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")

{$v}-icon-error
    @extends $icon-base 
    background-image url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHOSURBVEhLrZa/SgNBEMZzh0WKCClSCKaIYOED+AAKeQQLG8HWztLCImBrYadgIdY+gIKNYkBFSwu7CAoqCgkkoGBI/E28PdbLZmeDLgzZzcx83/zZ2SSXC1j9fr+I1Hq93g2yxH4iwM1vkoBWAdxCmpzTxfkN2RcyZNaHFIkSo10+8kgxkXIURV5HGxTmFuc75B2RfQkpxHG8aAgaAFa0tAHqYFfQ7Iwe2yhODk8+J4C7yAoRTWI3w/4klGRgR4lO7Rpn9+gvMyWp+uxFh8+H+ARlgN1nJuJuQAYvNkEnwGFck18Er4q3egEc/oO+mhLdKgRyhdNFiacC0rlOCbhNVz4H9FnAYgDBvU3QIioZlJFLJtsoHYRDfiZoUyIxqCtRpVlANq0EU4dApjrtgezPFad5S19Wgjkc0hNVnuF4HjVA6C7QrSIbylB+oZe3aHgBsqlNqKYH48jXyJKMuAbiyVJ8KzaB3eRc0pg9VwQ4niFryI68qiOi3AbjwdsfnAtk0bCjTLJKr6mrD9g8iq/S/B81hguOMlQTnVyG40wAcjnmgsCNESDrjme7wfftP4P7SP4N3CJZdvzoNyGq2c/HWOXJGsvVg+RA/k2MC/wN6I2YA2Pt8GkAAAAASUVORK5CYII=")
    
{$v}-icon-success
    @extends $icon-base 
    background-image url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==")

{$v}-icon-warning
    @extends $icon-base 
    background-image url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVEhL5ZSvTsNQFMbXZGICMYGYmJhAQIJAICYQPAACiSDB8AiICQQJT4CqQEwgJvYASAQCiZiYmJhAIBATCARJy+9rTsldd8sKu1M0+dLb057v6/lbq/2rK0mS/TRNj9cWNAKPYIJII7gIxCcQ51cvqID+GIEX8ASG4B1bK5gIZFeQfoJdEXOfgX4QAQg7kH2A65yQ87lyxb27sggkAzAuFhbbg1K2kgCkB1bVwyIR9m2L7PRPIhDUIXgGtyKw575yz3lTNs6X4JXnjV+LKM/m3MydnTbtOKIjtz6VhCBq4vSm3ncdrD2lk0VgUXSVKjVDJXJzijW1RQdsU7F77He8u68koNZTz8Oz5yGa6J3H3lZ0xYgXBK2QymlWWA+RWnYhskLBv2vmE+hBMCtbA7KX5drWyRT/2JsqZ2IvfB9Y4bWDNMFbJRFmC9E74SoS0CqulwjkC0+5bpcV1CZ8NMej4pjy0U+doDQsGyo1hzVJttIjhQ7GnBtRFN1UarUlH8F3xict+HY07rEzoUGPlWcjRFRr4/gChZgc3ZL2d8oAAAAASUVORK5CYII=")


{$v}-info
  background-color #2f96b4

{$v}-success
  background-color #51a351

{$v}-error
  background-color #bd362f

{$v}-wait
  background-color #2f96b4

{$v}-warning
  background-color #f89406
</style>
