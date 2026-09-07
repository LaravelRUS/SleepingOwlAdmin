export const DATE_TIME_ORDER = 'DateTime'

export function installDataTableExtensions(engine, { onError }) {
    assertExtensionDependencies(engine, onError)

    engine.ext.errMode = onError
    engine.ext.order[DATE_TIME_ORDER] = (settings, column) =>
        dateTimeOrderValues(engine, settings, column)

    return engine.ext
}

export function dateTimeOrderValues(engine, settings, column) {
    return new engine.Api(settings)
        .column(column, { order: 'index' })
        .nodes()
        .map((cell) => cell.dataset.value)
}

function assertExtensionDependencies(engine, onError) {
    if (typeof engine?.Api !== 'function' || !engine.ext?.order) {
        throw new TypeError('DataTables extensions require an engine extension registry.')
    }
    if (typeof onError !== 'function') {
        throw new TypeError('DataTables extensions require an error handler.')
    }
}
