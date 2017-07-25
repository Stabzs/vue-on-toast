import Constants from './constants'

export default function(toastConfig) {
  const toastConfigDefaults = {
    closeHtml: Constants.DEFAULT_CLOSE_HTML,
    defaultTypeClass: Constants.INFO_TYPE_CLASS,
    typeClasses: {
      error: Constants.ERROR_TYPE_CLASS,
      info: Constants.INFO_TYPE_CLASS,
      wait: Constants.WAIT_TYPE_CLASS,
      success: Constants.SUCCESS_TYPE_CLASS,
      warning: Constants.WARNING_TYPE_CLASS
    },
    iconClasses: {
      error: Constants.ERROR_ICON_CLASS,
      info: Constants.INFO_ICON_CLASS,
      wait: Constants.WAIT_ICON_CLASS,
      success: Constants.SUCCESS_ICON_CLASS,
      warning: Constants.WARNING_ICON_CLASS
    },
    messageClass: Constants.MESSAGE_CLASS,
    mouseoverTimerStop: false,
    newestOnTop: true,
    positionClass: Constants.TOP_RIGHT_POSITION_CLASS,
    preventDuplicates: false,
    tapToDismiss: true,
    timeout: 0,
    titleClass: Constants.TITLE_CLASS,
    toastContainerId: null,
    animation: Constants.animations.FADE
  }

  toastConfig = Object.assign(toastConfigDefaults, toastConfig)

  toastConfig.typeClasses = Object.assign(
    toastConfigDefaults.typeClasses, toastConfig.typeClasses)

  toastConfig.iconClasses = Object.assign(
    toastConfigDefaults.iconClasses, toastConfig.iconClasses)

  return toastConfig
}
