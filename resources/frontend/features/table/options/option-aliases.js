const LEGACY_OPTION_ALIASES = Object.freeze([
    ['sDom', 'dom'],
    ['bStateSave', 'stateSave'],
    ['fnDrawCallback', 'drawCallback'],
])

const REMOVED_DATATABLES1_OPTIONS = Object.freeze([
    ['asStripeClasses', 'Move row striping to the active theme CSS.'],
    ['fnServerData', 'Use an ajax function.'],
    ['fnServerParams', 'Use ajax.data.'],
    ['sAjaxSource', 'Use ajax.'],
    ['sAjaxDataProp', 'Use ajax.dataSrc.'],
])

export function normalizeDataTables2Options(options, { warn = warnRemovedOption } = {}) {
    const normalized = { ...options }

    LEGACY_OPTION_ALIASES.forEach(([legacyName, currentName]) => {
        moveOption(normalized, legacyName, currentName)
    })
    REMOVED_DATATABLES1_OPTIONS.forEach(([legacyName, migration]) => {
        removeUnsupportedOption(normalized, legacyName, migration, warn)
    })

    return normalized
}

function moveOption(options, legacyName, currentName) {
    if (options[currentName] === undefined && options[legacyName] !== undefined) {
        options[currentName] = options[legacyName]
    }

    delete options[legacyName]
}

function removeUnsupportedOption(options, legacyName, migration, warn) {
    if (!Object.hasOwn(options, legacyName)) {
        return
    }

    warn(formatRemovedOptionWarning(legacyName, migration))
    delete options[legacyName]
}

function formatRemovedOptionWarning(legacyName, migration) {
    return (
        `[SleepingOwl Admin] DataTables 1 option "${legacyName}" ` +
        `is not supported by DataTables 2. ${migration}`
    )
}

function warnRemovedOption(message) {
    globalThis.console?.warn(message)
}
