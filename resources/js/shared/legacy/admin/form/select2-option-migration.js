const SUPPORTED_OPTIONS = new Set([
    'allowClear',
    'disabled',
    'maximumSelectionLength',
    'minimumInputLength',
    'placeholder',
    'tags',
])

const OPTION_MIGRATIONS = Object.freeze({
    ajax: 'Use SelectAjax or MultiSelectAjax.',
    escapeMarkup: 'HTML labels are no longer executed; use text labels or a custom Vue island.',
    multiple: 'Use MultiSelect or MultiSelectAjax.',
    templateResult: 'Use a custom Vue island component.',
    templateSelection: 'Use a custom Vue island component.',
})

export function normalizeLegacySelect2Options(options, { warn = warnOption } = {}) {
    const source = validOptions(options)
    warnUnsupportedOptions(source, warn)

    return {
        allowEmpty: optionalBoolean(source.allowClear),
        max: optionalCount(source.maximumSelectionLength),
        minSymbols: optionalCount(source.minimumInputLength),
        placeholder: optionalString(source.placeholder),
        readonly: optionalBoolean(source.disabled),
        taggable: optionalBoolean(source.tags),
    }
}

function warnUnsupportedOptions(options, warn) {
    Object.keys(options)
        .filter((name) => !SUPPORTED_OPTIONS.has(name))
        .forEach((name) => warn(optionWarning(name)))
}

function optionWarning(name) {
    const migration = OPTION_MIGRATIONS[name] ?? 'Use the Vue Multiselect or custom-island API.'

    return `[SleepingOwl Admin] Select2 option "${name}" is not supported. ${migration}`
}

function optionalBoolean(value) {
    if (value === undefined || value === null) return null
    if (value === 'false' || value === '0') return false

    return Boolean(value)
}

function optionalCount(value) {
    if (value === undefined || value === null) return null
    const number = Number(value)

    return Number.isFinite(number) && number >= 0 ? number : null
}

function optionalString(value) {
    return value === undefined || value === null ? null : String(value)
}

function validOptions(options) {
    return options && typeof options === 'object' && !Array.isArray(options) ? options : {}
}

function warnOption(message) {
    globalThis.console?.warn(message)
}
