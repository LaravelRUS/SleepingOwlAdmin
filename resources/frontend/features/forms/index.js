export const FORM_FEATURE_ID = 'forms'

export { bindFormButtons } from './actions/form-buttons.js'
export {
    createDateControlDefinition,
    DATE_CONTROL_COMPONENT,
    DATE_CONTROL_SELECTOR,
    mountDateControl,
} from './date/date-control.js'
export { formatDateValue, parseDateValue, toAirDateFormat } from './date/date-format.js'
export { resolveDatePickerLocale } from './date/date-locales.js'
export { createDatePickerOptions, DATE_CONTROL_TYPES } from './date/date-options.js'
export {
    createDateRangeOptions,
    DATE_RANGE_SEPARATOR,
    parseDateRangeValue,
} from './date/date-range-options.js'
export { installDateControls, LEGACY_DATE_MODULES } from './date/install-date-controls.js'
