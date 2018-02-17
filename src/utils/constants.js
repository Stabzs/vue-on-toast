const v = 'vot'

// Toast Types
export const types = {
  success: 'success',
  error: 'error',
  info: 'info',
  wait: 'wait',
  warning: 'warning'
}

// Events
export const ADD_TOAST = 'addToast'
export const REMOVE_TOAST = 'removeToast'

// Toast Type style class names
export const SUCCESS_TYPE_CLASS = v + '-' + types.success
export const ERROR_TYPE_CLASS = v + '-' + types.error
export const INFO_TYPE_CLASS = v + '-' + types.info
export const WAIT_TYPE_CLASS = v + '-' + types.wait
export const WARNING_TYPE_CLASS = v + '-' + types.warning

// Toast icon style class names
export const SUCCESS_ICON_CLASS = v + '-icon-' + types.success
export const ERROR_ICON_CLASS = v + '-icon-' + types.error
export const INFO_ICON_CLASS = v + '-icon-' + types.info
export const WAIT_ICON_CLASS = v + '-icon-' + types.wait
export const WARNING_ICON_CLASS = v + '-icon-' + types.warning

// Toast style class names
export const TITLE_CLASS = v + '-title'
export const BODY_CLASS = v + '-body'

// Container position style class names
export const TOP_RIGHT_POSITION_CLASS = v + '-top-right'
export const TOP_LEFT_POSITION_CLASS = v + '-top-left'
export const TOP_FULL_WIDTH_POSITION_CLASS = v + '-top-full-width'

export const CLOSE_HTML = '<button class="toast-close-button" type="button">&times;</button>'

// Animation types
export const animations = {
  FADE: 'fade',
  EASE_OUT_LEFT: 'ease-out-left',
  EASE_OUT_RIGHT: 'ease-out-right'
}
