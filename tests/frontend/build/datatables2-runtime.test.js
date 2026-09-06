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
