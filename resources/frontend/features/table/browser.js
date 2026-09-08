import ProgressBar from 'progressbar.js'

import { installInlineEditors } from './editing/install-inline-editors.js'
import { dataTableEngineVersions } from './engine/data-table-engine.js'
import { tableBrowserOptions } from './browser-options.js'
import { installDataTables } from './runtime/install-data-tables.js'
import { installTableAutoUpdates } from './runtime/install-table-auto-updates.js'
import { installTableControls } from './runtime/install-table-controls.js'

if (globalThis.document) bootTables(globalThis)

export function bootTables(target) {
    const admin = requireCompatibility(target.Admin)
    const options = tableBrowserOptions(target)
    const features = installFeatures(target, admin, options)
    const runtime = createTableRuntime(features, target.document)

    admin.TableFeature = runtime
    admin.Tables.scan = runtime.scan
    runtime.scan()

    return runtime
}

function installFeatures(target, admin, options) {
    const root = target.document
    const presentation = admin.TablePresentation ?? {}
    const inlineEditor = installInlineEditors(admin, { ...options.inlineEditor, root })
    const tables = installDataTables(admin, {
        createEngine: presentation.createEngine,
        engine: presentation.engine,
        inlineEditor,
        onError: options.onError,
        root,
        storage: target.localStorage,
        target,
    })

    return {
        autoUpdates: installTableAutoUpdates(admin, {
            engine: tables.engine,
            now: () => target.performance.now(),
            ProgressBar,
            root,
            scheduler: target,
        }),
        controls: installTableControls(admin, {
            ...options.actions,
            ...options.controls,
            root,
            target,
        }),
        inlineEditor,
        tables,
    }
}

function createTableRuntime(features, root) {
    return Object.freeze({
        features: Object.freeze({ ...features }),
        scan(scanRoot = root) {
            return (
                features.tables.scan(scanRoot) +
                features.inlineEditor.scan(scanRoot) +
                features.controls.scan(scanRoot) +
                features.autoUpdates.scan(scanRoot)
            )
        },
        versions: dataTableEngineVersions(),
    })
}

function requireCompatibility(admin) {
    const required = ['Components', 'Config', 'Events', 'Http', 'Messages', 'Modules', 'Tables']
    if (required.some((name) => !admin?.[name])) {
        throw new TypeError('Tables require the SleepingOwl compatibility runtime.')
    }

    return admin
}
