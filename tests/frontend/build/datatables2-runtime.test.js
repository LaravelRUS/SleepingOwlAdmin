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

it('pins the agreed DataTables 2 and Responsive 3 package lines', () => {
    expect(packageJson.dependencies).toMatchObject({
        'datatables.net': '2.3.8',
        'datatables.net-bs4': '2.3.8',
        'datatables.net-responsive': '3.0.8',
        'datatables.net-responsive-bs4': '3.0.8',
    })
    expect(packageLock.packages['node_modules/datatables.net'].version).toBe('2.3.8')
    expect(packageLock.packages['node_modules/datatables.net-responsive'].version).toBe('3.0.8')
})

it('keeps the engine independent from the legacy theme presentation adapter', () => {
    const engine = readSource('resources/frontend/features/table/engine/datatables2.js')
    const presentation = readSource(
        'resources/frontend/features/table/themes/legacy-adminlte/datatables.js',
    )

    expect(engine).toContain("from 'datatables.net'")
    expect(engine).toContain("import 'datatables.net-responsive'")
    expect(engine).not.toMatch(/bootstrap|adminlte|jquery|jQuery|\$\(/i)
    expect(presentation).toContain("from 'datatables.net-bs4'")
    expect(presentation).toContain("import 'datatables.net-responsive-bs4'")
    expect(presentation).not.toMatch(/oApi|pageButton|\$\(/)
})

it('removes the handwritten Bootstrap 3 renderer and owns vendor CSS in the adapter', () => {
    const legacyRenderer = resolve(root, 'resources/assets/js_owl/libs/datatables.js')
    const bootstrap = readSource('resources/assets/js_owl/bootstrap.js')
    const styles = readSource(
        'resources/frontend/features/table/themes/legacy-adminlte/styles/datatables.scss',
    )

    expect(existsSync(legacyRenderer)).toBe(false)
    expect(bootstrap.indexOf('dataTables2Runtime')).toBeLessThan(
        bootstrap.indexOf('installLegacyDataTablesPresentation'),
    )
    expect(styles).toContain('datatables.net-bs4/css/dataTables.bootstrap4.css')
    expect(styles).toContain('datatables.net-responsive-bs4/css/responsive.bootstrap4.css')
})

it('mounts live tables through the DataTables 2 constructor boundary', () => {
    const orchestration = readSource('resources/assets/js_owl/admin/display/datatables.js')

    expect(orchestration).toContain('createEngine: createDataTables2')
    expect(orchestration).not.toContain('$(table).DataTable(engineOptions)')
})

it('uses current DataTables 2 option names in first-party runtime code', () => {
    const orchestration = readSource('resources/assets/js_owl/admin/display/datatables.js')
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
    const inlineEditor = readSource(
        'resources/frontend/features/table/themes/legacy-adminlte/inline-editor.js',
    )
    const tooltips = readSource(
        'resources/frontend/features/table/themes/legacy-adminlte/tooltips.js',
    )

    expect(`${orchestration}\n${hooks}`).not.toMatch(/(?:\$|jQuery)\s*\(/)
    expect(hooks).toContain('addEventListener')
    expect(hooks).toContain("element.loading = 'lazy'")
    expect(inlineEditor).toContain('jquery(elements).editable')
    expect(tooltips).toContain('jquery(elements).tooltip')
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
    const legacyCallbacks = readSource(
        'resources/frontend/features/table/themes/legacy-adminlte/action-callbacks.js',
    )

    expect(`${legacyActions}\n${actions}\n${autoUpdate}`).not.toMatch(
        /(?:\$|jQuery)\s*\(|\.DataTable\(/,
    )
    expect(legacyActions).toContain('http: Admin.Http')
    expect(actions).toContain('tables.reload(table)')
    expect(autoUpdate).toContain('dependencies.tables.reload(table)')
    expect(autoUpdateView).toContain('data-admin-table-autoupdate')
    expect(autoUpdateView).not.toContain('<script')
    expect(legacyCallbacks).toContain('jquery(context.wrapper)')
})
