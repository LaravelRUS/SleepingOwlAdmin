import { expect, test } from '@playwright/test'

let fixtureHeaders

function capturePageErrors(page) {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.stack || error.message))

    return errors
}

async function openFixture(page) {
    await page.goto('/select-controls')
    await expect(page.locator('html')).toHaveAttribute('data-ready', 'true')
    await expect.poll(() => page.evaluate(() => globalThis.Admin.VueApps.size)).toBe(3)
}

async function recordedSearches(request) {
    const response = await request.get('/__fixture/requests', { headers: fixtureHeaders })
    const state = await response.json()

    return state.requests.filter(({ kind }) => kind === 'select-search')
}

async function enterShortRemoteQuery(page, request) {
    await page.locator('#ajax-select-fixture .multiselect').click()
    await page.locator('#ajax-select-fixture .multiselect__input').fill('a')
    await expect(page.locator('#ajax-select-fixture [data-soa-select-status]')).toHaveText(
        'Type at least 2 characters',
    )
    expect(await recordedSearches(request)).toHaveLength(0)
}

async function loadRemoteOptions(page) {
    const response = page.waitForResponse((item) => item.url().endsWith('/api/select-search'))
    await page.locator('#ajax-select-fixture .multiselect__input').fill('aurora')
    await response
    await expect(
        page.locator('#ajax-select-fixture .multiselect__option').filter({ hasText: 'Borealis' }),
    ).toBeVisible()
    await expect(page.locator('#ajax-select-fixture strong')).toHaveCount(0)
}

async function selectRemoteOption(page) {
    await page
        .locator('#ajax-select-fixture .multiselect__option')
        .filter({ hasText: 'Borealis' })
        .click()
    await expect(page.locator('#project')).toHaveValue('borealis')
}

async function triggerRemoteError(page) {
    await page.locator('#ajax-select-fixture .multiselect').click()
    const response = page.waitForResponse(
        (item) => item.url().endsWith('/api/select-search') && item.status() === 500,
    )
    await page.locator('#ajax-select-fixture .multiselect__input').fill('error')
    await response
    await expect(page.locator('#ajax-select-fixture [data-soa-select-status]')).toHaveText(
        'Something went wrong',
    )
}

test.beforeEach(async ({ page, request }, testInfo) => {
    fixtureHeaders = { 'x-fixture-scope': String(testInfo.workerIndex) }
    await page.setExtraHTTPHeaders(fixtureHeaders)
    await request.post('/__fixture/reset', { headers: fixtureHeaders })
})

test('remote select preserves payload, values, text safety and error state', async ({
    page,
    request,
}) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)
    await expect(page.locator('#project')).toHaveValue('current')
    await enterShortRemoteQuery(page, request)
    await loadRemoteOptions(page)

    const search = (await recordedSearches(request)).at(-1)
    expect(search.method).toBe('POST')
    expect(search.parameters).toMatchObject({
        'depdrop_all_params[country]': 'fr',
        'depdrop_parents[0]': 'fr',
        depends: '["country"]',
        page: '1',
        q: 'aurora',
    })

    await selectRemoteOption(page)
    await triggerRemoteError(page)
    expect(pageErrors).toEqual([])
})

test('setSelect2 compatibility options drive the same Vue island', async ({ page }) => {
    await openFixture(page)
    await expect(page.locator('#select2-alias-fixture .multiselect__placeholder')).toHaveText(
        'Compatibility placeholder',
    )

    await page.locator('#select2-alias-fixture .multiselect').click()
    const input = page.locator('#select2-alias-fixture .multiselect__input')
    await input.fill('Custom project')
    await input.press('Enter')

    await expect(page.locator('#alias')).toHaveValue('Custom project')
    await expect(page.locator('#select2-alias-fixture .select2-container')).toHaveCount(0)
})

test('legacy disabled option disables both the widget and submitted control', async ({ page }) => {
    await openFixture(page)

    await expect(page.locator('#select2-disabled-fixture .multiselect')).toHaveClass(
        /multiselect--disabled/,
    )
    await expect(page.locator('#disabled-project')).toBeDisabled()
})
