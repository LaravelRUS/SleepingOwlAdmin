const LEGACY_OPTION_ALIASES = Object.freeze([
    ['sDom', 'dom'],
    ['bStateSave', 'stateSave'],
    ['fnDrawCallback', 'drawCallback'],
])

export function normalizeDataTables2Options(options) {
    const normalized = { ...options }

    LEGACY_OPTION_ALIASES.forEach(([legacyName, currentName]) => {
        moveOption(normalized, legacyName, currentName)
    })

    return normalized
}

function moveOption(options, legacyName, currentName) {
    if (options[currentName] === undefined && options[legacyName] !== undefined) {
        options[currentName] = options[legacyName]
    }

    delete options[legacyName]
}
