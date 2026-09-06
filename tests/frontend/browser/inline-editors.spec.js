import { expect, test } from '@playwright/test'

let fixtureHeaders

async function requests(request) {
    const response = await request.get('/__fixture/requests', { headers: fixtureHeaders })
    const state = await response.json()

    return state.requests.filter(({ kind }) => kind === 'inline-edit')
}

test.beforeEach(async ({ page, request }, testInfo) => {
    fixtureHeaders = { 'x-fixture-scope': String(testInfo.workerIndex) }
    await page.setExtraHTTPHeaders(fixtureHeaders)
    await request.post('/__fixture/reset', { headers: fixtureHeaders })
    await page.goto('/inline-editors')
})

test('all PHP editor types mount native controls without X-editable', async ({ page }) => {
    const expectations = {
        checkbox: 'fieldset',
        checklist: 'fieldset',
        date: 'input',
        datetime: 'input',
        number: 'input[type="number"]',
        range: 'input[type="range"]',
        select: 'select',
        text: 'input[type="text"]',
        textarea: 'textarea',
    }

    for (const [type, selector] of Object.entries(expectations)) {
        await page.locator(`#editor-${type}`).click()
        await expect(page.locator(`.soa-inline-editor-input ${selector}`)).toBeVisible()
        await page.locator('.soa-inline-editor-cancel').click()
    }

    expect(await page.evaluate(() => globalThis.jQuery?.fn?.editable)).toBeUndefined()
    expect(await page.evaluate(() => globalThis.moment)).toBeUndefined()
})

test('text, select and checklist preserve payloads and update display values', async ({
    page,
    request,
}) => {
    await editScalar(page, '#editor-text', 'Published')
    await expect(page.locator('#editor-text')).toHaveText('Published')

    await page.locator('#editor-select').click()
    await page.locator('.soa-inline-editor-control').selectOption('published')
    await submit(page)
    await expect(page.locator('#editor-select')).toHaveText('Published')

    await page.locator('#editor-checklist').click()
    await page.locator('.soa-inline-editor-check-input[value="2"]').check()
    await submit(page)
    await expect(page.locator('#editor-checklist')).toHaveText('Admin, Editor')

    await page.locator('#editor-checkbox').click()
    await page.locator('.soa-inline-editor-check-input').uncheck()
    await submit(page)
    await expect(page.locator('#editor-checkbox')).toHaveText('No')

    await page.locator('#editor-checkbox').click()
    await page.locator('.soa-inline-editor-check-input').check()
    await submit(page)
    await expect(page.locator('#editor-checkbox')).toHaveText('Yes')

    const recorded = await requests(request)
    expect(recorded.map(({ parameters }) => parameters)).toEqual([
        { name: 'title', pk: '2', value: 'Published' },
        { name: 'state', pk: '2', value: 'published' },
        { name: 'roles', pk: '2', 'value[]': ['1', '2'] },
        { name: 'active', pk: '2', value: '' },
        { name: 'active', pk: '2', 'value[]': ['1'] },
    ])
})

test('date and datetime editors reuse Air Datepicker and emit native lifecycle events', async ({
    page,
}) => {
    for (const type of ['date', 'datetime']) {
        await page.locator(`#editor-${type}`).click()
        const input = page.locator('.soa-inline-editor-control')
        await expect(input).toHaveAttribute('data-soa-date-control', type)
        expect(
            await input.evaluate((element) =>
                Boolean(globalThis.Admin.Components.get(element, 'date-control')),
            ),
        ).toBe(true)
        await page.locator('.soa-inline-editor-cancel').click()
    }

    expect(await page.evaluate(() => globalThis.__inlineEvents)).toEqual([
        { name: 'inline-edit:opened', field: 'published_on' },
        { name: 'inline-edit:closed', field: 'published_on' },
        { name: 'inline-edit:opened', field: 'published_at' },
        { name: 'inline-edit:closed', field: 'published_at' },
    ])
})

test('Laravel validation errors stay visible and Escape closes the editor', async ({ page }) => {
    await page.locator('#editor-text').click()
    await page.locator('.soa-inline-editor-control').fill('invalid')
    const response = page.waitForResponse(
        (item) => item.url().endsWith('/api/inline-edit') && item.status() === 422,
    )
    await page.locator('.soa-inline-editor-submit').click()
    await response
    await expect(page.locator('.soa-inline-editor-error')).toHaveText('The status is invalid.')
    await expect(page.locator('#editor-text')).toBeHidden()
    await page.locator('.soa-inline-editor-control').press('Escape')
    await expect(page.locator('#editor-text')).toBeVisible()

    expect(await page.evaluate(() => globalThis.__inlineEvents.map(({ name }) => name))).toEqual([
        'inline-edit:opened',
        'inline-edit:submitting',
        'inline-edit:failed',
        'inline-edit:closed',
    ])
})

async function editScalar(page, selector, value) {
    await page.locator(selector).click()
    await page.locator('.soa-inline-editor-control').fill(value)
    await submit(page)
}

async function submit(page) {
    const response = page.waitForResponse((item) => item.url().endsWith('/api/inline-edit'))
    await page.locator('.soa-inline-editor-submit').click()
    await response
}
