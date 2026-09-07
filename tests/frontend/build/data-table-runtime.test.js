import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const packageJson = readJson('package.json')
const packageLock = readJson('package-lock.json')

function readJson(path) {
    return JSON.parse(readSource(path))
}

function readSource(path) {
    return readFileSync(resolve(root, path), 'utf8')
}

it('pins the dependency-free DataTables 3 and Responsive 4 package lines', () => {
    expect(packageJson.dependencies).toMatchObject({
        'datatables.net': '3.0.3',
        'datatables.net-bs5': '3.0.3',
        'datatables.net-responsive': '4.0.3',
        'datatables.net-responsive-bs5': '4.0.3',
    })
    expect(packageLock.packages['node_modules/datatables.net'].version).toBe('3.0.3')
    expect(packageLock.packages['node_modules/datatables.net'].dependencies).toBeUndefined()
    expect(packageLock.packages['node_modules/datatables.net-responsive'].version).toBe('4.0.3')
    expect(packageLock.packages['node_modules/datatables.net-responsive'].dependencies).toEqual({
        'datatables.net': '^3',
    })
})

it('keeps the engine independent from the legacy theme presentation adapter', () => {
    const engine = readSource('resources/frontend/features/table/engine/data-table-engine.js')
    const presentation = readSource(
        'resources/frontend/features/table/themes/legacy-adminlte/datatables.js',
    )

    expect(engine).toContain("from 'datatables.net'")
    expect(engine).toContain("import 'datatables.net-responsive'")
    expect(engine).not.toMatch(/bootstrap|adminlte|jquery|jQuery|\$\(/i)
    expect(presentation).toContain("from 'datatables.net-bs5'")
    expect(presentation).toContain("import 'datatables.net-responsive-bs5'")
    expect(presentation).not.toMatch(/oApi|pageButton|\$\(/)
})

it('removes the handwritten Bootstrap 3 renderer and owns vendor CSS in the adapter', () => {
    const legacyRenderer = resolve(root, 'resources/assets/js_owl/libs/datatables.js')
    const bootstrap = readSource('resources/assets/js_owl/bootstrap.js')
    const styles = readSource(
        'resources/frontend/features/table/themes/legacy-adminlte/styles/datatables.scss',
    )

    expect(existsSync(legacyRenderer)).toBe(false)
    expect(bootstrap.indexOf('dataTableEngineRuntime')).toBeLessThan(
        bootstrap.indexOf('installLegacyDataTablesPresentation'),
    )
    expect(styles).toContain('datatables.net-bs5/css/dataTables.bootstrap5.css')
    expect(styles).toContain('datatables.net-responsive-bs5/css/responsive.bootstrap5.css')
})

it('mounts live tables through the engine-neutral constructor boundary', () => {
    const bridge = readSource('resources/assets/js_owl/admin/display/datatables.js')
    const orchestration = readSource(
        'resources/frontend/features/table/runtime/install-data-tables.js',
    )

    expect(bridge).toContain('installDataTables(Admin')
    expect(orchestration).toContain('createEngine: settings.createEngine')
    expect(orchestration).toContain('options.createEngine ?? createDataTableEngine')
    expect(`${bridge}\n${orchestration}`).not.toContain('$(table).DataTable(engineOptions)')
})

it('uses current DataTables 3 option names in first-party runtime code', () => {
    const orchestration = readSource(
        'resources/frontend/features/table/runtime/table-runtime-options.js',
    )
    const stateOptions = readSource('resources/frontend/features/table/options/state-options.js')
    const tableOptions = readSource('resources/frontend/features/table/options/table-options.js')

    expect(orchestration).toContain('options.drawCallback')
    expect(orchestration).toContain('applyTableStateOptions')
    expect(stateOptions).toContain('options.stateSave')
    expect(tableOptions).toContain('layout: tableLayout(definition)')
    expect(`${orchestration}\n${stateOptions}\n${tableOptions}`).not.toMatch(
        /\b(?:sDom|bStateSave|fnDrawCallback)\b/,
    )
})

it('registers errors, ordering and search through the active engine API', () => {
    const extensions = readSource('resources/frontend/features/table/engine/extensions.js')
    const filters = readSource('resources/frontend/features/table/filters/filter-drivers.js')
    const orchestration = readSource('resources/assets/js_owl/admin/display/datatables.js')

    expect(extensions).toContain('engine.ext.errMode')
    expect(extensions).toContain('engine.ext.order[DATE_TIME_ORDER]')
    expect(filters).toContain('engine.ext.search')
    expect(filters).not.toMatch(/settings\(\)\[0\]\.[A-Za-z]+/)
    expect(`${orchestration}\n${filters}`).not.toMatch(/(?:\$|jQuery)\.fn\.dataTable/)
})

it('keeps the reusable filter modules on native DOM APIs', () => {
    const controls = readSource('resources/frontend/features/table/filters/filter-controls.js')
    const drivers = readSource('resources/frontend/features/table/filters/filter-drivers.js')

    expect(`${controls}\n${drivers}`).not.toMatch(/(?:\$|jQuery)\s*\(/)
    expect(`${controls}\n${drivers}`).not.toContain("from 'jquery'")
    expect(`${controls}\n${drivers}`).not.toContain("from 'moment'")
    expect(controls).toContain('addEventListener')
    expect(drivers).toContain('addEventListener')
})

it('keeps reusable draw hooks native and isolates legacy plugins in theme adapters', () => {
    const orchestration = readSource('resources/assets/js_owl/admin/display/datatables.js')
    const hooks = [
        readSource('resources/frontend/features/table/hooks/table-hooks.js'),
        readSource('resources/frontend/features/table/hooks/column-highlight.js'),
        readSource('resources/frontend/features/table/hooks/lazy-images.js'),
    ].join('\n')
    const inlineEditor = [
        readSource('resources/frontend/features/table/editing/inline-editor.js'),
        readSource('resources/frontend/features/table/editing/inline-editor-request.js'),
        readSource('resources/frontend/features/table/editing/install-inline-editors.js'),
    ].join('\n')
    const tooltips = readSource(
        'resources/frontend/features/table/themes/legacy-adminlte/tooltips.js',
    )

    expect(`${orchestration}\n${hooks}`).not.toMatch(/(?:\$|jQuery)\s*\(/)
    expect(hooks).toContain('addEventListener')
    expect(hooks).toContain("element.loading = 'lazy'")
    expect(inlineEditor).not.toMatch(/(?:\$|jQuery)\s*\(/)
    expect(inlineEditor).toContain('http: admin.Http')
    expect(tooltips).not.toMatch(/(?:\$|jQuery)\s*\(/)
    expect(tooltips).toContain('admin?.Tooltips?.scan')
})

it('routes actions and auto-update through native modules and Admin.Tables', () => {
    const legacyActions = [
        readSource('resources/assets/js_owl/admin/display/actions.js'),
        readSource('resources/assets/js_owl/admin/display/actions_form.js'),
    ].join('\n')
    const actions = [
        readSource('resources/frontend/features/table/actions/action-context.js'),
        readSource('resources/frontend/features/table/actions/action-request.js'),
        readSource('resources/frontend/features/table/actions/bulk-actions.js'),
        readSource('resources/frontend/features/table/actions/form-actions.js'),
    ].join('\n')
    const autoUpdate = readSource(
        'resources/frontend/features/table/autoupdate/table-auto-update.js',
    )
    const autoUpdateView = readSource('resources/views/features/datatables/autoupdate.blade.php')
    const namedCallbacks = readSource(
        'resources/frontend/features/table/actions/named-action-callbacks.js',
    )

    expect(`${legacyActions}\n${actions}\n${autoUpdate}`).not.toMatch(
        /(?:\$|jQuery)\s*\(|\.DataTable\(/,
    )
    expect(legacyActions).toContain('http: Admin.Http')
    expect(actions).toContain('tables.reload(table)')
    expect(autoUpdate).toContain('dependencies.tables.reload(table)')
    expect(autoUpdate).not.toContain('createElement')
    expect(autoUpdateView).toContain('data-admin-table-autoupdate')
    expect(autoUpdateView).toContain('data-admin-table-autoupdate-control')
    expect(autoUpdateView).toContain('data-admin-table-autoupdate-close')
    expect(autoUpdateView).not.toContain('<script')
    expect(namedCallbacks).not.toMatch(/jquery|jQuery|\$\(/)
    expect(namedCallbacks).toContain('context.wrapper')
    expect(namedCallbacks).toContain('context.checkboxes')
})
