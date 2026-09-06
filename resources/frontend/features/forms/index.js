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
export {
    createFilesDefinition,
    FILES_COMPONENT,
    FILES_SELECTOR,
    mountFiles,
} from './files/files-controller.js'
export { installFiles, LEGACY_FILES_MODULE } from './files/install-files.js'
export { createFileItem, cssUrl } from './files/files-template.js'
export { createFilesUploader } from './files/files-uploader.js'
export {
    baseName,
    collectFiles,
    fileExtension,
    filePresentation,
    isImageExtension,
    readFile,
    serializeFiles,
} from './files/files-values.js'
