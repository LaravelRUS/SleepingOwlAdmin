import { expect, test } from '@playwright/test'

const filterValues = {
    date: '06.09.2026',
    daterange: '01.09.2026 - 06.09.2026',
    rangeFrom: '10',
    rangeTo: '40',
    text: 'Alice',
}

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
    await page.evaluate(() =>
        globalThis.jQuery('#date-filter').closest('.input-date').trigger('dp.change'),
    )
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

function latest(items) {
    return items.at(-1)
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
    await expect(page.locator('#lazy-image-1')).toHaveAttribute('src', /\/fixtures\/pixel\.svg$/)
    const runtime = await page.evaluate(() => ({
        draws: globalThis.__legacyEvents.filter((event) => event === 'datatables::draw').length,
        lazyloadCalls: globalThis.__lazyloadCalls,
        tooltip: Boolean(globalThis.jQuery('#draw-tooltip-1').data('bs.tooltip')),
        version: globalThis.jQuery.fn.dataTable.version,
    }))
    const requests = await recordedRequests(request, 'datatable')

    expect(runtime).toMatchObject({ draws: 1, tooltip: true, version: '1.13.11' })
    expect(runtime.lazyloadCalls).toBeGreaterThan(0)
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
        await page.evaluate(() => globalThis.localStorage.getItem('Filters_/legacy-datatables')),
    ).not.toBeNull()

    await page.reload()
    await expect(page.locator('#legacy-table tbody tr')).toHaveCount(2)
    await expect(page.locator('#text-filter')).toHaveValue(filterValues.text)
    await expect(page.locator('#range-to')).toHaveValue(filterValues.rangeTo)

    const response = page.waitForResponse((item) => item.url().endsWith('/api/datatables'))
    await page.locator('#filters-cancel').click()
    await response
    expect(
        await page.evaluate(() => globalThis.localStorage.getItem('Filters_/legacy-datatables')),
    ).toBeNull()
    await expect(page.locator('#text-filter')).toHaveValue('')
    await expect(page.locator('#select-filter')).toHaveValues([])

    const parameters = latest(await recordedRequests(request, 'datatable')).parameters
    expect(parameters['columns[1][search][value]']).toBe('')
    expect(parameters['columns[4][search][value]']).toBe('')
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
