import { expect, test } from '@playwright/test'

const filterValues = {
    date: '06.09.2026',
    daterange: '01.09.2026 - 06.09.2026',
    rangeFrom: '10',
    rangeTo: '40',
    text: 'Alice',
}

const filterStateKeys = {
    primary: 'Filters_/legacy-datatables::legacy-table-fixture',
    secondary: 'Filters_/legacy-datatables::secondary-table-fixture',
}

const mixedTableIds = ['legacy-table', 'secondary-table', 'sync-table']

function capturePageErrors(page) {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    return errors
}

async function openFixture(page, suffix = '') {
    await page.goto(`/legacy-datatables${suffix}`)
    await expect(page.locator('#legacy-table tbody tr')).toHaveCount(2)
}

async function recordedRequests(request, kind) {
    const response = await request.get('/__fixture/requests')
    const state = await response.json()
    return state.requests.filter((item) => item.kind === kind)
}

async function setFilters(page) {
    await page.locator('#text-filter').fill(filterValues.text)
    await page.locator('#text-filter').dispatchEvent('change')
    await page.locator('#date-filter').fill(filterValues.date)
    await page.locator('#date-filter').dispatchEvent('change')
    await page.locator('#range-from').fill(filterValues.rangeFrom)
    await page.locator('#range-from').dispatchEvent('change')
    await page.locator('#range-to').fill(filterValues.rangeTo)
    await page.locator('#range-to').dispatchEvent('change')
    await page.locator('#select-filter').selectOption(['active', 'archived'])
    await page.locator('#daterange-filter').fill(filterValues.daterange)
    await page.locator('#daterange-filter').dispatchEvent('change')
}

async function executeFilters(page) {
    const response = page.waitForResponse((item) => item.url().endsWith('/api/datatables'))
    await page.locator('#filters-exec').click()
    await response
}

function filterPanel(page, id) {
    return page.locator(`[data-datatables-id="${id}"].display-filters`)
}

async function saveTextFilter(panel, selector, value) {
    await panel.locator(selector).fill(value)
    await panel.locator(selector).dispatchEvent('change')
    await panel.locator('#filters-exec').click()
}

async function readScopedFilterState(page) {
    return page.evaluate((keys) => {
        return Object.fromEntries(
            Object.entries(keys).map(([name, key]) => [name, globalThis.localStorage.getItem(key)]),
        )
    }, filterStateKeys)
}

function latest(items) {
    return items.at(-1)
}

async function rememberTableAdapters(page) {
    return page.evaluate((ids) => {
        const tables = ids.map((id) => globalThis.document.getElementById(id))
        globalThis.__fixtureTableAdapters = tables.map((table) =>
            globalThis.Admin.Tables.get(table),
        )

        return {
            count: globalThis.Admin.Tables.all().length,
            registered: globalThis.__fixtureTableAdapters.every(Boolean),
        }
    }, mixedTableIds)
}

async function repeatTableBoot(page) {
    return page.evaluate((ids) => {
        globalThis.Admin.Modules.call('display.datatables')
        const tables = ids.map((id) => globalThis.document.getElementById(id))

        return {
            count: globalThis.Admin.Tables.all().length,
            sameAdapters: tables.every(
                (table, index) =>
                    globalThis.Admin.Tables.get(table) === globalThis.__fixtureTableAdapters[index],
            ),
        }
    }, mixedTableIds)
}

test.beforeEach(async ({ request }) => {
    await request.post('/__fixture/reset')
})

test('Admin.Events dispatches native document events', async ({ page }) => {
    await openFixture(page)

    const received = await page.evaluate(() => {
        let capturedEvent = null
        const listener = (event) => {
            capturedEvent = event
        }

        globalThis.document.addEventListener('fixture::native', listener)
        globalThis.Admin.Events.fire('fixture::native', 'orders', { page: 2 })
        globalThis.document.removeEventListener('fixture::native', listener)

        return {
            detail: capturedEvent?.detail,
            isCustomEvent: capturedEvent instanceof globalThis.CustomEvent,
            targetIsDocument: capturedEvent?.target === globalThis.document,
        }
    })

    expect(received).toEqual({
        detail: ['orders', { page: 2 }],
        isCustomEvent: true,
        targetIsDocument: true,
    })
})

test('legacy DataTables mounts through the engine-neutral Admin.Tables registry', async ({
    page,
}) => {
    await openFixture(page)

    const registry = await page.evaluate(() => {
        const element = globalThis.document.querySelector('#legacy-table')
        const adapter = globalThis.Admin.Tables.get(element)

        return {
            adapterCount: globalThis.Admin.Tables.all().length,
            elementMatches: adapter.element === element,
            hasEngine: Boolean(adapter.engineInstance.table),
            methods: ['reload', 'destroy', 'clearState', 'selectedRows'].map(
                (method) => typeof adapter[method],
            ),
        }
    })

    expect(registry).toEqual({
        adapterCount: 1,
        elementMatches: true,
        hasEngine: true,
        methods: ['function', 'function', 'function', 'function'],
    })
})

test('published legacy bundle initializes DataTables and runs draw hooks', async ({
    page,
    request,
}) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)

    await expect(page.locator('#legacy-table tbody tr').first()).toHaveClass(/fixture-row/)
    await expect(page.locator('#legacy-table_wrapper .dt-length')).toBeVisible()
    await expect(page.locator('#legacy-table_wrapper .dt-search')).toBeVisible()
    await expect(page.locator('#legacy-table_wrapper .dt-info')).toBeVisible()
    await expect(page.locator('#legacy-table_wrapper .dt-paging')).toBeVisible()
    await expect(page.locator('#lazy-image-1')).toHaveAttribute('src', /\/fixtures\/pixel\.svg$/)
    const runtime = await page.evaluate(() => ({
        draws: globalThis.__legacyEvents.filter((event) => event === 'datatables::draw').length,
        globalDataTable: typeof globalThis.DataTable,
        responsiveVersion: globalThis.jQuery.fn.dataTable.Responsive.version,
        tooltip: Boolean(globalThis.jQuery('#draw-tooltip-1').data('bs.tooltip')),
        version: globalThis.jQuery.fn.dataTable.version,
        wrapperClass: globalThis.document.querySelector('#legacy-table_wrapper').className,
    }))
    const requests = await recordedRequests(request, 'datatable')

    expect(runtime).toMatchObject({
        draws: 1,
        globalDataTable: 'undefined',
        responsiveVersion: '3.0.8',
        tooltip: true,
        version: '2.3.8',
        wrapperClass: expect.stringContaining('dt-bootstrap4'),
    })
    await expect(page.locator('#lazy-image-1')).toHaveAttribute('loading', 'lazy')
    expect(requests[0].method).toBe('POST')
    expect(requests[0].parameters['payload[fixture]']).toBe('legacy')
    expect(pageErrors).toEqual([])
})

test('text, date, range, select and daterange filters reach the server', async ({
    page,
    request,
}) => {
    await openFixture(page)
    await setFilters(page)
    await executeFilters(page)

    const parameters = latest(await recordedRequests(request, 'datatable')).parameters
    expect(parameters['columns[1][search][value]']).toBe(filterValues.text)
    expect(parameters['columns[2][search][value]']).toBe(filterValues.date)
    expect(parameters['columns[3][search][value]']).toBe('10::40')
    expect(parameters['columns[4][search][value]']).toBe('active:::archived')
    expect(parameters['columns[5][search][value]']).toBe(filterValues.daterange)
})

test('custom filters restore from storage and clear through the legacy control', async ({
    page,
    request,
}) => {
    await openFixture(page)
    await setFilters(page)
    await executeFilters(page)
    expect(
        await page.evaluate(() =>
            globalThis.localStorage.getItem('Filters_/legacy-datatables::legacy-table-fixture'),
        ),
    ).not.toBeNull()

    await page.reload()
    await expect(page.locator('#legacy-table tbody tr')).toHaveCount(2)
    await expect(page.locator('#text-filter')).toHaveValue(filterValues.text)
    await expect(page.locator('#range-to')).toHaveValue(filterValues.rangeTo)

    const response = page.waitForResponse((item) => item.url().endsWith('/api/datatables'))
    await page.locator('#filters-cancel').click()
    await response
    expect(
        await page.evaluate(() =>
            globalThis.localStorage.getItem('Filters_/legacy-datatables::legacy-table-fixture'),
        ),
    ).toBeNull()
    await expect(page.locator('#text-filter')).toHaveValue('')
    await expect(page.locator('#select-filter')).toHaveValues([])

    const parameters = latest(await recordedRequests(request, 'datatable')).parameters
    expect(parameters['columns[1][search][value]']).toBe('')
    expect(parameters['columns[4][search][value]']).toBe('')
})

test('filter state and clear controls stay scoped to their table', async ({ page }) => {
    await openFixture(page, '?multiple=1')
    await expect(page.locator('#secondary-table tbody tr')).toHaveCount(2)

    const primaryFilters = filterPanel(page, 'legacy-table-fixture')
    const secondaryFilters = filterPanel(page, 'secondary-table-fixture')

    await saveTextFilter(primaryFilters, '#text-filter', 'Alice')
    await saveTextFilter(secondaryFilters, '#secondary-text-filter', 'Bob')

    const stored = await readScopedFilterState(page)
    expect(JSON.parse(stored.primary)).toEqual({
        0: { 1: { type: 'text', val: 'Alice' } },
    })
    expect(JSON.parse(stored.secondary)).toEqual({
        0: { 1: { type: 'text', val: 'Bob' } },
    })

    await primaryFilters.locator('#filters-cancel').click()
    await expect(secondaryFilters.locator('#secondary-text-filter')).toHaveValue('Bob')
    const afterClear = await readScopedFilterState(page)
    expect(afterClear.primary).toBeNull()
    expect(afterClear.secondary).not.toBeNull()

    await page.reload()
    await expect(page.locator('#secondary-table tbody tr')).toHaveCount(2)
    await expect(page.locator('#text-filter')).toHaveValue('')
    await expect(page.locator('#secondary-text-filter')).toHaveValue('Bob')
})

test('sync and async tables mount independently without duplicate engines', async ({
    page,
    request,
}) => {
    await openFixture(page, '?multiple=1&sync=1')
    await expect(page.locator('#secondary-table tbody tr')).toHaveCount(2)
    await expect(page.locator('#sync-table tbody tr')).toHaveCount(3)
    await expect(page.locator('#sync-table tbody tr').first()).toContainText('Gamma')

    const before = await rememberTableAdapters(page)
    expect(before).toEqual({ count: 3, registered: true })

    await page.locator('#sync-table_wrapper .dt-search input').fill('Alpha')
    await expect(page.locator('#sync-table tbody tr')).toHaveCount(1)
    await expect(page.locator('#sync-table tbody tr').first()).toContainText('Alpha')
    expect(await recordedRequests(request, 'datatable')).toHaveLength(2)

    const after = await repeatTableBoot(page)

    expect(after).toEqual({ count: 3, sameAdapters: true })
    expect(await recordedRequests(request, 'datatable')).toHaveLength(2)
})

test('a table initialized inside a hidden tab is usable after activation', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page, '?tab=1')

    const registeredWhileHidden = await page.evaluate(() => {
        const table = globalThis.document.querySelector('#tab-table')

        return globalThis.Admin.Tables.has(table)
    })
    expect(registeredWhileHidden).toBe(true)

    await page.locator('#tab-trigger').click()
    await expect(page.locator('#tab-table_wrapper')).toBeVisible()
    await expect(page.locator('#tab-table tbody tr')).toHaveCount(2)

    const geometry = await page.locator('#tab-table').evaluate((table) => ({
        headers: [...table.querySelectorAll('thead th')].map(
            (header) => header.getBoundingClientRect().width,
        ),
        table: table.getBoundingClientRect().width,
    }))
    expect(geometry.table).toBeGreaterThan(0)
    expect(geometry.headers.every((width) => width > 0)).toBe(true)

    await page.locator('#tab-table_wrapper .dt-search input').fill('Borealis')
    await expect(page.locator('#tab-table tbody tr')).toHaveCount(1)
    await expect(page.locator('#tab-table tbody tr').first()).toContainText('Borealis')
    expect(pageErrors).toEqual([])
})

test('legacy positional filter state migrates to table-scoped keys', async ({ page }) => {
    await page.addInitScript(() => {
        globalThis.localStorage.setItem(
            'Filters_/legacy-datatables',
            JSON.stringify({
                0: { 1: { type: 'text', val: 'Legacy primary' } },
                1: { 1: { type: 'text', val: 'Legacy secondary' } },
            }),
        )
    })

    await openFixture(page, '?multiple=1')
    await expect(page.locator('#secondary-table tbody tr')).toHaveCount(2)
    await expect(page.locator('#text-filter')).toHaveValue('Legacy primary')
    await expect(page.locator('#secondary-text-filter')).toHaveValue('Legacy secondary')

    const keys = await page.evaluate(() => ({
        legacy: globalThis.localStorage.getItem('Filters_/legacy-datatables'),
        primary: globalThis.localStorage.getItem(
            'Filters_/legacy-datatables::legacy-table-fixture',
        ),
        secondary: globalThis.localStorage.getItem(
            'Filters_/legacy-datatables::secondary-table-fixture',
        ),
    }))

    expect(keys.legacy).toBeNull()
    expect(keys.primary).not.toBeNull()
    expect(keys.secondary).not.toBeNull()
})

test('DataTables state restores ordering and pagination after reload', async ({
    page,
    request,
}) => {
    await openFixture(page)
    const response = page.waitForResponse((item) => item.url().endsWith('/api/datatables'))
    await page.evaluate(() => {
        globalThis
            .jQuery('#legacy-table')
            .DataTable()
            .order([[3, 'desc']])
            .page(1)
            .draw(false)
    })
    await response
    expect(
        await page.evaluate(() =>
            globalThis.localStorage.getItem('DataTables_legacy-table_/legacy-datatables'),
        ),
    ).not.toBeNull()

    await page.reload()
    await expect(page.locator('#legacy-table tbody tr')).toHaveCount(2)
    const parameters = latest(await recordedRequests(request, 'datatable')).parameters
    expect(parameters.start).toBe('2')
    expect(parameters['order[0][column]']).toBe('3')
    expect(parameters['order[0][dir]']).toBe('desc')
})

test('state config disables DataTables and custom filter persistence together', async ({
    page,
}) => {
    await openFixture(page, '?state_datatables=false')
    await page.locator('#text-filter').fill('Not persisted')
    await page.locator('#text-filter').dispatchEvent('change')
    await executeFilters(page)

    const state = await page.evaluate(() => {
        const table = globalThis.Admin.Tables.get(
            globalThis.document.querySelector('#legacy-table'),
        ).engineInstance

        return {
            dataTables: globalThis.localStorage.getItem(
                'DataTables_legacy-table_/legacy-datatables',
            ),
            filters: globalThis.localStorage.getItem(
                'Filters_/legacy-datatables::legacy-table-fixture',
            ),
            stateSave: table.settings()[0].oFeatures.bStateSave,
        }
    })

    expect(state).toEqual({ dataTables: null, filters: null, stateSave: null })
})

test('highlight config marks only the hovered DataTables column', async ({ page }) => {
    await openFixture(page, '?highlight=true')
    await page.locator('#legacy-table tbody tr').first().locator('td').nth(1).hover()

    await expect(page.locator('#legacy-table tbody td:nth-child(2).highlight')).toHaveCount(2)
    await expect(page.locator('#legacy-table tbody td.highlight')).toHaveCount(2)
})

test('bulk and custom actions submit checked rows and fire lifecycle events', async ({
    page,
    request,
}) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)
    await page.locator('.adminCheckboxRow').first().check()
    expect(
        await page.evaluate(() =>
            globalThis.Admin.Tables.get(
                globalThis.document.querySelector('#legacy-table'),
            ).selectedRows(),
        ),
    ).toEqual(['1'])
    const bulkResponse = page.waitForResponse((item) => item.url().endsWith('/api/action'))
    await page.locator('#bulk-action-submit').click()
    await bulkResponse

    await expect
        .poll(async () => (await recordedRequests(request, 'datatable')).length)
        .toBeGreaterThan(1)
    await page.locator('.adminCheckboxRow').first().check()
    const customResponse = page.waitForResponse((item) => item.url().endsWith('/api/action-form'))
    await page.locator('#custom-action-submit').click()
    await customResponse

    expect(latest(await recordedRequests(request, 'action')).parameters['_id[]']).toBe('1')
    const custom = latest(await recordedRequests(request, 'action-form')).parameters
    expect(custom).toMatchObject({ '_id[]': '1', reason: 'fixture' })
    expect(await page.evaluate(() => globalThis.__swalCalls)).toContainEqual({
        icon: 'success',
        text: 'Rows updated',
        timer: 5000,
        title: 'Custom action complete',
    })
    const events = await page.evaluate(() => globalThis.__legacyEvents)
    expect(events.filter((event) => event === 'datatables::actions::submitting')).toHaveLength(2)
    expect(events.filter((event) => event === 'datatables::actions::submitted')).toHaveLength(2)
    expect(pageErrors).toEqual([])
})

test('inline edit posts its value and is rebound after a draw', async ({ page, request }) => {
    await openFixture(page)
    await page.locator('#inline-edit-1').click()
    await page.locator('.editable-input input').fill('Published')
    const editResponse = page.waitForResponse((item) => item.url().endsWith('/api/inline-edit'))
    await page.locator('.editable-submit').click()
    await editResponse
    await expect(page.locator('#inline-edit-1')).toHaveText('Server normalized')

    const edit = latest(await recordedRequests(request, 'inline-edit')).parameters
    expect(edit).toMatchObject({ name: 'status', pk: '1', value: 'Published' })
    const drawResponse = page.waitForResponse((item) => item.url().endsWith('/api/datatables'))
    await page.evaluate(() => globalThis.jQuery('#legacy-table').DataTable().draw(false))
    await drawResponse
    expect(
        await page.evaluate(() => Boolean(globalThis.jQuery('#inline-edit-1').data('editable'))),
    ).toBe(true)
})

test('auto-update redraws the table and its close control stops the timer', async ({
    page,
    request,
}) => {
    await openFixture(page, '?autoupdate=1')
    await expect(page.locator('#legacy-table')).toHaveClass(/autoupdater/)
    await expect
        .poll(async () => (await recordedRequests(request, 'datatable')).length)
        .toBeGreaterThan(1)
    await page.locator('.autoupdater-close').click()
    await page.waitForTimeout(100)
    const stoppedAt = (await recordedRequests(request, 'datatable')).length

    await page.waitForTimeout(500)
    expect((await recordedRequests(request, 'datatable')).length).toBe(stoppedAt)
    await expect(page.locator('.autoupdater-close')).toHaveCount(0)
})
