import { expect, test } from '@playwright/test'

let fixtureHeaders

function capturePageErrors(page) {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.stack || error.message))

    return errors
}

async function openFixture(page) {
    await page.goto('/dependent-controls')
    await expect(page.locator('html')).toHaveAttribute('data-ready', 'true')
    await expect.poll(() => page.evaluate(() => globalThis.Admin.VueApps.size)).toBe(1)
    await expect(page.locator('#city')).toHaveValue('paris')
}

async function recordedLoads(request) {
    const response = await request.get('/__fixture/requests', { headers: fixtureHeaders })
    const state = await response.json()

    return state.requests.filter(({ kind }) => kind === 'dependent-select')
}

test.beforeEach(async ({ page, request }, testInfo) => {
    fixtureHeaders = { 'x-fixture-scope': String(testInfo.workerIndex) }
    await page.setExtraHTTPHeaders(fixtureHeaders)
    await request.post('/__fixture/reset', { headers: fixtureHeaders })
})

test('dependent select initializes through Vue and preserves its payload and events', async ({
    page,
    request,
}) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)

    await expectInitialPayload(request)
    await expectInitialEvents(page)
    expect(await page.evaluate(() => globalThis.jQuery?.fn?.depdrop === undefined)).toBe(true)
    expect(pageErrors).toEqual([])
})

async function expectInitialPayload(request) {
    const loads = await recordedLoads(request)
    expect(loads).toHaveLength(1)
    expect(loads[0]).toMatchObject({
        method: 'POST',
        parameters: {
            'depdrop_all_params[country]': 'fr',
            'depdrop_parents[0]': 'fr',
        },
    })
}

async function expectInitialEvents(page) {
    expect(await page.evaluate(() => globalThis.__dependentEvents)).toEqual([
        {
            detail: {
                dependencyId: null,
                dependencyValue: null,
                optionCount: null,
                selected: null,
            },
            name: 'depdrop:init',
        },
        {
            detail: {
                dependencyId: null,
                dependencyValue: null,
                optionCount: null,
                selected: null,
            },
            name: 'depdrop:beforeChange',
        },
        {
            detail: {
                dependencyId: null,
                dependencyValue: null,
                optionCount: 2,
                selected: ['paris'],
            },
            name: 'depdrop:change',
        },
        {
            detail: {
                dependencyId: null,
                dependencyValue: null,
                optionCount: null,
                selected: null,
            },
            name: 'depdrop:afterChange',
        },
    ])
}

test('parent changes replace options and errors keep the dependent control disabled', async ({
    page,
}) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)

    const germanResponse = page.waitForResponse((item) =>
        item.url().endsWith('/api/dependent-options'),
    )
    await page.selectOption('#country', 'de')
    await germanResponse
    await expect(page.locator('#city')).toHaveValue('berlin')
    await expect(page.locator('#dependent-city-fixture .multiselect__single')).toHaveText('Berlin')

    const errorResponse = page.waitForResponse(
        (item) => item.url().endsWith('/api/dependent-options') && item.status() === 503,
    )
    await page.selectOption('#country', 'error')
    await errorResponse
    await expect(page.locator('#dependent-city-fixture [data-soa-select-status]')).toHaveText(
        'Something went wrong',
    )
    await expect(page.locator('#city')).toBeDisabled()
    await expect
        .poll(() =>
            page.evaluate(() => globalThis.__dependentEvents.map(({ name }) => name).slice(-3)),
        )
        .toEqual(['depdrop:beforeChange', 'depdrop:error', 'depdrop:afterChange'])
    expect(pageErrors).toEqual([])
})
