import { URL } from 'node:url'

import { expect, test } from '@playwright/test'

let fixtureHeaders

for (const profile of ['development', 'production']) {
    test(`${profile} column visibility overrides previously saved browser state`, async ({
        page,
        request,
    }, testInfo) => {
        const headers = { 'x-fixture-scope': String(testInfo.workerIndex) }
        await page.setExtraHTTPHeaders(headers)
        await request.post('/__fixture/reset', { headers })
        await useTableProfile(page, profile)
        await page.goto('/table-logical')
        await expect(page.locator('#logical-table tbody tr')).toHaveCount(2)
        await page.evaluate(() => {
            const table = globalThis.document.getElementById('logical-table')
            globalThis.Admin.Tables.get(table).engineInstance.state.save()
        })

        await page.route('**/table-logical', async (route) => {
            const response = await route.fetch()
            const body = (await response.text()).replace(
                '"orderable":true',
                '"orderable":true,"visible":false',
            )
            await route.fulfill({ response, body })
        })
        await page.reload()
        await expect(page.locator('#logical-table tbody tr')).toHaveCount(2)
        await expect(page.locator('#logical-table thead th')).toHaveCount(6)
        await expect(page.locator('#logical-table tbody tr').first().locator('td')).toHaveCount(6)
        expect(
            await page.evaluate(() => {
                const table = globalThis.document.getElementById('logical-table')
                return globalThis.Admin.Tables.get(table).engineInstance.column(1).visible()
            }),
        ).toBe(false)

        await page.unroute('**/table-logical')
        await page.reload()
        await expect(page.locator('#logical-table tbody tr')).toHaveCount(2)
        await expect(page.locator('#logical-table thead th')).toHaveCount(7)
    })

    test(`${profile} table entry boots the complete DataTables 3 feature`, async ({
        page,
        request,
    }, testInfo) => {
        fixtureHeaders = { 'x-fixture-scope': String(testInfo.workerIndex) }
        await page.setExtraHTTPHeaders(fixtureHeaders)
        await request.post('/__fixture/reset', { headers: fixtureHeaders })
        await useTableProfile(page, profile)
        await page.goto('/table-logical')
        await expect(page.locator('#logical-table tbody tr')).toHaveCount(2)

        expect(await inspectRuntime(page)).toEqual(expectedRuntime())
        await exerciseDynamicLifecycle(page)
        await exerciseFilter(page, request)
        await exerciseInlineEditor(page)
        await exerciseBulkAction(page, request)
    })
}

async function useTableProfile(page, profile) {
    if (profile === 'development') return

    for (const path of ['admin-core.js', 'shared/compatibility.js', 'features/table.js']) {
        await page.route(`**/profiles/development/js/${path}`, (route) => {
            const requestUrl = new URL(route.request().url())
            const replacement = `/public/default/profiles/${profile}/js/${path}`

            return route.continue({ url: new URL(replacement, requestUrl).href })
        })
    }
}

function inspectRuntime(page) {
    return page.evaluate(() => {
        const table = globalThis.document.querySelector('#logical-table')
        const adapter = globalThis.Admin.Tables.get(table)

        return {
            adapter: Boolean(adapter?.engineInstance),
            autoUpdate: table.classList.contains('autoupdater'),
            autoUpdateControl: {
                label: table.querySelector('.project-auto-update-label')?.textContent,
                nested: Boolean(table.querySelector(':scope > .project-auto-update-shell')),
            },
            compatibility: {
                checkDateRange: typeof globalThis.checkDateRange,
                checkNumberRange: typeof globalThis.checkNumberRange,
                columnFilters: Object.keys(globalThis.columnFilters).sort(),
            },
            events: globalThis.__logicalTableEvents,
            drawContext: globalThis.__logicalDrawContext,
            forbidden: Object.fromEntries(
                [
                    '$',
                    'AdminLTE',
                    'DataTable',
                    'ProgressBar',
                    'Vue',
                    'bootstrap',
                    'jQuery',
                    'moment',
                ].map((name) => [name, typeof globalThis[name]]),
            ),
            registrySize: globalThis.Admin.Tables.all().length,
            rescan: globalThis.Admin.Tables.scan(globalThis.document),
            runtime: typeof globalThis.Admin.TableFeature.scan,
            versions: globalThis.Admin.TableFeature.versions,
        }
    })
}

function expectedRuntime() {
    return {
        adapter: true,
        autoUpdate: true,
        autoUpdateControl: { label: 'Pause', nested: true },
        compatibility: {
            checkDateRange: 'function',
            checkNumberRange: 'function',
            columnFilters: ['date', 'daterange', 'range', 'select', 'text'],
        },
        events: ['datatables::draw'],
        drawContext: {
            api: 'function',
            jquery: 'undefined',
            tableId: 'logical-table',
        },
        forbidden: Object.fromEntries(
            [
                '$',
                'AdminLTE',
                'DataTable',
                'ProgressBar',
                'Vue',
                'bootstrap',
                'jQuery',
                'moment',
            ].map((name) => [name, 'undefined']),
        ),
        registrySize: 1,
        rescan: 0,
        runtime: 'function',
        versions: { core: '3.0.3', responsive: '4.0.3' },
    }
}

async function exerciseFilter(page, request) {
    await page.locator('#text-filter').fill('Alice')
    await page.locator('#text-filter').dispatchEvent('change')
    const response = page.waitForResponse((item) => item.url().endsWith('/api/datatables'))
    await page.locator('#filters-exec').click()
    await response

    const requests = await recordedRequests(request, 'datatable')
    expect(requests.at(-1).parameters['columns[1][search][value]']).toBe('Alice')
}

async function exerciseDynamicLifecycle(page) {
    const result = await page.evaluate(() => {
        const host = globalThis.document.querySelector('#dynamic-table-host')
        host.innerHTML = `
            <table class="datatables" data-id="dynamic-table" data-attributes='{"order":[]}'>
                <thead><tr><th>Name</th></tr></thead>
                <tbody><tr><td>Dynamic row</td></tr></tbody>
            </table>
        `
        const table = host.querySelector('table')
        const mounted = globalThis.Admin.Tables.scan(host)
        const registered = globalThis.Admin.Tables.has(table)
        const destroyed = globalThis.Admin.Components.destroy(host, 'data-table')

        return {
            destroyed,
            mounted,
            registered,
            registrySize: globalThis.Admin.Tables.all().length,
        }
    })

    expect(result).toEqual({ destroyed: 1, mounted: 1, registered: true, registrySize: 1 })
}

async function exerciseInlineEditor(page) {
    await page.locator('#inline-edit-1').click()
    await page.locator('.soa-inline-editor-control').fill('Published')
    const response = page.waitForResponse((item) => item.url().endsWith('/api/inline-edit'))
    await page.locator('.soa-inline-editor-submit').click()
    await response
    await expect(page.locator('#inline-edit-1')).toHaveText('Server normalized')
}

async function exerciseBulkAction(page, request) {
    await page.locator('#logical-table .adminCheckboxRow').first().check()
    const response = page.waitForResponse((item) => item.url().endsWith('/api/action'))
    await page.locator('#bulk-action-submit').click()
    await response

    const requests = await recordedRequests(request, 'action')
    expect(requests.at(-1).parameters['_id[]']).toBe('1')
    await expect.poll(() => page.evaluate(() => globalThis.__swalCalls.length)).toBe(0)
}

async function recordedRequests(request, kind) {
    const response = await request.get('/__fixture/requests', { headers: fixtureHeaders })
    const state = await response.json()

    return state.requests.filter((item) => item.kind === kind)
}
