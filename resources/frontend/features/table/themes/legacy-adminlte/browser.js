import {
    createLegacyDataTableEngine,
    DATATABLES_PRESENTATION_ID,
    legacyDataTableEngineRuntime,
} from './datatables.js'

if (globalThis.document) installLegacyDataTablesAdapter(globalThis)

export function installLegacyDataTablesAdapter(target) {
    const admin = target.Admin

    if (!admin?.Components) {
        throw new TypeError('The AdminLTE DataTables adapter requires the admin runtime.')
    }

    admin.TablePresentation = Object.freeze({
        createEngine: createLegacyDataTableEngine,
        engine: legacyDataTableEngineRuntime(),
        id: DATATABLES_PRESENTATION_ID,
    })

    return admin.TablePresentation
}
