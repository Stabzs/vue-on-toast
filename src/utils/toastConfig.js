import Constants from './constants'

export default function(toastConfig) {
  const toastConfigDefaults = {
    animation: Constants.animations.FADE,
    bodyClass: Constants.BODY_CLASS,
    closeHtml: Constants.CLOSE_HTML,
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
    mouseoverTimerStop: false,
    newestOnTop: true,
    positionClass: Constants.TOP_RIGHT_POSITION_CLASS,
    preventDuplicates: false,
    tapToDismiss: true,
    timeout: 5000,
    titleClass: Constants.TITLE_CLASS,
    toastContainerId: null,
    showCloseButton: false
  }

  toastConfig = Object.assign(toastConfigDefaults, toastConfig)

  toastConfig.typeClasses = Object.assign(
    toastConfigDefaults.typeClasses, toastConfig.typeClasses)

  toastConfig.iconClasses = Object.assign(
    toastConfigDefaults.iconClasses, toastConfig.iconClasses)

  return toastConfig
}
