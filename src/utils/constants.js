const v = 'vot'
const types = {
  success: 'success',
  error: 'error',
  info: 'info',
  wait: 'wait',
  warning: 'warning'
}

export default {
  // Events
  ADD_TOAST: 'addToast',
  REMOVE_TOAST: 'removeToast',

  // Toast Types
  types: types,

  // Toast Type style class names
  SUCCESS_TYPE_CLASS: v + '-' + types.success,
  ERROR_TYPE_CLASS: v + '-' + types.error,
  INFO_TYPE_CLASS: v + '-' + types.info,
  WAIT_TYPE_CLASS: v + '-' + types.wait,
  WARNING_TYPE_CLASS: v + '-' + types.warning,

  // Toast icon style class names
  SUCCESS_ICON_CLASS: v + '-icon-' + types.success,
  ERROR_ICON_CLASS: v + '-icon-' + types.error,
  INFO_ICON_CLASS: v + '-icon-' + types.info,
  WAIT_ICON_CLASS: v + '-icon-' + types.wait,
  WARNING_ICON_CLASS: v + '-icon-' + types.warning,

  // Toast style class names
  TITLE_CLASS: v + '-title',
  BODY_CLASS: v + '-body',

  // Container position style class names
  TOP_RIGHT_POSITION_CLASS: v + '-top-right',
  TOP_LEFT_POSITION_CLASS: v + '-top-left',
  TOP_FULL_WIDTH_POSITION_CLASS: v + '-top-full-width',

  CLOSE_HTML: '<button class="toast-close-button" type="button">&times;</button>',

  // Animation types
  animations: {
    FADE: 'fade',
    EASE_OUT_LEFT: 'ease-out-left',
    EASE_OUT_RIGHT: 'ease-out-right'
  }
}
