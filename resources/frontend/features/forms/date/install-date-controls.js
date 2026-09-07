import AirDatepicker from 'air-datepicker'

import { createDateControlDefinition, DATE_CONTROL_COMPONENT } from './date-control.js'
import { resolveDatePickerLocale } from './date-locales.js'

export const LEGACY_DATE_MODULES = Object.freeze([
    'form.elements.date',
    'form.elements.datetime',
    'form.elements.daterange',
])

export function installDateControls(
    admin,
    { Datepicker = AirDatepicker, root = globalThis.document } = {},
) {
    assertAdminServices(admin)

    const definition = createDateControlDefinition(
        Datepicker,
        resolveDatePickerLocale(admin.locale),
    )
    admin.Components.register(definition)

    const scan = (scanRoot = root) => admin.Components.scan(scanRoot, DATE_CONTROL_COMPONENT)
    LEGACY_DATE_MODULES.forEach((name) => admin.Modules.register(name, () => scan()))

    return { definition, scan }
}

function assertAdminServices(admin) {
    if (typeof admin?.Components?.register !== 'function') {
        throw new TypeError('Date controls require Admin.Components.')
    }
    if (typeof admin?.Modules?.register !== 'function') {
        throw new TypeError('Date controls require Admin.Modules compatibility registry.')
    }
}
