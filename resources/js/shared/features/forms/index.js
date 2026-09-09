export const FORM_FEATURE_ID = 'forms'

export { bindFormButtons } from './actions/form-buttons.js'
export {
    createFormButtonsDefinition,
    FORM_BUTTONS_COMPONENT,
    FORM_BUTTONS_ROOT_SELECTOR,
    installFormButtons,
} from './actions/install-form-buttons.js'
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
export {
    bindFieldGenerator,
    createPasswordDefinition,
    createTextGeneratorDefinition,
    DEFAULT_GENERATED_CHARACTERS,
    generateFieldValue,
    installPasswordControls,
    installTextGenerators,
    mountPasswordControl,
    PASSWORD_COMPONENT,
    PASSWORD_SELECTOR,
    TEXT_GENERATOR_COMPONENT,
    TEXT_GENERATOR_SELECTOR,
} from './generation.js'
export { createCkeditor4Adapter } from './wysiwyg/adapters/ckeditor4.js'
export { createCkeditor5Adapter } from './wysiwyg/adapters/ckeditor5.js'
export { createSimpleMdeAdapter } from './wysiwyg/adapters/simplemde.js'
export { createTinyMceAdapter } from './wysiwyg/adapters/tinymce.js'
export { installWysiwygAdapters } from './wysiwyg/install-wysiwyg-adapters.js'
export { installWysiwyg, LEGACY_WYSIWYG_MODULE } from './wysiwyg/install-wysiwyg.js'
export { parseParameters, readWysiwygConfig } from './wysiwyg/wysiwyg-config.js'
export {
    createWysiwygDefinition,
    mountWysiwyg,
    WYSIWYG_COMPONENT,
    WYSIWYG_INIT_ATTRIBUTE,
    WYSIWYG_SELECTOR,
} from './wysiwyg/wysiwyg-component.js'
export { createWysiwygRegistry } from './wysiwyg/wysiwyg-registry.js'
